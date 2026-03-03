import { QuotationItem } from './quotation-item.entity';
import { Customer } from '../eCommerce/customer.entity';
import { Warehouse } from '../warehouse/warehouse.entity';
export declare enum QuotationStatus {
    DRAFT = "DRAFT",
    SENT = "SENT",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    EXPIRED = "EXPIRED",
    CONVERTED = "CONVERTED",
    CANCELLED = "CANCELLED"
}
export declare class Quotation {
    id: string;
    quotationNumber: string;
    customerId: string;
    customer: Customer;
    warehouseId: string;
    warehouse: Warehouse;
    quotationDate: Date;
    validUntil: Date;
    status: QuotationStatus;
    currency: string;
    subtotal: number;
    discountType: string;
    discountValue: number;
    discountAmount: number;
    taxAmount: number;
    shippingAmount: number;
    totalAmount: number;
    billingAddressId: string;
    shippingAddressId: string;
    referenceNumber: string;
    salesPersonId: string;
    paymentTermsId: string;
    salesOrderId: string;
    salesOrderNumber: string;
    notes: string;
    internalNotes: string;
    termsAndConditions: string;
    rejectionReason: string;
    createdBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
    items: QuotationItem[];
    get isExpired(): boolean;
    get isConverted(): boolean;
}
