import { BankAccount } from '../accounting/bank-account.entity';
import { Customer } from '../eCommerce/customer.entity';
import { PaymentMethod } from '../eCommerce/payment-method.entity';
import { User } from '../user/user.entity';
export declare enum CollectionStatus {
    DRAFT = "DRAFT",
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    DEPOSITED = "DEPOSITED",
    BOUNCED = "BOUNCED",
    CANCELLED = "CANCELLED"
}
export declare class CustomerDueCollection {
    id: string;
    collectionNumber: string;
    collectionDate: Date;
    customerId: string;
    paymentMethodId: string;
    amount: number;
    currency: string;
    status: CollectionStatus;
    referenceNumber: string;
    chequeNumber: string;
    chequeDate: Date;
    chequeBank: string;
    bankAccountId: string;
    depositDate: Date;
    clearanceDate: Date;
    bounceDate: Date;
    bounceReason: string;
    bounceCharges: number;
    allocatedAmount: number;
    unallocatedAmount: number;
    journalEntryId: string;
    notes: string;
    receivedBy: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    customer: Customer;
    paymentMethod: PaymentMethod;
    bankAccount: BankAccount;
    receivedByUser: User;
    get isFullyAllocated(): boolean;
}
