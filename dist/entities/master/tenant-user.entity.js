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
exports.TenantUser = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const tenant_entity_1 = require("./tenant.entity");
let TenantUser = class TenantUser {
    id;
    tenantId;
    email;
    passwordHash;
    firstName;
    lastName;
    failedLoginAttempts;
    isAdmin;
    lastLoginAt;
    lockedUntil;
    isActive;
    passwordResetToken;
    passwordResetExpires;
    createdAt;
    updatedAt;
    tenant;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, tenantId: { required: true, type: () => String }, email: { required: true, type: () => String }, passwordHash: { required: true, type: () => String }, firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, failedLoginAttempts: { required: true, type: () => Number }, isAdmin: { required: true, type: () => Boolean }, lastLoginAt: { required: true, type: () => Date, nullable: true }, lockedUntil: { required: true, type: () => Date, nullable: true }, isActive: { required: true, type: () => Boolean }, passwordResetToken: { required: true, type: () => String }, passwordResetExpires: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, tenant: { required: true, type: () => require("./tenant.entity").Tenant } };
    }
};
exports.TenantUser = TenantUser;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TenantUser.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tenant_id' }),
    __metadata("design:type", String)
], TenantUser.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, unique: true }),
    __metadata("design:type", String)
], TenantUser.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password_hash', length: 255 }),
    __metadata("design:type", String)
], TenantUser.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'first_name', length: 100 }),
    __metadata("design:type", String)
], TenantUser.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_name', length: 100, nullable: true }),
    __metadata("design:type", String)
], TenantUser.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'failed_login_attempts', default: 0 }),
    __metadata("design:type", Number)
], TenantUser.prototype, "failedLoginAttempts", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_admin', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], TenantUser.prototype, "isAdmin", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_login_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], TenantUser.prototype, "lastLoginAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'locked_until', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], TenantUser.prototype, "lockedUntil", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], TenantUser.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password_reset_token', length: 255, nullable: true }),
    __metadata("design:type", String)
], TenantUser.prototype, "passwordResetToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password_reset_expires', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], TenantUser.prototype, "passwordResetExpires", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], TenantUser.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], TenantUser.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tenant_entity_1.Tenant, (tenant) => tenant.users, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'tenant_id' }),
    __metadata("design:type", tenant_entity_1.Tenant)
], TenantUser.prototype, "tenant", void 0);
exports.TenantUser = TenantUser = __decorate([
    (0, typeorm_1.Entity)('tenant_users')
], TenantUser);
//# sourceMappingURL=tenant-user.entity.js.map