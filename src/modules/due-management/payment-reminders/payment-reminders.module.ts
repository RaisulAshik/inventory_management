// src/modules/sales/payment-reminders/payment-reminders.module.ts

import { Module } from '@nestjs/common';
import { PaymentRemindersController } from './payment-reminders.controller';
import { PaymentRemindersService } from './payment-reminders.service';

@Module({
  controllers: [PaymentRemindersController],
  providers: [PaymentRemindersService],
  exports: [PaymentRemindersService],
})
export class PaymentRemindersModule {}
