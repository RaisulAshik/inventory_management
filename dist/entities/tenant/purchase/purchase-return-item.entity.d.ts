import { PurchaseReturn } from './purchase-return.entity';
import { Product } from '../inventory/product.entity';
import { ProductVariant } from '../inventory/product-variant.entity';
import { InventoryBatch } from '../warehouse/inventory-batch.entity';
import { UnitOfMeasure } from '../inventory/unit-of-measure.entity';
export declare class PurchaseReturnItem {
    id: string;
    purchaseReturnId: string;
    productId: string;
    variantId: string;
    batchId: string;
    quantity: number;
    uomId: string;
    unitPrice: number;
    taxAmount: number;
    lineTotal: number;
    reason: string;
    notes: string;
    createdAt: Date;
    purchaseReturn: PurchaseReturn;
    product: Product;
    variant: ProductVariant;
    batch: InventoryBatch;
    uom: UnitOfMeasure;
}
