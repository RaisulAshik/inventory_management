export declare class CreateQuotationItemDto {
    productId: string;
    variantId?: string;
    uomId?: string;
    quantity: number;
    unitPrice: number;
    discountType?: 'PERCENTAGE' | 'FIXED';
    discountValue?: number;
    notes?: string;
}
export declare class CreateQuotationDto {
    customerId: string;
    warehouseId: string;
    quotationDate: string;
    validUntil?: string;
    billingAddressId?: string;
    shippingAddressId?: string;
    paymentTermsId?: string;
    salesPersonId?: string;
    referenceNumber?: string;
    notes?: string;
    internalNotes?: string;
    termsAndConditions?: string;
    items: CreateQuotationItemDto[];
    discountType?: string;
    discountValue?: number;
    shippingAmount?: number;
}
