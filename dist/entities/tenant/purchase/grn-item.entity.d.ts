import { GoodsReceivedNote } from './goods-received-note.entity';
import { PurchaseOrderItem } from './purchase-order-item.entity';
import { Product } from '../inventory/product.entity';
import { ProductVariant } from '../inventory/product-variant.entity';
import { WarehouseLocation } from '../warehouse/warehouse-location.entity';
import { InventoryBatch } from '../warehouse/inventory-batch.entity';
import { UnitOfMeasure } from '../inventory/unit-of-measure.entity';
export declare enum GrnItemStatus {
    PENDING_QC = "PENDING_QC",
    QC_PASSED = "QC_PASSED",
    QC_FAILED = "QC_FAILED",
    PARTIALLY_ACCEPTED = "PARTIALLY_ACCEPTED",
    ACCEPTED = "ACCEPTED"
}
export declare class GrnItem {
    id: string;
    grnId: string;
    poItemId: string;
    productId: string;
    variantId: string;
    locationId: string;
    batchId: string;
    quantityReceived: number;
    quantityAccepted: number;
    quantityRejected: number;
    uomId: string;
    unitPrice: number;
    lineValue: number;
    status: GrnItemStatus;
    batchNumber: string;
    manufacturingDate: Date;
    expiryDate: Date;
    rejectionReason: string;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    grn: GoodsReceivedNote;
    poItem: PurchaseOrderItem;
    product: Product;
    variant: ProductVariant;
    location: WarehouseLocation;
    batch: InventoryBatch;
    uom: UnitOfMeasure;
}
