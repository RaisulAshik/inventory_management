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
exports.Tenant = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const enums_1 = require("../../common/enums");
const tenant_database_entity_1 = require("./tenant-database.entity");
const tenant_user_entity_1 = require("./tenant-user.entity");
const subscription_entity_1 = require("./subscription.entity");
let Tenant = class Tenant {
    id;
    tenantCode;
    companyName;
    legalName;
    taxId;
    email;
    phone;
    website;
    logoUrl;
    addressLine1;
    addressLine2;
    city;
    state;
    country;
    postalCode;
    industry;
    timezone;
    defaultCurrency;
    dateFormat;
    fiscalYearStartMonth;
    employeeCount;
    status;
    activatedAt;
    suspendedAt;
    suspendedReason;
    terminatedAt;
    deletedAt;
    createdAt;
    updatedAt;
    database;
    subscriptions;
    users;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, tenantCode: { required: true, type: () => String }, companyName: { required: true, type: () => String }, legalName: { required: true, type: () => String }, taxId: { required: true, type: () => String }, email: { required: true, type: () => String }, phone: { required: true, type: () => String }, website: { required: true, type: () => String }, logoUrl: { required: true, type: () => String }, addressLine1: { required: true, type: () => String }, addressLine2: { required: true, type: () => String }, city: { required: true, type: () => String }, state: { required: true, type: () => String }, country: { required: true, type: () => String }, postalCode: { required: true, type: () => String }, industry: { required: true, type: () => String }, timezone: { required: true, type: () => String }, defaultCurrency: { required: true, type: () => String }, dateFormat: { required: true, type: () => String }, fiscalYearStartMonth: { required: true, type: () => Number }, employeeCount: { required: true, type: () => Number }, status: { required: true, enum: require("../../common/enums/index").TenantStatus }, activatedAt: { required: true, type: () => Date }, suspendedAt: { required: true, type: () => Date }, suspendedReason: { required: true, type: () => String }, terminatedAt: { required: true, type: () => Date }, deletedAt: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, database: { required: true, type: () => require("./tenant-database.entity").TenantDatabase }, subscriptions: { required: true, type: () => [require("./subscription.entity").Subscription] }, users: { required: true, type: () => [require("./tenant-user.entity").TenantUser] } };
    }
};
exports.Tenant = Tenant;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Tenant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tenant_code', length: 50, unique: true }),
    __metadata("design:type", String)
], Tenant.prototype, "tenantCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'company_name', length: 200 }),
    __metadata("design:type", String)
], Tenant.prototype, "companyName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'legal_name', length: 200, nullable: true }),
    __metadata("design:type", String)
], Tenant.prototype, "legalName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tax_id', length: 100, nullable: true }),
    __metadata("design:type", String)
], Tenant.prototype, "taxId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, unique: true }),
    __metadata("design:type", String)
], Tenant.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Tenant.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Tenant.prototype, "website", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'logo_url', length: 500, nullable: true }),
    __metadata("design:type", String)
], Tenant.prototype, "logoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'address_line1', length: 255, nullable: true }),
    __metadata("design:type", String)
], Tenant.prototype, "addressLine1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'address_line2', length: 255, nullable: true }),
    __metadata("design:type", String)
], Tenant.prototype, "addressLine2", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Tenant.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Tenant.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, default: 'Bangladesh' }),
    __metadata("design:type", String)
], Tenant.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'postal_code', length: 20, nullable: true }),
    __metadata("design:type", String)
], Tenant.prototype, "postalCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Tenant.prototype, "industry", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, default: 'Asia/Kolkata' }),
    __metadata("design:type", String)
], Tenant.prototype, "timezone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'default_currency', length: 3, default: 'INR' }),
    __metadata("design:type", String)
], Tenant.prototype, "defaultCurrency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date_format', length: 20, default: 'DD/MM/YYYY' }),
    __metadata("design:type", String)
], Tenant.prototype, "dateFormat", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fiscal_year_start_month', type: 'tinyint', default: 4 }),
    __metadata("design:type", Number)
], Tenant.prototype, "fiscalYearStartMonth", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'employee_count', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Tenant.prototype, "employeeCount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.TenantStatus,
        default: enums_1.TenantStatus.PENDING,
    }),
    __metadata("design:type", String)
], Tenant.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'activated_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Tenant.prototype, "activatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'suspended_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Tenant.prototype, "suspendedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'suspended_reason', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Tenant.prototype, "suspendedReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'terminated_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Tenant.prototype, "terminatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'deleted_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Tenant.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Tenant.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Tenant.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => tenant_database_entity_1.TenantDatabase, (database) => database.tenant),
    __metadata("design:type", tenant_database_entity_1.TenantDatabase)
], Tenant.prototype, "database", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => subscription_entity_1.Subscription, (subscription) => subscription.tenant),
    __metadata("design:type", Array)
], Tenant.prototype, "subscriptions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tenant_user_entity_1.TenantUser, (user) => user.tenant),
    __metadata("design:type", Array)
], Tenant.prototype, "users", void 0);
exports.Tenant = Tenant = __decorate([
    (0, typeorm_1.Entity)('tenants')
], Tenant);
//# sourceMappingURL=tenant.entity.js.map