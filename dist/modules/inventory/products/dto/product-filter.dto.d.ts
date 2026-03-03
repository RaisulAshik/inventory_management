import { ProductType } from '@common/enums';
export declare class ProductFilterDto {
    categoryId?: string;
    brandId?: string;
    productType?: ProductType;
    isActive?: boolean;
    isStockable?: boolean;
    isSellable?: boolean;
    isPurchasable?: boolean;
    trackSerial?: boolean;
    trackBatch?: boolean;
    minPrice?: number;
    maxPrice?: number;
}
