import { SubscriptionStatus, BillingCycle } from '@common/enums';
import { Tenant } from './tenant.entity';
import { SubscriptionPlan } from './subscription-plan.entity';
export declare class Subscription {
    id: string;
    tenantId: string;
    planId: string;
    billingCycle: BillingCycle;
    status: SubscriptionStatus;
    trialStartDate: Date;
    trialEndDate: Date;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelledAt: Date;
    cancelReason: string;
    createdAt: Date;
    updatedAt: Date;
    tenant: Tenant;
    plan: SubscriptionPlan;
}
