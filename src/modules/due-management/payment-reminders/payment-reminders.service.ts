// src/modules/sales/payment-reminders/payment-reminders.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository, DataSource, DeepPartial } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { PaginatedResult } from '@common/interfaces';
import { paginate } from '@common/utils/pagination.util';
import { DueStatus } from '@common/enums';
import { CustomerDue } from '@/entities/tenant';
import {
  PaymentReminder,
  ReminderStatus,
  ReminderType,
} from '@/entities/tenant/dueManagement/payment-reminder.entity';
import {
  ReminderFilterDto,
  CreateReminderDto,
  RecordResponseDto,
} from './dto/reminder.dto';

@Injectable()
export class PaymentRemindersService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  private async getRepo(): Promise<Repository<PaymentReminder>> {
    return this.tenantConnectionManager.getRepository(PaymentReminder);
  }

  private async getDataSource(): Promise<DataSource> {
    return this.tenantConnectionManager.getDataSource();
  }

  // ─────────────────────── LIST ───────────────────────
  async findAll(
    filterDto: ReminderFilterDto,
  ): Promise<PaginatedResult<PaymentReminder>> {
    const repo = await this.getRepo();
    const qb = repo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.customer', 'customer')
      .leftJoinAndSelect('r.customerDue', 'due');

    if (filterDto.status)
      qb.andWhere('r.status = :status', { status: filterDto.status });
    if (filterDto.reminderType)
      qb.andWhere('r.reminderType = :type', { type: filterDto.reminderType });
    if (filterDto.customerId)
      qb.andWhere('r.customerId = :cid', { cid: filterDto.customerId });
    if (filterDto.customerDueId)
      qb.andWhere('r.customerDueId = :did', { did: filterDto.customerDueId });
    if (filterDto.fromDate)
      qb.andWhere('r.reminderDate >= :from', { from: filterDto.fromDate });
    if (filterDto.toDate)
      qb.andWhere('r.reminderDate <= :to', { to: filterDto.toDate });

    if (filterDto.followUpToday) {
      const today = new Date().toISOString().split('T')[0];
      qb.andWhere('r.followUpRequired = 1');
      qb.andWhere('r.followUpDate <= :today', { today });
      qb.andWhere('r.status = :sent', { sent: ReminderStatus.SENT });
    }

    if (filterDto.brokenPromises) {
      const today = new Date().toISOString().split('T')[0];
      qb.andWhere('r.promiseToPayDate IS NOT NULL');
      qb.andWhere('r.promiseToPayDate < :today', { today });
      qb.andWhere('due.status NOT IN (:...paid)', {
        paid: [DueStatus.PAID, DueStatus.WRITTEN_OFF],
      });
    }

    if (filterDto.search) {
      qb.andWhere(
        '(customer.firstName LIKE :s OR customer.lastName LIKE :s OR customer.companyName LIKE :s OR due.referenceNumber LIKE :s)',
        { s: `%${filterDto.search}%` },
      );
    }

    if (!filterDto.sortBy) {
      filterDto.sortBy = 'reminderDate';
      filterDto.sortOrder = 'DESC';
    }
    return paginate(qb, filterDto);
  }

  // ─────────────────────── FIND BY ID ───────────────────────
  async findById(id: string): Promise<PaymentReminder> {
    const repo = await this.getRepo();
    const r = await repo.findOne({
      where: { id },
      relations: ['customer', 'customerDue'],
    });
    if (!r) throw new NotFoundException(`Reminder ${id} not found`);
    return r;
  }

  // ─────────────────────── FIND BY DUE ───────────────────────
  async findByDue(dueId: string): Promise<PaymentReminder[]> {
    const repo = await this.getRepo();
    return repo.find({
      where: { customerDueId: dueId },
      relations: ['customer'],
      order: { reminderDate: 'DESC' },
    });
  }

  // ─────────────────────── FOLLOW-UPS TODAY ───────────────────────
  async getFollowUpsToday(): Promise<PaymentReminder[]> {
    const repo = await this.getRepo();
    const today = new Date().toISOString().split('T')[0];

    return repo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.customer', 'customer')
      .leftJoinAndSelect('r.customerDue', 'due')
      .where('r.followUpRequired = 1')
      .andWhere('r.followUpDate <= :today', { today })
      .andWhere('r.status = :sent', { sent: ReminderStatus.SENT })
      .orderBy('r.followUpDate', 'ASC')
      .getMany();
  }

  // ─────────────────────── BROKEN PROMISES ───────────────────────
  async getBrokenPromises(): Promise<PaymentReminder[]> {
    const repo = await this.getRepo();
    const today = new Date().toISOString().split('T')[0];

    return repo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.customer', 'customer')
      .leftJoinAndSelect('r.customerDue', 'due')
      .where('r.promiseToPayDate IS NOT NULL')
      .andWhere('r.promiseToPayDate < :today', { today })
      .andWhere('due.status NOT IN (:...paid)', {
        paid: [DueStatus.PAID, DueStatus.WRITTEN_OFF],
      })
      .orderBy('r.promiseToPayDate', 'ASC')
      .getMany();
  }

  // ─────────────────────── CREATE MANUAL ───────────────────────
  async createManual(
    dto: CreateReminderDto,
    userId: string,
  ): Promise<PaymentReminder> {
    const repo = await this.getRepo();

    // Build overdue info if linked to a due
    let overdueAmount: number | null = null;
    let overdueDays: number | null = null;

    if (dto.customerDueId) {
      const ds = await this.getDataSource();
      const dueRepo = ds.getRepository(CustomerDue);
      const due = await dueRepo.findOne({ where: { id: dto.customerDueId } });
      if (due) {
        overdueAmount =
          Number(due.originalAmount) -
          Number(due.paidAmount) -
          Number(due.adjustedAmount) -
          Number(due.writtenOffAmount);
        const diff = new Date().getTime() - new Date(due.dueDate).getTime();
        overdueDays = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
      }
    }

    const reminder = repo.create({
      id: uuidv4(),
      customerId: dto.customerId,
      customerDueId: dto.customerDueId,
      reminderType: dto.reminderType,
      status: ReminderStatus.SCHEDULED,
      reminderDate: dto.reminderDate,
      scheduledTime: dto.scheduledTime,
      subject: dto.subject,
      message: dto.message,
      recipientEmail: dto.recipientEmail,
      recipientPhone: dto.recipientPhone,
      overdueAmount,
      overdueDays,
      reminderLevel: 1,
      notes: dto.notes,
      createdBy: userId,
    } as DeepPartial<PaymentReminder>);

    return repo.save(reminder);
  }

  // ─────────────────────── CREATE AUTOMATED (called by cron) ───────────────────────
  async createAutomated(
    due: CustomerDue,
    level: number,
    reminderType: ReminderType = ReminderType.EMAIL,
  ): Promise<PaymentReminder> {
    const repo = await this.getRepo();

    const balance =
      Number(due.originalAmount) -
      Number(due.paidAmount) -
      Number(due.adjustedAmount) -
      Number(due.writtenOffAmount);
    const diff = new Date().getTime() - new Date(due.dueDate).getTime();
    const overdueDays = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));

    const customerName = due.customer
      ? `${due.customer.firstName || ''} ${due.customer.lastName || ''}`.trim() ||
        due.customer.companyName ||
        ''
      : 'Customer';

    const subject =
      level <= 2
        ? `Payment Reminder - ${due.referenceNumber}`
        : `URGENT: Payment Overdue ${overdueDays} Days - ${due.referenceNumber}`;

    const message = this.buildReminderMessage(
      customerName,
      due.referenceNumber,
      balance,
      due.currency,
      overdueDays,
      level,
    );

    const reminder = repo.create({
      id: uuidv4(),
      customerId: due.customerId,
      customerDueId: due.id,
      reminderType,
      status: ReminderStatus.SENT,
      reminderDate: new Date().toISOString().split('T')[0],
      sentAt: new Date(),
      subject,
      message,
      recipientEmail: due.customer?.email || null,
      recipientPhone: due.customer?.phone || null,
      overdueAmount: balance,
      overdueDays,
      reminderLevel: level,
      followUpRequired: level >= 3,
      followUpDate:
        level >= 3
          ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split('T')[0]
          : null,
    } as DeepPartial<PaymentReminder>);

    return repo.save(reminder);
  }

  // ─────────────────────── MARK SENT ───────────────────────
  async markSent(id: string, userId: string): Promise<PaymentReminder> {
    const repo = await this.getRepo();
    const r = await this.findById(id);

    if (r.status !== ReminderStatus.SCHEDULED) {
      throw new BadRequestException(
        'Only scheduled reminders can be marked sent',
      );
    }

    r.status = ReminderStatus.SENT;
    r.sentAt = new Date();
    r.sentBy = userId;
    return repo.save(r);
  }

  // ─────────────────────── MARK DELIVERED ───────────────────────
  async markDelivered(id: string): Promise<PaymentReminder> {
    const repo = await this.getRepo();
    const r = await this.findById(id);
    r.status = ReminderStatus.DELIVERED;
    return repo.save(r);
  }

  // ─────────────────────── MARK FAILED ───────────────────────
  async markFailed(id: string, reason: string): Promise<PaymentReminder> {
    const repo = await this.getRepo();
    const r = await this.findById(id);
    r.status = ReminderStatus.FAILED;
    r.notes = r.notes ? `${r.notes}\nFailed: ${reason}` : `Failed: ${reason}`;
    return repo.save(r);
  }

  // ─────────────────────── RECORD RESPONSE ───────────────────────
  async recordResponse(
    id: string,
    dto: RecordResponseDto,
    userId: string,
  ): Promise<PaymentReminder> {
    const repo = await this.getRepo();
    const r = await this.findById(id);

    r.responseReceived = dto.responseReceived;
    r.responseDate = dto.responseDate ? new Date(dto.responseDate) : new Date();
    r.responseNotes = dto.responseNotes || '';

    if (dto.promiseToPayDate) {
      r.promiseToPayDate = new Date(dto.promiseToPayDate);
      if (dto.promisedAmount !== undefined) {
        r.promisedAmount = dto.promisedAmount;
      }
    }

    if (dto.followUpRequired !== undefined) {
      r.followUpRequired = dto.followUpRequired;
    }
    if (dto.followUpDate) {
      r.followUpDate = new Date(dto.followUpDate);
      r.followUpRequired = true;
    }

    return repo.save(r);
  }

  // ─────────────────────── CANCEL ───────────────────────
  async cancel(id: string, userId: string): Promise<PaymentReminder> {
    const repo = await this.getRepo();
    const r = await this.findById(id);

    if (r.status !== ReminderStatus.SCHEDULED) {
      throw new BadRequestException(
        'Only scheduled reminders can be cancelled',
      );
    }

    r.status = ReminderStatus.CANCELLED;
    return repo.save(r);
  }

  // ─────────────────────── MESSAGE BUILDER ───────────────────────
  private buildReminderMessage(
    name: string,
    refNo: string,
    balance: number,
    currency: string,
    days: number,
    level: number,
  ): string {
    if (level <= 1) {
      return `Dear ${name},\n\nThis is a friendly reminder that payment of ${currency} ${balance.toFixed(2)} for ${refNo} is now due. Please arrange payment at your earliest convenience.\n\nThank you.`;
    }
    if (level <= 3) {
      return `Dear ${name},\n\nWe notice that payment of ${currency} ${balance.toFixed(2)} for ${refNo} is overdue by ${days} days. Kindly arrange the payment immediately to avoid any inconvenience.\n\nThank you.`;
    }
    return `Dear ${name},\n\nThis is an URGENT notice regarding overdue payment of ${currency} ${balance.toFixed(2)} for ${refNo}, now ${days} days past due. Please contact us immediately to resolve this matter.\n\nThank you.`;
  }
}
