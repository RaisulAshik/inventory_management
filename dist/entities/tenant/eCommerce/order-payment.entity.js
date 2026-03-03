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
exports.OrderPayment = exports.OrderPaymentStatus = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const sales_order_entity_1 = require("./sales-order.entity");
const payment_method_entity_1 = require("./payment-method.entity");
var OrderPaymentStatus;
(function (OrderPaymentStatus) {
    OrderPaymentStatus["PENDING"] = "PENDING";
    OrderPaymentStatus["PROCESSING"] = "PROCESSING";
    OrderPaymentStatus["COMPLETED"] = "COMPLETED";
    OrderPaymentStatus["FAILED"] = "FAILED";
    OrderPaymentStatus["CANCELLED"] = "CANCELLED";
    OrderPaymentStatus["REFUNDED"] = "REFUNDED";
    OrderPaymentStatus["PARTIALLY_REFUNDED"] = "PARTIALLY_REFUNDED";
})(OrderPaymentStatus || (exports.OrderPaymentStatus = OrderPaymentStatus = {}));
let OrderPayment = class OrderPayment {
    id;
    orderId;
    paymentMethodId;
    paymentDate;
    amount;
    currency;
    status;
    transactionId;
    gatewayTransactionId;
    gatewayResponse;
    paymentReference;
    refundedAmount;
    refundReason;
    refundedAt;
    failureReason;
    notes;
    processedBy;
    createdAt;
    updatedAt;
    order;
    paymentMethod;
    get netAmount() {
        return this.amount - this.refundedAmount;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, orderId: { required: true, type: () => String }, paymentMethodId: { required: true, type: () => String }, paymentDate: { required: true, type: () => Date }, amount: { required: true, type: () => Number }, currency: { required: true, type: () => String }, status: { required: true, enum: require("./order-payment.entity").OrderPaymentStatus }, transactionId: { required: true, type: () => String }, gatewayTransactionId: { required: true, type: () => String }, gatewayResponse: { required: true, type: () => Object }, paymentReference: { required: true, type: () => String }, refundedAmount: { required: true, type: () => Number }, refundReason: { required: true, type: () => String }, refundedAt: { required: true, type: () => Date }, failureReason: { required: true, type: () => String }, notes: { required: true, type: () => String }, processedBy: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, order: { required: true, type: () => require("./sales-order.entity").SalesOrder }, paymentMethod: { required: true, type: () => require("./payment-method.entity").PaymentMethod } };
    }
};
exports.OrderPayment = OrderPayment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], OrderPayment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_id' }),
    __metadata("design:type", String)
], OrderPayment.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_method_id' }),
    __metadata("design:type", String)
], OrderPayment.prototype, "paymentMethodId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_date', type: 'timestamp' }),
    __metadata("design:type", Date)
], OrderPayment.prototype, "paymentDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], OrderPayment.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 3, default: 'INR' }),
    __metadata("design:type", String)
], OrderPayment.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: OrderPaymentStatus,
        default: OrderPaymentStatus.PENDING,
    }),
    __metadata("design:type", String)
], OrderPayment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transaction_id', length: 255, nullable: true }),
    __metadata("design:type", String)
], OrderPayment.prototype, "transactionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gateway_transaction_id', length: 255, nullable: true }),
    __metadata("design:type", String)
], OrderPayment.prototype, "gatewayTransactionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gateway_response', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], OrderPayment.prototype, "gatewayResponse", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_reference', length: 255, nullable: true }),
    __metadata("design:type", String)
], OrderPayment.prototype, "paymentReference", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'refunded_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], OrderPayment.prototype, "refundedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'refund_reason', type: 'text', nullable: true }),
    __metadata("design:type", String)
], OrderPayment.prototype, "refundReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'refunded_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], OrderPayment.prototype, "refundedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'failure_reason', type: 'text', nullable: true }),
    __metadata("design:type", String)
], OrderPayment.prototype, "failureReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], OrderPayment.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'processed_by', nullable: true }),
    __metadata("design:type", String)
], OrderPayment.prototype, "processedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], OrderPayment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], OrderPayment.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sales_order_entity_1.SalesOrder, (order) => order.payments, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'order_id' }),
    __metadata("design:type", sales_order_entity_1.SalesOrder)
], OrderPayment.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => payment_method_entity_1.PaymentMethod),
    (0, typeorm_1.JoinColumn)({ name: 'payment_method_id' }),
    __metadata("design:type", payment_method_entity_1.PaymentMethod)
], OrderPayment.prototype, "paymentMethod", void 0);
exports.OrderPayment = OrderPayment = __decorate([
    (0, typeorm_1.Entity)('order_payments')
], OrderPayment);
//# sourceMappingURL=order-payment.entity.js.map