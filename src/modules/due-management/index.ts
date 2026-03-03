// src/modules/financial/index.ts
// ============================================================================
// Barrel exports for the Financial Module
// ============================================================================

// ── Root Module ──
export { FinancialModule } from './financial.module';

// ── Customer Dues ──
export { CustomerDuesModule } from './customer-dues/customer-dues.module';
export { CustomerDuesService } from './customer-dues/customer-dues.service';
export { CustomerDuesController } from './customer-dues/customer-dues.controller';

// ── Collections ──
export { CollectionsModule } from './collections/collections.module';
export { CollectionsService } from './collections/collections.service';
export { CollectionsController } from './collections/collections.controller';

// ── Credit Notes ──
export { CreditNotesModule } from './credit-notes/credit-notes.module';
export { CreditNotesService } from './credit-notes/credit-notes.service';
export { CreditNotesController } from './credit-notes/credit-notes.controller';

// ── Payment Reminders ──
export { PaymentRemindersModule } from './payment-reminders/payment-reminders.module';
export { PaymentRemindersService } from './payment-reminders/payment-reminders.service';
export { PaymentRemindersController } from './payment-reminders/payment-reminders.controller';

// ── Supplier Dues ──
export { SupplierDuesModule } from './supplier-dues/supplier-dues.module';
export { SupplierDuesService } from './supplier-dues/supplier-dues.service';
export { SupplierDuesController } from './supplier-dues/supplier-dues.controller';

// ── Supplier Payments ──
export { SupplierPaymentsModule } from './supplier-payments/supplier-payments.module';
export { SupplierPaymentsService } from './supplier-payments/supplier-payments.service';
export { SupplierPaymentsController } from './supplier-payments/supplier-payments.controller';

// ── Debit Notes ──
export { DebitNotesModule } from './debit-notes/debit-notes.module';
export { DebitNotesService } from './debit-notes/debit-notes.service';
export { DebitNotesController } from './debit-notes/debit-notes.controller';

// ── Cron ──
export { FinancialCronModule } from './cron/financial-cron.module';
export { FinancialCronService } from './cron/financial-cron.service';
