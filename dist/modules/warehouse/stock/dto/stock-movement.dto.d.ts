import { StockMovementType } from '@common/enums';
export declare class StockMovementDto {
    movementType: StockMovementType;
    productId: string;
    variantId?: string;
    batchId?: string;
    warehouseId?: string;
    fromWarehouseId?: string;
    toWarehouseId?: string;
    fromLocationId?: string;
    toLocationId?: string;
    quantity: number;
    uomId: string;
    unitCost?: number;
    referenceType?: string;
    referenceId?: string;
    referenceNumber?: string;
    reason?: string;
}
