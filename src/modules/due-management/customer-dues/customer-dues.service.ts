// src/modules/sales/customer-dues/customer-dues.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { PaginatedResult } from '@common/interfaces';
import { paginate } from '@common/utils/pagination.util';
import { DueStatus } from '@common/enums';
import { CustomerDue, CustomerDueReferenceType } from '@entities/tenant';
import { DueFilterDto } from './dto/due-filter.dto';
import {
  CreateOpeningBalanceDto,
  AdjustDueDto,
  WriteOffDueDto,
} from './dto/create-opening-balance.dto';

@Injectable()
export class CustomerDuesService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  private async getRepo(): Promise<Repository<CustomerDue>> {
    return this.tenantConnectionManager.getRepository(CustomerDue);
  }

  private async getDataSource(): Promise<DataSource> {
    return this.tenantConnectionManager.getDataSource();
  }

  // ─────────────────────── LIST ───────────────────────
  async findAll(
    filterDto: DueFilterDto,
  ): Promise<PaginatedResult<CustomerDue>> {
    const repo = await this.getRepo();
    const qb = repo
      .createQueryBuilder('due')
      .leftJoinAndSelect('due.customer', 'customer');

    if (filterDto.status) {
      qb.andWhere('due.status = :status', { status: filterDto.status });
    }
    if (filterDto.customerId) {
      qb.andWhere('due.customerId = :customerId', {
        customerId: filterDto.customerId,
      });
    }
    if (filterDto.overdueOnly) {
      qb.andWhere('due.status NOT IN (:...settled)', {
        settled: [DueStatus.PAID, DueStatus.WRITTEN_OFF],
      });
      qb.andWhere('due.dueDate < :today', {
        today: new Date().toISOString().split('T')[0],
      });
    }
    if (filterDto.fromDate) {
      qb.andWhere('due.dueDate >= :fromDate', { fromDate: filterDto.fromDate });
    }
    if (filterDto.toDate) {
      qb.andWhere('due.dueDate <= :toDate', { toDate: filterDto.toDate });
    }
    if (filterDto.referenceNumber) {
      qb.andWhere('due.referenceNumber LIKE :referenceNumber', {
        referenceNumber: `%${filterDto.referenceNumber}%`,
      });
    }
    if (filterDto.customer) {
      const cn = `%${filterDto.customer}%`;
      qb.andWhere(
        '(customer.firstName LIKE :cn OR customer.lastName LIKE :cn OR customer.companyName LIKE :cn)',
        { cn },
      );
    }
    if (filterDto.customerCode) {
      qb.andWhere('customer.customerCode LIKE :customerCode', {
        customerCode: `%${filterDto.customerCode}%`,
      });
    }
    if (filterDto.search) {
      qb.andWhere(
        '(due.referenceNumber LIKE :search OR customer.firstName LIKE :search OR customer.lastName LIKE :search OR customer.companyName LIKE :search)',
        { search: `%${filterDto.search}%` },
      );
    }

    if (!filterDto.sortBy) {
      filterDto.sortBy = 'dueDate';
      filterDto.sortOrder = 'ASC';
    }

    return paginate(qb, filterDto);
  }

  // ─────────────────────── FIND BY ID ───────────────────────
  async findById(id: string): Promise<CustomerDue> {
    const repo = await this.getRepo();
    const due = await repo.findOne({
      where: { id },
      relations: ['customer'],
    });
    if (!due) throw new NotFoundException(`Customer due ${id} not found`);
    return due;
  }

  // ─────────────────────── FIND BY CUSTOMER ───────────────────────
  async findByCustomer(customerId: string): Promise<{
    dues: CustomerDue[];
    summary: any;
  }> {
    const repo = await this.getRepo();
    const dues = await repo.find({
      where: { customerId },
      relations: ['customer'],
      order: { dueDate: 'ASC' },
    });

    const today = new Date();
    let totalDues = 0,
      totalPaid = 0,
      totalOutstanding = 0;
    let overdueCount = 0,
      overdueAmount = 0;

    for (const due of dues) {
      totalDues += Number(due.originalAmount);
      totalPaid += Number(due.paidAmount);
      const balance = due.balanceAmount;
      if (![DueStatus.PAID, DueStatus.WRITTEN_OFF].includes(due.status)) {
        totalOutstanding += balance;
        if (new Date(due.dueDate) < today && balance > 0) {
          overdueCount++;
          overdueAmount += balance;
        }
      }
    }

    return {
      dues,
      summary: {
        customerId,
        totalDues,
        totalPaid,
        totalOutstanding,
        overdueCount,
        overdueAmount,
      },
    };
  }

  // ─────────────────────── CREATE FROM ORDER (called by OrdersService.deliver) ───────────────────────
  async createFromOrder(
    customerId: string,
    salesOrderId: string,
    referenceNumber: string,
    amount: number,
    dueDate: Date,
    currency: string = 'BDT',
    manager?: EntityManager,
  ): Promise<CustomerDue> {
    const repo = manager
      ? manager.getRepository(CustomerDue)
      : await this.getRepo();
    const due = repo.create({
      id: uuidv4(),
      customerId,
      referenceType: CustomerDueReferenceType.SALES_ORDER,
      salesOrderId,
      referenceNumber,
      dueDate,
      originalAmount: amount,
      paidAmount: 0,
      adjustedAmount: 0,
      writtenOffAmount: 0,
      currency,
      status: DueStatus.PENDING,
      reminderCount: 0,
    });
    return repo.save(due);
  }

  // ─────────────────────── CREATE OPENING BALANCE ──────────────────────────
  async createOpeningBalance(
    dto: CreateOpeningBalanceDto,
    userId: string,
  ): Promise<CustomerDue> {
    const repo = await this.getRepo();
    const due = repo.create({
      id: uuidv4(),
      customerId: dto.customerId,
      referenceType: CustomerDueReferenceType.OPENING_BALANCE,
      referenceNumber: dto.referenceNumber || `OB-${Date.now()}`,
      dueDate: dto.dueDate,
      originalAmount: dto.originalAmount,
      paidAmount: 0,
      adjustedAmount: 0,
      writtenOffAmount: 0,
      currency: dto.currency || 'BDT',
      status: DueStatus.PENDING,
      notes: dto.notes,
      reminderCount: 0,
    });
    return repo.save(due);
  }

  // ─────────────────────── ADJUST DUE ───────────────────────
  async adjustDue(
    id: string,
    dto: AdjustDueDto,
    userId: string,
  ): Promise<CustomerDue> {
    const repo = await this.getRepo();
    const due = await this.findById(id);

    if ([DueStatus.PAID, DueStatus.WRITTEN_OFF].includes(due.status)) {
      throw new BadRequestException('Cannot adjust a settled due');
    }

    const balance = due.balanceAmount;
    if (dto.adjustmentAmount > balance) {
      throw new BadRequestException(
        `Adjustment (${dto.adjustmentAmount}) exceeds balance (${balance})`,
      );
    }

    due.adjustedAmount = Number(due.adjustedAmount) + dto.adjustmentAmount;

    const note = `[${new Date().toISOString().split('T')[0]}] Adjusted ${dto.adjustmentAmount}${dto.reason ? ': ' + dto.reason : ''}`;
    due.notes = due.notes ? `${due.notes}\n${note}` : note;

    if (due.balanceAmount <= 0.01) {
      due.status = DueStatus.PAID;
    }

    return repo.save(due);
  }

  // ─────────────────────── WRITE OFF ───────────────────────
  async writeOff(
    id: string,
    dto: WriteOffDueDto,
    userId: string,
  ): Promise<CustomerDue> {
    const repo = await this.getRepo();
    const due = await this.findById(id);

    if ([DueStatus.PAID, DueStatus.WRITTEN_OFF].includes(due.status)) {
      throw new BadRequestException('Cannot write off a settled due');
    }

    const balance = due.balanceAmount;
    if (dto.amount > balance) {
      throw new BadRequestException(
        `Write-off (${dto.amount}) exceeds balance (${balance})`,
      );
    }

    due.writtenOffAmount = Number(due.writtenOffAmount) + dto.amount;

    const note = `[${new Date().toISOString().split('T')[0]}] Written off ${dto.amount}: ${dto.reason}`;
    due.notes = due.notes ? `${due.notes}\n${note}` : note;

    if (due.balanceAmount <= 0.01) {
      due.status = DueStatus.WRITTEN_OFF;
    }

    // TODO: Create Journal Entry → Dr: Bad Debt Expense, Cr: Accounts Receivable

    return repo.save(due);
  }

  // ─────────────────────── MARK OVERDUE (cron) ───────────────────────
  async markOverdueDues(): Promise<number> {
    const ds = await this.getDataSource();
    const result = await ds
      .createQueryBuilder()
      .update('customer_dues')
      .set({ status: DueStatus.OVERDUE })
      .where('status IN (:...statuses)', {
        statuses: [DueStatus.PENDING, DueStatus.PARTIALLY_PAID],
      })
      .andWhere('due_date < :today', {
        today: new Date().toISOString().split('T')[0],
      })
      .execute();
    return result.affected ?? 0;
  }

  // ─────────────────────── UPDATE PAID AMOUNT (called by CollectionsService) ───────────────────────
  async addPayment(
    dueId: string,
    amount: number,
    manager?: any,
  ): Promise<CustomerDue> {
    const repo = manager
      ? manager.getRepository(CustomerDue)
      : await this.getRepo();

    const due = await repo.findOne({ where: { id: dueId } });
    if (!due) throw new NotFoundException(`Due ${dueId} not found`);

    due.paidAmount = Number(due.paidAmount) + amount;

    if (due.balanceAmount <= 0.01) {
      due.status = DueStatus.PAID;
    } else if (Number(due.paidAmount) > 0) {
      due.status = DueStatus.PARTIALLY_PAID;
    }

    return repo.save(due);
  }

  // ─────────────────────── REVERSE PAYMENT (called on cheque bounce) ───────────────────────
  async reversePayment(
    dueId: string,
    amount: number,
    manager?: any,
  ): Promise<CustomerDue> {
    const repo = manager
      ? manager.getRepository(CustomerDue)
      : await this.getRepo();

    const due = await repo.findOne({ where: { id: dueId } });
    if (!due) throw new NotFoundException(`Due ${dueId} not found`);

    due.paidAmount = Math.max(0, Number(due.paidAmount) - amount);

    // Re-determine status
    if (due.balanceAmount <= 0.01) {
      due.status = DueStatus.PAID;
    } else if (new Date(due.dueDate) < new Date()) {
      due.status = DueStatus.OVERDUE;
    } else if (Number(due.paidAmount) > 0) {
      due.status = DueStatus.PARTIALLY_PAID;
    } else {
      due.status = DueStatus.PENDING;
    }

    return repo.save(due);
  }

  // ─────────────────────── APPLY CREDIT NOTE (called by CreditNotesService) ───────────────────────
  async applyCreditNote(
    dueId: string,
    amount: number,
    manager?: any,
  ): Promise<CustomerDue> {
    const repo = manager
      ? manager.getRepository(CustomerDue)
      : await this.getRepo();

    const due = await repo.findOne({ where: { id: dueId } });
    if (!due) throw new NotFoundException(`Due ${dueId} not found`);

    const balance =
      Number(due.originalAmount) -
      Number(due.paidAmount) -
      Number(due.adjustedAmount) -
      Number(due.writtenOffAmount);
    if (amount > balance + 0.01) {
      throw new BadRequestException(
        `Credit amount (${amount}) exceeds due balance (${balance})`,
      );
    }

    due.adjustedAmount = Number(due.adjustedAmount) + amount;

    if (due.balanceAmount <= 0.01) {
      due.status = DueStatus.PAID;
    }

    return repo.save(due);
  }

  // ─────────────────────── DASHBOARD ───────────────────────
  async getDashboardSummary(): Promise<any> {
    const ds = await this.getDataSource();
    const today = new Date().toISOString().split('T')[0];

    const stats = await ds.query(
      `
      SELECT
        COALESCE(SUM(CASE WHEN status NOT IN ('PAID','WRITTEN_OFF')
          THEN original_amount - paid_amount - adjusted_amount - written_off_amount ELSE 0 END), 0) as totalOutstanding,
        COALESCE(SUM(CASE WHEN status NOT IN ('PAID','WRITTEN_OFF') AND due_date < ?
          THEN original_amount - paid_amount - adjusted_amount - written_off_amount ELSE 0 END), 0) as totalOverdue,
        COUNT(CASE WHEN status NOT IN ('PAID','WRITTEN_OFF') AND due_date < ? THEN 1 END) as overdueCount,
        COUNT(CASE WHEN status NOT IN ('PAID','WRITTEN_OFF') AND due_date >= ? AND due_date <= DATE_ADD(?, INTERVAL 7 DAY) THEN 1 END) as upcomingCount,
        COALESCE(SUM(CASE WHEN status NOT IN ('PAID','WRITTEN_OFF') AND due_date >= ? AND due_date <= DATE_ADD(?, INTERVAL 7 DAY)
          THEN original_amount - paid_amount - adjusted_amount - written_off_amount ELSE 0 END), 0) as upcomingAmount
      FROM customer_dues
    `,
      [today, today, today, today, today, today],
    );

    const aging = await ds.query(
      `
      SELECT
        CASE
          WHEN DATEDIFF(?, due_date) BETWEEN 1 AND 30 THEN '1-30 days'
          WHEN DATEDIFF(?, due_date) BETWEEN 31 AND 60 THEN '31-60 days'
          WHEN DATEDIFF(?, due_date) BETWEEN 61 AND 90 THEN '61-90 days'
          WHEN DATEDIFF(?, due_date) > 90 THEN '90+ days'
          ELSE 'Current'
        END as bucket,
        COUNT(*) as count,
        COALESCE(SUM(original_amount - paid_amount - adjusted_amount - written_off_amount), 0) as amount
      FROM customer_dues
      WHERE status NOT IN ('PAID', 'WRITTEN_OFF')
      GROUP BY bucket
      ORDER BY FIELD(bucket, 'Current', '1-30 days', '31-60 days', '61-90 days', '90+ days')
    `,
      [today, today, today, today],
    );

    return {
      ...stats[0],
      totalOutstanding: Number(stats[0]?.totalOutstanding ?? 0),
      totalOverdue: Number(stats[0]?.totalOverdue ?? 0),
      overdueCount: Number(stats[0]?.overdueCount ?? 0),
      upcomingCount: Number(stats[0]?.upcomingCount ?? 0),
      upcomingAmount: Number(stats[0]?.upcomingAmount ?? 0),
      aging: aging.map((r: any) => ({
        bucket: r.bucket,
        count: Number(r.count),
        amount: Number(r.amount),
      })),
    };
  }

  // ─────────────────────── CUSTOMER STATEMENT ───────────────────────
  async getCustomerStatement(
    customerId: string,
    fromDate: string,
    toDate: string,
  ): Promise<any> {
    const ds = await this.getDataSource();

    const dues = await ds.query(
      `
      SELECT d.*, 
        d.original_amount - d.paid_amount - d.adjusted_amount - d.written_off_amount as balance_amount
      FROM customer_dues d
      WHERE d.customer_id = ? AND d.due_date BETWEEN ? AND ?
      ORDER BY d.due_date ASC
    `,
      [customerId, fromDate, toDate],
    );

    const collections = await ds.query(
      `
      SELECT c.*, pm.name as payment_method_name
      FROM customer_due_collections c
      LEFT JOIN payment_methods pm ON c.payment_method_id = pm.id
      WHERE c.customer_id = ? AND c.collection_date BETWEEN ? AND ?
      ORDER BY c.collection_date ASC
    `,
      [customerId, fromDate, toDate],
    );

    return { customerId, fromDate, toDate, dues, collections };
  }

  // ─────────────────────── OVERDUE LIST (for reminders) ───────────────────────
  async getOverdueDues(): Promise<CustomerDue[]> {
    const repo = await this.getRepo();
    return repo
      .createQueryBuilder('due')
      .leftJoinAndSelect('due.customer', 'customer')
      .where('due.status NOT IN (:...settled)', {
        settled: [DueStatus.PAID, DueStatus.WRITTEN_OFF],
      })
      .andWhere('due.dueDate < :today', {
        today: new Date().toISOString().split('T')[0],
      })
      .orderBy('due.dueDate', 'ASC')
      .getMany();
  }
}
