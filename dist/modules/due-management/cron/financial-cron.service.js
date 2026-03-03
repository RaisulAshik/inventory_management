"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var FinancialCronService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancialCronService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const enums_1 = require("../../../common/enums");
const customer_dues_service_1 = require("../customer-dues/customer-dues.service");
const supplier_dues_service_1 = require("../supplier-dues/supplier-dues.service");
const payment_reminders_service_1 = require("../payment-reminders/payment-reminders.service");
const credit_notes_service_1 = require("../credit-notes/credit-notes.service");
const payment_reminder_entity_1 = require("../../../entities/tenant/dueManagement/payment-reminder.entity");
const REMINDER_DAYS = [0, 3, 7, 14, 30, 60];
let FinancialCronService = FinancialCronService_1 = class FinancialCronService {
    customerDuesService;
    supplierDuesService;
    remindersService;
    creditNotesService;
    logger = new common_1.Logger(FinancialCronService_1.name);
    constructor(customerDuesService, supplierDuesService, remindersService, creditNotesService) {
        this.customerDuesService = customerDuesService;
        this.supplierDuesService = supplierDuesService;
        this.remindersService = remindersService;
        this.creditNotesService = creditNotesService;
    }
    async handleDailyFinancialTasks() {
        this.logger.log('═══ Daily financial cron started ═══');
        try {
            const custOverdue = await this.customerDuesService.markOverdueDues();
            this.logger.log(`Customer dues marked overdue: ${custOverdue}`);
            const suppOverdue = await this.supplierDuesService.markOverdueDues();
            this.logger.log(`Supplier dues marked overdue: ${suppOverdue}`);
            await this.processPaymentReminders();
            const expired = await this.creditNotesService.markExpired();
            if (expired > 0) {
                this.logger.log(`Credit notes expired: ${expired}`);
            }
            this.logger.log('═══ Daily financial cron completed ═══');
        }
        catch (error) {
            this.logger.error('Financial cron error:', error.message, error.stack);
        }
    }
    async processPaymentReminders() {
        const overdueDues = await this.customerDuesService.getOverdueDues();
        this.logger.log(`Found ${overdueDues.length} overdue customer dues`);
        let sent = 0;
        for (const due of overdueDues) {
            try {
                const shouldSend = this.shouldSendReminder(due);
                if (!shouldSend)
                    continue;
                const level = (due.reminderCount || 0) + 1;
                let reminderType = payment_reminder_entity_1.ReminderType.EMAIL;
                if (level >= 3)
                    reminderType = payment_reminder_entity_1.ReminderType.PHONE_CALL;
                if (level >= 5)
                    reminderType = payment_reminder_entity_1.ReminderType.WHATSAPP;
                await this.remindersService.createAutomated(due, level, reminderType);
                const repo = await this.customerDuesService['getRepo']();
                due.reminderCount = level;
                due.lastReminderDate = new Date();
                await repo.save(due);
                sent++;
            }
            catch (err) {
                this.logger.error(`Reminder error for due ${due.id}: ${err.message}`);
            }
        }
        this.logger.log(`Payment reminders sent: ${sent}/${overdueDues.length}`);
    }
    shouldSendReminder(due) {
        if ([enums_1.DueStatus.PAID, enums_1.DueStatus.WRITTEN_OFF].includes(due.status))
            return false;
        const today = new Date();
        const dueDate = new Date(due.dueDate);
        const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysOverdue < 0)
            return false;
        const currentCount = due.reminderCount || 0;
        let expectedCount = 0;
        for (const day of REMINDER_DAYS) {
            if (daysOverdue >= day)
                expectedCount++;
        }
        if (daysOverdue > REMINDER_DAYS[REMINDER_DAYS.length - 1]) {
            const extraMonths = Math.floor((daysOverdue - REMINDER_DAYS[REMINDER_DAYS.length - 1]) / 30);
            expectedCount += extraMonths;
        }
        return currentCount < expectedCount;
    }
};
exports.FinancialCronService = FinancialCronService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_9AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FinancialCronService.prototype, "handleDailyFinancialTasks", null);
exports.FinancialCronService = FinancialCronService = FinancialCronService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [customer_dues_service_1.CustomerDuesService,
        supplier_dues_service_1.SupplierDuesService,
        payment_reminders_service_1.PaymentRemindersService,
        credit_notes_service_1.CreditNotesService])
], FinancialCronService);
//# sourceMappingURL=financial-cron.service.js.map