import { Quotation } from '@/entities/tenant';
export declare class QuotationResponseDto {
    id: string;
    quotationNumber: string;
    customerId: string;
    customerName: string;
    warehouseId: string;
    quotationDate: Date;
    validUntil: Date;
    status: string;
    subtotal: number;
    discountAmount: number;
    taxAmount: number;
    shippingAmount: number;
    totalAmount: number;
    salesOrderId: string;
    salesOrderNumber: string;
    itemCount: number;
    createdAt: Date;
    constructor(quotation: Quotation);
}
export declare class QuotationDetailResponseDto extends QuotationResponseDto {
    warehouseName: string;
    billingAddressId: string;
    shippingAddressId: string;
    referenceNumber: string;
    salesPersonId: string;
    paymentTermsId: string;
    currency: string;
    discountType: string;
    discountValue: number;
    notes: string;
    internalNotes: string;
    termsAndConditions: string;
    rejectionReason: string;
    createdBy: string;
    updatedAt: Date;
    items: any[];
    constructor(quotation: Quotation);
}
