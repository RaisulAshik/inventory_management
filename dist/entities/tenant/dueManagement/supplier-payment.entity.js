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
exports.SupplierPayment = exports.SupplierPaymentStatus = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const bank_account_entity_1 = require("../accounting/bank-account.entity");
const payment_method_entity_1 = require("../eCommerce/payment-method.entity");
const supplier_entity_1 = require("../inventory/supplier.entity");
const user_entity_1 = require("../user/user.entity");
var SupplierPaymentStatus;
(function (SupplierPaymentStatus) {
    SupplierPaymentStatus["DRAFT"] = "DRAFT";
    SupplierPaymentStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    SupplierPaymentStatus["APPROVED"] = "APPROVED";
    SupplierPaymentStatus["PROCESSING"] = "PROCESSING";
    SupplierPaymentStatus["COMPLETED"] = "COMPLETED";
    SupplierPaymentStatus["CANCELLED"] = "CANCELLED";
    SupplierPaymentStatus["FAILED"] = "FAILED";
})(SupplierPaymentStatus || (exports.SupplierPaymentStatus = SupplierPaymentStatus = {}));
let SupplierPayment = class SupplierPayment {
    id;
    paymentNumber;
    paymentDate;
    supplierId;
    paymentMethodId;
    bankAccountId;
    amount;
    currency;
    exchangeRate;
    status;
    referenceNumber;
    chequeNumber;
    chequeDate;
    bankReference;
    transactionId;
    allocatedAmount;
    unallocatedAmount;
    tdsAmount;
    tdsPercentage;
    journalEntryId;
    notes;
    approvedBy;
    approvedAt;
    createdBy;
    createdAt;
    updatedAt;
    supplier;
    paymentMethod;
    bankAccount;
    approvedByUser;
    get netPaymentAmount() {
        return this.amount - this.tdsAmount;
    }
    get isFullyAllocated() {
        return Math.abs(this.amount - this.allocatedAmount) < 0.01;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, paymentNumber: { required: true, type: () => String }, paymentDate: { required: true, type: () => Date }, supplierId: { required: true, type: () => String }, paymentMethodId: { required: true, type: () => String }, bankAccountId: { required: true, type: () => String }, amount: { required: true, type: () => Number }, currency: { required: true, type: () => String }, exchangeRate: { required: true, type: () => Number }, status: { required: true, enum: require("./supplier-payment.entity").SupplierPaymentStatus }, referenceNumber: { required: true, type: () => String }, chequeNumber: { required: true, type: () => String }, chequeDate: { required: true, type: () => Date }, bankReference: { required: true, type: () => String }, transactionId: { required: true, type: () => String }, allocatedAmount: { required: true, type: () => Number }, unallocatedAmount: { required: true, type: () => Number }, tdsAmount: { required: true, type: () => Number }, tdsPercentage: { required: true, type: () => Number }, journalEntryId: { required: true, type: () => String }, notes: { required: true, type: () => String }, approvedBy: { required: true, type: () => String }, approvedAt: { required: true, type: () => Date }, createdBy: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, supplier: { required: true, type: () => require("../inventory/supplier.entity").Supplier }, paymentMethod: { required: true, type: () => require("../eCommerce/payment-method.entity").PaymentMethod }, bankAccount: { required: true, type: () => require("../accounting/bank-account.entity").BankAccount }, approvedByUser: { required: true, type: () => require("../user/user.entity").User } };
    }
};
exports.SupplierPayment = SupplierPayment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SupplierPayment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_number', length: 50, unique: true }),
    __metadata("design:type", String)
], SupplierPayment.prototype, "paymentNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_date', type: 'date' }),
    __metadata("design:type", Date)
], SupplierPayment.prototype, "paymentDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supplier_id' }),
    __metadata("design:type", String)
], SupplierPayment.prototype, "supplierId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_method_id' }),
    __metadata("design:type", String)
], SupplierPayment.prototype, "paymentMethodId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bank_account_id', nullable: true }),
    __metadata("design:type", String)
], SupplierPayment.prototype, "bankAccountId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], SupplierPayment.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 3, default: 'INR' }),
    __metadata("design:type", String)
], SupplierPayment.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'exchange_rate',
        type: 'decimal',
        precision: 12,
        scale: 6,
        default: 1,
    }),
    __metadata("design:type", Number)
], SupplierPayment.prototype, "exchangeRate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SupplierPaymentStatus,
        default: SupplierPaymentStatus.DRAFT,
    }),
    __metadata("design:type", String)
], SupplierPayment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_number', length: 100, nullable: true }),
    __metadata("design:type", String)
], SupplierPayment.prototype, "referenceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cheque_number', length: 50, nullable: true }),
    __metadata("design:type", String)
], SupplierPayment.prototype, "chequeNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cheque_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], SupplierPayment.prototype, "chequeDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bank_reference', length: 100, nullable: true }),
    __metadata("design:type", String)
], SupplierPayment.prototype, "bankReference", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transaction_id', length: 255, nullable: true }),
    __metadata("design:type", String)
], SupplierPayment.prototype, "transactionId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'allocated_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], SupplierPayment.prototype, "allocatedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'unallocated_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], SupplierPayment.prototype, "unallocatedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'tds_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], SupplierPayment.prototype, "tdsAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'tds_percentage',
        type: 'decimal',
        precision: 5,
        scale: 2,
        nullable: true,
    }),
    __metadata("design:type", Number)
], SupplierPayment.prototype, "tdsPercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'journal_entry_id', nullable: true }),
    __metadata("design:type", String)
], SupplierPayment.prototype, "journalEntryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SupplierPayment.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_by', nullable: true }),
    __metadata("design:type", String)
], SupplierPayment.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], SupplierPayment.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", String)
], SupplierPayment.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SupplierPayment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], SupplierPayment.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => supplier_entity_1.Supplier),
    (0, typeorm_1.JoinColumn)({ name: 'supplier_id' }),
    __metadata("design:type", supplier_entity_1.Supplier)
], SupplierPayment.prototype, "supplier", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => payment_method_entity_1.PaymentMethod),
    (0, typeorm_1.JoinColumn)({ name: 'payment_method_id' }),
    __metadata("design:type", payment_method_entity_1.PaymentMethod)
], SupplierPayment.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => bank_account_entity_1.BankAccount),
    (0, typeorm_1.JoinColumn)({ name: 'bank_account_id' }),
    __metadata("design:type", bank_account_entity_1.BankAccount)
], SupplierPayment.prototype, "bankAccount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'approved_by' }),
    __metadata("design:type", user_entity_1.User)
], SupplierPayment.prototype, "approvedByUser", void 0);
exports.SupplierPayment = SupplierPayment = __decorate([
    (0, typeorm_1.Entity)('supplier_payments')
], SupplierPayment);
//# sourceMappingURL=supplier-payment.entity.js.map