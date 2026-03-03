import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { PaginatedResult } from '@common/interfaces';
import { CustomerDueCollection } from '@entities/tenant';
import { CustomerDuesService } from '../customer-dues/customer-dues.service';
import { CreateCollectionDto, CollectionFilterDto, DepositDto, BounceDto, AllocateCollectionDto } from './dto/create-collection.dto';
export declare class CollectionsService {
    private readonly tenantConnectionManager;
    private readonly duesService;
    constructor(tenantConnectionManager: TenantConnectionManager, duesService: CustomerDuesService);
    private getRepo;
    private getDataSource;
    create(dto: CreateCollectionDto, userId: string): Promise<CustomerDueCollection>;
    findAll(filterDto: CollectionFilterDto): Promise<PaginatedResult<CustomerDueCollection>>;
    findById(id: string): Promise<CustomerDueCollection>;
    confirm(id: string, userId: string): Promise<CustomerDueCollection>;
    deposit(id: string, dto: DepositDto, userId: string): Promise<CustomerDueCollection>;
    bounce(id: string, dto: BounceDto, userId: string): Promise<CustomerDueCollection>;
    allocate(id: string, dto: AllocateCollectionDto, userId: string): Promise<CustomerDueCollection>;
    cancel(id: string, reason: string, userId: string): Promise<CustomerDueCollection>;
    private updateOrderPayment;
}
