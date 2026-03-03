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
exports.Subscription = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const subscription_plan_entity_1 = require("./subscription-plan.entity");
const billing_history_entity_1 = require("./billing-history.entity");
const tenant_entity_1 = require("./tenant.entity");
const enums_1 = require("../../common/enums");
let Subscription = class Subscription {
    id;
    tenantId;
    planId;
    status;
    startDate;
    trialEndDate;
    currentPeriodStart;
    currentPeriodEnd;
    quantity;
    unitPrice;
    currency;
    billingCycle;
    autoRenew;
    cancelAtPeriodEnd;
    cancelledAt;
    cancellationReason;
    paymentMethod;
    paymentReference;
    lastPaymentAt;
    nextBillingAt;
    createdAt;
    updatedAt;
    tenant;
    plan;
    billingHistory;
    get totalPrice() {
        return Number(this.unitPrice) * this.quantity;
    }
    get isTrialing() {
        return this.status === enums_1.SubscriptionStatus.TRIAL;
    }
    get isActive() {
        return [enums_1.SubscriptionStatus.ACTIVE, enums_1.SubscriptionStatus.TRIAL].includes(this.status);
    }
    get daysRemaining() {
        const endDate = this.trialEndDate || this.currentPeriodEnd;
        const now = new Date();
        const diffTime = endDate.getTime() - now.getTime();
        return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, tenantId: { required: true, type: () => String }, planId: { required: true, type: () => String }, status: { required: true, enum: require("../../common/enums/index").SubscriptionStatus }, startDate: { required: true, type: () => Date }, trialEndDate: { required: true, type: () => Date }, currentPeriodStart: { required: true, type: () => Date }, currentPeriodEnd: { required: true, type: () => Date }, quantity: { required: true, type: () => Number }, unitPrice: { required: true, type: () => Number }, currency: { required: true, type: () => String }, billingCycle: { required: true, enum: require("../../common/enums/index").BillingCycle }, autoRenew: { required: true, type: () => Boolean }, cancelAtPeriodEnd: { required: true, type: () => Boolean }, cancelledAt: { required: true, type: () => Date }, cancellationReason: { required: true, type: () => String }, paymentMethod: { required: true, type: () => String }, paymentReference: { required: true, type: () => String }, lastPaymentAt: { required: true, type: () => Date }, nextBillingAt: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, tenant: { required: true, type: () => require("./tenant.entity").Tenant }, plan: { required: true, type: () => require("./subscription-plan.entity").SubscriptionPlan }, billingHistory: { required: true, type: () => [require("./billing-history.entity").BillingHistory] } };
    }
};
exports.Subscription = Subscription;
__decorate([
    (0, typeorm_1.PrimaryColumn)('char', { length: 36 }),
    __metadata("design:type", String)
], Subscription.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('char', { name: 'tenant_id', length: 36 }),
    __metadata("design:type", String)
], Subscription.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.Column)('char', { name: 'plan_id', length: 36 }),
    __metadata("design:type", String)
], Subscription.prototype, "planId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.SubscriptionStatus,
        default: enums_1.SubscriptionStatus.TRIAL,
    }),
    __metadata("design:type", String)
], Subscription.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('date', { name: 'start_date' }),
    __metadata("design:type", Date)
], Subscription.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)('date', { name: 'trial_end_date', nullable: true }),
    __metadata("design:type", Date)
], Subscription.prototype, "trialEndDate", void 0);
__decorate([
    (0, typeorm_1.Column)('date', { name: 'current_period_start' }),
    __metadata("design:type", Date)
], Subscription.prototype, "currentPeriodStart", void 0);
__decorate([
    (0, typeorm_1.Column)('date', { name: 'current_period_end' }),
    __metadata("design:type", Date)
], Subscription.prototype, "currentPeriodEnd", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { default: 1 }),
    __metadata("design:type", Number)
], Subscription.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { name: 'unit_price', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], Subscription.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)('char', { length: 3, default: 'INR' }),
    __metadata("design:type", String)
], Subscription.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.BillingCycle,
        name: 'billing_cycle',
        default: enums_1.BillingCycle.MONTHLY,
    }),
    __metadata("design:type", String)
], Subscription.prototype, "billingCycle", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { name: 'auto_renew', default: true }),
    __metadata("design:type", Boolean)
], Subscription.prototype, "autoRenew", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { name: 'cancel_at_period_end', default: false }),
    __metadata("design:type", Boolean)
], Subscription.prototype, "cancelAtPeriodEnd", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { name: 'cancelled_at', nullable: true }),
    __metadata("design:type", Date)
], Subscription.prototype, "cancelledAt", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'cancellation_reason',
        length: 500,
        nullable: true,
    }),
    __metadata("design:type", String)
], Subscription.prototype, "cancellationReason", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'payment_method', length: 50, nullable: true }),
    __metadata("design:type", String)
], Subscription.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'payment_reference', length: 255, nullable: true }),
    __metadata("design:type", String)
], Subscription.prototype, "paymentReference", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { name: 'last_payment_at', nullable: true }),
    __metadata("design:type", Date)
], Subscription.prototype, "lastPaymentAt", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { name: 'next_billing_at', nullable: true }),
    __metadata("design:type", Date)
], Subscription.prototype, "nextBillingAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Subscription.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Subscription.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => tenant_entity_1.Tenant, (tenant) => tenant.subscriptions),
    (0, typeorm_1.JoinColumn)({ name: 'tenant_id' }),
    __metadata("design:type", tenant_entity_1.Tenant)
], Subscription.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => subscription_plan_entity_1.SubscriptionPlan, (plan) => plan.subscriptions),
    (0, typeorm_1.JoinColumn)({ name: 'plan_id' }),
    __metadata("design:type", subscription_plan_entity_1.SubscriptionPlan)
], Subscription.prototype, "plan", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => billing_history_entity_1.BillingHistory, (billing) => billing.subscription),
    __metadata("design:type", Array)
], Subscription.prototype, "billingHistory", void 0);
exports.Subscription = Subscription = __decorate([
    (0, typeorm_1.Entity)('subscriptions'),
    (0, typeorm_1.Index)(['tenantId'], { unique: true }),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['currentPeriodEnd'])
], Subscription);
//# sourceMappingURL=subscription.entity.js.map