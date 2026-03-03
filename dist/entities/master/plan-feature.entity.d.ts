import { SubscriptionPlan } from './subscription-plan.entity';
export declare class PlanFeature {
    id: string;
    planId: string;
    featureCode: string;
    featureName: string;
    description: string;
    isEnabled: boolean;
    limitValue: string;
    createdAt: Date;
    updatedAt: Date;
    plan: SubscriptionPlan;
}
