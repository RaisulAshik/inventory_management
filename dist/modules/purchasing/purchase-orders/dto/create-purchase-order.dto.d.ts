declare class CreatePurchaseOrderItemDto {
    productId: string;
    variantId?: string;
    quantityOrdered: number;
    uomId?: string;
    unitPrice?: number;
    discountPercentage?: number;
    discountAmount?: number;
    notes?: string;
}
export declare class CreatePurchaseOrderDto {
    supplierId: string;
    warehouseId: string;
    poDate?: Date;
    orderDate?: Date;
    expectedDeliveryDate?: Date;
    currency?: string;
    exchangeRate?: number;
    discountPercentage?: number;
    discountAmount?: number;
    shippingAmount?: number;
    otherCharges?: number;
    paymentTermsDays?: number;
    notes?: string;
    internalNotes?: string;
    items: CreatePurchaseOrderItemDto[];
}
export {};
