"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantDataSource = exports.MasterDataSource = exports.tenantDataSourceOptions = exports.masterDataSourceOptions = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.masterDataSourceOptions = {
    type: 'mysql',
    host: process.env.MASTER_DB_HOST || 'localhost',
    port: parseInt(process.env.MASTER_DB_PORT || '3306', 10),
    username: process.env.MASTER_DB_USERNAME || 'root',
    password: process.env.MASTER_DB_PASSWORD || '',
    database: process.env.MASTER_DB_NAME || 'erp_master',
    entities: ['src/entities/master/**/*.entity.ts'],
    migrations: ['src/database/migrations/master/**/*.ts'],
    synchronize: false,
    logging: true,
};
exports.tenantDataSourceOptions = {
    type: 'mysql',
    host: process.env.TENANT_DB_HOST || 'localhost',
    port: parseInt(process.env.TENANT_DB_PORT || '3306', 10),
    username: process.env.TENANT_DB_USERNAME || 'root',
    password: process.env.TENANT_DB_PASSWORD || '',
    database: process.env.TENANT_DB_TEMPLATE || 'erp_tenant_template',
    entities: ['src/entities/tenant/**/*.entity.ts'],
    migrations: ['src/database/migrations/tenant/**/*.ts'],
    synchronize: false,
    logging: true,
};
exports.MasterDataSource = new typeorm_1.DataSource(exports.masterDataSourceOptions);
exports.TenantDataSource = new typeorm_1.DataSource(exports.tenantDataSourceOptions);
exports.default = exports.MasterDataSource;
//# sourceMappingURL=data-source.js.map