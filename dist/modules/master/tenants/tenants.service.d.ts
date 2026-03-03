import { Repository } from 'typeorm';
import { Tenant } from '@entities/master/tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantFilterDto } from './dto/tenant-filter.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResult } from '@common/interfaces';
import { ConfigService } from '@nestjs/config';
import { Subscription } from 'rxjs';
import { TenantDatabase } from '@entities/master/tenant-database.entity';
import { TenantUser } from '@entities/master/tenant-user.entity';
export declare class TenantsService {
    private readonly tenantRepository;
    private readonly tenantDatabaseRepository;
    private readonly tenantUserRepository;
    private readonly subscriptionRepository;
    private readonly configService;
    constructor(tenantRepository: Repository<Tenant>, tenantDatabaseRepository: Repository<TenantDatabase>, tenantUserRepository: Repository<TenantUser>, subscriptionRepository: Repository<Subscription>, configService: ConfigService);
    create(createTenantDto: CreateTenantDto): Promise<Tenant>;
    provisionDatabase(tenantId: string): Promise<void>;
    findAll(paginationDto: PaginationDto, filterDto: TenantFilterDto): Promise<PaginatedResult<Tenant>>;
    findById(id: string): Promise<Tenant>;
    findByCode(code: string): Promise<Tenant | null>;
    findByEmail(email: string): Promise<Tenant | null>;
    update(id: string, updateTenantDto: UpdateTenantDto): Promise<Tenant>;
    activate(id: string): Promise<Tenant>;
    suspend(id: string, reason: string): Promise<Tenant>;
    reactivate(id: string): Promise<Tenant>;
    remove(id: string): Promise<void>;
    getUsers(tenantId: string): Promise<TenantUser[]>;
    addUser(tenantId: string, userData: {
        email: string;
        password: string;
        firstName: string;
        lastName?: string;
        isAdmin?: boolean;
    }): Promise<TenantUser>;
    getStatistics(): Promise<any>;
}
