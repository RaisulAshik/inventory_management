import { PaginationDto } from '@common/dto/pagination.dto';
import { CreatePlanDto } from './dto/create-plan.dto';
import { PlanResponseDto } from './dto/plan-response.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlansService } from './plans.service';
export declare class PlansController {
    private readonly plansService;
    constructor(plansService: PlansService);
    create(createDto: CreatePlanDto): Promise<PlanResponseDto>;
    findAll(paginationDto: PaginationDto): Promise<{
        data: PlanResponseDto[];
        meta: import("../../../common/interfaces").PaginationMeta;
    }>;
    findAllActive(): Promise<{
        data: PlanResponseDto[];
    }>;
    comparePlans(planIds: string[]): Promise<any>;
    findOne(id: string): Promise<PlanResponseDto>;
    update(id: string, updateDto: UpdatePlanDto): Promise<PlanResponseDto>;
    addFeature(id: string, featureDto: {
        featureCode: string;
        featureName: string;
        description?: string;
        isEnabled: boolean;
    }): Promise<import("../../../entities/master").PlanFeature>;
    updateFeature(featureId: string, isEnabled: boolean): Promise<import("../../../entities/master").PlanFeature>;
    removeFeature(featureId: string): Promise<void>;
    remove(id: string): Promise<void>;
}
