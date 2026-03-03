import { SalesReturn } from './sales-return.entity';
import { SalesOrderItem } from './sales-order-item.entity';
import { Product } from '../inventory/product.entity';
import { ProductVariant } from '../inventory/product-variant.entity';
import { UnitOfMeasure } from '../inventory/unit-of-measure.entity';
export declare enum ReturnItemCondition {
    GOOD = "GOOD",
    LIKE_NEW = "LIKE_NEW",
    NEW = "NEW",
    OPENED = "OPENED",
    DAMAGED = "DAMAGED",
    DEFECTIVE = "DEFECTIVE",
    EXPIRED = "EXPIRED"
}
export declare enum ReturnItemDisposition {
    RESTOCK = "RESTOCK",
    SCRAP = "SCRAP",
    REFURBISH = "REFURBISH",
    RETURN_TO_VENDOR = "RETURN_TO_VENDOR",
    PENDING = "PENDING"
}
export declare class SalesReturnItem {
    id: string;
    salesReturnId: string;
    orderItemId: string;
    productId: string;
    variantId: string;
    quantityReturned: number;
    quantityReceived: number;
    quantityRestocked: number;
    uomId: string;
    unitPrice: number;
    taxAmount: number;
    lineTotal: number;
    refundAmount: number;
    condition: ReturnItemCondition;
    disposition: ReturnItemDisposition;
    reason: string;
    inspectionNotes: string;
    createdAt: Date;
    isRestocked: boolean;
    restockedQuantity: number;
    salesOrderItemId: string;
    salesOrderItem: SalesOrderItem;
    salesReturn: SalesReturn;
    orderItem: SalesOrderItem;
    product: Product;
    variant: ProductVariant;
    uom: UnitOfMeasure;
}
