import { PriceList } from './price-list.entity';
import { Product } from './product.entity';
import { ProductVariant } from './product-variant.entity';
import { UnitOfMeasure } from './unit-of-measure.entity';
export declare class PriceListItem {
    id: string;
    priceListId: string;
    productId: string;
    variantId: string;
    uomId: string;
    price: number;
    minQuantity: number;
    maxQuantity: number;
    discountPercentage: number;
    discountAmount: number;
    effectiveFrom: Date;
    effectiveTo: Date;
    createdAt: Date;
    updatedAt: Date;
    priceList: PriceList;
    product: Product;
    variant: ProductVariant;
    uom: UnitOfMeasure;
    get netPrice(): number;
}
