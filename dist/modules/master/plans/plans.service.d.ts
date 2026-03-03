import { Repository } from 'typeorm';
import { SubscriptionPlan } from '@entities/master/subscription-plan.entity';
import { PlanFeature } from '@entities/master/plan-feature.entity';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResult } from '@common/interfaces';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
export declare class PlansService {
    private readonly planRepository;
    private readonly featureRepository;
    constructor(planRepository: Repository<SubscriptionPlan>, featureRepository: Repository<PlanFeature>);
    create(createDto: CreatePlanDto): Promise<SubscriptionPlan>;
    private createFeatures;
    findAll(paginationDto: PaginationDto): Promise<PaginatedResult<SubscriptionPlan>>;
    findAllActive(): Promise<SubscriptionPlan[]>;
    findById(id: string): Promise<SubscriptionPlan>;
    findByCode(code: string): Promise<SubscriptionPlan | null>;
    update(id: string, updateDto: UpdatePlanDto): Promise<SubscriptionPlan>;
    addFeature(planId: string, featureDto: {
        featureCode: string;
        featureName: string;
        description?: string;
        isEnabled: boolean;
    }): Promise<PlanFeature>;
    updateFeature(featureId: string, isEnabled: boolean): Promise<PlanFeature>;
    removeFeature(featureId: string): Promise<void>;
    remove(id: string): Promise<void>;
    comparePlans(planIds: string[]): Promise<any>;
}
