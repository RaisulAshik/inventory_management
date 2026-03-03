import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SubscriptionPlan } from '@entities/master/subscription-plan.entity';
import { BillingCycle } from '@common/enums';

class PlanFeatureDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  featureCode: string;

  @ApiProperty()
  featureName: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  isEnabled: boolean;
}

export class PlanResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  planCode: string;

  @ApiProperty()
  planName: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  currency: string;

  @ApiProperty({ enum: BillingCycle })
  billingCycle: BillingCycle;

  @ApiProperty()
  trialDays: number;

  @ApiPropertyOptional()
  maxUsers?: number;

  @ApiPropertyOptional()
  maxWarehouses?: number;

  @ApiPropertyOptional()
  maxProducts?: number;

  @ApiPropertyOptional()
  maxOrders?: number;

  @ApiPropertyOptional()
  storageGb?: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  displayOrder: number;

  @ApiPropertyOptional({ type: [PlanFeatureDto] })
  features?: PlanFeatureDto[];

  @ApiProperty()
  pricePerMonth: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(plan: SubscriptionPlan, billingCycle?: BillingCycle) {
    this.id = plan.id;
    this.planCode = plan.planCode;
    this.planName = plan.planName;
    this.description = plan.description;

    // Use appropriate price based on billing cycle
    const cycle = billingCycle || BillingCycle.MONTHLY;
    this.billingCycle = cycle;
    this.price =
      cycle === BillingCycle.ANNUAL
        ? Number(plan.yearlyPrice)
        : Number(plan.monthlyPrice);

    this.currency = 'INR'; // Hardcoded or add to entity
    this.trialDays = plan.trialDays;
    this.maxUsers = plan.maxUsers;
    this.maxWarehouses = plan.maxWarehouses;
    this.maxProducts = plan.maxProducts;
    this.maxOrders = plan.maxOrdersPerMonth; // Fixed
    this.storageGb = plan.storageLimitGb; // Fixed
    this.isActive = Boolean(plan.isActive);
    this.displayOrder = plan.sortOrder; // Fixed
    this.createdAt = plan.createdAt;
    this.updatedAt = plan.updatedAt;

    // Calculate monthly equivalent price
    this.pricePerMonth =
      cycle === BillingCycle.ANNUAL
        ? Number(plan.yearlyPrice) / 12
        : Number(plan.monthlyPrice);

    if (plan.features) {
      this.features = plan.features.map((f) => ({
        id: f.id,
        featureCode: f.featureCode,
        featureName: f.featureName,
        description: f.description,
        isEnabled: f.isEnabled,
      }));
    }
  }
}
