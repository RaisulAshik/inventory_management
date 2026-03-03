declare class CreateOrderItemDto {
    productId: string;
    variantId?: string;
    quantity: number;
    uomId?: string;
    unitPrice?: number;
    discountPercentage?: number;
    discountAmount?: number;
    notes?: string;
}
declare class AddressDto {
    name?: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
}
export declare class CreateOrderDto {
    customerId: string;
    warehouseId: string;
    billingAddress?: AddressDto;
    shippingAddress?: AddressDto;
    orderDate?: Date;
    expectedDeliveryDate?: Date;
    currency?: string;
    exchangeRate?: number;
    discountPercentage?: number;
    discountAmount?: number;
    shippingAmount?: number;
    notes?: string;
    internalNotes?: string;
    items: CreateOrderItemDto[];
}
export {};
