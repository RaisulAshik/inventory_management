import { WorkOrder } from './work-order.entity';
import { WorkOrderOperation } from './work-order-operation.entity';
import { Product } from '../inventory/product.entity';
import { ProductVariant } from '../inventory/product-variant.entity';
import { Warehouse } from '../warehouse/warehouse.entity';
import { User } from '../user/user.entity';
import { UnitOfMeasure } from '../inventory/unit-of-measure.entity';
import { WarehouseLocation } from '../warehouse/warehouse-location.entity';
import { InventoryBatch } from '../warehouse/inventory-batch.entity';
export declare enum ProductionOutputStatus {
    PENDING_QC = "PENDING_QC",
    QC_PASSED = "QC_PASSED",
    QC_FAILED = "QC_FAILED",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    REWORK = "REWORK"
}
export declare class ProductionOutput {
    id: string;
    outputNumber: string;
    outputDate: Date;
    workOrderId: string;
    workOrderOperationId: string;
    productId: string;
    variantId: string;
    warehouseId: string;
    locationId: string;
    batchId: string;
    producedQuantity: number;
    acceptedQuantity: number;
    rejectedQuantity: number;
    reworkQuantity: number;
    uomId: string;
    status: ProductionOutputStatus;
    materialCost: number;
    laborCost: number;
    overheadCost: number;
    totalCost: number;
    unitCost: number;
    batchNumber: string;
    manufacturingDate: Date;
    expiryDate: Date;
    rejectionReason: string;
    notes: string;
    producedBy: string;
    qcBy: string;
    qcAt: Date;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    workOrder: WorkOrder;
    workOrderOperation: WorkOrderOperation;
    product: Product;
    variant: ProductVariant;
    warehouse: Warehouse;
    location: WarehouseLocation;
    batch: InventoryBatch;
    uom: UnitOfMeasure;
    producedByUser: User;
    get yieldPercentage(): number;
}
