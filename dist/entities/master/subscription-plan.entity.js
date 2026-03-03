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
exports.SubscriptionPlan = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const plan_feature_entity_1 = require("./plan-feature.entity");
const subscription_entity_1 = require("./subscription.entity");
let SubscriptionPlan = class SubscriptionPlan {
    id;
    planCode;
    planName;
    description;
    monthlyPrice;
    yearlyPrice;
    maxUsers;
    maxWarehouses;
    maxStores;
    maxProducts;
    maxOrdersPerMonth;
    storageLimitGb;
    isActive;
    trialDays;
    sortOrder;
    createdAt;
    updatedAt;
    features;
    subscriptions;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, planCode: { required: true, type: () => String }, planName: { required: true, type: () => String }, description: { required: true, type: () => String }, monthlyPrice: { required: true, type: () => Number }, yearlyPrice: { required: true, type: () => Number }, maxUsers: { required: true, type: () => Number }, maxWarehouses: { required: true, type: () => Number }, maxStores: { required: true, type: () => Number }, maxProducts: { required: true, type: () => Number }, maxOrdersPerMonth: { required: true, type: () => Number }, storageLimitGb: { required: true, type: () => Number }, isActive: { required: true, type: () => Boolean }, trialDays: { required: true, type: () => Number }, sortOrder: { required: true, type: () => Number }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, features: { required: true, type: () => [require("./plan-feature.entity").PlanFeature] }, subscriptions: { required: true, type: () => [require("./subscription.entity").Subscription] } };
    }
};
exports.SubscriptionPlan = SubscriptionPlan;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SubscriptionPlan.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'plan_code', length: 50, unique: true }),
    __metadata("design:type", String)
], SubscriptionPlan.prototype, "planCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'plan_name', length: 100 }),
    __metadata("design:type", String)
], SubscriptionPlan.prototype, "planName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SubscriptionPlan.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'monthly_price',
        type: 'decimal',
        precision: 12,
        scale: 2,
        default: 0,
    }),
    __metadata("design:type", Number)
], SubscriptionPlan.prototype, "monthlyPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'yearly_price',
        type: 'decimal',
        precision: 12,
        scale: 2,
        default: 0,
    }),
    __metadata("design:type", Number)
], SubscriptionPlan.prototype, "yearlyPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_users', type: 'int', default: 1 }),
    __metadata("design:type", Number)
], SubscriptionPlan.prototype, "maxUsers", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_warehouses', type: 'int', default: 1 }),
    __metadata("design:type", Number)
], SubscriptionPlan.prototype, "maxWarehouses", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_stores', type: 'int', default: 1 }),
    __metadata("design:type", Number)
], SubscriptionPlan.prototype, "maxStores", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_products', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], SubscriptionPlan.prototype, "maxProducts", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_orders_per_month', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], SubscriptionPlan.prototype, "maxOrdersPerMonth", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'storage_limit_gb', type: 'int', default: 5 }),
    __metadata("design:type", Number)
], SubscriptionPlan.prototype, "storageLimitGb", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], SubscriptionPlan.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'trial_days', type: 'int', default: 14 }),
    __metadata("design:type", Number)
], SubscriptionPlan.prototype, "trialDays", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sort_order', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], SubscriptionPlan.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SubscriptionPlan.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], SubscriptionPlan.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => plan_feature_entity_1.PlanFeature, (feature) => feature.plan),
    __metadata("design:type", Array)
], SubscriptionPlan.prototype, "features", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => subscription_entity_1.Subscription, (subscription) => subscription.plan),
    __metadata("design:type", Array)
], SubscriptionPlan.prototype, "subscriptions", void 0);
exports.SubscriptionPlan = SubscriptionPlan = __decorate([
    (0, typeorm_1.Entity)('subscription_plans')
], SubscriptionPlan);
//# sourceMappingURL=subscription-plan.entity.js.map