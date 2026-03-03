import { BillingCycle } from '@common/enums';
export declare class CreateSubscriptionDto {
    tenantId: string;
    planId: string;
    startDate?: Date;
    quantity?: number;
    billingCycle?: BillingCycle;
    autoRenew?: boolean;
    includeTrip?: boolean;
}
