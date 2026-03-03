// src/modules/financial/financial.module.ts
// ============================================================================
// ROOT FINANCIAL MODULE
// Import this single module in AppModule to enable all financial features:
//   Order-to-Cash: CustomerDues → Collections → CreditNotes → Reminders
//   Procure-to-Pay: SupplierDues → SupplierPayments → DebitNotes
//   Automation:     FinancialCron (overdue marking, reminders, CN expiry)
// ============================================================================

import { Module } from '@nestjs/common';

// ── Order-to-Cash (Customer Side) ──
import { CustomerDuesModule } from './customer-dues/customer-dues.module';
import { CollectionsModule } from './collections/collections.module';
import { CreditNotesModule } from './credit-notes/credit-notes.module';
import { PaymentRemindersModule } from './payment-reminders/payment-reminders.module';

// ── Procure-to-Pay (Supplier Side) ──
import { SupplierDuesModule } from './supplier-dues/supplier-dues.module';
import { SupplierPaymentsModule } from './supplier-payments/supplier-payments.module';
import { DebitNotesModule } from './debit-notes/debit-notes.module';

// ── Automation ──
import { FinancialCronModule } from './cron/financial-cron.module';

@Module({
  imports: [
    // Customer / Receivables
    CustomerDuesModule,
    CollectionsModule,
    CreditNotesModule,
    PaymentRemindersModule,

    // Supplier / Payables
    SupplierDuesModule,
    SupplierPaymentsModule,
    DebitNotesModule,

    // Cron Jobs
    FinancialCronModule,
  ],
  exports: [
    CustomerDuesModule,
    CollectionsModule,
    CreditNotesModule,
    PaymentRemindersModule,
    SupplierDuesModule,
    SupplierPaymentsModule,
    DebitNotesModule,
  ],
})
export class FinancialModule {}
