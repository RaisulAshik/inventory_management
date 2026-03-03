"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('database', () => ({
    master: {
        type: 'mysql',
        host: process.env.MASTER_DB_HOST || 'localhost',
        port: parseInt(process.env.MASTER_DB_PORT ?? '3306', 10),
        username: process.env.MASTER_DB_USERNAME || 'root',
        password: process.env.MASTER_DB_PASSWORD || '',
        database: process.env.MASTER_DB_DATABASE || 'erp_master',
        synchronize: process.env.NODE_ENV === 'development',
        logging: process.env.NODE_ENV === 'development',
    },
    tenant: {
        type: 'mysql',
        host: process.env.TENANT_DB_HOST || 'localhost',
        port: parseInt(process.env.TENANT_DB_PORT ?? '3306', 10),
        username: process.env.TENANT_DB_USERNAME || 'root',
        password: process.env.TENANT_DB_PASSWORD || '',
        synchronize: false,
        logging: process.env.NODE_ENV === 'development',
    },
}));
//# sourceMappingURL=database.config.js.map