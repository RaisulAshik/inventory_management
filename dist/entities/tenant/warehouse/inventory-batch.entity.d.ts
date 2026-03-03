import { Product } from '../inventory/product.entity';
import { ProductVariant } from '../inventory/product-variant.entity';
import { Supplier } from '../inventory/supplier.entity';
export declare class InventoryBatch {
    id: string;
    productId: string;
    variantId: string;
    batchNumber: string;
    manufacturingDate: Date;
    expiryDate: Date;
    supplierId: string;
    warehouseId: string;
    purchaseOrderId: string;
    costPrice: number;
    currentQuantity: number;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    product: Product;
    variant: ProductVariant;
    supplier: Supplier;
    get isExpired(): boolean;
    get daysUntilExpiry(): number | null;
}
