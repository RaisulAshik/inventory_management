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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentReminder = exports.ReminderStatus = exports.ReminderType = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const customer_due_entity_1 = require("./customer-due.entity");
const customer_entity_1 = require("../eCommerce/customer.entity");
const user_entity_1 = require("../user/user.entity");
var ReminderType;
(function (ReminderType) {
    ReminderType["EMAIL"] = "EMAIL";
    ReminderType["SMS"] = "SMS";
    ReminderType["PHONE_CALL"] = "PHONE_CALL";
    ReminderType["LETTER"] = "LETTER";
    ReminderType["WHATSAPP"] = "WHATSAPP";
    ReminderType["IN_PERSON"] = "IN_PERSON";
})(ReminderType || (exports.ReminderType = ReminderType = {}));
var ReminderStatus;
(function (ReminderStatus) {
    ReminderStatus["SCHEDULED"] = "SCHEDULED";
    ReminderStatus["SENT"] = "SENT";
    ReminderStatus["DELIVERED"] = "DELIVERED";
    ReminderStatus["FAILED"] = "FAILED";
    ReminderStatus["CANCELLED"] = "CANCELLED";
})(ReminderStatus || (exports.ReminderStatus = ReminderStatus = {}));
let PaymentReminder = class PaymentReminder {
    id;
    customerId;
    customerDueId;
    reminderType;
    status;
    reminderDate;
    scheduledTime;
    sentAt;
    subject;
    message;
    recipientEmail;
    recipientPhone;
    overdueAmount;
    overdueDays;
    reminderLevel;
    responseReceived;
    responseDate;
    responseNotes;
    promiseToPayDate;
    promisedAmount;
    followUpRequired;
    followUpDate;
    notes;
    sentBy;
    createdBy;
    createdAt;
    customer;
    customerDue;
    sentByUser;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, customerId: { required: true, type: () => String }, customerDueId: { required: true, type: () => String }, reminderType: { required: true, enum: require("./payment-reminder.entity").ReminderType }, status: { required: true, enum: require("./payment-reminder.entity").ReminderStatus }, reminderDate: { required: true, type: () => Date }, scheduledTime: { required: true, type: () => String }, sentAt: { required: true, type: () => Date }, subject: { required: true, type: () => String }, message: { required: true, type: () => String }, recipientEmail: { required: true, type: () => String }, recipientPhone: { required: true, type: () => String }, overdueAmount: { required: true, type: () => Number }, overdueDays: { required: true, type: () => Number }, reminderLevel: { required: true, type: () => Number }, responseReceived: { required: true, type: () => Boolean }, responseDate: { required: true, type: () => Date }, responseNotes: { required: true, type: () => String }, promiseToPayDate: { required: true, type: () => Date }, promisedAmount: { required: true, type: () => Number }, followUpRequired: { required: true, type: () => Boolean }, followUpDate: { required: true, type: () => Date }, notes: { required: true, type: () => String }, sentBy: { required: true, type: () => String }, createdBy: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, customer: { required: true, type: () => require("../eCommerce/customer.entity").Customer }, customerDue: { required: true, type: () => require("./customer-due.entity").CustomerDue }, sentByUser: { required: true, type: () => require("../user/user.entity").User } };
    }
};
exports.PaymentReminder = PaymentReminder;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PaymentReminder.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_id' }),
    __metadata("design:type", String)
], PaymentReminder.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_due_id', nullable: true }),
    __metadata("design:type", String)
], PaymentReminder.prototype, "customerDueId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'reminder_type',
        type: 'enum',
        enum: ReminderType,
    }),
    __metadata("design:type", String)
], PaymentReminder.prototype, "reminderType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ReminderStatus,
        default: ReminderStatus.SCHEDULED,
    }),
    __metadata("design:type", String)
], PaymentReminder.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reminder_date', type: 'date' }),
    __metadata("design:type", Date)
], PaymentReminder.prototype, "reminderDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'scheduled_time', type: 'time', nullable: true }),
    __metadata("design:type", String)
], PaymentReminder.prototype, "scheduledTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sent_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], PaymentReminder.prototype, "sentAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PaymentReminder.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PaymentReminder.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'recipient_email', length: 255, nullable: true }),
    __metadata("design:type", String)
], PaymentReminder.prototype, "recipientEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'recipient_phone', length: 50, nullable: true }),
    __metadata("design:type", String)
], PaymentReminder.prototype, "recipientPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'overdue_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], PaymentReminder.prototype, "overdueAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'overdue_days', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], PaymentReminder.prototype, "overdueDays", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reminder_level', type: 'int', default: 1 }),
    __metadata("design:type", Number)
], PaymentReminder.prototype, "reminderLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'response_received', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], PaymentReminder.prototype, "responseReceived", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'response_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], PaymentReminder.prototype, "responseDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'response_notes', type: 'text', nullable: true }),
    __metadata("design:type", String)
], PaymentReminder.prototype, "responseNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'promise_to_pay_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], PaymentReminder.prototype, "promiseToPayDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'promised_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], PaymentReminder.prototype, "promisedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'follow_up_required', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], PaymentReminder.prototype, "followUpRequired", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'follow_up_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], PaymentReminder.prototype, "followUpDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PaymentReminder.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sent_by', nullable: true }),
    __metadata("design:type", String)
], PaymentReminder.prototype, "sentBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", String)
], PaymentReminder.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PaymentReminder.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer),
    (0, typeorm_1.JoinColumn)({ name: 'customer_id' }),
    __metadata("design:type", customer_entity_1.Customer)
], PaymentReminder.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_due_entity_1.CustomerDue),
    (0, typeorm_1.JoinColumn)({ name: 'customer_due_id' }),
    __metadata("design:type", customer_due_entity_1.CustomerDue)
], PaymentReminder.prototype, "customerDue", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'sent_by' }),
    __metadata("design:type", user_entity_1.User)
], PaymentReminder.prototype, "sentByUser", void 0);
exports.PaymentReminder = PaymentReminder = __decorate([
    (0, typeorm_1.Entity)('payment_reminders')
], PaymentReminder);
//# sourceMappingURL=payment-reminder.entity.js.map