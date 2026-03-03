import { SubscriptionPlan } from '@entities/master/subscription-plan.entity';
import { BillingCycle } from '@common/enums';
declare class PlanFeatureDto {
    id: string;
    featureCode: string;
    featureName: string;
    description?: string;
    isEnabled: boolean;
}
export declare class PlanResponseDto {
    id: string;
    planCode: string;
    planName: string;
    description?: string;
    price: number;
    currency: string;
    billingCycle: BillingCycle;
    trialDays: number;
    maxUsers?: number;
    maxWarehouses?: number;
    maxProducts?: number;
    maxOrders?: number;
    storageGb?: number;
    isActive: boolean;
    displayOrder: number;
    features?: PlanFeatureDto[];
    pricePerMonth: number;
    createdAt: Date;
    updatedAt: Date;
    constructor(plan: SubscriptionPlan, billingCycle?: BillingCycle);
}
export {};
