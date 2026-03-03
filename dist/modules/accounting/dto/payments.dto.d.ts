export declare enum PaymentType {
    RECEIVED = "RECEIVED",
    SENT = "SENT"
}
export declare enum PaymentMethod {
    CASH = "CASH",
    CHEQUE = "CHEQUE",
    BANK_TRANSFER = "BANK_TRANSFER",
    CREDIT_CARD = "CREDIT_CARD",
    DEBIT_CARD = "DEBIT_CARD",
    MOBILE_PAYMENT = "MOBILE_PAYMENT",
    OTHER = "OTHER"
}
export declare enum PaymentStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
    RECONCILED = "RECONCILED"
}
export declare class PaymentAllocationDto {
    invoiceId: string;
    amount: number;
    discountAmount?: number;
}
export declare class CreatePaymentDto {
    paymentType: PaymentType;
    paymentDate: string;
    amount: number;
    paymentMethod: PaymentMethod;
    customerId?: string;
    supplierId?: string;
    bankAccountId?: string;
    referenceNumber?: string;
    notes?: string;
    currency?: string;
    exchangeRate?: number;
    allocations?: PaymentAllocationDto[];
}
export declare class UpdatePaymentDto {
    paymentDate?: string;
    amount?: number;
    paymentMethod?: PaymentMethod;
    bankAccountId?: string;
    referenceNumber?: string;
    notes?: string;
    allocations?: PaymentAllocationDto[];
}
export declare class AllocatePaymentDto {
    allocations: PaymentAllocationDto[];
}
