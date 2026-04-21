import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { LeaveType } from '@entities/tenant/hr/leave-type.entity';
import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';

@Injectable()
export class LeaveTypesService {
  constructor(private readonly tenantConnectionManager: TenantConnectionManager) {}

  private async getRepo(): Promise<Repository<LeaveType>> {
    return this.tenantConnectionManager.getRepository(LeaveType);
  }

  async create(dto: CreateLeaveTypeDto, createdBy?: string): Promise<LeaveType> {
    const repo = await this.getRepo();
    const existing = await repo.findOne({ where: { code: dto.code } });
    if (existing) throw new BadRequestException(`Leave type code '${dto.code}' already exists`);
    const item = repo.create({ ...dto, createdBy });
    return repo.save(item);
  }

  async findAll(isActive?: boolean): Promise<LeaveType[]> {
    const repo = await this.getRepo();
    const qb = repo.createQueryBuilder('lt').where('lt.deleted_at IS NULL');
    if (isActive !== undefined) qb.andWhere('lt.isActive = :isActive', { isActive: isActive ? 1 : 0 });
    return qb.orderBy('lt.name', 'ASC').getMany();
  }

  async findOne(id: string): Promise<LeaveType> {
    const repo = await this.getRepo();
    const item = await repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException(`Leave type ${id} not found`);
    return item;
  }

  async update(id: string, dto: Partial<CreateLeaveTypeDto> & { isActive?: boolean }): Promise<LeaveType> {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    const repo = await this.getRepo();
    return repo.save(item);
  }

  async remove(id: string): Promise<void> {
    const repo = await this.getRepo();
    const item = await this.findOne(id);
    await repo.softRemove(item);
  }
}
