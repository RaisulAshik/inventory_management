import { Product } from './product.entity';
import { ProductVariantAttribute } from './product-variant-attribute.entity';
export declare class ProductVariant {
    id: string;
    productId: string;
    variantSku: string;
    variantBarcode: string;
    variantName: string;
    costPrice: number;
    sellingPrice: number;
    mrp: number;
    weight: number;
    imageUrl: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    product: Product;
    attributes: ProductVariantAttribute[];
}
