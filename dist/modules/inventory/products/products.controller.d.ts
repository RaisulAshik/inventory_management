import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { JwtPayload } from '@common/interfaces';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto, currentUser: JwtPayload): Promise<ProductResponseDto>;
    findAll(paginationDto: PaginationDto, filterDto: ProductFilterDto): Promise<{
        data: ProductResponseDto[];
        meta: import("@common/interfaces").PaginationMeta;
    }>;
    getLowStock(warehouseId?: string): Promise<{
        data: import("../../../entities/tenant").Product[];
    }>;
    findBySku(sku: string): Promise<{
        data: null;
    } | {
        data: ProductResponseDto;
    }>;
    findByBarcode(barcode: string): Promise<{
        data: null;
    } | {
        data: ProductResponseDto;
    }>;
    findOne(id: string): Promise<ProductResponseDto>;
    getStock(id: string): Promise<{
        data: import("../../../entities/tenant").InventoryStock[];
    }>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<ProductResponseDto>;
    remove(id: string): Promise<void>;
}
