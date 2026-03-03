import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResult } from '@common/interfaces';
import { StockMovementType } from '@common/enums';
import { InventoryStock, StockMovement, LocationInventory } from '@entities/tenant';
import { StockFilterDto } from './dto/stock-filter.dto';
import { StockMovementDto } from './dto/stock-movement.dto';
export declare class StockService {
    private readonly tenantConnectionManager;
    constructor(tenantConnectionManager: TenantConnectionManager);
    getStock(paginationDto: PaginationDto, filterDto: StockFilterDto): Promise<PaginatedResult<InventoryStock>>;
    getStockByProduct(productId: string): Promise<InventoryStock[]>;
    getStockByWarehouse(warehouseId: string, paginationDto: PaginationDto): Promise<PaginatedResult<InventoryStock>>;
    getAvailableQuantity(productId: string, warehouseId: string, variantId?: string): Promise<number>;
    reserveStock(productId: string, warehouseId: string, quantity: number, variantId?: string): Promise<void>;
    releaseStock(productId: string, warehouseId: string, quantity: number, variantId?: string): Promise<void>;
    recordMovement(movementDto: StockMovementDto, createdBy: string): Promise<StockMovement>;
    getMovements(paginationDto: PaginationDto, filterDto: {
        productId?: string;
        warehouseId?: string;
        movementType?: StockMovementType;
        fromDate?: Date;
        toDate?: Date;
    }): Promise<PaginatedResult<StockMovement>>;
    getLowStockProducts(warehouseId?: string): Promise<any[]>;
    getStockValuation(warehouseId?: string): Promise<any>;
    getLocationInventory(warehouseId: string): Promise<LocationInventory[]>;
}
