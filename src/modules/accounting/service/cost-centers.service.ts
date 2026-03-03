import { CostCenter } from '@/entities/tenant';
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Repository, IsNull } from 'typeorm';
import {
  CreateCostCenterDto,
  QueryCostCenterDto,
  UpdateCostCenterDto,
} from '../dto/cost-centers.dto';
import { TenantConnectionManager } from '@database/tenant-connection.manager';

@Injectable()
export class CostCentersService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  private async getRepo(): Promise<Repository<CostCenter>> {
    return this.tenantConnectionManager.getRepository(CostCenter);
  }

  async create(dto: CreateCostCenterDto): Promise<CostCenter> {
    const repo = await this.getRepo();
    const existing = await repo.findOne({
      where: { costCenterCode: dto.costCenterCode },
    });
    if (existing)
      throw new ConflictException(
        `Cost center code ${dto.costCenterCode} already exists`,
      );
    const costCenter = repo.create(dto);
    if (dto.parentId) {
      const parent = await repo.findOne({ where: { id: dto.parentId } });
      if (!parent)
        throw new NotFoundException(
          `Parent cost center ${dto.parentId} not found`,
        );
      costCenter.level = parent.level + 1;
      costCenter.path = parent.path
        ? `${parent.path}/${costCenter.costCenterCode}`
        : `${parent.costCenterCode}/${costCenter.costCenterCode}`;
    } else {
      costCenter.level = 0;
      costCenter.path = costCenter.costCenterCode;
    }
    return repo.save(costCenter);
  }

  async findAll(query: QueryCostCenterDto) {
    const repo = await this.getRepo();
    const { parentId, isActive, search, page = 1, limit = 50 } = query;
    const qb = repo.createQueryBuilder('cc');
    if (parentId) qb.andWhere('cc.parentId = :parentId', { parentId });
    if (isActive !== undefined)
      qb.andWhere('cc.isActive = :isActive', { isActive });
    if (search)
      qb.andWhere(
        '(cc.costCenterCode LIKE :search OR cc.costCenterName LIKE :search)',
        { search: `%${search}%` },
      );
    qb.orderBy('cc.costCenterCode', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);
    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<CostCenter> {
    const repo = await this.getRepo();
    const cc = await repo.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });
    if (!cc) throw new NotFoundException(`Cost center ${id} not found`);
    return cc;
  }

  async update(id: string, dto: UpdateCostCenterDto): Promise<CostCenter> {
    const repo = await this.getRepo();
    const cc = await this.findOne(id);
    if (dto.parentId && dto.parentId === id)
      throw new BadRequestException('Cost center cannot be its own parent');
    Object.assign(cc, dto);
    return repo.save(cc);
  }

  async remove(id: string): Promise<void> {
    const repo = await this.getRepo();
    const cc = await this.findOne(id);
    const hasChildren = await repo.count({ where: { parentId: id } });
    if (hasChildren > 0)
      throw new BadRequestException(
        'Cannot delete cost center with child cost centers',
      );
    await repo.remove(cc);
  }

  async getTree(): Promise<CostCenter[]> {
    const repo = await this.getRepo();
    return repo.find({
      where: { parentId: IsNull() },
      relations: ['children', 'children.children'],
      order: { costCenterCode: 'ASC' },
    });
  }
}
