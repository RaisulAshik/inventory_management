import { StockAdjustment } from './stock-adjustment.entity';
import { WarehouseLocation } from './warehouse-location.entity';
import { InventoryBatch } from './inventory-batch.entity';
import { Product } from '../inventory/product.entity';
import { ProductVariant } from '../inventory/product-variant.entity';
import { UnitOfMeasure } from '../inventory/unit-of-measure.entity';
export declare class StockAdjustmentItem {
    id: string;
    stockAdjustmentId: string;
    productId: string;
    variantId: string;
    locationId: string;
    batchId: string;
    systemQuantity: number;
    physicalQuantity: number;
    adjustmentQuantity: number;
    uomId: string;
    unitCost: number;
    valueImpact: number;
    reason: string;
    createdAt: Date;
    stockAdjustment: StockAdjustment;
    product: Product;
    variant: ProductVariant;
    location: WarehouseLocation;
    batch: InventoryBatch;
    uom: UnitOfMeasure;
    get variancePercentage(): number;
}
