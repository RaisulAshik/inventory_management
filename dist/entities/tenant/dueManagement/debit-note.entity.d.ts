import { Supplier } from '../inventory/supplier.entity';
import { GoodsReceivedNote } from '../purchase/goods-received-note.entity';
import { PurchaseOrder } from '../purchase/purchase-order.entity';
import { PurchaseReturn } from '../purchase/purchase-return.entity';
export declare enum DebitNoteStatus {
    DRAFT = "DRAFT",
    PENDING_APPROVAL = "PENDING_APPROVAL",
    APPROVED = "APPROVED",
    SENT_TO_SUPPLIER = "SENT_TO_SUPPLIER",
    ACKNOWLEDGED = "ACKNOWLEDGED",
    PARTIALLY_ADJUSTED = "PARTIALLY_ADJUSTED",
    FULLY_ADJUSTED = "FULLY_ADJUSTED",
    CANCELLED = "CANCELLED",
    REJECTED = "REJECTED"
}
export declare enum DebitNoteReason {
    PURCHASE_RETURN = "PURCHASE_RETURN",
    PRICE_DIFFERENCE = "PRICE_DIFFERENCE",
    QUALITY_ISSUE = "QUALITY_ISSUE",
    SHORT_RECEIPT = "SHORT_RECEIPT",
    DAMAGED_GOODS = "DAMAGED_GOODS",
    BILLING_ERROR = "BILLING_ERROR",
    OTHER = "OTHER"
}
export declare class DebitNote {
    id: string;
    debitNoteNumber: string;
    debitNoteDate: Date;
    supplierId: string;
    purchaseOrderId: string;
    grnId: string;
    purchaseReturnId: string;
    reason: DebitNoteReason;
    reasonDetails: string;
    status: DebitNoteStatus;
    currency: string;
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
    adjustedAmount: number;
    balanceAmount: number;
    supplierAcknowledgementNumber: string;
    supplierAcknowledgementDate: Date;
    journalEntryId: string;
    notes: string;
    approvedBy: string;
    approvedAt: Date;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    supplier: Supplier;
    purchaseOrder: PurchaseOrder;
    grn: GoodsReceivedNote;
    purchaseReturn: PurchaseReturn;
    get isFullyAdjusted(): boolean;
}
