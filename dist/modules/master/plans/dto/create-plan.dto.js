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
exports.CreatePlanDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const enums_1 = require("../../../../common/enums");
class CreatePlanFeatureDto {
    featureCode;
    featureName;
    description;
    isEnabled;
    static _OPENAPI_METADATA_FACTORY() {
        return { featureCode: { required: true, type: () => String }, featureName: { required: true, type: () => String }, description: { required: false, type: () => String }, isEnabled: { required: true, type: () => Boolean } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'MULTI_WAREHOUSE' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePlanFeatureDto.prototype, "featureCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Multi-Warehouse Support' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePlanFeatureDto.prototype, "featureName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlanFeatureDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePlanFeatureDto.prototype, "isEnabled", void 0);
class CreatePlanDto {
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
    static _OPENAPI_METADATA_FACTORY() {
        return { planCode: { required: true, type: () => String, maxLength: 50 }, planName: { required: true, type: () => String, maxLength: 200 }, description: { required: false, type: () => String }, price: { required: true, type: () => Number, minimum: 0 }, currency: { required: false, type: () => String, maxLength: 3 }, billingCycle: { required: true, enum: require("../../../../common/enums/index").BillingCycle }, trialDays: { required: false, type: () => Number, minimum: 0 }, maxUsers: { required: false, type: () => Number, minimum: 1 }, maxWarehouses: { required: false, type: () => Number, minimum: 1 }, maxProducts: { required: false, type: () => Number, minimum: 1 }, maxOrders: { required: false, type: () => Number, minimum: 1 }, storageGb: { required: false, type: () => Number, minimum: 0.1 }, isActive: { required: false, type: () => Boolean }, displayOrder: { required: false, type: () => Number, minimum: 0 }, features: { required: false, type: () => [CreatePlanFeatureDto] } };
    }
}
exports.CreatePlanDto = CreatePlanDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'STARTER' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreatePlanDto.prototype, "planCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Starter Plan' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreatePlanDto.prototype, "planName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlanDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 999 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePlanDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'INR', default: 'INR' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(3),
    __metadata("design:type", String)
], CreatePlanDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.BillingCycle, default: enums_1.BillingCycle.MONTHLY }),
    (0, class_validator_1.IsEnum)(enums_1.BillingCycle),
    __metadata("design:type", String)
], CreatePlanDto.prototype, "billingCycle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 14 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePlanDto.prototype, "trialDays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 5 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreatePlanDto.prototype, "maxUsers", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreatePlanDto.prototype, "maxWarehouses", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreatePlanDto.prototype, "maxProducts", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 500 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreatePlanDto.prototype, "maxOrders", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 5 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.1),
    __metadata("design:type", Number)
], CreatePlanDto.prototype, "storageGb", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePlanDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePlanDto.prototype, "displayOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [CreatePlanFeatureDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreatePlanFeatureDto),
    __metadata("design:type", Array)
], CreatePlanDto.prototype, "features", void 0);
//# sourceMappingURL=create-plan.dto.js.map