import { DueStatus } from '@common/enums';
import { Customer } from '../eCommerce/customer.entity';
export declare enum CustomerDueReferenceType {
    SALES_ORDER = "SALES_ORDER",
    INVOICE = "INVOICE",
    DEBIT_NOTE = "DEBIT_NOTE",
    OPENING_BALANCE = "OPENING_BALANCE",
    OTHER = "OTHER"
}
export declare class CustomerDue {
    id: string;
    customerId: string;
    referenceType: CustomerDueReferenceType;
    salesOrderId: string;
    referenceId: string;
    referenceNumber: string;
    dueDate: Date;
    currency: string;
    originalAmount: number;
    paidAmount: number;
    adjustedAmount: number;
    writtenOffAmount: number;
    status: DueStatus;
    lastReminderDate: Date;
    reminderCount: number;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    customer: Customer;
    get balanceAmount(): number;
    get overdueDays(): number;
    get isOverdue(): boolean;
}
