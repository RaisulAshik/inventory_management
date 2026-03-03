import { Warehouse } from './warehouse.entity';
import { WarehouseTransferItem } from './warehouse-transfer-item.entity';
export declare enum TransferStatus {
    DRAFT = "DRAFT",
    PENDING_APPROVAL = "PENDING_APPROVAL",
    APPROVED = "APPROVED",
    IN_TRANSIT = "IN_TRANSIT",
    PARTIALLY_RECEIVED = "PARTIALLY_RECEIVED",
    RECEIVED = "RECEIVED",
    CANCELLED = "CANCELLED"
}
export declare enum TransferType {
    INTER_WAREHOUSE = "INTER_WAREHOUSE",
    INTER_LOCATION = "INTER_LOCATION"
}
export declare class WarehouseTransfer {
    id: string;
    transferNumber: string;
    transferType: TransferType;
    transferDate: Date;
    fromWarehouseId: string;
    toWarehouseId: string;
    status: TransferStatus;
    expectedDeliveryDate: Date;
    actualDeliveryDate: Date;
    shippingMethod: string;
    trackingNumber: string;
    shippingCost: number;
    totalValue: number;
    reason: string;
    notes: string;
    approvedBy: string;
    approvedAt: Date;
    shippedBy: string;
    shippedAt: Date;
    receivedBy: string;
    receivedAt: Date;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    fromWarehouse: Warehouse;
    toWarehouse: Warehouse;
    items: WarehouseTransferItem[];
}
