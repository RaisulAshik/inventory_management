import { Warehouse } from './warehouse.entity';
import { WarehouseLocation } from './warehouse-location.entity';
import { InventoryBatch } from './inventory-batch.entity';
import { Product } from '../inventory/product.entity';
import { ProductVariant } from '../inventory/product-variant.entity';
export declare enum SerialNumberStatus {
    AVAILABLE = "AVAILABLE",
    RESERVED = "RESERVED",
    SOLD = "SOLD",
    IN_TRANSIT = "IN_TRANSIT",
    RETURNED = "RETURNED",
    DAMAGED = "DAMAGED",
    SCRAPPED = "SCRAPPED"
}
export declare class InventorySerialNumber {
    id: string;
    serialNumber: string;
    productId: string;
    variantId: string;
    batchId: string;
    warehouseId: string;
    locationId: string;
    status: SerialNumberStatus;
    costPrice: number;
    purchaseOrderId: string;
    grnId: string;
    receivedDate: Date;
    salesOrderId: string;
    soldDate: Date;
    warrantyStartDate: Date;
    warrantyEndDate: Date;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    product: Product;
    variant: ProductVariant;
    batch: InventoryBatch;
    warehouse: Warehouse;
    location: WarehouseLocation;
    get isUnderWarranty(): boolean;
    get warrantyDaysRemaining(): number | null;
}
