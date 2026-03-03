export declare class CreateQuotationItemDto {
    productId: string;
    variantId?: string;
    productName: string;
    productSku?: string;
    description?: string;
    unit?: string;
    unitPrice: number;
    quantity: number;
    discountPercentage?: number;
    discountAmount?: number;
    taxRate?: number;
    taxAmount?: number;
    lineTotal: number;
    sortOrder?: number;
    notes?: string;
    discountType: string;
    discountValue: number;
}
export declare class CreateQuotationDto {
    customerId: string;
    salesPersonId?: string;
    quotationDate: string;
    validUntil: string;
    currency?: string;
    items: CreateQuotationItemDto[];
    subtotal?: number;
    discountAmount?: number;
    discountPercentage?: number;
    taxAmount?: number;
    shippingAmount?: number;
    totalAmount?: number;
    notes?: string;
    internalNotes?: string;
    termsAndConditions?: string;
    customerReferenceNumber?: string;
    discountType: string;
    discountValue: number;
}
declare const UpdateQuotationDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateQuotationDto>>;
export declare class UpdateQuotationDto extends UpdateQuotationDto_base {
}
export declare class QuotationFilterDto {
    quotationNumber?: string;
    status?: string;
    customerId?: string;
    salesPersonId?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
}
export {};
