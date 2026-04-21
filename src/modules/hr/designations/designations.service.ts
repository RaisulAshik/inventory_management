import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { Designation } from '@entities/tenant/hr/designation.entity';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';

@Injectable()
export class DesignationsService {
  constructor(private readonly tenantConnectionManager: TenantConnectionManager) {}

  private async getRepo(): Promise<Repository<Designation>> {
    return this.tenantConnectionManager.getRepository(Designation);
  }

  async create(dto: CreateDesignationDto, createdBy?: string): Promise<Designation> {
    const repo = await this.getRepo();
    const existing = await repo.findOne({ where: { designationCode: dto.designationCode } });
    if (existing) throw new BadRequestException(`Designation code '${dto.designationCode}' already exists`);
    const designation = repo.create({ ...dto, createdBy });
    return repo.save(designation);
  }

  async findAll(params: {
    search?: string;
    departmentId?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ data: Designation[]; total: number }> {
    const { search, departmentId, isActive, page = 1, limit = 20 } = params;
    const repo = await this.getRepo();
    const qb = repo.createQueryBuilder('d')
      .leftJoinAndSelect('d.department', 'dept')
      .where('d.deleted_at IS NULL');

    if (search) {
      qb.andWhere('(d.name LIKE :search OR d.designationCode LIKE :search)', { search: `%${search}%` });
    }
    if (departmentId) qb.andWhere('d.departmentId = :departmentId', { departmentId });
    if (isActive !== undefined) qb.andWhere('d.isActive = :isActive', { isActive: isActive ? 1 : 0 });

    const total = await qb.getCount();
    const data = await qb.orderBy('d.name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { data, total };
  }

  async findOne(id: string): Promise<Designation> {
    const repo = await this.getRepo();
    const item = await repo.findOne({ where: { id }, relations: ['department'] });
    if (!item) throw new NotFoundException(`Designation ${id} not found`);
    return item;
  }

  async update(id: string, dto: UpdateDesignationDto): Promise<Designation> {
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
