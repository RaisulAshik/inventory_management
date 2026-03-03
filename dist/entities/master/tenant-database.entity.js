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
exports.TenantDatabase = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const tenant_entity_1 = require("./tenant.entity");
let TenantDatabase = class TenantDatabase {
    id;
    tenantId;
    databaseName;
    host;
    port;
    username;
    isProvisioned;
    isActive;
    provisionedAt;
    createdAt;
    updatedAt;
    tenant;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, tenantId: { required: true, type: () => String }, databaseName: { required: true, type: () => String }, host: { required: true, type: () => String }, port: { required: true, type: () => Number }, username: { required: true, type: () => String }, isProvisioned: { required: true, type: () => Boolean }, isActive: { required: true, type: () => Boolean }, provisionedAt: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, tenant: { required: true, type: () => require("./tenant.entity").Tenant } };
    }
};
exports.TenantDatabase = TenantDatabase;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TenantDatabase.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tenant_id' }),
    __metadata("design:type", String)
], TenantDatabase.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'database_name', length: 100, unique: true }),
    __metadata("design:type", String)
], TenantDatabase.prototype, "databaseName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, default: 'localhost' }),
    __metadata("design:type", String)
], TenantDatabase.prototype, "host", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 3306 }),
    __metadata("design:type", Number)
], TenantDatabase.prototype, "port", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], TenantDatabase.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_provisioned', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], TenantDatabase.prototype, "isProvisioned", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], TenantDatabase.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'provisioned_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], TenantDatabase.prototype, "provisionedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], TenantDatabase.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], TenantDatabase.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => tenant_entity_1.Tenant, (tenant) => tenant.database, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'tenant_id' }),
    __metadata("design:type", tenant_entity_1.Tenant)
], TenantDatabase.prototype, "tenant", void 0);
exports.TenantDatabase = TenantDatabase = __decorate([
    (0, typeorm_1.Entity)('tenant_databases')
], TenantDatabase);
//# sourceMappingURL=tenant-database.entity.js.map