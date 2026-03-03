import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { FiscalPeriodStatus } from '@common/enums';
import { FiscalPeriod } from '@/entities/tenant';
import {
  CreateFiscalPeriodDto,
  QueryFiscalPeriodDto,
  UpdateFiscalPeriodDto,
} from '../dto/fiscal-periods.dto';
import { TenantConnectionManager } from '@database/tenant-connection.manager';

@Injectable()
export class FiscalPeriodsService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  private async getRepo(): Promise<Repository<FiscalPeriod>> {
    return this.tenantConnectionManager.getRepository(FiscalPeriod);
  }

  async create(dto: CreateFiscalPeriodDto): Promise<FiscalPeriod> {
    const repo = await this.getRepo();
    const period = repo.create(dto);
    return repo.save(period);
  }

  async findAll(query: QueryFiscalPeriodDto) {
    const repo = await this.getRepo();
    const { fiscalYearId, status, page = 1, limit = 20 } = query;
    const qb = repo
      .createQueryBuilder('fp')
      .leftJoinAndSelect('fp.fiscalYear', 'fy');
    if (fiscalYearId)
      qb.andWhere('fp.fiscalYearId = :fiscalYearId', { fiscalYearId });
    if (status) qb.andWhere('fp.status = :status', { status });
    qb.orderBy('fp.periodNumber', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);
    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<FiscalPeriod> {
    const repo = await this.getRepo();
    const period = await repo.findOne({
      where: { id },
      relations: ['fiscalYear'],
    });
    if (!period) throw new NotFoundException(`Fiscal period ${id} not found`);
    return period;
  }

  async findByDate(date: Date): Promise<FiscalPeriod> {
    const repo = await this.getRepo();
    const period = await repo.findOne({
      where: {
        startDate: LessThanOrEqual(date),
        endDate: MoreThanOrEqual(date),
      },
      relations: ['fiscalYear'],
    });
    if (!period)
      throw new NotFoundException(`No fiscal period found for date ${date}`);
    return period;
  }

  async update(id: string, dto: UpdateFiscalPeriodDto): Promise<FiscalPeriod> {
    const repo = await this.getRepo();
    const period = await this.findOne(id);
    Object.assign(period, dto);
    return repo.save(period);
  }

  async close(id: string, userId: string): Promise<FiscalPeriod> {
    const repo = await this.getRepo();
    const period = await this.findOne(id);
    if (period.status === FiscalPeriodStatus.CLOSED)
      throw new BadRequestException('Fiscal period is already closed');

    if (period.periodNumber > 1) {
      const priorOpen = await repo
        .createQueryBuilder('fp')
        .where('fp.fiscalYearId = :fyId', { fyId: period.fiscalYearId })
        .andWhere('fp.periodNumber < :pn', { pn: period.periodNumber })
        .andWhere('fp.status != :status', { status: FiscalPeriodStatus.CLOSED })
        .getCount();
      if (priorOpen > 0)
        throw new BadRequestException(
          'Cannot close period: prior periods are still open',
        );
    }

    period.status = FiscalPeriodStatus.CLOSED;
    period.closedBy = userId;
    period.closedAt = new Date();
    return repo.save(period);
  }

  async reopen(id: string): Promise<FiscalPeriod> {
    const repo = await this.getRepo();
    const period = await this.findOne(id);
    if (period.status !== FiscalPeriodStatus.CLOSED)
      throw new BadRequestException('Fiscal period is not closed');
    period.status = FiscalPeriodStatus.OPEN;
    return repo.save(period);
  }
}
