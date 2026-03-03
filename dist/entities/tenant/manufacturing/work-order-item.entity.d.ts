import { WorkOrder } from './work-order.entity';
import { BomItem, BomItemType } from './bom-item.entity';
import { ProductVariant } from '../inventory/product-variant.entity';
import { Product } from '../inventory/product.entity';
import { UnitOfMeasure } from '../inventory/unit-of-measure.entity';
export declare enum WorkOrderItemStatus {
    PENDING = "PENDING",
    PARTIALLY_ISSUED = "PARTIALLY_ISSUED",
    ISSUED = "ISSUED",
    RETURNED = "RETURNED"
}
export declare class WorkOrderItem {
    id: string;
    workOrderId: string;
    bomItemId: string;
    itemType: BomItemType;
    productId: string;
    variantId: string;
    requiredQuantity: number;
    issuedQuantity: number;
    consumedQuantity: number;
    returnedQuantity: number;
    scrapQuantity: number;
    uomId: string;
    unitCost: number;
    totalCost: number;
    status: WorkOrderItemStatus;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    workOrder: WorkOrder;
    bomItem: BomItem;
    product: Product;
    variant: ProductVariant;
    uom: UnitOfMeasure;
    get pendingQuantity(): number;
    get variance(): number;
}
