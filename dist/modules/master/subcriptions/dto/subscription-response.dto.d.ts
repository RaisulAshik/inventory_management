import { Subscription } from '@entities/master/subscription.entity';
import { SubscriptionStatus, BillingCycle } from '@common/enums';
declare class PlanDto {
    id: string;
    planCode: string;
    planName: string;
    monthlyPrice: number;
    yearlyPrice: number;
}
declare class TenantDto {
    id: string;
    tenantCode: string;
    companyName: string;
}
export declare class SubscriptionResponseDto {
    id: string;
    tenantId: string;
    planId: string;
    status: SubscriptionStatus;
    startDate: Date;
    trialEndDate?: Date;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    currency: string;
    billingCycle: BillingCycle;
    autoRenew: boolean;
    cancelAtPeriodEnd: boolean;
    cancelledAt?: Date;
    plan?: PlanDto;
    tenant?: TenantDto;
    daysRemaining: number;
    isTrialing: boolean;
    createdAt: Date;
    updatedAt: Date;
    constructor(subscription: Subscription);
}
export {};
