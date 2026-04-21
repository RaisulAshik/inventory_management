import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { LeaveRequest } from '@entities/tenant/hr/leave-request.entity';
import { LeaveRequestStatus } from '@common/enums';
import { getNextSequence } from '@common/utils/sequence.util';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';

@Injectable()
export class LeaveRequestsService {
  constructor(private readonly tenantConnectionManager: TenantConnectionManager) {}

  private async getRepo(): Promise<Repository<LeaveRequest>> {
    return this.tenantConnectionManager.getRepository(LeaveRequest);
  }

  private computeDays(from: Date, to: Date): number {
    const diff = to.getTime() - from.getTime();
    return Math.round(diff / (1000 * 60 * 60 * 24)) + 1;
  }

  async create(dto: CreateLeaveRequestDto, createdBy?: string): Promise<LeaveRequest> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const requestNumber = await getNextSequence(dataSource, 'LEAVE_REQUEST');
    const repo = dataSource.getRepository(LeaveRequest);

    const from = new Date(dto.fromDate);
    const to = new Date(dto.toDate);
    if (to < from) throw new BadRequestException('toDate must be after fromDate');

    const totalDays = this.computeDays(from, to);
    const item = repo.create({ ...dto, requestNumber, totalDays, createdBy });
    return repo.save(item);
  }

  async findAll(params: {
    employeeId?: string;
    status?: LeaveRequestStatus;
    year?: number;
    page?: number;
    limit?: number;
  }): Promise<{ data: LeaveRequest[]; total: number }> {
    const { employeeId, status, year, page = 1, limit = 20 } = params;
    const repo = await this.getRepo();
    const qb = repo.createQueryBuilder('lr')
      .leftJoinAndSelect('lr.employee', 'emp')
      .leftJoinAndSelect('lr.leaveType', 'lt')
      .where('lr.deleted_at IS NULL');

    if (employeeId) qb.andWhere('lr.employeeId = :employeeId', { employeeId });
    if (status) qb.andWhere('lr.status = :status', { status });
    if (year) qb.andWhere('YEAR(lr.fromDate) = :year', { year });

    const total = await qb.getCount();
    const data = await qb.orderBy('lr.createdAt', 'DESC').skip((page - 1) * limit).take(limit).getMany();
    return { data, total };
  }

  async findOne(id: string): Promise<LeaveRequest> {
    const repo = await this.getRepo();
    const item = await repo.findOne({ where: { id }, relations: ['employee', 'leaveType'] });
    if (!item) throw new NotFoundException(`Leave request ${id} not found`);
    return item;
  }

  async approve(id: string, approverId: string): Promise<LeaveRequest> {
    const item = await this.findOne(id);
    if (item.status !== LeaveRequestStatus.PENDING) {
      throw new BadRequestException(`Cannot approve a request with status ${item.status}`);
    }
    item.status = LeaveRequestStatus.APPROVED;
    item.approvedBy = approverId;
    item.approvedAt = new Date();
    const repo = await this.getRepo();
    return repo.save(item);
  }

  async reject(id: string, approverId: string, rejectionReason?: string): Promise<LeaveRequest> {
    const item = await this.findOne(id);
    if (item.status !== LeaveRequestStatus.PENDING) {
      throw new BadRequestException(`Cannot reject a request with status ${item.status}`);
    }
    item.status = LeaveRequestStatus.REJECTED;
    item.approvedBy = approverId;
    item.approvedAt = new Date();
    item.rejectionReason = rejectionReason ?? '';
    const repo = await this.getRepo();
    return repo.save(item);
  }

  async cancel(id: string): Promise<LeaveRequest> {
    const item = await this.findOne(id);
    if (item.status === LeaveRequestStatus.APPROVED) {
      throw new BadRequestException('Cannot cancel an already approved request');
    }
    item.status = LeaveRequestStatus.CANCELLED;
    const repo = await this.getRepo();
    return repo.save(item);
  }

  async remove(id: string): Promise<void> {
    const repo = await this.getRepo();
    const item = await this.findOne(id);
    if (item.status === LeaveRequestStatus.APPROVED) {
      throw new BadRequestException('Cannot delete an approved leave request');
    }
    await repo.softRemove(item);
  }
}
