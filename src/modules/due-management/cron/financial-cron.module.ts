// src/modules/cron/financial-cron.module.ts

import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { FinancialCronService } from './financial-cron.service';
import { CustomerDuesModule } from '../customer-dues/customer-dues.module';
import { SupplierDuesModule } from '../supplier-dues/supplier-dues.module';
import { PaymentRemindersModule } from '../payment-reminders/payment-reminders.module';
import { CreditNotesModule } from '../credit-notes/credit-notes.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    CustomerDuesModule,
    SupplierDuesModule,
    PaymentRemindersModule,
    CreditNotesModule,
  ],
  providers: [FinancialCronService],
})
export class FinancialCronModule {}
