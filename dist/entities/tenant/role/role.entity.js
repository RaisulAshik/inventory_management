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
exports.Role = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const role_permission_entity_1 = require("./role-permission.entity");
const user_role_entity_1 = require("../user/user-role.entity");
let Role = class Role {
    id;
    roleCode;
    roleName;
    description;
    isSystem;
    isActive;
    createdAt;
    updatedAt;
    rolePermissions;
    userRoles;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, roleCode: { required: true, type: () => String }, roleName: { required: true, type: () => String }, description: { required: true, type: () => String }, isSystem: { required: true, type: () => Boolean }, isActive: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, rolePermissions: { required: true, type: () => [require("./role-permission.entity").RolePermission] }, userRoles: { required: true, type: () => [require("../user/user-role.entity").UserRole] } };
    }
};
exports.Role = Role;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Role.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'role_code', length: 50, unique: true }),
    __metadata("design:type", String)
], Role.prototype, "roleCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'role_name', length: 100 }),
    __metadata("design:type", String)
], Role.prototype, "roleName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Role.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_system', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], Role.prototype, "isSystem", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], Role.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Role.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Role.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => role_permission_entity_1.RolePermission, (rp) => rp.role),
    __metadata("design:type", Array)
], Role.prototype, "rolePermissions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_role_entity_1.UserRole, (ur) => ur.role),
    __metadata("design:type", Array)
], Role.prototype, "userRoles", void 0);
exports.Role = Role = __decorate([
    (0, typeorm_1.Entity)('roles')
], Role);
//# sourceMappingURL=role.entity.js.map