"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancialModule = void 0;
const common_1 = require("@nestjs/common");
const customer_dues_module_1 = require("./customer-dues/customer-dues.module");
const collections_module_1 = require("./collections/collections.module");
const credit_notes_module_1 = require("./credit-notes/credit-notes.module");
const payment_reminders_module_1 = require("./payment-reminders/payment-reminders.module");
const supplier_dues_module_1 = require("./supplier-dues/supplier-dues.module");
const supplier_payments_module_1 = require("./supplier-payments/supplier-payments.module");
const debit_notes_module_1 = require("./debit-notes/debit-notes.module");
const financial_cron_module_1 = require("./cron/financial-cron.module");
let FinancialModule = class FinancialModule {
};
exports.FinancialModule = FinancialModule;
exports.FinancialModule = FinancialModule = __decorate([
    (0, common_1.Module)({
        imports: [
            customer_dues_module_1.CustomerDuesModule,
            collections_module_1.CollectionsModule,
            credit_notes_module_1.CreditNotesModule,
            payment_reminders_module_1.PaymentRemindersModule,
            supplier_dues_module_1.SupplierDuesModule,
            supplier_payments_module_1.SupplierPaymentsModule,
            debit_notes_module_1.DebitNotesModule,
            financial_cron_module_1.FinancialCronModule,
        ],
        exports: [
            customer_dues_module_1.CustomerDuesModule,
            collections_module_1.CollectionsModule,
            credit_notes_module_1.CreditNotesModule,
            payment_reminders_module_1.PaymentRemindersModule,
            supplier_dues_module_1.SupplierDuesModule,
            supplier_payments_module_1.SupplierPaymentsModule,
            debit_notes_module_1.DebitNotesModule,
        ],
    })
], FinancialModule);
//# sourceMappingURL=financial.module.js.map