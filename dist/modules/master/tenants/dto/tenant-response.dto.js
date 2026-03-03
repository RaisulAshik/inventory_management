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
exports.TenantResponseDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../../../common/enums");
class TenantDatabaseDto {
    databaseName;
    isProvisioned;
    isActive;
    provisionedAt;
    host;
    port;
    static _OPENAPI_METADATA_FACTORY() {
        return { databaseName: { required: true, type: () => String }, isProvisioned: { required: true, type: () => Boolean }, isActive: { required: true, type: () => Boolean }, provisionedAt: { required: true, type: () => Date }, host: { required: true, type: () => String }, port: { required: true, type: () => Number } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TenantDatabaseDto.prototype, "databaseName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], TenantDatabaseDto.prototype, "isProvisioned", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], TenantDatabaseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], TenantDatabaseDto.prototype, "provisionedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TenantDatabaseDto.prototype, "host", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TenantDatabaseDto.prototype, "port", void 0);
class SubscriptionDto {
    id;
    status;
    planName;
    startDate;
    trialEndDate;
    currentPeriodEnd;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, status: { required: true, type: () => String }, planName: { required: false, type: () => String }, startDate: { required: false, type: () => Date }, trialEndDate: { required: false, type: () => Date }, currentPeriodEnd: { required: false, type: () => Date } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SubscriptionDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SubscriptionDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SubscriptionDto.prototype, "planName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], SubscriptionDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], SubscriptionDto.prototype, "trialEndDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], SubscriptionDto.prototype, "currentPeriodEnd", void 0);
class TenantResponseDto {
    id;
    tenantCode;
    companyName;
    displayName;
    email;
    phone;
    website;
    addressLine1;
    addressLine2;
    city;
    state;
    country;
    postalCode;
    taxId;
    industry;
    employeeCount;
    timezone;
    dateFormat;
    currency;
    logoUrl;
    status;
    activatedAt;
    suspendedAt;
    suspensionReason;
    database;
    subscription;
    createdAt;
    updatedAt;
    userCount;
    constructor(tenant) {
        this.id = tenant.id;
        this.tenantCode = tenant.tenantCode;
        this.companyName = tenant.companyName;
        this.displayName = tenant.legalName || tenant.companyName;
        this.email = tenant.email;
        this.phone = tenant.phone;
        this.website = tenant.website;
        this.addressLine1 = tenant.addressLine1;
        this.addressLine2 = tenant.addressLine2;
        this.city = tenant.city;
        this.state = tenant.state;
        this.country = tenant.country;
        this.postalCode = tenant.postalCode;
        this.taxId = tenant.taxId;
        this.industry = tenant.industry;
        this.employeeCount = tenant.employeeCount;
        this.timezone = tenant.timezone;
        this.dateFormat = tenant.dateFormat;
        this.currency = tenant.defaultCurrency;
        this.logoUrl = tenant.logoUrl;
        this.status = tenant.status;
        this.activatedAt = tenant.activatedAt;
        this.suspendedAt = tenant.suspendedAt;
        this.suspensionReason = tenant.suspendedReason;
        this.createdAt = tenant.createdAt;
        this.updatedAt = tenant.updatedAt;
        this.userCount = tenant.users?.length || 0;
        if (tenant.database) {
            this.database = {
                databaseName: tenant.database.databaseName,
                host: tenant.database.host,
                port: tenant.database.port,
                isProvisioned: tenant.database.isProvisioned,
                isActive: tenant.database.isActive,
                provisionedAt: tenant.database.provisionedAt,
            };
        }
        const activeSubscription = tenant.subscriptions?.find((sub) => sub.status === enums_1.SubscriptionStatus.ACTIVE ||
            sub.status === enums_1.SubscriptionStatus.TRIAL) || tenant.subscriptions?.[0];
        if (activeSubscription) {
            this.subscription = {
                id: activeSubscription.id,
                status: activeSubscription.status,
                planName: activeSubscription.plan?.planName,
                startDate: activeSubscription.currentPeriodStart,
                trialEndDate: activeSubscription.trialEndDate,
                currentPeriodEnd: activeSubscription.currentPeriodEnd,
            };
        }
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, tenantCode: { required: true, type: () => String }, companyName: { required: true, type: () => String }, displayName: { required: true, type: () => String }, email: { required: true, type: () => String }, phone: { required: false, type: () => String }, website: { required: false, type: () => String }, addressLine1: { required: false, type: () => String }, addressLine2: { required: false, type: () => String }, city: { required: false, type: () => String }, state: { required: false, type: () => String }, country: { required: false, type: () => String }, postalCode: { required: false, type: () => String }, taxId: { required: false, type: () => String }, industry: { required: false, type: () => String }, employeeCount: { required: false, type: () => Number }, timezone: { required: true, type: () => String }, dateFormat: { required: true, type: () => String }, currency: { required: true, type: () => String }, logoUrl: { required: false, type: () => String }, status: { required: true, enum: require("../../../../common/enums/index").TenantStatus }, activatedAt: { required: false, type: () => Date }, suspendedAt: { required: false, type: () => Date }, suspensionReason: { required: false, type: () => String }, database: { required: false, type: () => TenantDatabaseDto }, subscription: { required: false, type: () => SubscriptionDto }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, userCount: { required: true, type: () => Number } };
    }
}
exports.TenantResponseDto = TenantResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TenantResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TenantResponseDto.prototype, "tenantCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TenantResponseDto.prototype, "companyName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TenantResponseDto.prototype, "displayName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TenantResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], TenantResponseDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], TenantResponseDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], TenantResponseDto.prototype, "addressLine1", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], TenantResponseDto.prototype, "addressLine2", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], TenantResponseDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], TenantResponseDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], TenantResponseDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], TenantResponseDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], TenantResponseDto.prototype, "taxId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], TenantResponseDto.prototype, "industry", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], TenantResponseDto.prototype, "employeeCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TenantResponseDto.prototype, "timezone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TenantResponseDto.prototype, "dateFormat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TenantResponseDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], TenantResponseDto.prototype, "logoUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.TenantStatus }),
    __metadata("design:type", String)
], TenantResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], TenantResponseDto.prototype, "activatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], TenantResponseDto.prototype, "suspendedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], TenantResponseDto.prototype, "suspensionReason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: TenantDatabaseDto }),
    __metadata("design:type", TenantDatabaseDto)
], TenantResponseDto.prototype, "database", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: SubscriptionDto }),
    __metadata("design:type", SubscriptionDto)
], TenantResponseDto.prototype, "subscription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], TenantResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], TenantResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TenantResponseDto.prototype, "userCount", void 0);
//# sourceMappingURL=tenant-response.dto.js.map