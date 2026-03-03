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
exports.CustomerDue = exports.CustomerDueReferenceType = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const enums_1 = require("../../../common/enums");
const customer_entity_1 = require("../eCommerce/customer.entity");
var CustomerDueReferenceType;
(function (CustomerDueReferenceType) {
    CustomerDueReferenceType["SALES_ORDER"] = "SALES_ORDER";
    CustomerDueReferenceType["INVOICE"] = "INVOICE";
    CustomerDueReferenceType["DEBIT_NOTE"] = "DEBIT_NOTE";
    CustomerDueReferenceType["OPENING_BALANCE"] = "OPENING_BALANCE";
    CustomerDueReferenceType["OTHER"] = "OTHER";
})(CustomerDueReferenceType || (exports.CustomerDueReferenceType = CustomerDueReferenceType = {}));
let CustomerDue = class CustomerDue {
    id;
    customerId;
    referenceType;
    salesOrderId;
    referenceId;
    referenceNumber;
    dueDate;
    currency;
    originalAmount;
    paidAmount;
    adjustedAmount;
    writtenOffAmount;
    status;
    lastReminderDate;
    reminderCount;
    notes;
    createdAt;
    updatedAt;
    customer;
    get balanceAmount() {
        return (this.originalAmount -
            this.paidAmount -
            this.adjustedAmount -
            this.writtenOffAmount);
    }
    get overdueDays() {
        if (this.balanceAmount <= 0)
            return 0;
        const today = new Date();
        const due = new Date(this.dueDate);
        const diff = today.getTime() - due.getTime();
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }
    get isOverdue() {
        return this.overdueDays > 0 && this.balanceAmount > 0;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, customerId: { required: true, type: () => String }, referenceType: { required: true, enum: require("./customer-due.entity").CustomerDueReferenceType }, salesOrderId: { required: true, type: () => String }, referenceId: { required: true, type: () => String }, referenceNumber: { required: true, type: () => String }, dueDate: { required: true, type: () => Date }, currency: { required: true, type: () => String }, originalAmount: { required: true, type: () => Number }, paidAmount: { required: true, type: () => Number }, adjustedAmount: { required: true, type: () => Number }, writtenOffAmount: { required: true, type: () => Number }, status: { required: true, enum: require("../../../common/enums/index").DueStatus }, lastReminderDate: { required: true, type: () => Date }, reminderCount: { required: true, type: () => Number }, notes: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, customer: { required: true, type: () => require("../eCommerce/customer.entity").Customer } };
    }
};
exports.CustomerDue = CustomerDue;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CustomerDue.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_id' }),
    __metadata("design:type", String)
], CustomerDue.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'reference_type',
        type: 'enum',
        enum: CustomerDueReferenceType,
    }),
    __metadata("design:type", String)
], CustomerDue.prototype, "referenceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sales_order_id', nullable: true }),
    __metadata("design:type", String)
], CustomerDue.prototype, "salesOrderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_id', nullable: true }),
    __metadata("design:type", String)
], CustomerDue.prototype, "referenceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_number', length: 50, nullable: true }),
    __metadata("design:type", String)
], CustomerDue.prototype, "referenceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'due_date', type: 'date' }),
    __metadata("design:type", Date)
], CustomerDue.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 3, default: 'INR' }),
    __metadata("design:type", String)
], CustomerDue.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'original_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], CustomerDue.prototype, "originalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'paid_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], CustomerDue.prototype, "paidAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'adjusted_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], CustomerDue.prototype, "adjustedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'written_off_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], CustomerDue.prototype, "writtenOffAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.DueStatus,
        default: enums_1.DueStatus.PENDING,
    }),
    __metadata("design:type", String)
], CustomerDue.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_reminder_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], CustomerDue.prototype, "lastReminderDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reminder_count', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], CustomerDue.prototype, "reminderCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CustomerDue.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], CustomerDue.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], CustomerDue.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer),
    (0, typeorm_1.JoinColumn)({ name: 'customer_id' }),
    __metadata("design:type", customer_entity_1.Customer)
], CustomerDue.prototype, "customer", void 0);
exports.CustomerDue = CustomerDue = __decorate([
    (0, typeorm_1.Entity)('customer_dues')
], CustomerDue);
//# sourceMappingURL=customer-due.entity.js.map