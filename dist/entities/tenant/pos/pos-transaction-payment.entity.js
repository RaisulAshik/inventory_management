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
exports.PosTransactionPayment = exports.PosPaymentStatus = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const pos_transaction_entity_1 = require("./pos-transaction.entity");
const payment_method_entity_1 = require("../eCommerce/payment-method.entity");
var PosPaymentStatus;
(function (PosPaymentStatus) {
    PosPaymentStatus["PENDING"] = "PENDING";
    PosPaymentStatus["COMPLETED"] = "COMPLETED";
    PosPaymentStatus["FAILED"] = "FAILED";
    PosPaymentStatus["CANCELLED"] = "CANCELLED";
    PosPaymentStatus["REFUNDED"] = "REFUNDED";
})(PosPaymentStatus || (exports.PosPaymentStatus = PosPaymentStatus = {}));
let PosTransactionPayment = class PosTransactionPayment {
    id;
    transactionId;
    paymentMethodId;
    amount;
    tenderedAmount;
    changeAmount;
    currency;
    status;
    referenceNumber;
    cardLastFour;
    cardType;
    approvalCode;
    terminalResponse;
    isRefund;
    refundReason;
    originalPaymentId;
    notes;
    createdAt;
    transaction;
    paymentMethod;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, transactionId: { required: true, type: () => String }, paymentMethodId: { required: true, type: () => String }, amount: { required: true, type: () => Number }, tenderedAmount: { required: true, type: () => Number }, changeAmount: { required: true, type: () => Number }, currency: { required: true, type: () => String }, status: { required: true, enum: require("./pos-transaction-payment.entity").PosPaymentStatus }, referenceNumber: { required: true, type: () => String }, cardLastFour: { required: true, type: () => String }, cardType: { required: true, type: () => String }, approvalCode: { required: true, type: () => String }, terminalResponse: { required: true, type: () => Object }, isRefund: { required: true, type: () => Boolean }, refundReason: { required: true, type: () => String }, originalPaymentId: { required: true, type: () => String }, notes: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, transaction: { required: true, type: () => require("./pos-transaction.entity").PosTransaction }, paymentMethod: { required: true, type: () => require("../eCommerce/payment-method.entity").PaymentMethod } };
    }
};
exports.PosTransactionPayment = PosTransactionPayment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PosTransactionPayment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transaction_id' }),
    __metadata("design:type", String)
], PosTransactionPayment.prototype, "transactionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_method_id' }),
    __metadata("design:type", String)
], PosTransactionPayment.prototype, "paymentMethodId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], PosTransactionPayment.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'tendered_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], PosTransactionPayment.prototype, "tenderedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'change_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], PosTransactionPayment.prototype, "changeAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 3, default: 'INR' }),
    __metadata("design:type", String)
], PosTransactionPayment.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PosPaymentStatus,
        default: PosPaymentStatus.COMPLETED,
    }),
    __metadata("design:type", String)
], PosTransactionPayment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_number', length: 100, nullable: true }),
    __metadata("design:type", String)
], PosTransactionPayment.prototype, "referenceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'card_last_four', length: 4, nullable: true }),
    __metadata("design:type", String)
], PosTransactionPayment.prototype, "cardLastFour", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'card_type', length: 50, nullable: true }),
    __metadata("design:type", String)
], PosTransactionPayment.prototype, "cardType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approval_code', length: 50, nullable: true }),
    __metadata("design:type", String)
], PosTransactionPayment.prototype, "approvalCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'terminal_response', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], PosTransactionPayment.prototype, "terminalResponse", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_refund', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], PosTransactionPayment.prototype, "isRefund", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'refund_reason', type: 'text', nullable: true }),
    __metadata("design:type", String)
], PosTransactionPayment.prototype, "refundReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'original_payment_id', nullable: true }),
    __metadata("design:type", String)
], PosTransactionPayment.prototype, "originalPaymentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PosTransactionPayment.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PosTransactionPayment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pos_transaction_entity_1.PosTransaction, (transaction) => transaction.payments, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'transaction_id' }),
    __metadata("design:type", pos_transaction_entity_1.PosTransaction)
], PosTransactionPayment.prototype, "transaction", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => payment_method_entity_1.PaymentMethod),
    (0, typeorm_1.JoinColumn)({ name: 'payment_method_id' }),
    __metadata("design:type", payment_method_entity_1.PaymentMethod)
], PosTransactionPayment.prototype, "paymentMethod", void 0);
exports.PosTransactionPayment = PosTransactionPayment = __decorate([
    (0, typeorm_1.Entity)('pos_transaction_payments')
], PosTransactionPayment);
//# sourceMappingURL=pos-transaction-payment.entity.js.map