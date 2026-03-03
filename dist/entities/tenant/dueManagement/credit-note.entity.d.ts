import { Customer } from '../eCommerce/customer.entity';
import { SalesOrder } from '../eCommerce/sales-order.entity';
import { SalesReturn } from '../eCommerce/sales-return.entity';
export declare enum CreditNoteStatus {
    DRAFT = "DRAFT",
    PENDING_APPROVAL = "PENDING_APPROVAL",
    APPROVED = "APPROVED",
    PARTIALLY_USED = "PARTIALLY_USED",
    FULLY_USED = "FULLY_USED",
    CANCELLED = "CANCELLED",
    EXPIRED = "EXPIRED"
}
export declare enum CreditNoteReason {
    SALES_RETURN = "SALES_RETURN",
    PRICE_ADJUSTMENT = "PRICE_ADJUSTMENT",
    QUALITY_ISSUE = "QUALITY_ISSUE",
    BILLING_ERROR = "BILLING_ERROR",
    GOODWILL = "GOODWILL",
    DAMAGED_GOODS = "DAMAGED_GOODS",
    SHORT_DELIVERY = "SHORT_DELIVERY",
    OTHER = "OTHER"
}
export declare class CreditNote {
    id: string;
    creditNoteNumber: string;
    creditNoteDate: Date;
    customerId: string;
    salesOrderId: string;
    salesReturnId: string;
    reason: CreditNoteReason;
    reasonDetails: string;
    status: CreditNoteStatus;
    currency: string;
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
    usedAmount: number;
    balanceAmount: number;
    validUntil: Date;
    journalEntryId: string;
    notes: string;
    approvedBy: string;
    approvedAt: Date;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    customer: Customer;
    salesOrder: SalesOrder;
    salesReturn: SalesReturn;
    get isExpired(): boolean;
    get isUsable(): boolean;
}
