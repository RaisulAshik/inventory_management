import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { Product } from '@entities/tenant/inventory/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResult } from '@common/interfaces';
import { InventoryStock } from '@entities/tenant';
export declare class ProductsService {
    private readonly tenantConnectionManager;
    constructor(tenantConnectionManager: TenantConnectionManager);
    private getProductRepository;
    create(createProductDto: CreateProductDto, createdBy: string): Promise<Product>;
    private createVariants;
    private createImages;
    findAll(paginationDto: PaginationDto, filterDto: ProductFilterDto): Promise<PaginatedResult<Product>>;
    private applyFilters;
    findById(id: string): Promise<Product>;
    findBySku(sku: string): Promise<Product | null>;
    findByBarcode(barcode: string): Promise<Product | null>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<Product>;
    remove(id: string): Promise<void>;
    getProductStock(productId: string): Promise<InventoryStock[]>;
    getTotalStock(productId: string, warehouseId?: string): Promise<number>;
    getLowStockProducts(warehouseId?: string): Promise<Product[]>;
    bulkUpdate(updates: {
        id: string;
        data: Partial<UpdateProductDto>;
    }[]): Promise<void>;
    count(filterDto?: ProductFilterDto): Promise<number>;
}
