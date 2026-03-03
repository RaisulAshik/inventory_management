import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantsController } from './tenants.controller';
import { TenantsService } from './tenants.service';
import { Tenant } from '@entities/master/tenant.entity';
import { TenantDatabase } from '@entities/master/tenant-database.entity';
import { TenantUser } from '@entities/master/tenant-user.entity';
import { Subscription } from '@entities/master/subscription.entity';
import { TenantBillingInfo } from '@/entities/master';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Tenant, TenantDatabase, TenantBillingInfo, TenantUser, Subscription],
      'master',
    ),
  ],
  controllers: [TenantsController],
  providers: [TenantsService],
  exports: [TenantsService],
})
export class TenantsModule {}
