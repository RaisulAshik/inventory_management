// src/modules/purchase/supplier-dues/supplier-dues.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { PaginatedResult } from '@common/interfaces';
import { paginate } from '@common/utils/pagination.util';
import { DueStatus } from '@common/enums';
import { SupplierDue, SupplierDueReferenceType } from '@entities/tenant';
import {
  SupplierDueFilterDto,
  CreateSupplierOpeningBalanceDto,
  AdjustSupplierDueDto,
} from './dto/supplier-due.dto';

@Injectable()
export class SupplierDuesService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  private async getRepo(): Promise<Repository<SupplierDue>> {
    return this.tenantConnectionManager.getRepository(SupplierDue);
  }

  private async getDataSource(): Promise<DataSource> {
    return this.tenantConnectionManager.getDataSource();
  }

  // ─────────────────────── LIST ───────────────────────
  async findAll(
    filterDto: SupplierDueFilterDto,
  ): Promise<PaginatedResult<SupplierDue>> {
    const repo = await this.getRepo();
    const qb = repo
      .createQueryBuilder('due')
      .leftJoinAndSelect('due.supplier', 'supplier');

    if (filterDto.status)
      qb.andWhere('due.status = :status', { status: filterDto.status });
    if (filterDto.supplierId)
      qb.andWhere('due.supplierId = :sid', { sid: filterDto.supplierId });
    if (filterDto.overdueOnly) {
      qb.andWhere('due.status NOT IN (:...settled)', {
        settled: [DueStatus.PAID, DueStatus.WRITTEN_OFF],
      });
      qb.andWhere('due.dueDate < :today', {
        today: new Date().toISOString().split('T')[0],
      });
    }
    if (filterDto.fromDate)
      qb.andWhere('due.dueDate >= :from', { from: filterDto.fromDate });
    if (filterDto.toDate)
      qb.andWhere('due.dueDate <= :to', { to: filterDto.toDate });
    if (filterDto.search) {
      qb.andWhere(
        '(due.referenceNumber LIKE :s OR due.billNumber LIKE :s OR supplier.name LIKE :s OR supplier.companyName LIKE :s)',
        { s: `%${filterDto.search}%` },
      );
    }

    if (!filterDto.sortBy) {
      filterDto.sortBy = 'dueDate';
      filterDto.sortOrder = 'ASC';
    }
    return paginate(qb, filterDto);
  }

  // ─────────────────────── FIND BY ID ───────────────────────
  async findById(id: string): Promise<SupplierDue> {
    const repo = await this.getRepo();
    const due = await repo.findOne({ where: { id }, relations: ['supplier'] });
    if (!due) throw new NotFoundException(`Supplier due ${id} not found`);
    return due;
  }

  // ─────────────────────── FIND BY SUPPLIER ───────────────────────
  async findBySupplier(
    supplierId: string,
  ): Promise<{ dues: SupplierDue[]; summary: any }> {
    const repo = await this.getRepo();
    const dues = await repo.find({
      where: { supplierId },
      relations: ['supplier'],
      order: { dueDate: 'ASC' },
    });

    const today = new Date();
    let totalDues = 0,
      totalPaid = 0,
      totalOutstanding = 0,
      overdueCount = 0,
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
        supplierId,
        totalDues,
        totalPaid,
        totalOutstanding,
        overdueCount,
        overdueAmount,
      },
    };
  }

  // ─────────────────────── CREATE FROM GRN ───────────────────────
  async createFromGRN(
    supplierId: string,
    purchaseOrderId: string,
    referenceNumber: string,
    amount: number,
    dueDate: Date,
    billNumber?: string,
    billDate?: Date,
    currency: string = 'BDT',
  ): Promise<SupplierDue> {
    const repo = await this.getRepo();
    const due = repo.create({
      id: uuidv4(),
      supplierId,
      referenceType: SupplierDueReferenceType.PURCHASE_ORDER,
      purchaseOrderId,
      referenceNumber,
      billNumber,
      billDate,
      dueDate,
      originalAmount: amount,
      paidAmount: 0,
      adjustedAmount: 0,
      currency,
      status: DueStatus.PENDING,
    });
    return repo.save(due);
  }

  // ─────────────────────── CREATE OPENING BALANCE ───────────────────────
  async createOpeningBalance(
    dto: CreateSupplierOpeningBalanceDto,
    userId: string,
  ): Promise<SupplierDue> {
    const repo = await this.getRepo();
    const due = repo.create({
      id: uuidv4(),
      supplierId: dto.supplierId,
      referenceType: SupplierDueReferenceType.OPENING_BALANCE,
      referenceNumber: dto.referenceNumber || `SOB-${Date.now()}`,
      billNumber: dto.billNumber,
      billDate: dto.billDate,
      dueDate: dto.dueDate,
      originalAmount: dto.originalAmount,
      paidAmount: 0,
      adjustedAmount: 0,
      currency: dto.currency || 'BDT',
      status: DueStatus.PENDING,
      notes: dto.notes,
    });
    return repo.save(due);
  }

  // ─────────────────────── ADJUST DUE ───────────────────────
  async adjustDue(
    id: string,
    dto: AdjustSupplierDueDto,
    userId: string,
  ): Promise<SupplierDue> {
    const repo = await this.getRepo();
    const due = await this.findById(id);

    if ([DueStatus.PAID, DueStatus.WRITTEN_OFF].includes(due.status)) {
      throw new BadRequestException('Cannot adjust a settled due');
    }

    const balance = due.balanceAmount;
    if (dto.amount > balance + 0.01) {
      throw new BadRequestException(
        `Adjustment (${dto.amount}) exceeds balance (${balance})`,
      );
    }

    due.adjustedAmount = Number(due.adjustedAmount) + dto.amount;
    const note = `[${new Date().toISOString().split('T')[0]}] Adjusted ${dto.amount}${dto.reason ? ': ' + dto.reason : ''}`;
    due.notes = due.notes ? `${due.notes}\n${note}` : note;

    if (due.balanceAmount <= 0.01) due.status = DueStatus.PAID;

    return repo.save(due);
  }

  // ─────────────────────── ADD PAYMENT (called by SupplierPaymentsService) ───────────────────────
  async addPayment(
    dueId: string,
    amount: number,
    manager?: any,
  ): Promise<SupplierDue> {
    const repo = manager
      ? manager.getRepository(SupplierDue)
      : await this.getRepo();
    const due = await repo.findOne({ where: { id: dueId } });
    if (!due) throw new NotFoundException(`Supplier due ${dueId} not found`);

    due.paidAmount = Number(due.paidAmount) + amount;
    if (due.balanceAmount <= 0.01) {
      due.status = DueStatus.PAID;
    } else if (Number(due.paidAmount) > 0) {
      due.status = DueStatus.PARTIALLY_PAID;
    }
    return repo.save(due);
  }

  // ─────────────────────── REVERSE PAYMENT ───────────────────────
  async reversePayment(
    dueId: string,
    amount: number,
    manager?: any,
  ): Promise<SupplierDue> {
    const repo = manager
      ? manager.getRepository(SupplierDue)
      : await this.getRepo();
    const due = await repo.findOne({ where: { id: dueId } });
    if (!due) throw new NotFoundException(`Supplier due ${dueId} not found`);

    due.paidAmount = Math.max(0, Number(due.paidAmount) - amount);
    if (due.balanceAmount <= 0.01) due.status = DueStatus.PAID;
    else if (new Date(due.dueDate) < new Date()) due.status = DueStatus.OVERDUE;
    else if (Number(due.paidAmount) > 0) due.status = DueStatus.PARTIALLY_PAID;
    else due.status = DueStatus.PENDING;

    return repo.save(due);
  }

  // ─────────────────────── APPLY DEBIT NOTE ───────────────────────
  async applyDebitNote(
    dueId: string,
    amount: number,
    manager?: any,
  ): Promise<SupplierDue> {
    const repo = manager
      ? manager.getRepository(SupplierDue)
      : await this.getRepo();
    const due = await repo.findOne({ where: { id: dueId } });
    if (!due) throw new NotFoundException(`Supplier due ${dueId} not found`);

    const balance = due.balanceAmount;
    if (amount > balance + 0.01) {
      throw new BadRequestException(
        `Debit note amount (${amount}) exceeds due balance (${balance})`,
      );
    }

    due.adjustedAmount = Number(due.adjustedAmount) + amount;
    if (due.balanceAmount <= 0.01) due.status = DueStatus.PAID;
    return repo.save(due);
  }

  // ─────────────────────── MARK OVERDUE (cron) ───────────────────────
  async markOverdueDues(): Promise<number> {
    const ds = await this.getDataSource();
    const result = await ds
      .createQueryBuilder()
      .update('supplier_dues')
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

  // ─────────────────────── UPCOMING PAYMENTS ───────────────────────
  async getUpcomingPayments(days: number = 7): Promise<SupplierDue[]> {
    const repo = await this.getRepo();
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return repo
      .createQueryBuilder('due')
      .leftJoinAndSelect('due.supplier', 'supplier')
      .where('due.status NOT IN (:...settled)', {
        settled: [DueStatus.PAID, DueStatus.WRITTEN_OFF],
      })
      .andWhere('due.dueDate BETWEEN :today AND :future', {
        today: today.toISOString().split('T')[0],
        future: futureDate.toISOString().split('T')[0],
      })
      .orderBy('due.dueDate', 'ASC')
      .getMany();
  }

  // ─────────────────────── DASHBOARD ───────────────────────
  async getDashboardSummary(): Promise<any> {
    const ds = await this.getDataSource();
    const today = new Date().toISOString().split('T')[0];

    const stats = await ds.query(
      `
      SELECT
        COALESCE(SUM(CASE WHEN status NOT IN ('PAID','WRITTEN_OFF')
          THEN original_amount - paid_amount - adjusted_amount ELSE 0 END), 0) as totalOutstanding,
        COALESCE(SUM(CASE WHEN status NOT IN ('PAID','WRITTEN_OFF') AND due_date < ?
          THEN original_amount - paid_amount - adjusted_amount ELSE 0 END), 0) as totalOverdue,
        COUNT(CASE WHEN status NOT IN ('PAID','WRITTEN_OFF') AND due_date < ? THEN 1 END) as overdueCount,
        COUNT(CASE WHEN status NOT IN ('PAID','WRITTEN_OFF') AND due_date >= ? AND due_date <= DATE_ADD(?, INTERVAL 7 DAY) THEN 1 END) as upcomingCount,
        COALESCE(SUM(CASE WHEN status NOT IN ('PAID','WRITTEN_OFF') AND due_date >= ? AND due_date <= DATE_ADD(?, INTERVAL 7 DAY)
          THEN original_amount - paid_amount - adjusted_amount ELSE 0 END), 0) as upcomingAmount
      FROM supplier_dues
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
        COALESCE(SUM(original_amount - paid_amount - adjusted_amount), 0) as amount
      FROM supplier_dues
      WHERE status NOT IN ('PAID', 'WRITTEN_OFF')
      GROUP BY bucket
      ORDER BY FIELD(bucket, 'Current', '1-30 days', '31-60 days', '61-90 days', '90+ days')
    `,
      [today, today, today, today],
    );

    return {
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
}
