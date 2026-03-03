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
const enums_1 = require("../../common/enums");
const tenant_entity_1 = require("./tenant.entity");
const subscription_plan_entity_1 = require("./subscription-plan.entity");
let Subscription = class Subscription {
    id;
    tenantId;
    planId;
    billingCycle;
    status;
    trialStartDate;
    trialEndDate;
    currentPeriodStart;
    currentPeriodEnd;
    cancelledAt;
    cancelReason;
    createdAt;
    updatedAt;
    tenant;
    plan;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, tenantId: { required: true, type: () => String }, planId: { required: true, type: () => String }, billingCycle: { required: true, enum: require("../../common/enums/index").BillingCycle }, status: { required: true, enum: require("../../common/enums/index").SubscriptionStatus }, trialStartDate: { required: true, type: () => Date }, trialEndDate: { required: true, type: () => Date }, currentPeriodStart: { required: true, type: () => Date }, currentPeriodEnd: { required: true, type: () => Date }, cancelledAt: { required: true, type: () => Date }, cancelReason: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, tenant: { required: true, type: () => require("./tenant.entity").Tenant }, plan: { required: true, type: () => require("./subscription-plan.entity").SubscriptionPlan } };
    }
};
exports.Subscription = Subscription;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Subscription.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tenant_id' }),
    __metadata("design:type", String)
], Subscription.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'plan_id' }),
    __metadata("design:type", String)
], Subscription.prototype, "planId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'billing_cycle',
        type: 'enum',
        enum: enums_1.BillingCycle,
        default: enums_1.BillingCycle.MONTHLY,
    }),
    __metadata("design:type", String)
], Subscription.prototype, "billingCycle", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.SubscriptionStatus,
        default: enums_1.SubscriptionStatus.TRIAL,
    }),
    __metadata("design:type", String)
], Subscription.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'trial_start_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Subscription.prototype, "trialStartDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'trial_end_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Subscription.prototype, "trialEndDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'current_period_start', type: 'date' }),
    __metadata("design:type", Date)
], Subscription.prototype, "currentPeriodStart", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'current_period_end', type: 'date' }),
    __metadata("design:type", Date)
], Subscription.prototype, "currentPeriodEnd", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cancelled_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Subscription.prototype, "cancelledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cancel_reason', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Subscription.prototype, "cancelReason", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Subscription.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Subscription.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tenant_entity_1.Tenant, (tenant) => tenant.subscriptions, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'tenant_id' }),
    __metadata("design:type", tenant_entity_1.Tenant)
], Subscription.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => subscription_plan_entity_1.SubscriptionPlan, (plan) => plan.subscriptions),
    (0, typeorm_1.JoinColumn)({ name: 'plan_id' }),
    __metadata("design:type", subscription_plan_entity_1.SubscriptionPlan)
], Subscription.prototype, "plan", void 0);
exports.Subscription = Subscription = __decorate([
    (0, typeorm_1.Entity)('tenant_subscriptions')
], Subscription);
//# sourceMappingURL=tenant-subscription.entity.js.map