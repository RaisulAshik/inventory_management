import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  JournalEntryStatus,
  FiscalPeriodStatus,
  NormalBalance,
} from '@common/enums';
import {
  JournalEntry,
  JournalEntryLine,
  FiscalPeriod,
  ChartOfAccounts,
} from '@/entities/tenant';
import {
  CreateJournalEntryDto,
  ReverseJournalEntryDto,
  QueryJournalEntryDto,
  UpdateJournalEntryDto,
} from '../dto/journal-entries.dto';
import { GeneralLedgerService } from './journal-ledger.service';
import { TenantConnectionManager } from '@database/tenant-connection.manager';

@Injectable()
export class JournalEntriesService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
    private readonly glService: GeneralLedgerService,
  ) {}

  private async getJeRepo(): Promise<Repository<JournalEntry>> {
    return this.tenantConnectionManager.getRepository(JournalEntry);
  }

  private async getLineRepo(): Promise<Repository<JournalEntryLine>> {
    return this.tenantConnectionManager.getRepository(JournalEntryLine);
  }

  private async getPeriodRepo(): Promise<Repository<FiscalPeriod>> {
    return this.tenantConnectionManager.getRepository(FiscalPeriod);
  }

  private async getAccountRepo(): Promise<Repository<ChartOfAccounts>> {
    return this.tenantConnectionManager.getRepository(ChartOfAccounts);
  }

  async create(
    dto: CreateJournalEntryDto,
    userId?: string,
  ): Promise<JournalEntry> {
    this.validateBalance(dto.lines);

    const periodRepo = await this.getPeriodRepo();
    const accountRepo = await this.getAccountRepo();
    const jeRepo = await this.getJeRepo();
    const lineRepo = await this.getLineRepo();
    const dataSource = await this.tenantConnectionManager.getDataSource();

    const period = await periodRepo.findOne({
      where: { id: dto.fiscalPeriodId },
    });
    if (!period) throw new NotFoundException('Fiscal period not found');
    if (period.status === FiscalPeriodStatus.CLOSED)
      throw new BadRequestException('Cannot post to a closed fiscal period');

    for (const line of dto.lines) {
      const account = await accountRepo.findOne({
        where: { id: line.accountId },
      });
      if (!account)
        throw new NotFoundException(`Account ${line.accountId} not found`);
      if (account.isHeader)
        throw new BadRequestException(
          `Cannot post to header account ${account.accountCode}`,
        );
    }

    const entryNumber = await this.generateEntryNumber();
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let totalDebit = 0;
      let totalCredit = 0;

      const lines = dto.lines.map((line) => {
        const debit = Number(line.debitAmount) || 0;
        const credit = Number(line.creditAmount) || 0;
        const exchangeRate = Number(line.exchangeRate) || 1;
        totalDebit += debit;
        totalCredit += credit;
        return lineRepo.create({
          ...line,
          debitAmount: debit,
          creditAmount: credit,
          baseDebitAmount: debit * exchangeRate,
          baseCreditAmount: credit * exchangeRate,
          exchangeRate,
          currency: line.currency || dto.currency || 'INR',
        });
      });

      const entry = jeRepo.create({
        entryNumber,
        entryDate: dto.entryDate,
        fiscalYearId: dto.fiscalYearId,
        fiscalPeriodId: dto.fiscalPeriodId,
        entryType: dto.entryType,
        referenceType: dto.referenceType,
        referenceId: dto.referenceId,
        referenceNumber: dto.referenceNumber,
        description: dto.description,
        totalDebit,
        totalCredit,
        currency: dto.currency || 'INR',
        exchangeRate: dto.exchangeRate || 1,
        status: JournalEntryStatus.DRAFT,
        notes: dto.notes,
        createdBy: userId,
      });

      const savedEntry = await queryRunner.manager.save(JournalEntry, entry);
      for (const line of lines) {
        line.journalEntryId = savedEntry.id;
      }
      await queryRunner.manager.save(JournalEntryLine, lines);
      await queryRunner.commitTransaction();
      return this.findOne(savedEntry.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async post(id: string, userId: string): Promise<JournalEntry> {
    const periodRepo = await this.getPeriodRepo();
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const entry = await this.findOne(id);

    if (entry.status !== JournalEntryStatus.DRAFT)
      throw new BadRequestException('Only draft entries can be posted');

    const period = await periodRepo.findOne({
      where: { id: entry.fiscalPeriodId },
    });
    if (period?.status === FiscalPeriodStatus.CLOSED)
      throw new BadRequestException('Cannot post to a closed fiscal period');

    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const line of entry.lines) {
        await this.glService.postEntry(
          {
            accountId: line.accountId,
            fiscalYearId: entry.fiscalYearId,
            fiscalPeriodId: entry.fiscalPeriodId,
            transactionDate: entry.entryDate,
            journalEntryId: entry.id,
            journalEntryLineId: line.id,
            description: line.description || entry.description,
            debitAmount: Number(line.debitAmount),
            creditAmount: Number(line.creditAmount),
            currency: line.currency,
            exchangeRate: Number(line.exchangeRate),
            baseDebitAmount: Number(line.baseDebitAmount),
            baseCreditAmount: Number(line.baseCreditAmount),
            costCenterId: line.costCenterId,
            referenceType: entry.referenceType,
            referenceId: entry.referenceId,
            referenceNumber: entry.referenceNumber,
            partyType: line.partyType,
            partyId: line.partyId,
          },
          queryRunner,
        );

        const account = await queryRunner.manager.findOne(ChartOfAccounts, {
          where: { id: line.accountId },
        });
        if (account) {
          const netChange =
            account.normalBalance === NormalBalance.DEBIT
              ? Number(line.debitAmount) - Number(line.creditAmount)
              : Number(line.creditAmount) - Number(line.debitAmount);
          account.currentBalance = Number(account.currentBalance) + netChange;
          await queryRunner.manager.save(ChartOfAccounts, account);
        }
      }

      entry.status = JournalEntryStatus.POSTED;
      entry.postedBy = userId;
      entry.postedAt = new Date();
      await queryRunner.manager.save(JournalEntry, entry);
      await queryRunner.commitTransaction();
      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async reverse(
    id: string,
    dto: ReverseJournalEntryDto,
    userId: string,
  ): Promise<JournalEntry> {
    const periodRepo = await this.getPeriodRepo();
    const jeRepo = await this.getJeRepo();
    const original = await this.findOne(id);

    if (original.status !== JournalEntryStatus.POSTED)
      throw new BadRequestException('Only posted entries can be reversed');
    if (original.reversedById)
      throw new BadRequestException('Entry has already been reversed');

    const reverseLines = original.lines.map((line) => ({
      lineNumber: line.lineNumber,
      accountId: line.accountId,
      costCenterId: line.costCenterId,
      description: `Reversal: ${line.description || ''}`,
      debitAmount: Number(line.creditAmount),
      creditAmount: Number(line.debitAmount),
      currency: line.currency,
      exchangeRate: Number(line.exchangeRate),
      partyType: line.partyType,
      partyId: line.partyId,
      taxCategoryId: line.taxCategoryId,
    }));

    const period = await periodRepo
      .createQueryBuilder('fp')
      .where('fp.startDate <= :date AND fp.endDate >= :date', {
        date: dto.reversalDate,
      })
      .getOne();
    if (!period)
      throw new BadRequestException('No fiscal period found for reversal date');

    const reversalEntry = await this.create(
      {
        entryDate: dto.reversalDate,
        fiscalYearId: period.fiscalYearId,
        fiscalPeriodId: period.id,
        entryType: original.entryType,
        referenceType: 'REVERSAL',
        referenceId: original.id,
        referenceNumber: original.entryNumber,
        description: dto.description || `Reversal of ${original.entryNumber}`,
        currency: original.currency,
        exchangeRate: Number(original.exchangeRate),
        lines: reverseLines,
      },
      userId,
    );

    const posted = await this.post(reversalEntry.id, userId);

    original.reversedById = posted.id;
    original.status = JournalEntryStatus.REVERSED;
    await jeRepo.save(original);

    return posted;
  }

  async findAll(query: QueryJournalEntryDto) {
    const jeRepo = await this.getJeRepo();
    const {
      entryType,
      status,
      fiscalYearId,
      fiscalPeriodId,
      startDate,
      endDate,
      accountId,
      isAutoGenerated,
      search,
      page = 1,
      limit = 20,
    } = query;

    const qb = jeRepo.createQueryBuilder('je');
    qb.leftJoinAndSelect('je.lines', 'lines');
    qb.leftJoinAndSelect('lines.account', 'account');

    if (entryType) qb.andWhere('je.entryType = :entryType', { entryType });
    if (status) qb.andWhere('je.status = :status', { status });
    if (fiscalYearId)
      qb.andWhere('je.fiscalYearId = :fiscalYearId', { fiscalYearId });
    if (fiscalPeriodId)
      qb.andWhere('je.fiscalPeriodId = :fiscalPeriodId', { fiscalPeriodId });
    if (startDate) qb.andWhere('je.entryDate >= :startDate', { startDate });
    if (endDate) qb.andWhere('je.entryDate <= :endDate', { endDate });
    if (accountId) qb.andWhere('lines.accountId = :accountId', { accountId });
    if (isAutoGenerated !== undefined)
      qb.andWhere('je.isAutoGenerated = :isAutoGenerated', { isAutoGenerated });
    if (search)
      qb.andWhere(
        '(je.entryNumber LIKE :search OR je.description LIKE :search OR je.referenceNumber LIKE :search)',
        { search: `%${search}%` },
      );

    qb.orderBy('je.entryDate', 'DESC')
      .addOrderBy('je.entryNumber', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<JournalEntry> {
    const jeRepo = await this.getJeRepo();
    const entry = await jeRepo.findOne({
      where: { id },
      relations: [
        'lines',
        'lines.account',
        'lines.costCenter',
        'fiscalYear',
        'fiscalPeriod',
      ],
    });
    if (!entry) throw new NotFoundException(`Journal entry ${id} not found`);
    return entry;
  }

  async update(id: string, dto: UpdateJournalEntryDto): Promise<JournalEntry> {
    const jeRepo = await this.getJeRepo();
    const lineRepo = await this.getLineRepo();
    const entry = await this.findOne(id);

    if (entry.status !== JournalEntryStatus.DRAFT)
      throw new BadRequestException('Only draft entries can be updated');

    if (dto.lines) {
      this.validateBalance(dto.lines);
      await lineRepo.delete({ journalEntryId: id });

      let totalDebit = 0;
      let totalCredit = 0;
      const lines = dto.lines.map((line) => {
        const debit = Number(line.debitAmount) || 0;
        const credit = Number(line.creditAmount) || 0;
        totalDebit += debit;
        totalCredit += credit;
        return lineRepo.create({
          ...line,
          journalEntryId: id,
          debitAmount: debit,
          creditAmount: credit,
          baseDebitAmount: debit * (Number(line.exchangeRate) || 1),
          baseCreditAmount: credit * (Number(line.exchangeRate) || 1),
          currency: line.currency || dto.currency || entry.currency,
        });
      });
      await lineRepo.save(lines);
      entry.totalDebit = totalDebit;
      entry.totalCredit = totalCredit;
    }

    if (dto.description) entry.description = dto.description;
    if (dto.entryDate) entry.entryDate = dto.entryDate as any;
    if (dto.notes) entry.notes = dto.notes;
    if (dto.referenceNumber) entry.referenceNumber = dto.referenceNumber;

    await jeRepo.save(entry);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const jeRepo = await this.getJeRepo();
    const lineRepo = await this.getLineRepo();
    const entry = await this.findOne(id);
    if (entry.status !== JournalEntryStatus.DRAFT)
      throw new BadRequestException('Only draft entries can be deleted');
    await lineRepo.delete({ journalEntryId: id });
    await jeRepo.remove(entry);
  }

  private validateBalance(
    lines: { debitAmount: number; creditAmount: number }[],
  ): void {
    if (!lines || lines.length < 2)
      throw new BadRequestException('Journal entry must have at least 2 lines');

    const totalDebit = lines.reduce(
      (sum, l) => sum + (Number(l.debitAmount) || 0),
      0,
    );
    const totalCredit = lines.reduce(
      (sum, l) => sum + (Number(l.creditAmount) || 0),
      0,
    );

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      throw new BadRequestException(
        `Entry is not balanced. Debit: ${totalDebit}, Credit: ${totalCredit}`,
      );
    }

    for (const line of lines) {
      const debit = Number(line.debitAmount) || 0;
      const credit = Number(line.creditAmount) || 0;
      if (debit > 0 && credit > 0)
        throw new BadRequestException(
          'A line cannot have both debit and credit amounts',
        );
      if (debit === 0 && credit === 0)
        throw new BadRequestException(
          'A line must have either a debit or credit amount',
        );
    }
  }

  private async generateEntryNumber(): Promise<string> {
    const jeRepo = await this.getJeRepo();
    const year = new Date().getFullYear();
    const prefix = `JE-${year}-`;
    const last = await jeRepo
      .createQueryBuilder('je')
      .where('je.entryNumber LIKE :prefix', { prefix: `${prefix}%` })
      .orderBy('je.entryNumber', 'DESC')
      .getOne();
    if (last) {
      const lastNum = Number.parseInt(last.entryNumber.replace(prefix, ''), 10);
      return `${prefix}${String(lastNum + 1).padStart(6, '0')}`;
    }
    return `${prefix}000001`;
  }
}
