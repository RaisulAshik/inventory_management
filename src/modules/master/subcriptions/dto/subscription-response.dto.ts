import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Subscription } from '@entities/master/subscription.entity';
import { SubscriptionStatus, BillingCycle } from '@common/enums';

class PlanDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  planCode: string;

  @ApiProperty()
  planName: string;

  @ApiProperty()
  monthlyPrice: number;

  @ApiProperty()
  yearlyPrice: number;
}

class TenantDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  tenantCode: string;

  @ApiProperty()
  companyName: string;
}

export class SubscriptionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  tenantId: string;

  @ApiProperty()
  planId: string;

  @ApiProperty({ enum: SubscriptionStatus })
  status: SubscriptionStatus;

  @ApiProperty()
  startDate: Date;

  @ApiPropertyOptional()
  trialEndDate?: Date;

  @ApiProperty()
  currentPeriodStart: Date;

  @ApiProperty()
  currentPeriodEnd: Date;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unitPrice: number;

  @ApiProperty()
  totalPrice: number;

  @ApiProperty()
  currency: string;

  @ApiProperty({ enum: BillingCycle })
  billingCycle: BillingCycle;

  @ApiProperty()
  autoRenew: boolean;

  @ApiProperty()
  cancelAtPeriodEnd: boolean;

  @ApiPropertyOptional()
  cancelledAt?: Date;

  @ApiPropertyOptional({ type: PlanDto })
  plan?: PlanDto;

  @ApiPropertyOptional({ type: TenantDto })
  tenant?: TenantDto;

  @ApiProperty()
  daysRemaining: number;

  @ApiProperty()
  isTrialing: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(subscription: Subscription) {
    this.id = subscription.id;
    this.tenantId = subscription.tenantId;
    this.planId = subscription.planId;
    this.status = subscription.status;
    this.startDate = subscription.startDate;
    this.trialEndDate = subscription.trialEndDate;
    this.currentPeriodStart = subscription.currentPeriodStart;
    this.currentPeriodEnd = subscription.currentPeriodEnd;
    this.quantity = subscription.quantity;
    this.unitPrice = Number(subscription.unitPrice);
    this.totalPrice = Number(subscription.unitPrice) * subscription.quantity;
    this.currency = subscription.currency;
    this.billingCycle = subscription.billingCycle;
    this.autoRenew = subscription.autoRenew;
    this.cancelAtPeriodEnd = subscription.cancelAtPeriodEnd;
    this.cancelledAt = subscription.cancelledAt;
    this.createdAt = subscription.createdAt;
    this.updatedAt = subscription.updatedAt;

    // Calculate days remaining
    const now = new Date();
    const endDate = subscription.trialEndDate || subscription.currentPeriodEnd;
    this.daysRemaining = Math.max(
      0,
      Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
    );

    this.isTrialing = subscription.status === SubscriptionStatus.TRIAL;

    // Fixed: Use correct property names from SubscriptionPlan entity
    if (subscription.plan) {
      this.plan = {
        id: subscription.plan.id,
        planCode: subscription.plan.planCode,
        planName: subscription.plan.planName,
        monthlyPrice: Number(subscription.plan.monthlyPrice),
        yearlyPrice: Number(subscription.plan.yearlyPrice),
      };
    }

    if (subscription.tenant) {
      this.tenant = {
        id: subscription.tenant.id,
        tenantCode: subscription.tenant.tenantCode,
        companyName: subscription.tenant.companyName,
      };
    }
  }
}
