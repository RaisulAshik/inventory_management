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
exports.BillingHistory = exports.BillingStatus = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const tenant_entity_1 = require("./tenant.entity");
const subscription_entity_1 = require("./subscription.entity");
var BillingStatus;
(function (BillingStatus) {
    BillingStatus["PENDING"] = "PENDING";
    BillingStatus["PAID"] = "PAID";
    BillingStatus["FAILED"] = "FAILED";
    BillingStatus["REFUNDED"] = "REFUNDED";
    BillingStatus["CANCELLED"] = "CANCELLED";
})(BillingStatus || (exports.BillingStatus = BillingStatus = {}));
let BillingHistory = class BillingHistory {
    id;
    tenantId;
    subscriptionId;
    invoiceNumber;
    amount;
    taxAmount;
    totalAmount;
    currency;
    status;
    description;
    periodStart;
    periodEnd;
    invoiceDate;
    dueDate;
    paidDate;
    paymentMethod;
    paymentReference;
    transactionId;
    paymentGatewayResponse;
    refundAmount;
    refundDate;
    refundReason;
    invoiceUrl;
    createdAt;
    updatedAt;
    tenant;
    subscription;
    get isPaid() {
        return this.status === BillingStatus.PAID;
    }
    get isOverdue() {
        return (this.status === BillingStatus.PENDING &&
            new Date() > new Date(this.dueDate));
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, tenantId: { required: true, type: () => String }, subscriptionId: { required: true, type: () => String }, invoiceNumber: { required: true, type: () => String }, amount: { required: true, type: () => Number }, taxAmount: { required: true, type: () => Number }, totalAmount: { required: true, type: () => Number }, currency: { required: true, type: () => String }, status: { required: true, enum: require("./billing-history.entity").BillingStatus }, description: { required: true, type: () => String }, periodStart: { required: true, type: () => Date }, periodEnd: { required: true, type: () => Date }, invoiceDate: { required: true, type: () => Date }, dueDate: { required: true, type: () => Date }, paidDate: { required: true, type: () => Date }, paymentMethod: { required: true, type: () => String }, paymentReference: { required: true, type: () => String }, transactionId: { required: true, type: () => String }, paymentGatewayResponse: { required: true, type: () => String }, refundAmount: { required: true, type: () => Number }, refundDate: { required: true, type: () => Date }, refundReason: { required: true, type: () => String }, invoiceUrl: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, tenant: { required: true, type: () => require("./tenant.entity").Tenant }, subscription: { required: true, type: () => require("./subscription.entity").Subscription } };
    }
};
exports.BillingHistory = BillingHistory;
__decorate([
    (0, typeorm_1.PrimaryColumn)('char', { length: 36 }),
    __metadata("design:type", String)
], BillingHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('char', { name: 'tenant_id', length: 36 }),
    __metadata("design:type", String)
], BillingHistory.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.Column)('char', { name: 'subscription_id', length: 36, nullable: true }),
    __metadata("design:type", String)
], BillingHistory.prototype, "subscriptionId", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'invoice_number', length: 50 }),
    __metadata("design:type", String)
], BillingHistory.prototype, "invoiceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], BillingHistory.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', {
        name: 'tax_amount',
        precision: 15,
        scale: 2,
        default: 0,
    }),
    __metadata("design:type", Number)
], BillingHistory.prototype, "taxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { name: 'total_amount', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], BillingHistory.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)('char', { length: 3, default: 'INR' }),
    __metadata("design:type", String)
], BillingHistory.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: BillingStatus,
        default: BillingStatus.PENDING,
    }),
    __metadata("design:type", String)
], BillingHistory.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], BillingHistory.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('date', { name: 'period_start', nullable: true }),
    __metadata("design:type", Date)
], BillingHistory.prototype, "periodStart", void 0);
__decorate([
    (0, typeorm_1.Column)('date', { name: 'period_end', nullable: true }),
    __metadata("design:type", Date)
], BillingHistory.prototype, "periodEnd", void 0);
__decorate([
    (0, typeorm_1.Column)('date', { name: 'invoice_date' }),
    __metadata("design:type", Date)
], BillingHistory.prototype, "invoiceDate", void 0);
__decorate([
    (0, typeorm_1.Column)('date', { name: 'due_date' }),
    __metadata("design:type", Date)
], BillingHistory.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)('date', { name: 'paid_date', nullable: true }),
    __metadata("design:type", Date)
], BillingHistory.prototype, "paidDate", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'payment_method', length: 50, nullable: true }),
    __metadata("design:type", String)
], BillingHistory.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'payment_reference', length: 255, nullable: true }),
    __metadata("design:type", String)
], BillingHistory.prototype, "paymentReference", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'transaction_id', length: 255, nullable: true }),
    __metadata("design:type", String)
], BillingHistory.prototype, "transactionId", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'payment_gateway_response', nullable: true }),
    __metadata("design:type", String)
], BillingHistory.prototype, "paymentGatewayResponse", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', {
        name: 'refund_amount',
        precision: 15,
        scale: 2,
        nullable: true,
    }),
    __metadata("design:type", Number)
], BillingHistory.prototype, "refundAmount", void 0);
__decorate([
    (0, typeorm_1.Column)('date', { name: 'refund_date', nullable: true }),
    __metadata("design:type", Date)
], BillingHistory.prototype, "refundDate", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'refund_reason', length: 500, nullable: true }),
    __metadata("design:type", String)
], BillingHistory.prototype, "refundReason", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'invoice_url', length: 500, nullable: true }),
    __metadata("design:type", String)
], BillingHistory.prototype, "invoiceUrl", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], BillingHistory.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], BillingHistory.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tenant_entity_1.Tenant),
    (0, typeorm_1.JoinColumn)({ name: 'tenant_id' }),
    __metadata("design:type", tenant_entity_1.Tenant)
], BillingHistory.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => subscription_entity_1.Subscription, (sub) => sub.billingHistory),
    (0, typeorm_1.JoinColumn)({ name: 'subscription_id' }),
    __metadata("design:type", subscription_entity_1.Subscription)
], BillingHistory.prototype, "subscription", void 0);
exports.BillingHistory = BillingHistory = __decorate([
    (0, typeorm_1.Entity)('billing_history'),
    (0, typeorm_1.Index)(['tenantId', 'invoiceDate']),
    (0, typeorm_1.Index)(['invoiceNumber'], { unique: true }),
    (0, typeorm_1.Index)(['status'])
], BillingHistory);
//# sourceMappingURL=billing-history.entity.js.map