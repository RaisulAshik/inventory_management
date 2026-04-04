import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { Expense, ExpenseStatus } from '@entities/tenant/accounting/expense.entity';
import { ChartOfAccounts } from '@entities/tenant/accounting/chart-of-accounts.entity';
import { AccountingIntegrationService } from '@modules/accounting/service/accounting-integration.service';
import { getNextSequence } from '@common/utils/sequence.util';
import { PaginatedResult } from '@common/interfaces';
import { paginate } from '@common/utils/pagination.util';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ExpenseFilterDto } from './dto/expense-filter.dto';

@Injectable()
export class ExpensesService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
    private readonly accountingIntegration: AccountingIntegrationService,
  ) {}

  private async getRepo() {
    return this.tenantConnectionManager.getRepository(Expense);
  }

  /**
   * Create an expense and automatically post a journal entry.
   * DR Expense Account  /  CR Paid-From Account
   */
  async create(dto: CreateExpenseDto, userId: string): Promise<Expense> {
    const ds = await this.tenantConnectionManager.getDataSource();
    const coaRepo = ds.getRepository(ChartOfAccounts);

    // Validate both accounts exist
    const [expenseAccount, paidFromAccount] = await Promise.all([
      coaRepo.findOne({ where: { id: dto.expenseAccountId } }),
      coaRepo.findOne({ where: { id: dto.paidFromAccountId } }),
    ]);

    if (!expenseAccount) {
      throw new BadRequestException(
        `Expense account ${dto.expenseAccountId} not found`,
      );
    }
    if (!paidFromAccount) {
      throw new BadRequestException(
        `Paid-from account ${dto.paidFromAccountId} not found`,
      );
    }

    const taxAmount = Number(dto.taxAmount ?? 0);
    const totalAmount = Number(dto.amount) + taxAmount;

    // Generate expense number
    const expenseNumber = await getNextSequence(ds, 'EXPENSE');

    const repo = await this.getRepo();

    // Save expense record
    const expense = repo.create({
      expenseNumber,
      expenseDate: new Date(dto.expenseDate),
      expenseAccountId: dto.expenseAccountId,
      paidFromAccountId: dto.paidFromAccountId,
      amount: dto.amount,
      taxAmount,
      totalAmount,
      description: dto.description,
      referenceNumber: dto.referenceNumber,
      notes: dto.notes,
      category: dto.category,
      status: ExpenseStatus.POSTED,
      createdBy: userId,
    });

    const saved = await repo.save(expense);

    // Auto-post journal entry (non-blocking on failure)
    const journalEntryId = await this.accountingIntegration.postExpense(saved);
    if (journalEntryId) {
      await repo.update(saved.id, { journalEntryId });
      saved.journalEntryId = journalEntryId;
    }

    return saved;
  }

  async findAll(filterDto: ExpenseFilterDto): Promise<PaginatedResult<Expense>> {
    const ds = await this.tenantConnectionManager.getDataSource();
    const repo = ds.getRepository(Expense);

    const qb = repo
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.expenseAccount', 'expenseAccount')
      .leftJoinAndSelect('expense.paidFromAccount', 'paidFromAccount');

    if (filterDto.expenseAccountId) {
      qb.andWhere('expense.expenseAccountId = :expenseAccountId', {
        expenseAccountId: filterDto.expenseAccountId,
      });
    }

    if (filterDto.paidFromAccountId) {
      qb.andWhere('expense.paidFromAccountId = :paidFromAccountId', {
        paidFromAccountId: filterDto.paidFromAccountId,
      });
    }

    if (filterDto.status) {
      qb.andWhere('expense.status = :status', { status: filterDto.status });
    }

    if (filterDto.fromDate) {
      qb.andWhere('expense.expenseDate >= :fromDate', {
        fromDate: filterDto.fromDate,
      });
    }

    if (filterDto.toDate) {
      qb.andWhere('expense.expenseDate <= :toDate', {
        toDate: filterDto.toDate,
      });
    }

    if (filterDto.keyword) {
      qb.andWhere(
        '(expense.description LIKE :kw OR expense.referenceNumber LIKE :kw OR expense.expenseNumber LIKE :kw)',
        { kw: `%${filterDto.keyword}%` },
      );
    }

    if (filterDto.description) {
      qb.andWhere('expense.description LIKE :description', {
        description: `%${filterDto.description}%`,
      });
    }

    if (filterDto.category) {
      qb.andWhere('expense.category = :category', {
        category: filterDto.category,
      });
    }

    if (!filterDto.sortBy) {
      filterDto.sortBy = 'expense.expenseDate';
      filterDto.sortOrder = 'DESC';
    }

    return paginate(qb, filterDto);
  }

  async findOne(id: string): Promise<Expense> {
    const repo = await this.getRepo();
    const expense = await repo.findOne({
      where: { id },
      relations: ['expenseAccount', 'paidFromAccount', 'journalEntry'],
    });
    if (!expense) throw new NotFoundException(`Expense ${id} not found`);
    return expense;
  }

  /**
   * Cancel an expense — marks it CANCELLED.
   * Does NOT auto-reverse the journal entry (use manual JE reversal for that).
   */
  async cancel(id: string): Promise<Expense> {
    const repo = await this.getRepo();
    const expense = await repo.findOne({ where: { id } });
    if (!expense) throw new NotFoundException(`Expense ${id} not found`);
    if (expense.status === ExpenseStatus.CANCELLED) {
      throw new BadRequestException('Expense is already cancelled');
    }
    await repo.update(id, { status: ExpenseStatus.CANCELLED });
    expense.status = ExpenseStatus.CANCELLED;
    return expense;
  }

  async getSummary(fromDate?: string, toDate?: string): Promise<any> {
    const ds = await this.tenantConnectionManager.getDataSource();

    let query = `
      SELECT
        ca.account_name AS expenseAccount,
        COUNT(e.id) AS totalEntries,
        SUM(e.total_amount) AS totalAmount
      FROM expenses e
      INNER JOIN chart_of_accounts ca ON e.expense_account_id = ca.id
      WHERE e.status = 'POSTED'
    `;
    const params: string[] = [];

    if (fromDate) {
      query += ` AND e.expense_date >= ?`;
      params.push(fromDate);
    }
    if (toDate) {
      query += ` AND e.expense_date <= ?`;
      params.push(toDate);
    }

    query += ` GROUP BY e.expense_account_id, ca.account_name ORDER BY totalAmount DESC`;

    return ds.query(query, params);
  }
}
