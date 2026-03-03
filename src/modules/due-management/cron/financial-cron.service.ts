// src/modules/cron/financial-cron.service.ts
// ============================================================================
// Daily cron that handles:
//   1. Mark overdue customer dues
//   2. Mark overdue supplier dues
//   3. Send automated payment reminders
//   4. Expire credit notes past valid_until
// ============================================================================

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DueStatus } from '@/common/enums';
import { CustomerDuesService } from '../customer-dues/customer-dues.service';
import { SupplierDuesService } from '../supplier-dues/supplier-dues.service';
import { PaymentRemindersService } from '../payment-reminders/payment-reminders.service';
import { CreditNotesService } from '../credit-notes/credit-notes.service';
import { ReminderType } from '@/entities/tenant/dueManagement/payment-reminder.entity';

// Reminder schedule: send at these day-offsets past due date
const REMINDER_DAYS = [0, 3, 7, 14, 30, 60];

@Injectable()
export class FinancialCronService {
  private readonly logger = new Logger(FinancialCronService.name);

  constructor(
    private readonly customerDuesService: CustomerDuesService,
    private readonly supplierDuesService: SupplierDuesService,
    private readonly remindersService: PaymentRemindersService,
    private readonly creditNotesService: CreditNotesService,
  ) {}

  // ══════════════════════════════════════════════════════════════
  //  DAILY @ 9:00 AM — Main financial cron
  // ══════════════════════════════════════════════════════════════
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async handleDailyFinancialTasks(): Promise<void> {
    this.logger.log('═══ Daily financial cron started ═══');

    try {
      // 1. Mark overdue customer dues
      const custOverdue = await this.customerDuesService.markOverdueDues();
      this.logger.log(`Customer dues marked overdue: ${custOverdue}`);

      // 2. Mark overdue supplier dues
      const suppOverdue = await this.supplierDuesService.markOverdueDues();
      this.logger.log(`Supplier dues marked overdue: ${suppOverdue}`);

      // 3. Send payment reminders
      await this.processPaymentReminders();

      // 4. Expire credit notes
      const expired = await this.creditNotesService.markExpired();
      if (expired > 0) {
        this.logger.log(`Credit notes expired: ${expired}`);
      }

      this.logger.log('═══ Daily financial cron completed ═══');
    } catch (error: any) {
      this.logger.error('Financial cron error:', error.message, error.stack);
    }
  }

  // ══════════════════════════════════════════════════════════════
  //  Process payment reminders for overdue customer dues
  // ══════════════════════════════════════════════════════════════
  private async processPaymentReminders(): Promise<void> {
    const overdueDues = await this.customerDuesService.getOverdueDues();
    this.logger.log(`Found ${overdueDues.length} overdue customer dues`);

    let sent = 0;

    for (const due of overdueDues) {
      try {
        const shouldSend = this.shouldSendReminder(due);
        if (!shouldSend) continue;

        const level = (due.reminderCount || 0) + 1;

        // Escalate channel based on level
        let reminderType = ReminderType.EMAIL;
        if (level >= 3) reminderType = ReminderType.PHONE_CALL;
        if (level >= 5) reminderType = ReminderType.WHATSAPP;

        // Create the reminder record (also logs the send)
        await this.remindersService.createAutomated(due, level, reminderType);

        // Update due reminder tracking
        const repo = await this.customerDuesService['getRepo']();
        due.reminderCount = level;
        due.lastReminderDate = new Date();
        await repo.save(due);

        sent++;

        // TODO: Actually dispatch the notification via your email/SMS/notification service
        // await this.notificationService.send({ ... });
      } catch (err: any) {
        this.logger.error(`Reminder error for due ${due.id}: ${err.message}`);
      }
    }

    this.logger.log(`Payment reminders sent: ${sent}/${overdueDues.length}`);
  }

  // ══════════════════════════════════════════════════════════════
  //  Should we send a reminder for this due right now?
  // ══════════════════════════════════════════════════════════════
  private shouldSendReminder(due: any): boolean {
    if ([DueStatus.PAID, DueStatus.WRITTEN_OFF].includes(due.status))
      return false;

    const today = new Date();
    const dueDate = new Date(due.dueDate);
    const daysOverdue = Math.floor(
      (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysOverdue < 0) return false; // not yet due

    const currentCount = due.reminderCount || 0;

    // Find expected reminder count based on days overdue
    let expectedCount = 0;
    for (const day of REMINDER_DAYS) {
      if (daysOverdue >= day) expectedCount++;
    }

    // After the schedule ends, add one reminder per 30 days
    if (daysOverdue > REMINDER_DAYS[REMINDER_DAYS.length - 1]) {
      const extraMonths = Math.floor(
        (daysOverdue - REMINDER_DAYS[REMINDER_DAYS.length - 1]) / 30,
      );
      expectedCount += extraMonths;
    }

    return currentCount < expectedCount;
  }
}
