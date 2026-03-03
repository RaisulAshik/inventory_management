import { JwtPayload } from '@common/interfaces';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto, CollectionFilterDto, DepositDto, BounceDto, AllocateCollectionDto } from './dto/create-collection.dto';
export declare class CollectionsController {
    private readonly collectionsService;
    constructor(collectionsService: CollectionsService);
    create(dto: CreateCollectionDto, user: JwtPayload): Promise<import("../../../entities/tenant").CustomerDueCollection>;
    findAll(filterDto: CollectionFilterDto): Promise<import("@common/interfaces").PaginatedResult<import("../../../entities/tenant").CustomerDueCollection>>;
    findOne(id: string): Promise<import("../../../entities/tenant").CustomerDueCollection>;
    confirm(id: string, user: JwtPayload): Promise<import("../../../entities/tenant").CustomerDueCollection>;
    deposit(id: string, dto: DepositDto, user: JwtPayload): Promise<import("../../../entities/tenant").CustomerDueCollection>;
    bounce(id: string, dto: BounceDto, user: JwtPayload): Promise<import("../../../entities/tenant").CustomerDueCollection>;
    allocate(id: string, dto: AllocateCollectionDto, user: JwtPayload): Promise<import("../../../entities/tenant").CustomerDueCollection>;
    cancel(id: string, reason: string, user: JwtPayload): Promise<import("../../../entities/tenant").CustomerDueCollection>;
}
