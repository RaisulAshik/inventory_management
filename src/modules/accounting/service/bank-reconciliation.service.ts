import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { BankTransactionsService } from './bank-transactions.service';
import {
  BankReconciliation,
  BankAccount,
  ReconciliationStatus,
} from '@/entities/tenant';
import {
  CreateBankReconciliationDto,
  QueryBankReconciliationDto,
  UpdateBankReconciliationDto,
  CompleteReconciliationDto,
} from '../dto/bank-reconciliation.dto';
import { TenantConnectionManager } from '@database/tenant-connection.manager';

@Injectable()
export class BankReconciliationsService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
    private readonly bankTxnService: BankTransactionsService,
  ) {}

  private async getRecRepo(): Promise<Repository<BankReconciliation>> {
    return this.tenantConnectionManager.getRepository(BankReconciliation);
  }

  private async getBankRepo(): Promise<Repository<BankAccount>> {
    return this.tenantConnectionManager.getRepository(BankAccount);
  }

  async create(
    dto: CreateBankReconciliationDto,
    userId?: string,
  ): Promise<BankReconciliation> {
    const recRepo = await this.getRecRepo();
    const bankRepo = await this.getBankRepo();

    const bankAccount = await bankRepo.findOne({
      where: { id: dto.bankAccountId },
    });
    if (!bankAccount) throw new NotFoundException('Bank account not found');

    const existing = await recRepo.findOne({
      where: {
        bankAccountId: dto.bankAccountId,
        status: ReconciliationStatus.DRAFT,
      },
    });
    if (existing)
      throw new BadRequestException(
        'An open reconciliation already exists for this bank account',
      );

    const reconciliationNumber = await this.generateReconciliationNumber();
    const reconciliation = recRepo.create({
      ...dto,
      reconciliationNumber,
      status: ReconciliationStatus.DRAFT,
      createdBy: userId,
    });
    return recRepo.save(reconciliation);
  }

  async findAll(query: QueryBankReconciliationDto) {
    const repo = await this.getRecRepo();
    const {
      bankAccountId,
      status,
      startDate,
      endDate,
      page = 1,
      limit = 20,
    } = query;
    const qb = repo
      .createQueryBuilder('br')
      .leftJoinAndSelect('br.bankAccount', 'bankAccount');
    if (bankAccountId)
      qb.andWhere('br.bankAccountId = :bankAccountId', { bankAccountId });
    if (status) qb.andWhere('br.status = :status', { status });
    if (startDate) qb.andWhere('br.statementDate >= :startDate', { startDate });
    if (endDate) qb.andWhere('br.statementDate <= :endDate', { endDate });
    qb.orderBy('br.statementDate', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<BankReconciliation> {
    const repo = await this.getRecRepo();
    const rec = await repo.findOne({
      where: { id },
      relations: ['bankAccount'],
    });
    if (!rec)
      throw new NotFoundException(`Bank reconciliation ${id} not found`);
    return rec;
  }

  async update(
    id: string,
    dto: UpdateBankReconciliationDto,
  ): Promise<BankReconciliation> {
    const repo = await this.getRecRepo();
    const rec = await this.findOne(id);
    if (rec.status === ReconciliationStatus.COMPLETED)
      throw new BadRequestException('Cannot update a completed reconciliation');
    Object.assign(rec, dto);
    return repo.save(rec);
  }

  async startReconciliation(id: string): Promise<BankReconciliation> {
    const repo = await this.getRecRepo();
    const rec = await this.findOne(id);
    if (rec.status !== ReconciliationStatus.DRAFT)
      throw new BadRequestException(
        'Only draft reconciliations can be started',
      );
    rec.status = ReconciliationStatus.IN_PROGRESS;
    return repo.save(rec);
  }

  async complete(
    id: string,
    dto: CompleteReconciliationDto,
    userId: string,
  ): Promise<BankReconciliation> {
    const bankRepo = await this.getBankRepo();
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const rec = await this.findOne(id);

    if (
      rec.status !== ReconciliationStatus.DRAFT &&
      rec.status !== ReconciliationStatus.IN_PROGRESS
    ) {
      throw new BadRequestException(
        'Reconciliation cannot be completed in current status',
      );
    }

    const difference = Math.abs(
      dto.adjustedBalanceBook - dto.adjustedBalanceBank,
    );
    if (difference > 0.01) {
      throw new BadRequestException(
        `Adjusted balances do not match. Book: ${dto.adjustedBalanceBook}, Bank: ${dto.adjustedBalanceBank}, Difference: ${difference}`,
      );
    }

    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.bankTxnService.reconcileTransactions({
        transactionIds: dto.reconciledTransactionIds,
        reconciliationId: id,
      });

      const bankAccount = await bankRepo.findOne({
        where: { id: rec.bankAccountId },
      });
      if (bankAccount) {
        bankAccount.lastReconciledDate = rec.statementEndDate;
        bankAccount.lastReconciledBalance = dto.adjustedBalanceBank as any;
        await queryRunner.manager.save(BankAccount, bankAccount);
      }

      rec.adjustedBalanceBook = dto.adjustedBalanceBook;
      rec.adjustedBalanceBank = dto.adjustedBalanceBank;
      rec.difference = difference;
      rec.isReconciled = true as any;
      rec.status = ReconciliationStatus.COMPLETED;
      rec.reconciledBy = userId;
      rec.reconciledAt = new Date();
      if (dto.notes) rec.notes = dto.notes;

      const saved = await queryRunner.manager.save(BankReconciliation, rec);
      await queryRunner.commitTransaction();
      return saved;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async cancel(id: string): Promise<BankReconciliation> {
    const repo = await this.getRecRepo();
    const rec = await this.findOne(id);
    if (rec.status === ReconciliationStatus.COMPLETED)
      throw new BadRequestException('Cannot cancel a completed reconciliation');
    rec.status = ReconciliationStatus.CANCELLED;
    return repo.save(rec);
  }

  async getReconciliationSummary(id: string) {
    const rec = await this.findOne(id);
    const unreconciledTxns =
      await this.bankTxnService.getUnreconciledTransactions(rec.bankAccountId);
    return {
      reconciliation: rec,
      unreconciledTransactions: unreconciledTxns,
      summary: {
        unreconciledCount: unreconciledTxns.length,
        unreconciledTotal: unreconciledTxns.reduce(
          (sum, t) => sum + Number(t.amount),
          0,
        ),
      },
    };
  }

  private async generateReconciliationNumber(): Promise<string> {
    const repo = await this.getRecRepo();
    const year = new Date().getFullYear();
    const prefix = `REC-${year}-`;
    const last = await repo
      .createQueryBuilder('br')
      .where('br.reconciliationNumber LIKE :prefix', { prefix: `${prefix}%` })
      .orderBy('br.reconciliationNumber', 'DESC')
      .getOne();
    if (last) {
      const lastNum = Number.parseInt(
        last.reconciliationNumber.replace(prefix, ''),
        10,
      );
      return `${prefix}${String(lastNum + 1).padStart(6, '0')}`;
    }
    return `${prefix}000001`;
  }
}
