import { PriceListItem } from './price-list-item.entity';
export declare enum PriceListType {
    SALES = "SALES",
    PURCHASE = "PURCHASE"
}
export declare class PriceList {
    id: string;
    priceListCode: string;
    priceListName: string;
    priceListType: PriceListType;
    description: string;
    currency: string;
    isTaxInclusive: boolean;
    effectiveFrom: Date;
    effectiveTo: Date;
    minOrderAmount: number;
    discountPercentage: number;
    priority: number;
    isDefault: boolean;
    isActive: boolean;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    items: PriceListItem[];
    get isEffective(): boolean;
}
