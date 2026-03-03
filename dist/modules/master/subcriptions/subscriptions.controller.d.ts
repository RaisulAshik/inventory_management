import { SubscriptionsService } from './subscriptions.service';
import { PaginationDto } from '@common/dto/pagination.dto';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionResponseDto } from './dto/subscription-response.dto';
import { ChangePlanDto, UpdateSubscriptionDto } from './dto/update-subscription.dto';
export declare class SubscriptionsController {
    private readonly subscriptionsService;
    constructor(subscriptionsService: SubscriptionsService);
    create(createDto: CreateSubscriptionDto): Promise<SubscriptionResponseDto>;
    findAll(paginationDto: PaginationDto): Promise<{
        data: SubscriptionResponseDto[];
        meta: import("../../../common/interfaces").PaginationMeta;
    }>;
    findByTenantId(tenantId: string): Promise<{
        data: SubscriptionResponseDto | null;
    }>;
    getBillingHistory(tenantId: string): Promise<{
        data: import("../../../entities/master").BillingHistory[];
    }>;
    findOne(id: string): Promise<SubscriptionResponseDto>;
    update(id: string, updateDto: UpdateSubscriptionDto): Promise<SubscriptionResponseDto>;
    changePlan(id: string, dto: ChangePlanDto): Promise<SubscriptionResponseDto>;
    cancel(id: string, cancelImmediately?: boolean): Promise<SubscriptionResponseDto>;
    reactivate(id: string): Promise<SubscriptionResponseDto>;
    renew(id: string): Promise<SubscriptionResponseDto>;
}
