import { PurchaseOrder } from './purchase-order.entity';
import { PurchaseReturnItem } from './purchase-return-item.entity';
import { Supplier } from '../inventory/supplier.entity';
import { Warehouse } from '../warehouse/warehouse.entity';
import { GoodsReceivedNote } from './goods-received-note.entity';
export declare enum PurchaseReturnStatus {
    DRAFT = "DRAFT",
    PENDING_APPROVAL = "PENDING_APPROVAL",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    SHIPPED = "SHIPPED",
    RECEIVED_BY_SUPPLIER = "RECEIVED_BY_SUPPLIER",
    CREDIT_NOTE_RECEIVED = "CREDIT_NOTE_RECEIVED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
export declare class PurchaseReturn {
    id: string;
    returnNumber: string;
    purchaseOrderId: string;
    grnId: string;
    supplierId: string;
    warehouseId: string;
    returnDate: Date;
    status: PurchaseReturnStatus;
    returnType: string;
    reason: string;
    reasonDetails: string;
    currency: string;
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
    trackingNumber: string;
    creditNoteNumber: string;
    creditNoteAmount: number;
    creditNoteDate: Date;
    approvedBy: string;
    approvedAt: Date;
    shippedBy: string;
    shippedAt: Date;
    receivedBySupplierAt: Date;
    rejectionReason: string;
    notes: string;
    createdBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
    supplier: Supplier;
    warehouse: Warehouse;
    purchaseOrder: PurchaseOrder;
    grn: GoodsReceivedNote;
    items: PurchaseReturnItem[];
    get itemCount(): number;
    get totalQuantity(): number;
}
