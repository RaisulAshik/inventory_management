import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { ProductCategory } from '@entities/tenant/inventory/product-category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResult } from '@common/interfaces';
export declare class CategoriesService {
    private readonly tenantConnectionManager;
    constructor(tenantConnectionManager: TenantConnectionManager);
    private getCategoryRepository;
    create(createCategoryDto: CreateCategoryDto): Promise<ProductCategory>;
    findAll(paginationDto: PaginationDto): Promise<PaginatedResult<ProductCategory>>;
    getTree(): Promise<ProductCategory[]>;
    private buildTree;
    findAllActive(): Promise<ProductCategory[]>;
    findById(id: string): Promise<ProductCategory>;
    findByCode(code: string): Promise<ProductCategory | null>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<ProductCategory>;
    remove(id: string): Promise<void>;
    getChildren(parentId: string): Promise<ProductCategory[]>;
    getDescendants(id: string): Promise<ProductCategory[]>;
}
