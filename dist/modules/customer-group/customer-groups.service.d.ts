import { CreateCustomerGroupDto } from './dto/create-customer-group.dto';
import { UpdateCustomerGroupDto } from './dto/update-customer-group.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { CustomerGroup, Customer } from '@/entities/tenant';
import { TenantConnectionManager } from '@/database/tenant-connection.manager';
export declare class CustomerGroupsService {
    private readonly tenantConnectionManager;
    private readonly logger;
    constructor(tenantConnectionManager: TenantConnectionManager);
    private getGroupRepo;
    private getCustomerRepo;
    create(createDto: CreateCustomerGroupDto, createdBy?: string): Promise<CustomerGroup>;
    findAll(paginationDto: PaginationDto): Promise<{
        data: CustomerGroup[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findAllSimple(): Promise<CustomerGroup[]>;
    findOne(id: string): Promise<CustomerGroup>;
    findByCode(groupCode: string): Promise<CustomerGroup>;
    findDefault(): Promise<CustomerGroup | null>;
    update(id: string, updateDto: UpdateCustomerGroupDto, updatedBy?: string): Promise<CustomerGroup>;
    remove(id: string): Promise<void>;
    hardDelete(id: string): Promise<void>;
    getCustomersInGroup(groupId: string, paginationDto: PaginationDto): Promise<{
        data: Customer[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getCustomerCountByGroup(groupId: string): Promise<number>;
    assignCustomersToGroup(groupId: string, customerIds: string[]): Promise<{
        updated: number;
    }>;
    getStatistics(): Promise<{
        total: number;
        active: number;
        inactive: number;
        withDiscount: number;
        withCreditLimit: number;
    }>;
}
