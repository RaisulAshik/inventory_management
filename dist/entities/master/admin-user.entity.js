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
exports.AdminUser = exports.AdminRole = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
var AdminRole;
(function (AdminRole) {
    AdminRole["SUPER_ADMIN"] = "SUPER_ADMIN";
    AdminRole["ADMIN"] = "ADMIN";
    AdminRole["SUPPORT"] = "SUPPORT";
    AdminRole["BILLING"] = "BILLING";
})(AdminRole || (exports.AdminRole = AdminRole = {}));
let AdminUser = class AdminUser {
    id;
    email;
    passwordHash;
    firstName;
    lastName;
    phone;
    role;
    isActive;
    lastLoginAt;
    lastLoginIp;
    passwordChangedAt;
    createdAt;
    updatedAt;
    get fullName() {
        return `${this.firstName} ${this.lastName ?? ''}`.trim();
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, email: { required: true, type: () => String }, passwordHash: { required: true, type: () => String }, firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, phone: { required: true, type: () => String }, role: { required: true, enum: require("./admin-user.entity").AdminRole }, isActive: { required: true, type: () => Boolean }, lastLoginAt: { required: true, type: () => Date }, lastLoginIp: { required: true, type: () => String }, passwordChangedAt: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.AdminUser = AdminUser;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AdminUser.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, unique: true }),
    __metadata("design:type", String)
], AdminUser.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password_hash', length: 255 }),
    __metadata("design:type", String)
], AdminUser.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'first_name', length: 100 }),
    __metadata("design:type", String)
], AdminUser.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_name', length: 100, nullable: true }),
    __metadata("design:type", String)
], AdminUser.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], AdminUser.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AdminRole,
        default: AdminRole.SUPPORT,
    }),
    __metadata("design:type", String)
], AdminUser.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], AdminUser.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_login_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], AdminUser.prototype, "lastLoginAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_login_ip', length: 45, nullable: true }),
    __metadata("design:type", String)
], AdminUser.prototype, "lastLoginIp", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password_changed_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], AdminUser.prototype, "passwordChangedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], AdminUser.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], AdminUser.prototype, "updatedAt", void 0);
exports.AdminUser = AdminUser = __decorate([
    (0, typeorm_1.Entity)('admin_users')
], AdminUser);
//# sourceMappingURL=admin-user.entity.js.map