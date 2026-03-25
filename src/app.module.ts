// src/app.module.ts
import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';

// Configuration
import { configuration } from '@config/configuration';
import { validationSchema } from '@config/validation.schema';

// Database
import { DatabaseModule } from '@database/database.module';
import { getMasterDbConfig } from '@database/master-db.config';

// Common
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@common/guards/permissions.guard';
import { TenantGuard } from '@common/guards/tenant.guard';
import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { TransformInterceptor } from '@common/interceptors/transform.interceptor';
import { LoggingInterceptor } from '@common/interceptors/logging.interceptor';
import { TenantMiddleware } from '@common/middleware/tenant.middleware';
import { LoggingMiddleware } from '@common/middleware/logger.middleware';

// Modules
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { InventoryModule } from '@modules/inventory/inventory.module';
import { WarehouseModule } from '@modules/warehouse/warehouse.module';
import { SalesModule } from '@modules/sales/sales.module';
import { PurchasingModule } from '@modules/purchasing/purchasing.module';
import { DashboardModule } from '@modules/dashboard/dashboard.module';
import { MasterModule } from '@modules/master/master.module';
import { AdminAuthModule } from '@modules/admin-auth/admin-auth.module';
import { CustomerGroupsModule } from './modules/customer-group';
import { QuotationsModule } from './modules/quotations/quotations.module';
import { AccountingModule } from '@modules/accounting/accounting.module';
import { FinancialModule } from '@modules/due-management/financial.module';
import { SettingsModule } from '@modules/settings/settings.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
      envFilePath: ['.env.local', '.env'],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
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

    // Scheduled tasks
    ScheduleModule.forRoot(),

    // Master database connection
    TypeOrmModule.forRootAsync({
      name: 'master',
      imports: [ConfigModule],
      useFactory: getMasterDbConfig,
      inject: [ConfigService],
    }),

    // Database module for tenant connections
    DatabaseModule,

    // Feature modules
    AdminAuthModule, // Master DB - Admin Authentication
    MasterModule, // Master DB - SaaS Admin (Plans, Tenants)
    AuthModule, // Tenant DB - Tenant User Authentication
    UsersModule, // Tenant DB
    InventoryModule, // Tenant DB
    WarehouseModule, // Tenant DB
    SalesModule, // Tenant DB
    PurchasingModule, // Tenant DB
    DashboardModule, // Tenant DB
    CustomerGroupsModule, // Tenant DB
    QuotationsModule, // Tenant DB
    AccountingModule, // Tenant DB
    FinancialModule, // Tenant DB - Due Management
    SettingsModule, // Tenant DB - Tenant Settings
  ],
  providers: [
    // Global guards (order matters!)
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: TenantGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    // Global filters
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    // Global interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware, TenantMiddleware)
      .exclude(
        // ===============================================
        // ADMIN ROUTES (Master DB - No tenant required)
        // ===============================================
        { path: 'admin/(.*)', method: RequestMethod.ALL },
        { path: 'v1/admin/(.*)', method: RequestMethod.ALL },
        { path: 'api/v1/admin/(.*)', method: RequestMethod.ALL },

        // ===============================================
        // MASTER MODULE ROUTES (Master DB - No tenant required)
        // ===============================================
        { path: 'master/(.*)', method: RequestMethod.ALL },
        { path: 'v1/master/(.*)', method: RequestMethod.ALL },
        { path: 'api/v1/master/(.*)', method: RequestMethod.ALL },

        // ===============================================
        // AUTH ROUTES (Public - No tenant required for login/register)
        // ===============================================
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/register', method: RequestMethod.POST },
        { path: 'auth/forgot-password', method: RequestMethod.POST },
        { path: 'auth/reset-password', method: RequestMethod.POST },
        { path: 'v1/auth/login', method: RequestMethod.POST },
        { path: 'v1/auth/register', method: RequestMethod.POST },
        { path: 'api/v1/auth/login', method: RequestMethod.POST },
        { path: 'api/v1/auth/register', method: RequestMethod.POST },

        // ===============================================
        // UTILITY ROUTES
        // ===============================================
        { path: 'health', method: RequestMethod.GET },
        { path: 'docs', method: RequestMethod.GET },
        { path: 'docs/(.*)', method: RequestMethod.ALL },
        { path: 'api-json', method: RequestMethod.GET },
      )
      .forRoutes('*');
  }
}
