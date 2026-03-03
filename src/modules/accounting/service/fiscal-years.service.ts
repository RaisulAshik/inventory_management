import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { FiscalPeriodStatus } from '@common/enums';
import { FiscalYear, FiscalPeriod } from '@/entities/tenant';
import {
  CreateFiscalYearDto,
  QueryFiscalYearDto,
  UpdateFiscalYearDto,
  CloseFiscalYearDto,
} from '../dto/fiscal-years.dto';
import { TenantConnectionManager } from '@database/tenant-connection.manager';

@Injectable()
export class FiscalYearsService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  private async getFYRepo(): Promise<Repository<FiscalYear>> {
    return this.tenantConnectionManager.getRepository(FiscalYear);
  }

  private async getFPRepo(): Promise<Repository<FiscalPeriod>> {
    return this.tenantConnectionManager.getRepository(FiscalPeriod);
  }

  async create(dto: CreateFiscalYearDto): Promise<FiscalYear> {
    const fyRepo = await this.getFYRepo();
    const existing = await fyRepo.findOne({
      where: { yearCode: dto.yearCode },
    });
    if (existing)
      throw new ConflictException(
        `Fiscal year code ${dto.yearCode} already exists`,
      );

    const overlapping = await fyRepo
      .createQueryBuilder('fy')
      .where('(fy.startDate <= :endDate AND fy.endDate >= :startDate)', {
        startDate: dto.startDate,
        endDate: dto.endDate,
      })
      .getCount();
    if (overlapping > 0)
      throw new ConflictException(
        'Fiscal year dates overlap with existing fiscal year',
      );

    if (dto.isCurrent) await fyRepo.update({}, { isCurrent: false });

    const fiscalYear = fyRepo.create(dto);
    const saved = await fyRepo.save(fiscalYear);
    await this.generateMonthlyPeriods(saved);
    return this.findOne(saved.id);
  }

  private async generateMonthlyPeriods(fiscalYear: FiscalYear): Promise<void> {
    const fpRepo = await this.getFPRepo();
    const start = new Date(fiscalYear.startDate);
    const periods: Partial<FiscalPeriod>[] = [];
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    for (let i = 0; i < 12; i++) {
      const periodStart = new Date(
        start.getFullYear(),
        start.getMonth() + i,
        start.getDate(),
      );
      const periodEnd = new Date(
        start.getFullYear(),
        start.getMonth() + i + 1,
        0,
      );
      const fyEnd = new Date(fiscalYear.endDate);
      if (i === 11 || periodEnd > fyEnd) periodEnd.setTime(fyEnd.getTime());

      periods.push({
        fiscalYearId: fiscalYear.id,
        periodNumber: i + 1,
        periodName: `${monthNames[periodStart.getMonth()]} ${periodStart.getFullYear()}`,
        startDate: periodStart,
        endDate: periodEnd,
        status: FiscalPeriodStatus.OPEN,
      });
    }
    await fpRepo.save(periods);
  }

  async findAll(query: QueryFiscalYearDto) {
    const fyRepo = await this.getFYRepo();
    const { status, isCurrent, page = 1, limit = 20 } = query;
    const qb = fyRepo
      .createQueryBuilder('fy')
      .leftJoinAndSelect('fy.periods', 'periods');
    if (status) qb.andWhere('fy.status = :status', { status });
    if (isCurrent !== undefined)
      qb.andWhere('fy.isCurrent = :isCurrent', { isCurrent });
    qb.orderBy('fy.startDate', 'DESC')
      .addOrderBy('periods.periodNumber', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);
    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<FiscalYear> {
    const fyRepo = await this.getFYRepo();
    const fy = await fyRepo.findOne({ where: { id }, relations: ['periods'] });
    if (!fy) throw new NotFoundException(`Fiscal year ${id} not found`);
    return fy;
  }

  async findCurrent(): Promise<FiscalYear> {
    const fyRepo = await this.getFYRepo();
    const fy = await fyRepo.findOne({
      where: { isCurrent: true as any },
      relations: ['periods'],
    });
    if (!fy) throw new NotFoundException('No current fiscal year found');
    return fy;
  }

  async update(id: string, dto: UpdateFiscalYearDto): Promise<FiscalYear> {
    const fyRepo = await this.getFYRepo();
    const fy = await this.findOne(id);
    if (dto.isCurrent) await fyRepo.update({}, { isCurrent: false });
    Object.assign(fy, dto);
    return fyRepo.save(fy);
  }

  async close(
    id: string,
    _dto: CloseFiscalYearDto,
    userId: string,
  ): Promise<FiscalYear> {
    const fyRepo = await this.getFYRepo();
    const fpRepo = await this.getFPRepo();
    const fy = await this.findOne(id);
    if (fy.status === FiscalPeriodStatus.CLOSED)
      throw new BadRequestException('Fiscal year is already closed');

    await fpRepo
      .createQueryBuilder()
      .update(FiscalPeriod)
      .set({
        status: FiscalPeriodStatus.CLOSED,
        closedBy: userId,
        closedAt: new Date(),
      })
      .where('fiscalYearId = :id AND status != :status', {
        id,
        status: FiscalPeriodStatus.CLOSED,
      })
      .execute();

    fy.status = FiscalPeriodStatus.CLOSED;
    fy.closedBy = userId;
    fy.closedAt = new Date();
    fy.isCurrent = false as any;
    return fyRepo.save(fy);
  }

  async remove(id: string): Promise<void> {
    const fyRepo = await this.getFYRepo();
    const fpRepo = await this.getFPRepo();
    const fy = await this.findOne(id);
    if (fy.status === FiscalPeriodStatus.CLOSED)
      throw new BadRequestException('Cannot delete a closed fiscal year');
    await fpRepo.delete({ fiscalYearId: id });
    await fyRepo.remove(fy);
  }
}
