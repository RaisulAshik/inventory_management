import { DueStatus } from '@common/enums';
import { Supplier } from '../inventory/supplier.entity';
export declare enum SupplierDueReferenceType {
    PURCHASE_ORDER = "PURCHASE_ORDER",
    GRN = "GRN",
    BILL = "BILL",
    CREDIT_NOTE = "CREDIT_NOTE",
    OPENING_BALANCE = "OPENING_BALANCE",
    OTHER = "OTHER"
}
export declare class SupplierDue {
    id: string;
    supplierId: string;
    referenceType: SupplierDueReferenceType;
    referenceId: string;
    purchaseOrderId: string;
    referenceNumber: string;
    billNumber: string;
    billDate: Date;
    dueDate: Date;
    currency: string;
    originalAmount: number;
    paidAmount: number;
    adjustedAmount: number;
    status: DueStatus;
    paymentScheduledDate: Date;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    supplier: Supplier;
    get balanceAmount(): number;
    get overdueDays(): number;
}
