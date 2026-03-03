export declare enum InvoiceType {
    SALES_INVOICE = "SALES_INVOICE",
    PURCHASE_INVOICE = "PURCHASE_INVOICE",
    CREDIT_NOTE = "CREDIT_NOTE",
    DEBIT_NOTE = "DEBIT_NOTE",
    PROFORMA = "PROFORMA"
}
export declare enum InvoiceStatus {
    DRAFT = "DRAFT",
    SENT = "SENT",
    PARTIALLY_PAID = "PARTIALLY_PAID",
    PAID = "PAID",
    OVERDUE = "OVERDUE",
    VOID = "VOID",
    CANCELLED = "CANCELLED"
}
export declare class CreateInvoiceItemDto {
    productId?: string;
    description: string;
    quantity: number;
    unitPrice: number;
    discountPercent?: number;
    discountAmount?: number;
    taxCodeId?: string;
    accountId?: string;
    costCenterId?: string;
}
export declare class CreateInvoiceDto {
    invoiceType: InvoiceType;
    invoiceDate: string;
    dueDate: string;
    customerId?: string;
    supplierId?: string;
    referenceNumber?: string;
    terms?: string;
    notes?: string;
    items: CreateInvoiceItemDto[];
    discountAmount?: number;
    shippingCharges?: number;
    otherCharges?: number;
    currency?: string;
    exchangeRate?: number;
}
export declare class UpdateInvoiceDto {
    invoiceDate?: string;
    dueDate?: string;
    referenceNumber?: string;
    terms?: string;
    notes?: string;
    items?: CreateInvoiceItemDto[];
    discountAmount?: number;
    shippingCharges?: number;
    otherCharges?: number;
}
export declare class SendInvoiceDto {
    email: string;
    message?: string;
}
export declare class RecordPaymentDto {
    amount: number;
    paymentDate: string;
    paymentMethod: string;
    bankAccountId?: string;
    referenceNumber?: string;
    notes?: string;
}
