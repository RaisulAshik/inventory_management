import { GeneralLedger } from '@/entities/tenant';
import { Injectable } from '@nestjs/common';
import { Repository, QueryRunner } from 'typeorm';
import { QueryGeneralLedgerDto } from '../dto/general-ledger.dto';
import { TenantConnectionManager } from '@database/tenant-connection.manager';

export interface PostGLEntryDto {
  accountId: string;
  fiscalYearId: string;
  fiscalPeriodId: string;
  transactionDate: Date | string;
  journalEntryId: string;
  journalEntryLineId: string;
  description?: string;
  debitAmount: number;
  creditAmount: number;
  currency?: string;
  exchangeRate?: number;
  baseDebitAmount?: number;
  baseCreditAmount?: number;
  costCenterId?: string;
  referenceType?: string;
  referenceId?: string;
  referenceNumber?: string;
  partyType?: string;
  partyId?: string;
}

@Injectable()
export class GeneralLedgerService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  private async getRepo(): Promise<Repository<GeneralLedger>> {
    return this.tenantConnectionManager.getRepository(GeneralLedger);
  }

  async postEntry(
    dto: PostGLEntryDto,
    queryRunner?: QueryRunner,
  ): Promise<GeneralLedger> {
    const glRepo = await this.getRepo();
    const lastEntry = await (queryRunner?.manager || glRepo.manager)
      .createQueryBuilder(GeneralLedger, 'gl')
      .where('gl.accountId = :accountId', { accountId: dto.accountId })
      .orderBy('gl.transactionDate', 'DESC')
      .addOrderBy('gl.createdAt', 'DESC')
      .getOne();

    const previousBalance = lastEntry ? Number(lastEntry.runningBalance) : 0;
    const runningBalance = previousBalance + dto.debitAmount - dto.creditAmount;

    const entry = glRepo.create({
      ...dto,
      runningBalance,
      currency: dto.currency || 'INR',
      exchangeRate: dto.exchangeRate || 1,
      baseDebitAmount: dto.baseDebitAmount || dto.debitAmount,
      baseCreditAmount: dto.baseCreditAmount || dto.creditAmount,
    });

    if (queryRunner) return queryRunner.manager.save(GeneralLedger, entry);
    return glRepo.save(entry);
  }

  async findAll(query: QueryGeneralLedgerDto) {
    const repo = await this.getRepo();
    const {
      accountId,
      fiscalYearId,
      fiscalPeriodId,
      costCenterId,
      startDate,
      endDate,
      referenceType,
      partyType,
      partyId,
      search,
      page = 1,
      limit = 50,
    } = query;

    const qb = repo
      .createQueryBuilder('gl')
      .leftJoinAndSelect('gl.account', 'account')
      .leftJoinAndSelect('gl.journalEntry', 'journalEntry');

    if (accountId) qb.andWhere('gl.accountId = :accountId', { accountId });
    if (fiscalYearId)
      qb.andWhere('gl.fiscalYearId = :fiscalYearId', { fiscalYearId });
    if (fiscalPeriodId)
      qb.andWhere('gl.fiscalPeriodId = :fiscalPeriodId', { fiscalPeriodId });
    if (costCenterId)
      qb.andWhere('gl.costCenterId = :costCenterId', { costCenterId });
    if (startDate)
      qb.andWhere('gl.transactionDate >= :startDate', { startDate });
    if (endDate) qb.andWhere('gl.transactionDate <= :endDate', { endDate });
    if (referenceType)
      qb.andWhere('gl.referenceType = :referenceType', { referenceType });
    if (partyType) qb.andWhere('gl.partyType = :partyType', { partyType });
    if (partyId) qb.andWhere('gl.partyId = :partyId', { partyId });
    if (search)
      qb.andWhere(
        '(gl.description LIKE :search OR gl.referenceNumber LIKE :search)',
        { search: `%${search}%` },
      );

    qb.orderBy('gl.transactionDate', 'ASC')
      .addOrderBy('gl.createdAt', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);
    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async getAccountLedger(
    accountId: string,
    startDate?: string,
    endDate?: string,
  ) {
    const repo = await this.getRepo();
    const qb = repo
      .createQueryBuilder('gl')
      .leftJoinAndSelect('gl.account', 'account')
      .leftJoinAndSelect('gl.journalEntry', 'je')
      .where('gl.accountId = :accountId', { accountId });

    if (startDate)
      qb.andWhere('gl.transactionDate >= :startDate', { startDate });
    if (endDate) qb.andWhere('gl.transactionDate <= :endDate', { endDate });
    qb.orderBy('gl.transactionDate', 'ASC').addOrderBy('gl.createdAt', 'ASC');
    const entries = await qb.getMany();

    let openingBalance = 0;
    if (startDate) {
      const ob = await repo
        .createQueryBuilder('gl')
        .select('SUM(gl.debitAmount) - SUM(gl.creditAmount)', 'balance')
        .where('gl.accountId = :accountId', { accountId })
        .andWhere('gl.transactionDate < :startDate', { startDate })
        .getRawOne();
      openingBalance = Number(ob?.balance) || 0;
    }

    const totalDebit = entries.reduce(
      (sum, e) => sum + Number(e.debitAmount),
      0,
    );
    const totalCredit = entries.reduce(
      (sum, e) => sum + Number(e.creditAmount),
      0,
    );
    return {
      accountId,
      openingBalance,
      entries,
      totalDebit,
      totalCredit,
      closingBalance: openingBalance + totalDebit - totalCredit,
    };
  }

  async getTrialBalance(fiscalYearId: string, asOfDate?: string) {
    const repo = await this.getRepo();
    const qb = repo
      .createQueryBuilder('gl')
      .select('gl.accountId', 'accountId')
      .addSelect('account.accountCode', 'accountCode')
      .addSelect('account.accountName', 'accountName')
      .addSelect('account.accountType', 'accountType')
      .addSelect('account.normalBalance', 'normalBalance')
      .addSelect('SUM(gl.debitAmount)', 'totalDebit')
      .addSelect('SUM(gl.creditAmount)', 'totalCredit')
      .leftJoin('gl.account', 'account')
      .where('gl.fiscalYearId = :fiscalYearId', { fiscalYearId })
      .groupBy('gl.accountId')
      .addGroupBy('account.accountCode')
      .addGroupBy('account.accountName')
      .addGroupBy('account.accountType')
      .addGroupBy('account.normalBalance');

    if (asOfDate) qb.andWhere('gl.transactionDate <= :asOfDate', { asOfDate });
    qb.orderBy('account.accountCode', 'ASC');
    const results = await qb.getRawMany();

    let sumDebit = 0;
    let sumCredit = 0;
    const trialBalance = results.map((r) => {
      const debit = Number(r.totalDebit) || 0;
      const credit = Number(r.totalCredit) || 0;
      const balance = debit - credit;
      const debitBalance = balance > 0 ? balance : 0;
      const creditBalance = balance < 0 ? Math.abs(balance) : 0;
      sumDebit += debitBalance;
      sumCredit += creditBalance;
      return {
        accountId: r.accountId,
        accountCode: r.accountCode,
        accountName: r.accountName,
        accountType: r.accountType,
        normalBalance: r.normalBalance,
        totalDebit: debit,
        totalCredit: credit,
        debitBalance,
        creditBalance,
      };
    });

    return {
      trialBalance,
      totals: {
        debit: sumDebit,
        credit: sumCredit,
        difference: sumDebit - sumCredit,
      },
    };
  }
}
