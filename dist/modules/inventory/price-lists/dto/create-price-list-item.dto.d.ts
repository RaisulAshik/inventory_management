export declare class CreatePriceListItemDto {
    productId: string;
    variantId?: string;
    uomId?: string;
    price: number;
    minQuantity?: number;
    maxQuantity?: number;
    discountPercentage?: number;
    discountAmount?: number;
    effectiveFrom?: Date;
    effectiveTo?: Date;
}
