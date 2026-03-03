import { BankAccount } from '../accounting/bank-account.entity';
import { PaymentMethod } from '../eCommerce/payment-method.entity';
import { Supplier } from '../inventory/supplier.entity';
import { User } from '../user/user.entity';
export declare enum SupplierPaymentStatus {
    DRAFT = "DRAFT",
    PENDING_APPROVAL = "PENDING_APPROVAL",
    APPROVED = "APPROVED",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    FAILED = "FAILED"
}
export declare class SupplierPayment {
    id: string;
    paymentNumber: string;
    paymentDate: Date;
    supplierId: string;
    paymentMethodId: string;
    bankAccountId: string;
    amount: number;
    currency: string;
    exchangeRate: number;
    status: SupplierPaymentStatus;
    referenceNumber: string;
    chequeNumber: string;
    chequeDate: Date;
    bankReference: string;
    transactionId: string;
    allocatedAmount: number;
    unallocatedAmount: number;
    tdsAmount: number;
    tdsPercentage: number;
    journalEntryId: string;
    notes: string;
    approvedBy: string;
    approvedAt: Date;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    supplier: Supplier;
    paymentMethod: PaymentMethod;
    bankAccount: BankAccount;
    approvedByUser: User;
    get netPaymentAmount(): number;
    get isFullyAllocated(): boolean;
}
