import { CustomerGroupsService } from './customer-groups.service';
import { CreateCustomerGroupDto } from './dto/create-customer-group.dto';
import { UpdateCustomerGroupDto } from './dto/update-customer-group.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { AssignCustomersDto } from './dto/assign-customers.dto';
export declare class CustomerGroupsController {
    private readonly customerGroupsService;
    constructor(customerGroupsService: CustomerGroupsService);
    create(createDto: CreateCustomerGroupDto, userId: string): Promise<import("../../entities/tenant").CustomerGroup>;
    findAll(paginationDto: PaginationDto): Promise<{
        data: import("../../entities/tenant").CustomerGroup[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findAllSimple(): Promise<import("../../entities/tenant").CustomerGroup[]>;
    getStatistics(): Promise<{
        total: number;
        active: number;
        inactive: number;
        withDiscount: number;
        withCreditLimit: number;
    }>;
    findDefault(): Promise<{
        data: import("../../entities/tenant").CustomerGroup | null;
    }>;
    findOne(id: string): Promise<import("../../entities/tenant").CustomerGroup>;
    findByCode(code: string): Promise<import("../../entities/tenant").CustomerGroup>;
    update(id: string, updateDto: UpdateCustomerGroupDto, userId: string): Promise<import("../../entities/tenant").CustomerGroup>;
    remove(id: string): Promise<void>;
    getCustomersInGroup(id: string, paginationDto: PaginationDto): Promise<{
        data: import("../../entities/tenant").Customer[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getCustomerCount(id: string): Promise<{
        count: number;
    }>;
    assignCustomers(id: string, assignDto: AssignCustomersDto): Promise<{
        updated: number;
    }>;
}
