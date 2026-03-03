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
exports.TenantsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const uuid_1 = require("uuid");
const bcrypt = __importStar(require("bcrypt"));
const tenant_entity_1 = require("../../../entities/master/tenant.entity");
const enums_1 = require("../../../common/enums");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const tenant_database_entity_1 = require("../../../entities/master/tenant-database.entity");
const tenant_user_entity_1 = require("../../../entities/master/tenant-user.entity");
let TenantsService = class TenantsService {
    tenantRepository;
    tenantDatabaseRepository;
    tenantUserRepository;
    subscriptionRepository;
    configService;
    constructor(tenantRepository, tenantDatabaseRepository, tenantUserRepository, subscriptionRepository, configService) {
        this.tenantRepository = tenantRepository;
        this.tenantDatabaseRepository = tenantDatabaseRepository;
        this.tenantUserRepository = tenantUserRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.configService = configService;
    }
    async create(createTenantDto) {
        const existingCode = await this.tenantRepository.findOne({
            where: { tenantCode: createTenantDto.tenantCode },
        });
        if (existingCode) {
            throw new common_1.ConflictException(`Tenant with code ${createTenantDto.tenantCode} already exists`);
        }
        const existingEmail = await this.tenantRepository.findOne({
            where: { email: createTenantDto.email },
        });
        if (existingEmail) {
            throw new common_1.ConflictException(`Tenant with email ${createTenantDto.email} already exists`);
        }
        const databaseName = `tenant_${createTenantDto.tenantCode.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        const tenant = this.tenantRepository.create({
            id: (0, uuid_1.v4)(),
            tenantCode: createTenantDto.tenantCode,
            companyName: createTenantDto.companyName,
            displayName: createTenantDto.displayName || createTenantDto.companyName,
            email: createTenantDto.email,
            phone: createTenantDto.phone,
            website: createTenantDto.website,
            addressLine1: createTenantDto.addressLine1,
            addressLine2: createTenantDto.addressLine2,
            city: createTenantDto.city,
            state: createTenantDto.state,
            country: createTenantDto.country || 'Bangladesh',
            postalCode: createTenantDto.postalCode,
            taxId: createTenantDto.taxId,
            industry: createTenantDto.industry,
            employeeCount: createTenantDto.employeeCount,
            timezone: createTenantDto.timezone || 'Asia/Kolkata',
            dateFormat: createTenantDto.dateFormat || 'DD/MM/YYYY',
            currency: createTenantDto.currency || 'INR',
            logoUrl: createTenantDto.logoUrl,
            status: enums_1.TenantStatus.PENDING,
        });
        const savedTenant = await this.tenantRepository.save(tenant);
        const tenantDatabase = this.tenantDatabaseRepository.create({
            id: (0, uuid_1.v4)(),
            tenantId: savedTenant.id,
            databaseName,
            host: this.configService.get('DB_HOST', 'localhost'),
            port: this.configService.get('DB_PORT', 3306),
            username: `tenant_${createTenantDto.tenantCode.toLowerCase()}`,
            isProvisioned: false,
            isActive: false,
        });
        await this.tenantDatabaseRepository.save(tenantDatabase);
        const passwordHash = await bcrypt.hash(createTenantDto.adminPassword, 10);
        const adminUser = this.tenantUserRepository.create({
            id: (0, uuid_1.v4)(),
            tenantId: savedTenant.id,
            email: createTenantDto.adminEmail || createTenantDto.email,
            passwordHash,
            firstName: createTenantDto.adminFirstName || 'Admin',
            lastName: createTenantDto.adminLastName,
            isAdmin: true,
            isActive: true,
        });
        await this.tenantUserRepository.save(adminUser);
        if (createTenantDto.planId) {
            const trialEndDate = new Date();
            trialEndDate.setDate(trialEndDate.getDate() + 14);
            const subscription = this.subscriptionRepository.create({
                id: (0, uuid_1.v4)(),
                tenantId: savedTenant.id,
                planId: createTenantDto.planId,
                status: enums_1.SubscriptionStatus.TRIAL,
                startDate: new Date(),
                trialEndDate,
                currentPeriodStart: new Date(),
                currentPeriodEnd: trialEndDate,
            });
            await this.subscriptionRepository.save(subscription);
        }
        return this.findById(savedTenant.id);
    }
    async provisionDatabase(tenantId) {
        const tenant = await this.findById(tenantId);
        const tenantDb = await this.tenantDatabaseRepository.findOne({
            where: { tenantId },
        });
        if (!tenantDb) {
            throw new common_1.NotFoundException('Tenant database configuration not found');
        }
        if (tenantDb.isProvisioned) {
            throw new common_1.BadRequestException('Database is already provisioned');
        }
        tenantDb.isProvisioned = true;
        tenantDb.isActive = true;
        tenantDb.provisionedAt = new Date();
        await this.tenantDatabaseRepository.save(tenantDb);
        tenant.status = enums_1.TenantStatus.ACTIVE;
        tenant.activatedAt = new Date();
        await this.tenantRepository.save(tenant);
    }
    async findAll(paginationDto, filterDto) {
        const queryBuilder = this.tenantRepository
            .createQueryBuilder('tenant')
            .leftJoinAndSelect('tenant.database', 'database')
            .leftJoinAndSelect('tenant.subscription', 'subscription')
            .leftJoinAndSelect('subscription.plan', 'plan');
        if (filterDto.status) {
            queryBuilder.andWhere('tenant.status = :status', {
                status: filterDto.status,
            });
        }
        if (filterDto.industry) {
            queryBuilder.andWhere('tenant.industry = :industry', {
                industry: filterDto.industry,
            });
        }
        if (filterDto.country) {
            queryBuilder.andWhere('tenant.country = :country', {
                country: filterDto.country,
            });
        }
        if (paginationDto.search) {
            queryBuilder.andWhere('(tenant.tenantCode LIKE :search OR tenant.companyName LIKE :search OR tenant.email LIKE :search)', { search: `%${paginationDto.search}%` });
        }
        const sortBy = paginationDto.sortBy || 'createdAt';
        const sortOrder = paginationDto.sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        queryBuilder.orderBy(`tenant.${sortBy}`, sortOrder);
        const total = await queryBuilder.getCount();
        const page = paginationDto.page || 1;
        const limit = paginationDto.limit || 20;
        queryBuilder.skip((page - 1) * limit).take(limit);
        const data = await queryBuilder.getMany();
        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPreviousPage: page > 1,
            },
        };
    }
    async findById(id) {
        const tenant = await this.tenantRepository.findOne({
            where: { id },
            relations: ['database', 'subscription', 'subscription.plan', 'users'],
        });
        if (!tenant) {
            throw new common_1.NotFoundException(`Tenant with ID ${id} not found`);
        }
        return tenant;
    }
    async findByCode(code) {
        return this.tenantRepository.findOne({
            where: { tenantCode: code },
            relations: ['database', 'subscription'],
        });
    }
    async findByEmail(email) {
        return this.tenantRepository.findOne({
            where: { email },
        });
    }
    async update(id, updateTenantDto) {
        const tenant = await this.findById(id);
        if (updateTenantDto.tenantCode &&
            updateTenantDto.tenantCode !== tenant.tenantCode) {
            const existingCode = await this.tenantRepository.findOne({
                where: { tenantCode: updateTenantDto.tenantCode },
            });
            if (existingCode) {
                throw new common_1.ConflictException(`Tenant with code ${updateTenantDto.tenantCode} already exists`);
            }
        }
        Object.assign(tenant, updateTenantDto);
        await this.tenantRepository.save(tenant);
        return this.findById(id);
    }
    async activate(id) {
        const tenant = await this.findById(id);
        if (tenant.status === enums_1.TenantStatus.ACTIVE) {
            throw new common_1.BadRequestException('Tenant is already active');
        }
        if (!tenant.database?.isProvisioned) {
            throw new common_1.BadRequestException('Database must be provisioned before activation');
        }
        tenant.status = enums_1.TenantStatus.ACTIVE;
        tenant.activatedAt = new Date();
        await this.tenantRepository.save(tenant);
        return this.findById(id);
    }
    async suspend(id, reason) {
        const tenant = await this.findById(id);
        if (tenant.status === enums_1.TenantStatus.SUSPENDED) {
            throw new common_1.BadRequestException('Tenant is already suspended');
        }
        tenant.status = enums_1.TenantStatus.SUSPENDED;
        tenant.suspendedAt = new Date();
        tenant.suspendedReason = reason;
        await this.tenantRepository.save(tenant);
        if (tenant.database) {
            tenant.database.isActive = false;
            await this.tenantDatabaseRepository.save(tenant.database);
        }
        return this.findById(id);
    }
    async reactivate(id) {
        const tenant = await this.findById(id);
        if (tenant.status !== enums_1.TenantStatus.SUSPENDED) {
            throw new common_1.BadRequestException('Tenant is not suspended');
        }
        tenant.status = enums_1.TenantStatus.ACTIVE;
        await this.tenantRepository.save(tenant);
        if (tenant.database) {
            tenant.database.isActive = true;
            await this.tenantDatabaseRepository.save(tenant.database);
        }
        return this.findById(id);
    }
    async remove(id) {
        const tenant = await this.findById(id);
        tenant.status = enums_1.TenantStatus.DELETED;
        tenant.deletedAt = new Date();
        await this.tenantRepository.save(tenant);
        if (tenant.database) {
            tenant.database.isActive = false;
            await this.tenantDatabaseRepository.save(tenant.database);
        }
    }
    async getUsers(tenantId) {
        return this.tenantUserRepository.find({
            where: { tenantId },
            order: { createdAt: 'DESC' },
        });
    }
    async addUser(tenantId, userData) {
        await this.findById(tenantId);
        const existingUser = await this.tenantUserRepository.findOne({
            where: { tenantId, email: userData.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists for this tenant');
        }
        const passwordHash = await bcrypt.hash(userData.password, 10);
        const user = this.tenantUserRepository.create({
            id: (0, uuid_1.v4)(),
            tenantId,
            email: userData.email,
            passwordHash,
            firstName: userData.firstName,
            lastName: userData.lastName,
            isAdmin: userData.isAdmin || false,
            isActive: true,
        });
        return this.tenantUserRepository.save(user);
    }
    async getStatistics() {
        const total = await this.tenantRepository.count();
        const active = await this.tenantRepository.count({
            where: { status: enums_1.TenantStatus.ACTIVE },
        });
        const suspended = await this.tenantRepository.count({
            where: { status: enums_1.TenantStatus.SUSPENDED },
        });
        const pending = await this.tenantRepository.count({
            where: { status: enums_1.TenantStatus.PENDING },
        });
        const byIndustry = await this.tenantRepository
            .createQueryBuilder('tenant')
            .select('tenant.industry', 'industry')
            .addSelect('COUNT(*)', 'count')
            .where('tenant.industry IS NOT NULL')
            .groupBy('tenant.industry')
            .getRawMany();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentSignups = await this.tenantRepository.count({
            where: {
                createdAt: thirtyDaysAgo,
            },
        });
        return {
            total,
            active,
            suspended,
            pending,
            recentSignups,
            byIndustry,
        };
    }
};
exports.TenantsService = TenantsService;
exports.TenantsService = TenantsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tenant_entity_1.Tenant, 'master')),
    __param(1, (0, typeorm_1.InjectRepository)(tenant_database_entity_1.TenantDatabase, 'master')),
    __param(2, (0, typeorm_1.InjectRepository)(tenant_user_entity_1.TenantUser, 'master')),
    __param(3, (0, typeorm_1.InjectRepository)(rxjs_1.Subscription, 'master')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService])
], TenantsService);
//# sourceMappingURL=tenants.service.js.map