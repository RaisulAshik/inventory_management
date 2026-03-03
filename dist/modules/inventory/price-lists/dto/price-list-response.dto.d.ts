import { PriceListType, PriceList } from '@entities/tenant';
declare class PriceListItemDto {
    id: string;
    productId: string;
    productName?: string;
    productSku?: string;
    variantId?: string;
    variantName?: string;
    price: number;
    minQuantity: number;
    maxQuantity?: number;
    discountPercentage: number;
    discountAmount: number;
    effectiveFrom?: Date;
    effectiveTo?: Date;
}
export declare class PriceListResponseDto {
    id: string;
    priceListCode: string;
    priceListName: string;
    priceListType: PriceListType;
    description?: string;
    currency: string;
    isTaxInclusive: boolean;
    effectiveFrom?: Date;
    effectiveTo?: Date;
    minOrderAmount?: number;
    discountPercentage: number;
    priority: number;
    isDefault: boolean;
    isActive: boolean;
    isEffective: boolean;
    items?: PriceListItemDto[];
    createdAt: Date;
    updatedAt: Date;
    constructor(priceList: PriceList);
}
export {};
