import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { LeaveRequest } from '@entities/tenant/hr/leave-request.entity';
import { LeaveType } from '@entities/tenant/hr/leave-type.entity';
import { Employee } from '@entities/tenant/hr/employee.entity';
import { LeaveRequestStatus } from '@common/enums';
import { getNextSequence } from '@common/utils/sequence.util';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';

@Injectable()
export class LeaveRequestsService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  private async getRepo(): Promise<Repository<LeaveRequest>> {
    return this.tenantConnectionManager.getRepository(LeaveRequest);
  }

  /**
   * Inclusive count of calendar days.
   *
   * Weekends and public holidays are counted, because the tenant schema has
   * no holiday calendar and no working-week configuration to consult. If that
   * is not your leave policy, that configuration has to exist first.
   */
  private computeDays(from: Date, to: Date): number {
    const diff = to.getTime() - from.getTime();
    return Math.round(diff / (1000 * 60 * 60 * 24)) + 1;
  }

  /** Statuses that consume entitlement or block an overlapping request. */
  private static readonly LIVE_STATUSES = [
    LeaveRequestStatus.PENDING,
    LeaveRequestStatus.APPROVED,
  ];

  async create(
    dto: CreateLeaveRequestDto,
    createdBy?: string,
  ): Promise<LeaveRequest> {
    const dataSource = await this.tenantConnectionManager.getDataSource();

    const from = new Date(dto.fromDate);
    const to = new Date(dto.toDate);
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
      throw new BadRequestException('fromDate and toDate must be valid dates');
    }
    if (to < from) {
      throw new BadRequestException('toDate must be after fromDate');
    }

    const employee = await dataSource
      .getRepository(Employee)
      .findOne({ where: { id: dto.employeeId } });
    if (!employee) {
      throw new NotFoundException(`Employee ${dto.employeeId} not found`);
    }

    const leaveType = await dataSource
      .getRepository(LeaveType)
      .findOne({ where: { id: dto.leaveTypeId } });
    if (!leaveType) {
      throw new NotFoundException(`Leave type ${dto.leaveTypeId} not found`);
    }
    if (!leaveType.isActive) {
      throw new BadRequestException(
        `Leave type ${leaveType.name} is no longer active`,
      );
    }

    const totalDays = this.computeDays(from, to);

    // An employee cannot be on leave twice over the same dates. Without this
    // the same day is approved more than once and entitlement double-counts.
    const clash = await dataSource
      .getRepository(LeaveRequest)
      .createQueryBuilder('lr')
      .where('lr.employeeId = :employeeId', { employeeId: dto.employeeId })
      .andWhere('lr.status IN (:...statuses)', {
        statuses: LeaveRequestsService.LIVE_STATUSES,
      })
      .andWhere('lr.fromDate <= :to AND lr.toDate >= :from', {
        from: dto.fromDate,
        to: dto.toDate,
      })
      .getOne();

    if (clash) {
      throw new BadRequestException(
        `Overlaps leave request ${clash.requestNumber} (${clash.status})`,
      );
    }

    // Entitlement. maxDaysPerYear of 0 means the type is uncapped.
    if (leaveType.maxDaysPerYear > 0) {
      const used = await this.daysUsedInYear(
        dataSource,
        dto.employeeId,
        dto.leaveTypeId,
        from.getFullYear(),
      );
      if (used + totalDays > leaveType.maxDaysPerYear) {
        const remaining = Math.max(0, leaveType.maxDaysPerYear - used);
        throw new BadRequestException(
          `Requested ${totalDays} day(s) of ${leaveType.name} but only ${remaining} of ` +
            `${leaveType.maxDaysPerYear} remain for ${from.getFullYear()}`,
        );
      }
    }

    const requestNumber = await getNextSequence(dataSource, 'LEAVE_REQUEST');
    const repo = dataSource.getRepository(LeaveRequest);
    const item = repo.create({
      ...dto,
      requestNumber,
      totalDays,
      createdBy,
      // A type that needs no sign-off is approved on submission, rather than
      // sitting in a queue nobody is required to look at.
      status: leaveType.requiresApproval
        ? LeaveRequestStatus.PENDING
        : LeaveRequestStatus.APPROVED,
    });
    return repo.save(item);
  }

  /** Days already committed for a leave type in a calendar year. */
  private async daysUsedInYear(
    dataSource: DataSource,
    employeeId: string,
    leaveTypeId: string,
    year: number,
    excludeRequestId?: string,
  ): Promise<number> {
    const qb = dataSource
      .getRepository(LeaveRequest)
      .createQueryBuilder('lr')
      .select('COALESCE(SUM(lr.total_days), 0)', 'used')
      .where('lr.employeeId = :employeeId', { employeeId })
      .andWhere('lr.leaveTypeId = :leaveTypeId', { leaveTypeId })
      .andWhere('lr.status IN (:...statuses)', {
        statuses: LeaveRequestsService.LIVE_STATUSES,
      })
      .andWhere('YEAR(lr.fromDate) = :year', { year });

    if (excludeRequestId) {
      qb.andWhere('lr.id <> :excludeRequestId', { excludeRequestId });
    }

    const row = await qb.getRawOne<{ used: string }>();
    return Number(row?.used ?? 0);
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
    const qb = repo
      .createQueryBuilder('lr')
      .leftJoinAndSelect('lr.employee', 'emp')
      .leftJoinAndSelect('lr.leaveType', 'lt')
      .where('lr.deleted_at IS NULL');

    if (employeeId) qb.andWhere('lr.employeeId = :employeeId', { employeeId });
    if (status) qb.andWhere('lr.status = :status', { status });
    if (year) qb.andWhere('YEAR(lr.fromDate) = :year', { year });

    const total = await qb.getCount();
    const data = await qb
      .orderBy('lr.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
    return { data, total };
  }

  async findOne(id: string): Promise<LeaveRequest> {
    const repo = await this.getRepo();
    const item = await repo.findOne({
      where: { id },
      relations: ['employee', 'leaveType'],
    });
    if (!item) throw new NotFoundException(`Leave request ${id} not found`);
    return item;
  }

  /**
   * Move a pending request to a decided state.
   *
   * Runs in a transaction with the row locked, so two approvers clicking at
   * once cannot both read PENDING and both write a decision.
   */
  private async decide(
    id: string,
    approverId: string,
    status: LeaveRequestStatus.APPROVED | LeaveRequestStatus.REJECTED,
    rejectionReason?: string,
  ): Promise<LeaveRequest> {
    const dataSource = await this.tenantConnectionManager.getDataSource();

    await dataSource.transaction(async (manager) => {
      const item = await manager.getRepository(LeaveRequest).findOne({
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!item) throw new NotFoundException(`Leave request ${id} not found`);

      if (item.status !== LeaveRequestStatus.PENDING) {
        const verb =
          status === LeaveRequestStatus.APPROVED ? 'approve' : 'reject';
        throw new BadRequestException(
          `Cannot ${verb} a request with status ${item.status}`,
        );
      }

      // Compared against `createdBy`, not `employeeId`: users live in the
      // master database and employees in this one, with no relation between
      // them, so an employee id and a user id never match. `createdBy` is the
      // user who submitted the request, which is the meaningful test.
      if (item.createdBy && item.createdBy === approverId) {
        throw new ForbiddenException(
          'You cannot decide a leave request you submitted',
        );
      }

      item.status = status;
      item.approvedBy = approverId;
      item.approvedAt = new Date();
      if (status === LeaveRequestStatus.REJECTED) {
        item.rejectionReason = rejectionReason ?? '';
      }

      await manager.getRepository(LeaveRequest).save(item);
    });

    return this.findOne(id);
  }

  async approve(id: string, approverId: string): Promise<LeaveRequest> {
    return this.decide(id, approverId, LeaveRequestStatus.APPROVED);
  }

  async reject(
    id: string,
    approverId: string,
    rejectionReason?: string,
  ): Promise<LeaveRequest> {
    return this.decide(
      id,
      approverId,
      LeaveRequestStatus.REJECTED,
      rejectionReason,
    );
  }

  /**
   * Withdraw a request.
   *
   * `canManage` is true when the caller holds hr.leave-requests.approve;
   * otherwise they may only cancel a request they submitted. Previously this
   * took no caller at all, so anyone who could create a leave request could
   * cancel anybody else's.
   *
   * Ownership is `createdBy` (a master user id), not `employeeId` (a tenant
   * employee id) — the two are unrelated records.
   */
  async cancel(
    id: string,
    cancelledBy: string,
    canManage = false,
  ): Promise<LeaveRequest> {
    const item = await this.findOne(id);

    if (!canManage && item.createdBy !== cancelledBy) {
      throw new ForbiddenException(
        'You can only cancel leave requests you submitted',
      );
    }

    if (item.status === LeaveRequestStatus.APPROVED) {
      throw new BadRequestException(
        'Cannot cancel an already approved request',
      );
    }
    if (item.status === LeaveRequestStatus.CANCELLED) {
      throw new BadRequestException('Request is already cancelled');
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
