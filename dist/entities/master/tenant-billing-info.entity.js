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
exports.TenantBillingInfo = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
let TenantBillingInfo = class TenantBillingInfo {
    id;
    tenantId;
    billingName;
    billingEmail;
    billingPhone;
    billingAddressLine1;
    billingAddressLine2;
    billingCity;
    billingState;
    billingCountry;
    billingPostalCode;
    taxId;
    createdAt;
    updatedAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, tenantId: { required: true, type: () => String }, billingName: { required: true, type: () => String }, billingEmail: { required: true, type: () => String }, billingPhone: { required: true, type: () => String }, billingAddressLine1: { required: true, type: () => String }, billingAddressLine2: { required: true, type: () => String }, billingCity: { required: true, type: () => String }, billingState: { required: true, type: () => String }, billingCountry: { required: true, type: () => String }, billingPostalCode: { required: true, type: () => String }, taxId: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.TenantBillingInfo = TenantBillingInfo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TenantBillingInfo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tenant_id', unique: true }),
    __metadata("design:type", String)
], TenantBillingInfo.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'billing_name', length: 200 }),
    __metadata("design:type", String)
], TenantBillingInfo.prototype, "billingName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'billing_email', length: 255 }),
    __metadata("design:type", String)
], TenantBillingInfo.prototype, "billingEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'billing_phone', length: 50, nullable: true }),
    __metadata("design:type", String)
], TenantBillingInfo.prototype, "billingPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'billing_address_line1', length: 255, nullable: true }),
    __metadata("design:type", String)
], TenantBillingInfo.prototype, "billingAddressLine1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'billing_address_line2', length: 255, nullable: true }),
    __metadata("design:type", String)
], TenantBillingInfo.prototype, "billingAddressLine2", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'billing_city', length: 100, nullable: true }),
    __metadata("design:type", String)
], TenantBillingInfo.prototype, "billingCity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'billing_state', length: 100, nullable: true }),
    __metadata("design:type", String)
], TenantBillingInfo.prototype, "billingState", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'billing_country', length: 100, nullable: true }),
    __metadata("design:type", String)
], TenantBillingInfo.prototype, "billingCountry", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'billing_postal_code', length: 20, nullable: true }),
    __metadata("design:type", String)
], TenantBillingInfo.prototype, "billingPostalCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tax_id', length: 100, nullable: true }),
    __metadata("design:type", String)
], TenantBillingInfo.prototype, "taxId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], TenantBillingInfo.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], TenantBillingInfo.prototype, "updatedAt", void 0);
exports.TenantBillingInfo = TenantBillingInfo = __decorate([
    (0, typeorm_1.Entity)('tenant_billing_info')
], TenantBillingInfo);
//# sourceMappingURL=tenant-billing-info.entity.js.map