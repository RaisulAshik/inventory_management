import { StockService } from './stock.service';
import { PaginationDto } from '@common/dto/pagination.dto';
import { JwtPayload } from '@common/interfaces';
import { StockFilterDto } from './dto/stock-filter.dto';
import { StockMovementDto } from './dto/stock-movement.dto';
export declare class StockController {
    private readonly stockService;
    constructor(stockService: StockService);
    getStock(paginationDto: PaginationDto, filterDto: StockFilterDto): Promise<import("@common/interfaces").PaginatedResult<import("../../../entities/tenant").InventoryStock>>;
    getLowStock(warehouseId?: string): Promise<{
        data: any[];
    }>;
    getValuation(warehouseId?: string): Promise<any>;
    getMovements(paginationDto: PaginationDto, productId?: string, warehouseId?: string, movementType?: string, fromDate?: string, toDate?: string): Promise<import("@common/interfaces").PaginatedResult<import("../../../entities/tenant").StockMovement>>;
    getStockByProduct(productId: string): Promise<{
        data: import("../../../entities/tenant").InventoryStock[];
    }>;
    getStockByWarehouse(warehouseId: string, paginationDto: PaginationDto): Promise<import("@common/interfaces").PaginatedResult<import("../../../entities/tenant").InventoryStock>>;
    getLocationInventory(warehouseId: string): Promise<{
        data: import("../../../entities/tenant").LocationInventory[];
    }>;
    getAvailableQuantity(productId: string, warehouseId: string, variantId?: string): Promise<{
        availableQuantity: number;
    }>;
    recordMovement(movementDto: StockMovementDto, currentUser: JwtPayload): Promise<import("../../../entities/tenant").StockMovement>;
    reserveStock(body: {
        productId: string;
        warehouseId: string;
        quantity: number;
        variantId?: string;
    }): Promise<{
        message: string;
    }>;
    releaseStock(body: {
        productId: string;
        warehouseId: string;
        quantity: number;
        variantId?: string;
    }): Promise<{
        message: string;
    }>;
}
