import { PriceListType } from '@entities/tenant';
import { CreatePriceListItemDto } from './create-price-list-item.dto';
export declare class CreatePriceListDto {
    priceListCode: string;
    priceListName: string;
    priceListType: PriceListType;
    description?: string;
    currency?: string;
    isTaxInclusive?: boolean;
    effectiveFrom?: Date;
    effectiveTo?: Date;
    minOrderAmount?: number;
    discountPercentage?: number;
    priority?: number;
    isDefault?: boolean;
    isActive?: boolean;
    items?: CreatePriceListItemDto[];
}
