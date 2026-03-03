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
var AdminAuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const tenant_user_entity_1 = require("../../entities/master/tenant-user.entity");
const tenant_entity_1 = require("../../entities/master/tenant.entity");
const tenant_database_entity_1 = require("../../entities/master/tenant-database.entity");
const config_1 = require("@nestjs/config");
const tenant_provisioning_service_1 = require("./services/tenant-provisioning.service");
const enums_1 = require("../../common/enums");
let AdminAuthService = AdminAuthService_1 = class AdminAuthService {
    tenantUserRepository;
    tenantRepository;
    tenantDatabaseRepository;
    jwtService;
    configService;
    tenantProvisioningService;
    logger = new common_1.Logger(AdminAuthService_1.name);
    constructor(tenantUserRepository, tenantRepository, tenantDatabaseRepository, jwtService, configService, tenantProvisioningService) {
        this.tenantUserRepository = tenantUserRepository;
        this.tenantRepository = tenantRepository;
        this.tenantDatabaseRepository = tenantDatabaseRepository;
        this.jwtService = jwtService;
        this.configService = configService;
        this.tenantProvisioningService = tenantProvisioningService;
    }
    async validateUser(email, password) {
        const user = await this.tenantUserRepository.findOne({
            where: { email: email.toLowerCase() },
            relations: ['tenant'],
        });
        if (!user) {
            return null;
        }
        if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
            throw new common_1.UnauthorizedException(`Account is locked. Please try again after ${user.lockedUntil.toLocaleString()}`);
        }
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
            if (user.failedLoginAttempts >= 5) {
                user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
            }
            await this.tenantUserRepository.save(user);
            return null;
        }
        if (user.failedLoginAttempts > 0) {
            user.failedLoginAttempts = 0;
            user.lockedUntil = null;
            await this.tenantUserRepository.save(user);
        }
        return user;
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Your account has been deactivated');
        }
        const tenant = await this.tenantRepository.findOne({
            where: { id: user.tenantId },
        });
        if (!tenant) {
            throw new common_1.UnauthorizedException('Tenant not found');
        }
        if (tenant.status !== enums_1.TenantStatus.ACTIVE &&
            tenant.status !== enums_1.TenantStatus.PENDING) {
            throw new common_1.UnauthorizedException(`Tenant account is ${tenant.status.toLowerCase()}. Please contact support.`);
        }
        const tenantDatabase = await this.tenantDatabaseRepository.findOne({
            where: { tenantId: tenant.id },
        });
        if (!tenantDatabase) {
            throw new common_1.UnauthorizedException('Tenant database configuration not found');
        }
        if (!tenantDatabase.isProvisioned || !tenantDatabase.isActive) {
            throw new common_1.UnauthorizedException('Tenant database is not ready. Please contact support.');
        }
        user.lastLoginAt = new Date();
        await this.tenantUserRepository.save(user);
        const tokens = await this.generateTokens(user, tenant, tenantDatabase);
        return {
            ...tokens,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isAdmin: user.isAdmin,
            },
            tenant: {
                id: tenant.id,
                tenantCode: tenant.tenantCode,
                companyName: tenant.companyName,
                status: tenant.status,
                database: tenantDatabase.databaseName,
            },
        };
    }
    async generateTokens(user, tenant, tenantDatabase) {
        const payload = {
            sub: user.id,
            email: user.email,
            tenantId: tenant.id,
            tenantCode: tenant.tenantCode,
            tenantDatabase: tenantDatabase.databaseName,
            isAdmin: user.isAdmin,
            type: 'admin',
        };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                expiresIn: this.configService.get('jwt.expiresIn', '1h'),
            }),
            this.jwtService.signAsync({ ...payload, tokenType: 'refresh' }, {
                expiresIn: this.configService.get('jwt.refreshExpiresIn', '7d'),
            }),
        ]);
        return { accessToken, refreshToken };
    }
    async refreshToken(refreshToken) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken);
            if (payload.tokenType !== 'refresh') {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const user = await this.tenantUserRepository.findOne({
                where: { id: payload.sub },
                relations: ['tenant'],
            });
            if (!user || !user.isActive) {
                throw new common_1.UnauthorizedException('User not found or inactive');
            }
            const tenant = await this.tenantRepository.findOne({
                where: { id: payload.tenantId },
            });
            const tenantDatabase = await this.tenantDatabaseRepository.findOne({
                where: { tenantId: payload.tenantId },
            });
            if (!tenant || !tenantDatabase) {
                throw new common_1.UnauthorizedException('Tenant not found');
            }
            return this.generateTokens(user, tenant, tenantDatabase);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
    }
    async register(registerDto) {
        this.logger.log(`Starting tenant registration for: ${registerDto.tenantCode}`);
        const existingTenant = await this.tenantRepository.findOne({
            where: { tenantCode: registerDto.tenantCode.toUpperCase() },
        });
        if (existingTenant) {
            throw new common_1.ConflictException('Tenant code already exists');
        }
        const existingUser = await this.tenantUserRepository.findOne({
            where: { email: registerDto.email.toLowerCase() },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email already registered');
        }
        const databaseName = `erp_tenant_${registerDto.tenantCode.toLowerCase()}`;
        try {
            this.logger.log('Creating tenant record...');
            const tenant = this.tenantRepository.create({
                tenantCode: registerDto.tenantCode.toUpperCase(),
                companyName: registerDto.companyName,
                email: registerDto.email.toLowerCase(),
                phone: registerDto.phone,
                industry: registerDto.industry,
                country: registerDto.country || 'India',
                timezone: registerDto.timezone || 'Asia/Kolkata',
                currency: registerDto.currency || 'INR',
                status: 'PENDING',
            });
            const savedTenant = await this.tenantRepository.save(tenant);
            this.logger.log(`Tenant created with ID: ${savedTenant.id}`);
            this.logger.log('Creating tenant database record...');
            const tenantDatabase = this.tenantDatabaseRepository.create({
                tenantId: savedTenant.id,
                databaseName,
                host: this.configService.get('masterDb.host', 'localhost'),
                port: this.configService.get('masterDb.port', 3306),
                username: this.configService.get('masterDb.username', 'root'),
                isProvisioned: false,
                isActive: false,
            });
            const savedTenantDatabase = await this.tenantDatabaseRepository.save(tenantDatabase);
            this.logger.log(`Tenant database record created: ${databaseName}`);
            this.logger.log('Provisioning tenant database...');
            await this.tenantProvisioningService.provisionTenant(databaseName);
            savedTenantDatabase.isProvisioned = true;
            savedTenantDatabase.isActive = true;
            savedTenantDatabase.provisionedAt = new Date();
            await this.tenantDatabaseRepository.save(savedTenantDatabase);
            this.logger.log('Tenant database provisioned and activated');
            this.logger.log('Creating admin user...');
            const passwordHash = await bcrypt.hash(registerDto.password, 10);
            const user = this.tenantUserRepository.create({
                tenantId: savedTenant.id,
                email: registerDto.email.toLowerCase(),
                passwordHash,
                firstName: registerDto.firstName,
                lastName: registerDto.lastName,
                phone: registerDto.phone,
                isAdmin: true,
                isActive: true,
                emailVerified: false,
            });
            const savedUser = await this.tenantUserRepository.save(user);
            this.logger.log(`Admin user created: ${savedUser.email}`);
            savedTenant.status = enums_1.TenantStatus.ACTIVE;
            savedTenant.activatedAt = new Date();
            await this.tenantRepository.save(savedTenant);
            this.logger.log('Tenant activated');
            const tokens = await this.generateTokens(savedUser, savedTenant, savedTenantDatabase);
            this.logger.log(`Tenant registration completed: ${registerDto.tenantCode}`);
            return {
                ...tokens,
                user: {
                    id: savedUser.id,
                    email: savedUser.email,
                    firstName: savedUser.firstName,
                    lastName: savedUser.lastName,
                    isAdmin: savedUser.isAdmin,
                },
                tenant: {
                    id: savedTenant.id,
                    tenantCode: savedTenant.tenantCode,
                    companyName: savedTenant.companyName,
                    status: savedTenant.status,
                    database: savedTenantDatabase.databaseName,
                },
            };
        }
        catch (error) {
            this.logger.error(`Tenant registration failed: ${error.message}`, error.stack);
            try {
                await this.tenantProvisioningService.dropTenantDatabase(databaseName);
            }
            catch (cleanupError) {
                this.logger.warn(`Cleanup failed: ${cleanupError.message}`);
            }
            await this.tenantDatabaseRepository.delete({ databaseName });
            await this.tenantRepository.delete({
                tenantCode: registerDto.tenantCode.toUpperCase(),
            });
            throw error;
        }
    }
    async getProfile(userId) {
        const user = await this.tenantUserRepository.findOne({
            where: { id: userId },
            relations: ['tenant'],
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const tenantDatabase = await this.tenantDatabaseRepository.findOne({
            where: { tenantId: user.tenantId },
        });
        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isAdmin: user.isAdmin,
                lastLoginAt: user.lastLoginAt,
            },
            tenant: {
                id: user.tenant.id,
                tenantCode: user.tenant.tenantCode,
                companyName: user.tenant.companyName,
                email: user.tenant.email,
                status: user.tenant.status,
                database: tenantDatabase?.databaseName,
            },
        };
    }
    async getUserDetails(userId) {
        const user = await this.tenantUserRepository.findOne({
            where: { id: userId },
            relations: ['tenant'],
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const tenantDatabase = await this.tenantDatabaseRepository.findOne({
            where: { tenantId: user.tenantId },
        });
        return {
            lastSelectedCompany: {
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isAdmin: user.isAdmin,
                    lastLoginAt: user.lastLoginAt,
                },
                tenant: {
                    id: user.tenant.id,
                    tenantCode: user.tenant.tenantCode,
                    companyName: user.tenant.companyName,
                    email: user.tenant.email,
                    status: user.tenant.status,
                    database: tenantDatabase?.databaseName,
                },
            },
        };
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.tenantUserRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        user.passwordHash = await bcrypt.hash(newPassword, 10);
        await this.tenantUserRepository.save(user);
    }
    async forgotPassword(email) {
        const user = await this.tenantUserRepository.findOne({
            where: { email: email.toLowerCase() },
        });
        if (!user) {
            return;
        }
        const resetToken = await bcrypt.hash(Date.now().toString(), 10);
        user.passwordResetToken = resetToken;
        user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
        await this.tenantUserRepository.save(user);
        this.logger.log(`Password reset requested for: ${email}`);
    }
    async resetPassword(email, token, newPassword) {
        const user = await this.tenantUserRepository.findOne({
            where: { email: email.toLowerCase() },
        });
        if (!user || !user.passwordResetToken || !user.passwordResetExpires) {
            throw new common_1.BadRequestException('Invalid reset request');
        }
        if (new Date() > user.passwordResetExpires) {
            throw new common_1.BadRequestException('Password reset token has expired');
        }
        user.passwordHash = await bcrypt.hash(newPassword, 10);
        user.failedLoginAttempts = 0;
        user.lockedUntil = null;
        await this.tenantUserRepository.save(user);
    }
};
exports.AdminAuthService = AdminAuthService;
exports.AdminAuthService = AdminAuthService = AdminAuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tenant_user_entity_1.TenantUser, 'master')),
    __param(1, (0, typeorm_1.InjectRepository)(tenant_entity_1.Tenant, 'master')),
    __param(2, (0, typeorm_1.InjectRepository)(tenant_database_entity_1.TenantDatabase, 'master')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService,
        tenant_provisioning_service_1.TenantProvisioningService])
], AdminAuthService);
//# sourceMappingURL=admin-auth.service.js.map