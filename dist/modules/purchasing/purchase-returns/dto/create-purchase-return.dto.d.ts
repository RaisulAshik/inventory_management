export declare enum PurchaseReturnType {
    DAMAGED = "DAMAGED",
    DEFECTIVE = "DEFECTIVE",
    WRONG_ITEM = "WRONG_ITEM",
    QUALITY_ISSUE = "QUALITY_ISSUE",
    EXCESS_QUANTITY = "EXCESS_QUANTITY",
    OTHER = "OTHER"
}
declare class CreatePurchaseReturnItemDto {
    productId: string;
    variantId?: string;
    quantity: number;
    uomId: string;
    unitPrice: number;
    taxAmount?: number;
    reason?: string;
    condition?: string;
}
export declare class CreatePurchaseReturnDto {
    purchaseOrderId?: string;
    grnId?: string;
    warehouseId?: string;
    returnDate?: Date;
    returnType: PurchaseReturnType;
    reason: string;
    reasonDetails?: string;
    notes?: string;
    items: CreatePurchaseReturnItemDto[];
}
export {};
