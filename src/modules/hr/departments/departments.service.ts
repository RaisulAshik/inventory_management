import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { Department } from '@entities/tenant/hr/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(private readonly tenantConnectionManager: TenantConnectionManager) {}

  private async getRepo(): Promise<Repository<Department>> {
    return this.tenantConnectionManager.getRepository(Department);
  }

  async create(dto: CreateDepartmentDto, createdBy?: string): Promise<Department> {
    const repo = await this.getRepo();

    const existing = await repo.findOne({ where: { departmentCode: dto.departmentCode } });
    if (existing) throw new BadRequestException(`Department code '${dto.departmentCode}' already exists`);

    const department = repo.create({ ...dto, createdBy });
    return repo.save(department);
  }

  async findAll(search?: string, isActive?: boolean): Promise<Department[]> {
    const repo = await this.getRepo();
    const qb = repo.createQueryBuilder('d')
      .leftJoinAndSelect('d.parent', 'parent')
      .where('d.deleted_at IS NULL');

    if (search) {
      qb.andWhere('(d.name LIKE :s OR d.departmentCode LIKE :s)', { s: `%${search}%` });
    }
    if (isActive !== undefined) {
      qb.andWhere('d.isActive = :isActive', { isActive: isActive ? 1 : 0 });
    }

    return qb.orderBy('d.name', 'ASC').getMany();
  }

  async findOne(id: string): Promise<Department> {
    const repo = await this.getRepo();
    const dept = await repo.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });
    if (!dept) throw new NotFoundException(`Department ${id} not found`);
    return dept;
  }

  async update(id: string, dto: UpdateDepartmentDto): Promise<Department> {
    const dept = await this.findOne(id);
    Object.assign(dept, dto);
    const repo = await this.getRepo();
    return repo.save(dept);
  }

  async remove(id: string): Promise<void> {
    const repo = await this.getRepo();
    const dept = await this.findOne(id);
    await repo.softRemove(dept);
  }
}
