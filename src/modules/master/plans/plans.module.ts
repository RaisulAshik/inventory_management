import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionPlan } from '@entities/master/subscription-plan.entity';
import { PlanFeature } from '@entities/master/plan-feature.entity';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionPlan, PlanFeature], 'master'),
  ],
  controllers: [PlansController],
  providers: [PlansService],
  exports: [PlansService],
})
export class PlansModule {}
