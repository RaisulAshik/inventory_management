import { BillingCycle } from '@common/enums';
export declare class UpdateSubscriptionDto {
    quantity?: number;
    autoRenew?: boolean;
}
export declare class ChangePlanDto {
    newPlanId: string;
    billingCycle?: BillingCycle;
}
