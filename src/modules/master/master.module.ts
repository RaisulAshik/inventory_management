import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantsController } from './tenants/tenants.controller';
import { TenantsService } from './tenants/tenants.service';
import { Tenant } from '@entities/master/tenant.entity';
import { SubscriptionPlan } from '@entities/master/subscription-plan.entity';
import { PlanFeature } from '@entities/master/plan-feature.entity';
import { TenantDatabase } from '@entities/master/tenant-database.entity';
import { TenantUser } from '@entities/master/tenant-user.entity';
import { Subscription } from '@entities/master/subscription.entity';
import {
  BillingHistory,
  SystemSetting,
  TenantBillingInfo,
} from '@/entities/master';
import { PlansController } from './plans/plans.controller';
import { PlansService } from './plans/plans.service';
import { SubscriptionsController } from './subcriptions/subscriptions.controller';
import { SubscriptionsService } from './subcriptions/subscriptions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        Tenant,
        TenantBillingInfo,
        TenantDatabase,
        Subscription,
        SubscriptionPlan,
        PlanFeature,
        TenantUser,
        BillingHistory,
        SystemSetting,
      ],
      'master', // Use master database connection
    ),
  ],
  controllers: [TenantsController, SubscriptionsController, PlansController],
  providers: [TenantsService, SubscriptionsService, PlansService],
  exports: [TenantsService, SubscriptionsService, PlansService, TypeOrmModule],
})
export class MasterModule {}
