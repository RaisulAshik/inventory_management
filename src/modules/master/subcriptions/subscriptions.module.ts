import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { Subscription } from '@entities/master/subscription.entity';
import { SubscriptionPlan } from '@entities/master/subscription-plan.entity';
import { BillingHistory } from '@entities/master/billing-history.entity';
import { Tenant } from '@entities/master/tenant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Subscription, SubscriptionPlan, BillingHistory, Tenant],
      'master',
    ),
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
