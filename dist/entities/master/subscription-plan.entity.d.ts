import { PlanFeature } from './plan-feature.entity';
import { Subscription } from './subscription.entity';
export declare class SubscriptionPlan {
    id: string;
    planCode: string;
    planName: string;
    description: string;
    monthlyPrice: number;
    yearlyPrice: number;
    maxUsers: number;
    maxWarehouses: number;
    maxStores: number;
    maxProducts: number;
    maxOrdersPerMonth: number;
    storageLimitGb: number;
    isActive: boolean;
    trialDays: number;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
    features: PlanFeature[];
    subscriptions: Subscription[];
}
