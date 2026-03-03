import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { Brand } from '@entities/tenant/inventory/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResult } from '@common/interfaces';
export declare class BrandsService {
    private readonly tenantConnectionManager;
    constructor(tenantConnectionManager: TenantConnectionManager);
    private getBrandRepository;
    create(createBrandDto: CreateBrandDto): Promise<Brand>;
    findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Brand>>;
    findAllActive(): Promise<Brand[]>;
    findById(id: string): Promise<Brand>;
    findByCode(code: string): Promise<Brand | null>;
    update(id: string, updateBrandDto: UpdateBrandDto): Promise<Brand>;
    remove(id: string): Promise<void>;
    count(): Promise<number>;
}
