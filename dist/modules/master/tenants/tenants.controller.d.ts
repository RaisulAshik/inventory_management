import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantFilterDto } from './dto/tenant-filter.dto';
import { AddTenantUserDto } from './dto/add-tenant-user.dto';
import { TenantResponseDto } from './dto/tenant-response.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
export declare class TenantsController {
    private readonly tenantsService;
    constructor(tenantsService: TenantsService);
    create(createTenantDto: CreateTenantDto): Promise<TenantResponseDto>;
    findAll(paginationDto: PaginationDto, filterDto: TenantFilterDto): Promise<{
        data: TenantResponseDto[];
        meta: import("../../../common/interfaces").PaginationMeta;
    }>;
    getStatistics(): Promise<any>;
    findByCode(code: string): Promise<{
        data: TenantResponseDto | null;
    }>;
    findOne(id: string): Promise<TenantResponseDto>;
    getUsers(id: string): Promise<{
        data: import("../../../entities/master").TenantUser[];
    }>;
    update(id: string, updateTenantDto: UpdateTenantDto): Promise<TenantResponseDto>;
    provisionDatabase(id: string): Promise<{
        message: string;
    }>;
    activate(id: string): Promise<TenantResponseDto>;
    suspend(id: string, reason: string): Promise<TenantResponseDto>;
    reactivate(id: string): Promise<TenantResponseDto>;
    addUser(id: string, userDto: AddTenantUserDto): Promise<import("../../../entities/master").TenantUser>;
    remove(id: string): Promise<void>;
}
