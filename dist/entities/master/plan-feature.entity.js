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
exports.PlanFeature = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const subscription_plan_entity_1 = require("./subscription-plan.entity");
let PlanFeature = class PlanFeature {
    id;
    planId;
    featureCode;
    featureName;
    description;
    isEnabled;
    limitValue;
    createdAt;
    updatedAt;
    plan;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, planId: { required: true, type: () => String }, featureCode: { required: true, type: () => String }, featureName: { required: true, type: () => String }, description: { required: true, type: () => String }, isEnabled: { required: true, type: () => Boolean }, limitValue: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, plan: { required: true, type: () => require("./subscription-plan.entity").SubscriptionPlan } };
    }
};
exports.PlanFeature = PlanFeature;
__decorate([
    (0, typeorm_1.PrimaryColumn)('char', { length: 36 }),
    __metadata("design:type", String)
], PlanFeature.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('char', { name: 'plan_id', length: 36 }),
    __metadata("design:type", String)
], PlanFeature.prototype, "planId", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'feature_code', length: 100 }),
    __metadata("design:type", String)
], PlanFeature.prototype, "featureCode", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'feature_name', length: 200 }),
    __metadata("design:type", String)
], PlanFeature.prototype, "featureName", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], PlanFeature.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { name: 'is_enabled', default: true }),
    __metadata("design:type", Boolean)
], PlanFeature.prototype, "isEnabled", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'limit_value', length: 100, nullable: true }),
    __metadata("design:type", String)
], PlanFeature.prototype, "limitValue", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PlanFeature.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], PlanFeature.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => subscription_plan_entity_1.SubscriptionPlan, (plan) => plan.features, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'plan_id' }),
    __metadata("design:type", subscription_plan_entity_1.SubscriptionPlan)
], PlanFeature.prototype, "plan", void 0);
exports.PlanFeature = PlanFeature = __decorate([
    (0, typeorm_1.Entity)('plan_features'),
    (0, typeorm_1.Index)(['planId', 'featureCode'], { unique: true })
], PlanFeature);
//# sourceMappingURL=plan-feature.entity.js.map