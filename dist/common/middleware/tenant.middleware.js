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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var TenantMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantMiddleware = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const enums_1 = require("../enums");
const tenant_entity_1 = require("../../entities/master/tenant.entity");
const tenant_database_entity_1 = require("../../entities/master/tenant-database.entity");
let TenantMiddleware = TenantMiddleware_1 = class TenantMiddleware {
    tenantRepository;
    tenantDatabaseRepository;
    jwtService;
    configService;
    logger = new common_1.Logger(TenantMiddleware_1.name);
    constructor(tenantRepository, tenantDatabaseRepository, jwtService, configService) {
        this.tenantRepository = tenantRepository;
        this.tenantDatabaseRepository = tenantDatabaseRepository;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async use(req, res, next) {
        if (this.shouldSkip(req.path)) {
            this.logger.debug(`Skipping tenant middleware for: ${req.path}`);
            return next();
        }
        let tenantContext = this.getTenantFromJwt(req);
        if (!tenantContext) {
            const tenantIdentifier = this.getIdentifier(req);
            if (!tenantIdentifier) {
                throw new common_1.BadRequestException('Tenant identifier is required. Provide X-Tenant-ID header or use a valid authentication token.');
            }
            tenantContext = await this.validateAndGetTenantContext(tenantIdentifier);
        }
        req.tenantContext = tenantContext;
        req.tenantId = tenantContext.tenantId;
        req.tenantCode = tenantContext.tenantCode;
        req.tenantDatabase = tenantContext.tenantDatabase;
        this.logger.debug(`Tenant context set: ${tenantContext.tenantCode} -> ${tenantContext.tenantDatabase}`);
        next();
    }
    getTenantFromJwt(req) {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return null;
        }
        try {
            const token = authHeader.substring(7);
            const secret = this.configService.get('jwt.secret');
            const payload = this.jwtService.verify(token, { secret });
            this.logger.debug(`JWT Payload: ${JSON.stringify(payload)}`);
            if (payload.tenantId && payload.tenantCode && payload.tenantDatabase) {
                return payload;
            }
            if (payload.tenantId || payload.tenantCode) {
                return null;
            }
            return null;
        }
        catch (error) {
            this.logger.debug(`JWT verification failed: ${error.message}`);
            return null;
        }
    }
    getIdentifier(req) {
        const headerId = req.headers['x-tenant-id'];
        if (headerId) {
            this.logger.debug(`Tenant ID from header: ${headerId}`);
            return headerId;
        }
        const authHeader = req.headers.authorization;
        if (authHeader?.startsWith('Bearer ')) {
            try {
                const token = authHeader.substring(7);
                const secret = this.configService.get('jwt.secret');
                const payload = this.jwtService.verify(token, { secret });
                if (payload.tenantCode)
                    return payload.tenantCode;
                if (payload.tenantId)
                    return payload.tenantId;
            }
            catch (e) {
            }
        }
        const host = req.headers.host || '';
        const parts = host.split('.');
        if (parts.length >= 3 && parts[0] !== 'www' && parts[0] !== 'api') {
            this.logger.debug(`Tenant from subdomain: ${parts[0]}`);
            return parts[0];
        }
        const queryTenant = req.query.tenantId;
        if (queryTenant) {
            this.logger.debug(`Tenant from query: ${queryTenant}`);
            return queryTenant;
        }
        return null;
    }
    async validateAndGetTenantContext(identifier) {
        const tenant = await this.tenantRepository.findOne({
            where: [{ id: identifier }, { tenantCode: identifier.toUpperCase() }],
        });
        if (!tenant) {
            throw new common_1.NotFoundException(`Tenant not found: ${identifier}`);
        }
        if (tenant.status !== enums_1.TenantStatus.ACTIVE) {
            throw new common_1.BadRequestException(`Tenant account is ${tenant.status.toLowerCase()}. Please contact support.`);
        }
        const tenantDatabase = await this.tenantDatabaseRepository.findOne({
            where: { tenantId: tenant.id },
        });
        if (!tenantDatabase) {
            throw new common_1.BadRequestException('Tenant database configuration not found. Please contact support.');
        }
        if (!tenantDatabase.isProvisioned || !tenantDatabase.isActive) {
            throw new common_1.BadRequestException('Tenant database is not ready. Please contact support.');
        }
        return {
            tenantId: tenant.id,
            tenantCode: tenant.tenantCode,
            tenantDatabase: tenantDatabase.databaseName,
        };
    }
    shouldSkip(path) {
        const skipPaths = [
            '/api/v1/admin/auth',
            '/admin/auth',
            '/v1/admin',
            '/api/v1/master',
            '/master',
            '/auth/login',
            '/auth/register',
            '/auth/forgot-password',
            '/auth/reset-password',
            '/health',
            '/docs',
            '/api-json',
        ];
        return skipPaths.some((p) => path.startsWith(p) || path.includes(p));
    }
};
exports.TenantMiddleware = TenantMiddleware;
exports.TenantMiddleware = TenantMiddleware = TenantMiddleware_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tenant_entity_1.Tenant, 'master')),
    __param(1, (0, typeorm_1.InjectRepository)(tenant_database_entity_1.TenantDatabase, 'master')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService])
], TenantMiddleware);
//# sourceMappingURL=tenant.middleware.js.map