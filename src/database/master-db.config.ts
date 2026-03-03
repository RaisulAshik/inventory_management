import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// Import all master entities
import {
  Tenant,
  TenantDatabase,
  TenantUser,
  SubscriptionPlan,
  PlanFeature,
  Subscription,
  BillingHistory,
  SystemSetting,
} from '@entities/master';

export const getMasterDbConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get<string>('MASTER_DB_HOST', 'localhost'),
  port: configService.get<number>('MASTER_DB_PORT', 3306),
  username: configService.get<string>('MASTER_DB_USERNAME', 'root'),
  password: configService.get<string>('MASTER_DB_PASSWORD', ''),
  database: configService.get<string>('MASTER_DB_NAME', 'erp_master'),
  entities: [
    Tenant,
    TenantDatabase,
    TenantUser,
    SubscriptionPlan,
    PlanFeature,
    Subscription,
    BillingHistory,
    SystemSetting,
  ],
  synchronize: configService.get<string>('MASTER_DB_SYNC') === 'development',
  logging: configService.get<string>('NODE_ENV') === 'development',
  timezone: '+05:30',
  charset: 'utf8mb4',
  extra: {
    connectionLimit: 10,
  },
});
