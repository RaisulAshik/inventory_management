import { InventoryStatus } from '@common/enums';
import { Warehouse } from './warehouse.entity';
import { WarehouseLocation } from './warehouse-location.entity';
import { InventoryBatch } from './inventory-batch.entity';
import { Product } from '../inventory/product.entity';
import { ProductVariant } from '../inventory/product-variant.entity';
export declare class LocationInventory {
    id: string;
    productId: string;
    variantId: string;
    warehouseId: string;
    locationId: string;
    batchId: string;
    quantity: number;
    quantityReserved: number;
    status: InventoryStatus;
    createdAt: Date;
    updatedAt: Date;
    product: Product;
    variant: ProductVariant;
    warehouse: Warehouse;
    location: WarehouseLocation;
    batch: InventoryBatch;
    get quantityAvailable(): number;
}
