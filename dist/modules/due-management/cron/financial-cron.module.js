"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancialCronModule = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const financial_cron_service_1 = require("./financial-cron.service");
const customer_dues_module_1 = require("../customer-dues/customer-dues.module");
const supplier_dues_module_1 = require("../supplier-dues/supplier-dues.module");
const payment_reminders_module_1 = require("../payment-reminders/payment-reminders.module");
const credit_notes_module_1 = require("../credit-notes/credit-notes.module");
let FinancialCronModule = class FinancialCronModule {
};
exports.FinancialCronModule = FinancialCronModule;
exports.FinancialCronModule = FinancialCronModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            customer_dues_module_1.CustomerDuesModule,
            supplier_dues_module_1.SupplierDuesModule,
            payment_reminders_module_1.PaymentRemindersModule,
            credit_notes_module_1.CreditNotesModule,
        ],
        providers: [financial_cron_service_1.FinancialCronService],
    })
], FinancialCronModule);
//# sourceMappingURL=financial-cron.module.js.map