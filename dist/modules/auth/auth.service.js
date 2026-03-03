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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcrypt"));
const uuid_1 = require("uuid");
const users_service_1 = require("../users/users.service");
const tenant_connection_manager_1 = require("../../database/tenant-connection.manager");
const user_session_entity_1 = require("../../entities/tenant/user/user-session.entity");
let AuthService = class AuthService {
    jwtService;
    configService;
    usersService;
    tenantConnectionManager;
    constructor(jwtService, configService, usersService, tenantConnectionManager) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.usersService = usersService;
        this.tenantConnectionManager = tenantConnectionManager;
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            return null;
        }
        if (user.isLocked) {
            throw new common_1.UnauthorizedException('Account is temporarily locked. Please try again later.');
        }
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            await this.usersService.incrementFailedLoginAttempts(user.id);
            return null;
        }
        if (user.failedLoginAttempts > 0) {
            await this.usersService.resetFailedLoginAttempts(user.id);
        }
        return user;
    }
    async login(loginDto, ipAddress, userAgent) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Account is disabled');
        }
        const roles = await this.usersService.getUserRoles(user.id);
        const permissions = await this.usersService.getUserPermissions(user.id);
        const tokens = await this.generateTokens(user, roles, permissions);
        console.log(roles, 'user roles');
        await this.createSession(user.id, tokens.accessToken, tokens.refreshToken, ipAddress, userAgent);
        await this.usersService.updateLastLogin(user.id, ipAddress);
        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                fullName: user.fullName,
                roles,
                permissions,
            },
            tokens,
        };
    }
    async register(tenantId, registerDto) {
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new common_1.BadRequestException('Email already registered');
        }
        const saltRounds = this.configService.get('BCRYPT_SALT_ROUNDS', 10);
        const passwordHash = await bcrypt.hash(registerDto.password, saltRounds);
        const user = await this.usersService.create(tenantId, {
            ...registerDto,
            passwordHash,
        });
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        };
    }
    async refreshToken(refreshTokenDto) {
        const { refreshToken } = refreshTokenDto;
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('jwt.secret'),
            });
            const dataSource = await this.tenantConnectionManager.getDataSource();
            const sessionRepo = dataSource.getRepository(user_session_entity_1.UserSession);
            const refreshTokenHash = await this.hashToken(refreshToken);
            const session = await sessionRepo.findOne({
                where: {
                    userId: payload.sub,
                    refreshTokenHash,
                },
            });
            if (!session || session.refreshExpiresAt < new Date()) {
                throw new common_1.UnauthorizedException('Invalid or expired refresh token');
            }
            const user = await this.usersService.findById(payload.sub);
            if (!user || !user.isActive) {
                throw new common_1.UnauthorizedException('User not found or inactive');
            }
            const roles = await this.usersService.getUserRoles(user.id);
            const permissions = await this.usersService.getUserPermissions(user.id);
            const tokens = await this.generateTokens(user, roles, permissions);
            session.tokenHash = await this.hashToken(tokens.accessToken);
            session.refreshTokenHash = await this.hashToken(tokens.refreshToken);
            session.expiresAt = new Date(Date.now() + this.getTokenExpirationMs('access'));
            session.refreshExpiresAt = new Date(Date.now() + this.getTokenExpirationMs('refresh'));
            session.lastActivityAt = new Date();
            await sessionRepo.save(session);
            return { tokens };
        }
        catch (error) {
            console.log(error);
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
    }
    async logout(userId, accessToken) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const sessionRepo = dataSource.getRepository(user_session_entity_1.UserSession);
        const tokenHash = await this.hashToken(accessToken);
        await sessionRepo.delete({
            userId,
            tokenHash,
        });
        return { message: 'Logged out successfully' };
    }
    async logoutAll(userId) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const sessionRepo = dataSource.getRepository(user_session_entity_1.UserSession);
        await sessionRepo.delete({ userId });
        return { message: 'Logged out from all devices' };
    }
    async changePassword(userId, changePasswordDto) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        const isCurrentPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.passwordHash);
        if (!isCurrentPasswordValid) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        const saltRounds = this.configService.get('BCRYPT_SALT_ROUNDS', 10);
        const newPasswordHash = await bcrypt.hash(changePasswordDto.newPassword, saltRounds);
        await this.usersService.updatePassword(userId, newPasswordHash);
        await this.logoutAll(userId);
        return { message: 'Password changed successfully. Please login again.' };
    }
    async generateTokens(user, roles, permissions) {
        const payload = {
            sub: user.id,
            email: user.email,
            tenantId: '',
            roles,
            permissions,
        };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: await this.configService.get('jwt.accessExpiration'),
        });
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: await this.configService.get('jwt.refreshExpiration'),
        });
        return {
            accessToken,
            refreshToken,
            expiresIn: this.getTokenExpirationMs('access'),
        };
    }
    async createSession(userId, accessToken, refreshToken, ipAddress, userAgent) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const sessionRepo = dataSource.getRepository(user_session_entity_1.UserSession);
        const session = sessionRepo.create({
            id: (0, uuid_1.v4)(),
            userId,
            tokenHash: await this.hashToken(accessToken),
            refreshTokenHash: await this.hashToken(refreshToken),
            ipAddress,
            deviceType: this.parseDeviceType(userAgent),
            browser: this.parseBrowser(userAgent),
            os: this.parseOS(userAgent),
            expiresAt: new Date(Date.now() + this.getTokenExpirationMs('access')),
            refreshExpiresAt: new Date(Date.now() + this.getTokenExpirationMs('refresh')),
            lastActivityAt: new Date(),
        });
        await sessionRepo.save(session);
    }
    async hashToken(token) {
        const crypto = await Promise.resolve().then(() => __importStar(require('crypto')));
        return crypto.createHash('sha256').update(token).digest('hex');
    }
    getTokenExpirationMs(type) {
        const expiration = this.configService.get(type === 'access' ? 'jwt.accessExpiration' : 'jwt.refreshExpiration');
        const match = expiration.match(/^(\d+)([smhd])$/);
        if (!match)
            return 900000;
        const value = parseInt(match[1], 10);
        const unit = match[2];
        const multipliers = {
            s: 1000,
            m: 60 * 1000,
            h: 60 * 60 * 1000,
            d: 24 * 60 * 60 * 1000,
        };
        return value * (multipliers[unit] || 60000);
    }
    parseDeviceType(userAgent) {
        if (/mobile/i.test(userAgent))
            return 'MOBILE';
        if (/tablet/i.test(userAgent))
            return 'TABLET';
        return 'DESKTOP';
    }
    parseBrowser(userAgent) {
        if (/chrome/i.test(userAgent))
            return 'Chrome';
        if (/firefox/i.test(userAgent))
            return 'Firefox';
        if (/safari/i.test(userAgent))
            return 'Safari';
        if (/edge/i.test(userAgent))
            return 'Edge';
        return 'Unknown';
    }
    parseOS(userAgent) {
        if (/windows/i.test(userAgent))
            return 'Windows';
        if (/mac/i.test(userAgent))
            return 'macOS';
        if (/linux/i.test(userAgent))
            return 'Linux';
        if (/android/i.test(userAgent))
            return 'Android';
        if (/ios/i.test(userAgent))
            return 'iOS';
        return 'Unknown';
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService,
        users_service_1.UsersService,
        tenant_connection_manager_1.TenantConnectionManager])
], AuthService);
//# sourceMappingURL=auth.service.js.map