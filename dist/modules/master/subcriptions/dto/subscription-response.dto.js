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
exports.SubscriptionResponseDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../../../common/enums");
class PlanDto {
    id;
    planCode;
    planName;
    monthlyPrice;
    yearlyPrice;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, planCode: { required: true, type: () => String }, planName: { required: true, type: () => String }, monthlyPrice: { required: true, type: () => Number }, yearlyPrice: { required: true, type: () => Number } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PlanDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PlanDto.prototype, "planCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PlanDto.prototype, "planName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PlanDto.prototype, "monthlyPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PlanDto.prototype, "yearlyPrice", void 0);
class TenantDto {
    id;
    tenantCode;
    companyName;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, tenantCode: { required: true, type: () => String }, companyName: { required: true, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TenantDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TenantDto.prototype, "tenantCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TenantDto.prototype, "companyName", void 0);
class SubscriptionResponseDto {
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
    totalPrice;
    currency;
    billingCycle;
    autoRenew;
    cancelAtPeriodEnd;
    cancelledAt;
    plan;
    tenant;
    daysRemaining;
    isTrialing;
    createdAt;
    updatedAt;
    constructor(subscription) {
        this.id = subscription.id;
        this.tenantId = subscription.tenantId;
        this.planId = subscription.planId;
        this.status = subscription.status;
        this.startDate = subscription.startDate;
        this.trialEndDate = subscription.trialEndDate;
        this.currentPeriodStart = subscription.currentPeriodStart;
        this.currentPeriodEnd = subscription.currentPeriodEnd;
        this.quantity = subscription.quantity;
        this.unitPrice = Number(subscription.unitPrice);
        this.totalPrice = Number(subscription.unitPrice) * subscription.quantity;
        this.currency = subscription.currency;
        this.billingCycle = subscription.billingCycle;
        this.autoRenew = subscription.autoRenew;
        this.cancelAtPeriodEnd = subscription.cancelAtPeriodEnd;
        this.cancelledAt = subscription.cancelledAt;
        this.createdAt = subscription.createdAt;
        this.updatedAt = subscription.updatedAt;
        const now = new Date();
        const endDate = subscription.trialEndDate || subscription.currentPeriodEnd;
        this.daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
        this.isTrialing = subscription.status === enums_1.SubscriptionStatus.TRIAL;
        if (subscription.plan) {
            this.plan = {
                id: subscription.plan.id,
                planCode: subscription.plan.planCode,
                planName: subscription.plan.planName,
                monthlyPrice: Number(subscription.plan.monthlyPrice),
                yearlyPrice: Number(subscription.plan.yearlyPrice),
            };
        }
        if (subscription.tenant) {
            this.tenant = {
                id: subscription.tenant.id,
                tenantCode: subscription.tenant.tenantCode,
                companyName: subscription.tenant.companyName,
            };
        }
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, tenantId: { required: true, type: () => String }, planId: { required: true, type: () => String }, status: { required: true, enum: require("../../../../common/enums/index").SubscriptionStatus }, startDate: { required: true, type: () => Date }, trialEndDate: { required: false, type: () => Date }, currentPeriodStart: { required: true, type: () => Date }, currentPeriodEnd: { required: true, type: () => Date }, quantity: { required: true, type: () => Number }, unitPrice: { required: true, type: () => Number }, totalPrice: { required: true, type: () => Number }, currency: { required: true, type: () => String }, billingCycle: { required: true, enum: require("../../../../common/enums/index").BillingCycle }, autoRenew: { required: true, type: () => Boolean }, cancelAtPeriodEnd: { required: true, type: () => Boolean }, cancelledAt: { required: false, type: () => Date }, plan: { required: false, type: () => PlanDto }, tenant: { required: false, type: () => TenantDto }, daysRemaining: { required: true, type: () => Number }, isTrialing: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.SubscriptionResponseDto = SubscriptionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SubscriptionResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SubscriptionResponseDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SubscriptionResponseDto.prototype, "planId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.SubscriptionStatus }),
    __metadata("design:type", String)
], SubscriptionResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SubscriptionResponseDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], SubscriptionResponseDto.prototype, "trialEndDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SubscriptionResponseDto.prototype, "currentPeriodStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SubscriptionResponseDto.prototype, "currentPeriodEnd", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SubscriptionResponseDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SubscriptionResponseDto.prototype, "unitPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SubscriptionResponseDto.prototype, "totalPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SubscriptionResponseDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.BillingCycle }),
    __metadata("design:type", String)
], SubscriptionResponseDto.prototype, "billingCycle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SubscriptionResponseDto.prototype, "autoRenew", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SubscriptionResponseDto.prototype, "cancelAtPeriodEnd", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], SubscriptionResponseDto.prototype, "cancelledAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: PlanDto }),
    __metadata("design:type", PlanDto)
], SubscriptionResponseDto.prototype, "plan", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: TenantDto }),
    __metadata("design:type", TenantDto)
], SubscriptionResponseDto.prototype, "tenant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SubscriptionResponseDto.prototype, "daysRemaining", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SubscriptionResponseDto.prototype, "isTrialing", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SubscriptionResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SubscriptionResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=subscription-response.dto.js.map