"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMasterDbConfig = void 0;
const master_1 = require("../entities/master");
const getMasterDbConfig = (configService) => ({
    type: 'mysql',
    host: configService.get('MASTER_DB_HOST', 'localhost'),
    port: configService.get('MASTER_DB_PORT', 3306),
    username: configService.get('MASTER_DB_USERNAME', 'root'),
    password: configService.get('MASTER_DB_PASSWORD', ''),
    database: configService.get('MASTER_DB_NAME', 'erp_master'),
    entities: [
        master_1.Tenant,
        master_1.TenantDatabase,
        master_1.TenantUser,
        master_1.SubscriptionPlan,
        master_1.PlanFeature,
        master_1.Subscription,
        master_1.BillingHistory,
        master_1.SystemSetting,
    ],
    synchronize: configService.get('MASTER_DB_SYNC') === 'development',
    logging: configService.get('NODE_ENV') === 'development',
    timezone: '+05:30',
    charset: 'utf8mb4',
    extra: {
        connectionLimit: 10,
    },
});
exports.getMasterDbConfig = getMasterDbConfig;
//# sourceMappingURL=master-db.config.js.map