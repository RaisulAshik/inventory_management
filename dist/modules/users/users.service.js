"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const uuid_1 = require("uuid");
const tenant_connection_manager_1 = require("../../database/tenant-connection.manager");
const user_entity_1 = require("../../entities/tenant/user/user.entity");
const user_role_entity_1 = require("../../entities/tenant/user/user-role.entity");
const permission_entity_1 = require("../../entities/tenant/role/permission.entity");
const role_permission_entity_1 = require("../../entities/tenant/role/role-permission.entity");
const pagination_util_1 = require("../../common/utils/pagination.util");
const typeorm_2 = require("@nestjs/typeorm");
const master_1 = require("../../entities/master");
let UsersService = class UsersService {
    tenantConnectionManager;
    tenantUserRepository;
    constructor(tenantConnectionManager, tenantUserRepository) {
        this.tenantConnectionManager = tenantConnectionManager;
        this.tenantUserRepository = tenantUserRepository;
    }
    async getUserRepository() {
        return this.tenantConnectionManager.getRepository(user_entity_1.User);
    }
    async create(tenantId, createUserDto) {
        const userRepo = await this.getUserRepository();
        const existingUser = await userRepo.findOne({
            where: { email: createUserDto.email },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('Email already exists');
        }
        let passwordHash = createUserDto.passwordHash;
        if (!passwordHash && createUserDto.password) {
            passwordHash = await bcrypt.hash(createUserDto.password, 10);
        }
        const user = userRepo.create({
            id: (0, uuid_1.v4)(),
            email: createUserDto.email,
            passwordHash,
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            employeeCode: createUserDto.employeeCode,
            phone: createUserDto.phone,
            isActive: true,
        });
        const savedUser = await userRepo.save(user);
        const tenantUser = this.tenantUserRepository.create({
            tenantId: tenantId,
            email: createUserDto.email.toLowerCase(),
            passwordHash,
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            phone: createUserDto.phone,
            isAdmin: false,
            isActive: true,
            emailVerified: false,
        });
        await this.tenantUserRepository.save(tenantUser);
        if (createUserDto.roleIds?.length) {
            await this.assignRoles(savedUser.id, createUserDto.roleIds, createUserDto?.createdBy);
        }
        return savedUser;
    }
    async findAll(paginationDto) {
        const userRepo = await this.getUserRepository();
        const queryBuilder = userRepo
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.userRoles', 'userRoles')
            .leftJoinAndSelect('userRoles.role', 'role')
            .where('user.deletedAt IS NULL');
        if (paginationDto.search) {
            queryBuilder.andWhere('(user.firstName LIKE :search OR user.lastName LIKE :search OR user.email LIKE :search)', { search: `%${paginationDto.search}%` });
        }
        if (!paginationDto.sortBy) {
            paginationDto.sortBy = 'createdAt';
        }
        return (0, pagination_util_1.paginate)(queryBuilder, paginationDto);
    }
    async findById(id) {
        const userRepo = await this.getUserRepository();
        const user = await userRepo.findOne({
            where: { id },
            relations: ['userRoles', 'userRoles.role'],
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async findByEmail(email) {
        const userRepo = await this.getUserRepository();
        return userRepo.findOne({
            where: { email },
            relations: ['userRoles', 'userRoles.role'],
        });
    }
    async update(id, updateUserDto) {
        const userRepo = await this.getUserRepository();
        const user = await this.findById(id);
        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingUser = await userRepo.findOne({
                where: { email: updateUserDto.email },
            });
            if (existingUser) {
                throw new common_1.BadRequestException('Email already exists');
            }
        }
        Object.assign(user, updateUserDto);
        return userRepo.save(user);
    }
    async remove(id) {
        const userRepo = await this.getUserRepository();
        const user = await this.findById(id);
        user.deletedAt = new Date();
        await userRepo.save(user);
    }
    async hardDelete(id) {
        const userRepo = await this.getUserRepository();
        await userRepo.delete(id);
    }
    async getUserRoles(userId) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const userRoleRepo = dataSource.getRepository(user_role_entity_1.UserRole);
        const userRoles = await userRoleRepo.find({
            where: { userId },
            relations: ['role'],
        });
        return userRoles.map((ur) => ur.role.roleCode);
    }
    async getUserPermissions(userId) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const permissions = await dataSource
            .createQueryBuilder()
            .select('DISTINCT p.permission_code', 'permissionCode')
            .from(permission_entity_1.Permission, 'p')
            .innerJoin(role_permission_entity_1.RolePermission, 'rp', 'rp.permission_id = p.id')
            .innerJoin(user_role_entity_1.UserRole, 'ur', 'ur.role_id = rp.role_id')
            .where('ur.user_id = :userId', { userId })
            .getRawMany();
        return permissions.map((p) => p.permissionCode);
    }
    async assignRoles(userId, roleIds, assignedBy) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const userRoleRepo = dataSource.getRepository(user_role_entity_1.UserRole);
        await userRoleRepo.delete({ userId });
        const userRoles = roleIds.map((roleId) => userRoleRepo.create({
            id: (0, uuid_1.v4)(),
            userId,
            roleId,
            assignedBy,
        }));
        await userRoleRepo.save(userRoles);
    }
    async updateLastLogin(userId, ipAddress) {
        const userRepo = await this.getUserRepository();
        await userRepo.update(userId, {
            lastLoginAt: new Date(),
            lastLoginIp: ipAddress,
        });
    }
    async incrementFailedLoginAttempts(userId) {
        const userRepo = await this.getUserRepository();
        const user = await this.findById(userId);
        user.failedLoginAttempts += 1;
        if (user.failedLoginAttempts >= 5) {
            user.lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
        }
        await userRepo.save(user);
    }
    async resetFailedLoginAttempts(userId) {
        const userRepo = await this.getUserRepository();
        const user = await this.findById(userId);
        user.failedLoginAttempts = 0;
        user.lockedUntil = null;
        await userRepo.save(user);
    }
    async updatePassword(userId, passwordHash) {
        const userRepo = await this.getUserRepository();
        await userRepo.update(userId, {
            passwordHash,
            passwordChangedAt: new Date(),
        });
    }
    async activate(id) {
        return this.update(id, { isActive: true });
    }
    async deactivate(id) {
        return this.update(id, { isActive: false });
    }
    async count() {
        const userRepo = await this.getUserRepository();
        return userRepo.count({ where: { deletedAt: (0, typeorm_1.IsNull)() } });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_2.InjectRepository)(master_1.TenantUser, 'master')),
    __metadata("design:paramtypes", [tenant_connection_manager_1.TenantConnectionManager,
        typeorm_1.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map