import {
  BankTransaction,
  BankAccount,
  BankTransactionType,
  BankTransactionStatus,
} from '@/entities/tenant';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository, In } from 'typeorm';
import {
  CreateBankTransactionDto,
  QueryBankTransactionDto,
  UpdateBankTransactionDto,
  ReconcileTransactionsDto,
} from '../dto/bank-transactions.dto';
import { TenantConnectionManager } from '@database/tenant-connection.manager';

@Injectable()
export class BankTransactionsService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  private readonly DEBIT_TYPES = [
    BankTransactionType.DEPOSIT,
    BankTransactionType.TRANSFER_IN,
    BankTransactionType.INTEREST_CREDIT,
    BankTransactionType.CHEQUE_DEPOSIT,
    BankTransactionType.LOAN_DISBURSEMENT,
  ];

  private async getTxnRepo(): Promise<Repository<BankTransaction>> {
    return this.tenantConnectionManager.getRepository(BankTransaction);
  }

  private async getBankRepo(): Promise<Repository<BankAccount>> {
    return this.tenantConnectionManager.getRepository(BankAccount);
  }

  async create(
    dto: CreateBankTransactionDto,
    userId?: string,
  ): Promise<BankTransaction> {
    const bankRepo = await this.getBankRepo();
    const txnRepo = await this.getTxnRepo();
    const dataSource = await this.tenantConnectionManager.getDataSource();

    const bankAccount = await bankRepo.findOne({
      where: { id: dto.bankAccountId },
    });
    if (!bankAccount) throw new NotFoundException('Bank account not found');

    const transactionNumber = await this.generateTransactionNumber();
    const isDebit = this.DEBIT_TYPES.includes(dto.transactionType);
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const amount = Number(dto.amount);
      bankAccount.currentBalance =
        Number(bankAccount.currentBalance) + (isDebit ? amount : -amount);

      const txn = txnRepo.create({
        ...dto,
        transactionNumber,
        status: BankTransactionStatus.PENDING,
        runningBalance: bankAccount.currentBalance,
        currency: dto.currency || bankAccount.currency,
        createdBy: userId,
      });

      await queryRunner.manager.save(BankAccount, bankAccount);
      const saved = await queryRunner.manager.save(BankTransaction, txn);
      await queryRunner.commitTransaction();
      return saved;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(query: QueryBankTransactionDto) {
    const repo = await this.getTxnRepo();
    const {
      bankAccountId,
      transactionType,
      status,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      search,
      page = 1,
      limit = 20,
    } = query;
    const qb = repo
      .createQueryBuilder('bt')
      .leftJoinAndSelect('bt.bankAccount', 'bankAccount');
    if (bankAccountId)
      qb.andWhere('bt.bankAccountId = :bankAccountId', { bankAccountId });
    if (transactionType)
      qb.andWhere('bt.transactionType = :transactionType', { transactionType });
    if (status) qb.andWhere('bt.status = :status', { status });
    if (startDate)
      qb.andWhere('bt.transactionDate >= :startDate', { startDate });
    if (endDate) qb.andWhere('bt.transactionDate <= :endDate', { endDate });
    if (minAmount) qb.andWhere('bt.amount >= :minAmount', { minAmount });
    if (maxAmount) qb.andWhere('bt.amount <= :maxAmount', { maxAmount });
    if (search)
      qb.andWhere(
        '(bt.transactionNumber LIKE :search OR bt.description LIKE :search OR bt.referenceNumber LIKE :search OR bt.payeePayerName LIKE :search)',
        { search: `%${search}%` },
      );
    qb.orderBy('bt.transactionDate', 'DESC')
      .addOrderBy('bt.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<BankTransaction> {
    const repo = await this.getTxnRepo();
    const txn = await repo.findOne({
      where: { id },
      relations: ['bankAccount', 'journalEntry'],
    });
    if (!txn) throw new NotFoundException(`Bank transaction ${id} not found`);
    return txn;
  }

  async update(
    id: string,
    dto: UpdateBankTransactionDto,
  ): Promise<BankTransaction> {
    const repo = await this.getTxnRepo();
    const txn = await this.findOne(id);
    if (txn.isReconciled)
      throw new BadRequestException('Cannot update a reconciled transaction');
    Object.assign(txn, dto);
    return repo.save(txn);
  }

  async clearTransaction(id: string): Promise<BankTransaction> {
    const repo = await this.getTxnRepo();
    const txn = await this.findOne(id);
    if (txn.status !== BankTransactionStatus.PENDING)
      throw new BadRequestException('Only pending transactions can be cleared');
    txn.status = BankTransactionStatus.CLEARED;
    return repo.save(txn);
  }

  async bounceTransaction(id: string): Promise<BankTransaction> {
    const txnRepo = await this.getTxnRepo();
    const bankRepo = await this.getBankRepo();
    const txn = await this.findOne(id);
    if (
      txn.status !== BankTransactionStatus.PENDING &&
      txn.status !== BankTransactionStatus.CLEARED
    ) {
      throw new BadRequestException('Transaction cannot be bounced');
    }
    const bankAccount = await bankRepo.findOne({
      where: { id: txn.bankAccountId },
    });
    if (bankAccount) {
      const isDebit = this.DEBIT_TYPES.includes(txn.transactionType);
      const amount = Number(txn.amount);
      bankAccount.currentBalance =
        Number(bankAccount.currentBalance) + (isDebit ? -amount : amount);
      await bankRepo.save(bankAccount);
    }
    txn.status = BankTransactionStatus.BOUNCED;
    return txnRepo.save(txn);
  }

  async reconcileTransactions(dto: ReconcileTransactionsDto): Promise<void> {
    const repo = await this.getTxnRepo();
    await repo.update(
      { id: In(dto.transactionIds) },
      {
        isReconciled: true as any,
        reconciledDate: new Date(),
        reconciliationId: dto.reconciliationId,
        status: BankTransactionStatus.RECONCILED,
      },
    );
  }

  async getUnreconciledTransactions(bankAccountId: string) {
    const repo = await this.getTxnRepo();
    return repo.find({
      where: {
        bankAccountId,
        isReconciled: false as any,
        status: In([
          BankTransactionStatus.PENDING,
          BankTransactionStatus.CLEARED,
        ]),
      },
      order: { transactionDate: 'ASC' },
    });
  }

  async remove(id: string): Promise<void> {
    const txnRepo = await this.getTxnRepo();
    const bankRepo = await this.getBankRepo();
    const txn = await this.findOne(id);
    if (txn.isReconciled)
      throw new BadRequestException('Cannot delete a reconciled transaction');
    if (txn.status !== BankTransactionStatus.PENDING)
      throw new BadRequestException('Only pending transactions can be deleted');
    const bankAccount = await bankRepo.findOne({
      where: { id: txn.bankAccountId },
    });
    if (bankAccount) {
      const isDebit = this.DEBIT_TYPES.includes(txn.transactionType);
      const amount = Number(txn.amount);
      bankAccount.currentBalance =
        Number(bankAccount.currentBalance) + (isDebit ? -amount : amount);
      await bankRepo.save(bankAccount);
    }
    await txnRepo.remove(txn);
  }

  private async generateTransactionNumber(): Promise<string> {
    const repo = await this.getTxnRepo();
    const year = new Date().getFullYear();
    const prefix = `BT-${year}-`;
    const last = await repo
      .createQueryBuilder('bt')
      .where('bt.transactionNumber LIKE :prefix', { prefix: `${prefix}%` })
      .orderBy('bt.transactionNumber', 'DESC')
      .getOne();
    if (last) {
      const lastNum = Number.parseInt(
        last.transactionNumber.replace(prefix, ''),
        10,
      );
      return `${prefix}${String(lastNum + 1).padStart(6, '0')}`;
    }
    return `${prefix}000001`;
  }
}
