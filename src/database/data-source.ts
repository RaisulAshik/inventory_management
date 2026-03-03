import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();

export const masterDataSourceOptions: DataSourceOptions = {
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

export const tenantDataSourceOptions: DataSourceOptions = {
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

// Master database data source for migrations
export const MasterDataSource = new DataSource(masterDataSourceOptions);

// Tenant template database data source for migrations
export const TenantDataSource = new DataSource(tenantDataSourceOptions);

// Default export for TypeORM CLI
export default MasterDataSource;
