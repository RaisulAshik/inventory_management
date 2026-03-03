import { SalesOrder } from './sales-order.entity';
import { Customer } from './customer.entity';
import { Warehouse } from '../warehouse/warehouse.entity';
import { SalesReturnItem } from './sales-return-item.entity';
export declare enum SalesReturnStatus {
    REQUESTED = "REQUESTED",
    PENDING_APPROVAL = "PENDING_APPROVAL",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    RECEIVED = "RECEIVED",
    INSPECTING = "INSPECTING",
    REFUND_PENDING = "REFUND_PENDING",
    REFUNDED = "REFUNDED",
    EXCHANGED = "EXCHANGED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
export declare enum SalesReturnReason {
    DEFECTIVE = "DEFECTIVE",
    WRONG_ITEM = "WRONG_ITEM",
    NOT_AS_DESCRIBED = "NOT_AS_DESCRIBED",
    CHANGED_MIND = "CHANGED_MIND",
    SIZE_FIT_ISSUE = "SIZE_FIT_ISSUE",
    DAMAGED_IN_TRANSIT = "DAMAGED_IN_TRANSIT",
    LATE_DELIVERY = "LATE_DELIVERY",
    DUPLICATE_ORDER = "DUPLICATE_ORDER",
    OTHER = "OTHER"
}
export declare enum RefundType {
    ORIGINAL_PAYMENT = "ORIGINAL_PAYMENT",
    STORE_CREDIT = "STORE_CREDIT",
    BANK_TRANSFER = "BANK_TRANSFER",
    EXCHANGE = "EXCHANGE"
}
export declare class SalesReturn {
    id: string;
    returnNumber: string;
    returnDate: Date;
    salesOrderId: string;
    customerId: string;
    warehouseId: string;
    status: SalesReturnStatus;
    returnReason: SalesReturnReason;
    reasonDetails: string;
    refundType: RefundType;
    currency: string;
    subtotal: number;
    taxAmount: number;
    restockingFee: number;
    shippingFeeDeduction: number;
    totalAmount: number;
    refundAmount: number;
    isPickupRequired: boolean;
    pickupAddress: string;
    pickupDate: Date;
    trackingNumber: string;
    receivedDate: Date;
    inspectionNotes: string;
    customerNotes: string;
    internalNotes: string;
    refundTransactionId: string;
    refundedAt: Date;
    approvedBy: string;
    approvedAt: Date;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    salesOrder: SalesOrder;
    customer: Customer;
    warehouse: Warehouse;
    items: SalesReturnItem[];
}
