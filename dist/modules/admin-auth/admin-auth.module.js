"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const tenant_user_entity_1 = require("../../entities/master/tenant-user.entity");
const tenant_entity_1 = require("../../entities/master/tenant.entity");
const tenant_database_entity_1 = require("../../entities/master/tenant-database.entity");
const admin_auth_controller_1 = require("./admin-auth.controller");
const admin_auth_service_1 = require("./admin-auth.service");
const admin_jwt_strategy_1 = require("./strategies/admin-jwt.strategy");
const admin_local_strategy_1 = require("./strategies/admin-local.strategy");
const tenant_provisioning_service_1 = require("./services/tenant-provisioning.service");
let AdminAuthModule = class AdminAuthModule {
};
exports.AdminAuthModule = AdminAuthModule;
exports.AdminAuthModule = AdminAuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule.register({ defaultStrategy: 'admin-jwt' }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    secret: configService.get('jwt.secret'),
                    signOptions: {
                        expiresIn: configService.get('jwt.expiresIn', '1h'),
                    },
                }),
            }),
            typeorm_1.TypeOrmModule.forFeature([tenant_user_entity_1.TenantUser, tenant_entity_1.Tenant, tenant_database_entity_1.TenantDatabase], 'master'),
        ],
        controllers: [admin_auth_controller_1.AdminAuthController],
        providers: [
            admin_auth_service_1.AdminAuthService,
            admin_jwt_strategy_1.AdminJwtStrategy,
            admin_local_strategy_1.AdminLocalStrategy,
            tenant_provisioning_service_1.TenantProvisioningService,
        ],
        exports: [admin_auth_service_1.AdminAuthService, tenant_provisioning_service_1.TenantProvisioningService],
    })
], AdminAuthModule);
//# sourceMappingURL=admin-auth.module.js.map