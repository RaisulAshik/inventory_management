"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const schedule_1 = require("@nestjs/schedule");
const configuration_1 = require("./config/configuration");
const validation_schema_1 = require("./config/validation.schema");
const database_module_1 = require("./database/database.module");
const master_db_config_1 = require("./database/master-db.config");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const permissions_guard_1 = require("./common/guards/permissions.guard");
const tenant_guard_1 = require("./common/guards/tenant.guard");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const tenant_middleware_1 = require("./common/middleware/tenant.middleware");
const logger_middleware_1 = require("./common/middleware/logger.middleware");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const inventory_module_1 = require("./modules/inventory/inventory.module");
const warehouse_module_1 = require("./modules/warehouse/warehouse.module");
const sales_module_1 = require("./modules/sales/sales.module");
const purchasing_module_1 = require("./modules/purchasing/purchasing.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const master_module_1 = require("./modules/master/master.module");
const admin_auth_module_1 = require("./modules/admin-auth/admin-auth.module");
const customer_group_1 = require("./modules/customer-group");
const quotations_module_1 = require("./modules/quotations/quotations.module");
const accounting_module_1 = require("./modules/accounting/accounting.module");
const financial_module_1 = require("./modules/due-management/financial.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(logger_middleware_1.LoggingMiddleware, tenant_middleware_1.TenantMiddleware)
            .exclude({ path: 'admin/(.*)', method: common_1.RequestMethod.ALL }, { path: 'v1/admin/(.*)', method: common_1.RequestMethod.ALL }, { path: 'api/v1/admin/(.*)', method: common_1.RequestMethod.ALL }, { path: 'master/(.*)', method: common_1.RequestMethod.ALL }, { path: 'v1/master/(.*)', method: common_1.RequestMethod.ALL }, { path: 'api/v1/master/(.*)', method: common_1.RequestMethod.ALL }, { path: 'auth/login', method: common_1.RequestMethod.POST }, { path: 'auth/register', method: common_1.RequestMethod.POST }, { path: 'auth/forgot-password', method: common_1.RequestMethod.POST }, { path: 'auth/reset-password', method: common_1.RequestMethod.POST }, { path: 'v1/auth/login', method: common_1.RequestMethod.POST }, { path: 'v1/auth/register', method: common_1.RequestMethod.POST }, { path: 'api/v1/auth/login', method: common_1.RequestMethod.POST }, { path: 'api/v1/auth/register', method: common_1.RequestMethod.POST }, { path: 'health', method: common_1.RequestMethod.GET }, { path: 'docs', method: common_1.RequestMethod.GET }, { path: 'docs/(.*)', method: common_1.RequestMethod.ALL }, { path: 'api-json', method: common_1.RequestMethod.GET })
            .forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.configuration],
                validationSchema: validation_schema_1.validationSchema,
                envFilePath: ['.env.local', '.env'],
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    name: 'short',
                    ttl: 1000,
                    limit: 10,
                },
                {
                    name: 'medium',
                    ttl: 10000,
                    limit: 50,
                },
                {
                    name: 'long',
                    ttl: 60000,
                    limit: 200,
                },
            ]),
            schedule_1.ScheduleModule.forRoot(),
            typeorm_1.TypeOrmModule.forRootAsync({
                name: 'master',
                imports: [config_1.ConfigModule],
                useFactory: master_db_config_1.getMasterDbConfig,
                inject: [config_1.ConfigService],
            }),
            database_module_1.DatabaseModule,
            admin_auth_module_1.AdminAuthModule,
            master_module_1.MasterModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            inventory_module_1.InventoryModule,
            warehouse_module_1.WarehouseModule,
            sales_module_1.SalesModule,
            purchasing_module_1.PurchasingModule,
            dashboard_module_1.DashboardModule,
            customer_group_1.CustomerGroupsModule,
            quotations_module_1.QuotationsModule,
            accounting_module_1.AccountingModule,
            financial_module_1.FinancialModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: tenant_guard_1.TenantGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: permissions_guard_1.PermissionsGuard,
            },
            {
                provide: core_1.APP_FILTER,
                useClass: http_exception_filter_1.HttpExceptionFilter,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: transform_interceptor_1.TransformInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: logging_interceptor_1.LoggingInterceptor,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map