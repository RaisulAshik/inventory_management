import { Product } from '@entities/tenant/inventory/product.entity';
import { ProductType } from '@common/enums';
declare class CategoryDto {
    id: string;
    categoryCode: string;
    categoryName: string;
}
declare class BrandDto {
    id: string;
    brandCode: string;
    brandName: string;
}
declare class UomDto {
    id: string;
    uomCode: string;
    uomName: string;
}
declare class ProductImageDto {
    id: string;
    imageUrl: string;
    thumbnailUrl?: string;
    altText?: string;
    isPrimary: boolean;
    sortOrder: number;
}
declare class ProductVariantDto {
    id: string;
    variantSku: string;
    variantBarcode?: string;
    variantName: string;
    costPrice?: number;
    sellingPrice?: number;
    mrp?: number;
    isActive: boolean;
}
export declare class ProductResponseDto {
    id: string;
    sku: string;
    barcode?: string;
    productName: string;
    shortName?: string;
    description?: string;
    productType: ProductType;
    isStockable: boolean;
    isPurchasable: boolean;
    isSellable: boolean;
    isActive: boolean;
    trackSerial: boolean;
    trackBatch: boolean;
    trackExpiry: boolean;
    shelfLifeDays?: number;
    hsnCode?: string;
    costPrice: number;
    sellingPrice: number;
    mrp?: number;
    minimumPrice?: number;
    wholesalePrice?: number;
    reorderLevel: number;
    reorderQuantity: number;
    minimumOrderQuantity: number;
    maximumOrderQuantity?: number;
    category?: CategoryDto;
    brand?: BrandDto;
    baseUom?: UomDto;
    images?: ProductImageDto[];
    variants?: ProductVariantDto[];
    createdAt: Date;
    updatedAt: Date;
    constructor(product: Product);
}
export {};
