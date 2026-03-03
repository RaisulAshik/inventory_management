import { BillingCycle } from '@common/enums';
declare class CreatePlanFeatureDto {
    featureCode: string;
    featureName: string;
    description?: string;
    isEnabled: boolean;
}
export declare class CreatePlanDto {
    planCode: string;
    planName: string;
    description?: string;
    price: number;
    currency?: string;
    billingCycle: BillingCycle;
    trialDays?: number;
    maxUsers?: number;
    maxWarehouses?: number;
    maxProducts?: number;
    maxOrders?: number;
    storageGb?: number;
    isActive?: boolean;
    displayOrder?: number;
    features?: CreatePlanFeatureDto[];
}
export {};
