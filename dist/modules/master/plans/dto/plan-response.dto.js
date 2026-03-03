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
exports.PlanResponseDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../../../common/enums");
class PlanFeatureDto {
    id;
    featureCode;
    featureName;
    description;
    isEnabled;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, featureCode: { required: true, type: () => String }, featureName: { required: true, type: () => String }, description: { required: false, type: () => String }, isEnabled: { required: true, type: () => Boolean } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PlanFeatureDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PlanFeatureDto.prototype, "featureCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PlanFeatureDto.prototype, "featureName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PlanFeatureDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], PlanFeatureDto.prototype, "isEnabled", void 0);
class PlanResponseDto {
    id;
    planCode;
    planName;
    description;
    price;
    currency;
    billingCycle;
    trialDays;
    maxUsers;
    maxWarehouses;
    maxProducts;
    maxOrders;
    storageGb;
    isActive;
    displayOrder;
    features;
    pricePerMonth;
    createdAt;
    updatedAt;
    constructor(plan, billingCycle) {
        this.id = plan.id;
        this.planCode = plan.planCode;
        this.planName = plan.planName;
        this.description = plan.description;
        const cycle = billingCycle || enums_1.BillingCycle.MONTHLY;
        this.billingCycle = cycle;
        this.price =
            cycle === enums_1.BillingCycle.ANNUAL
                ? Number(plan.yearlyPrice)
                : Number(plan.monthlyPrice);
        this.currency = 'INR';
        this.trialDays = plan.trialDays;
        this.maxUsers = plan.maxUsers;
        this.maxWarehouses = plan.maxWarehouses;
        this.maxProducts = plan.maxProducts;
        this.maxOrders = plan.maxOrdersPerMonth;
        this.storageGb = plan.storageLimitGb;
        this.isActive = Boolean(plan.isActive);
        this.displayOrder = plan.sortOrder;
        this.createdAt = plan.createdAt;
        this.updatedAt = plan.updatedAt;
        this.pricePerMonth =
            cycle === enums_1.BillingCycle.ANNUAL
                ? Number(plan.yearlyPrice) / 12
                : Number(plan.monthlyPrice);
        if (plan.features) {
            this.features = plan.features.map((f) => ({
                id: f.id,
                featureCode: f.featureCode,
                featureName: f.featureName,
                description: f.description,
                isEnabled: f.isEnabled,
            }));
        }
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, planCode: { required: true, type: () => String }, planName: { required: true, type: () => String }, description: { required: false, type: () => String }, price: { required: true, type: () => Number }, currency: { required: true, type: () => String }, billingCycle: { required: true, enum: require("../../../../common/enums/index").BillingCycle }, trialDays: { required: true, type: () => Number }, maxUsers: { required: false, type: () => Number }, maxWarehouses: { required: false, type: () => Number }, maxProducts: { required: false, type: () => Number }, maxOrders: { required: false, type: () => Number }, storageGb: { required: false, type: () => Number }, isActive: { required: true, type: () => Boolean }, displayOrder: { required: true, type: () => Number }, features: { required: false, type: () => [PlanFeatureDto] }, pricePerMonth: { required: true, type: () => Number }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.PlanResponseDto = PlanResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PlanResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PlanResponseDto.prototype, "planCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PlanResponseDto.prototype, "planName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PlanResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PlanResponseDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PlanResponseDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.BillingCycle }),
    __metadata("design:type", String)
], PlanResponseDto.prototype, "billingCycle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PlanResponseDto.prototype, "trialDays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], PlanResponseDto.prototype, "maxUsers", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], PlanResponseDto.prototype, "maxWarehouses", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], PlanResponseDto.prototype, "maxProducts", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], PlanResponseDto.prototype, "maxOrders", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], PlanResponseDto.prototype, "storageGb", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], PlanResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PlanResponseDto.prototype, "displayOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [PlanFeatureDto] }),
    __metadata("design:type", Array)
], PlanResponseDto.prototype, "features", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PlanResponseDto.prototype, "pricePerMonth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], PlanResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], PlanResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=plan-response.dto.js.map