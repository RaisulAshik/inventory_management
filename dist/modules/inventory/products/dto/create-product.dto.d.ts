import { ProductType } from '@common/enums';
declare class CreateProductImageDto {
    imageUrl: string;
    thumbnailUrl?: string;
    altText?: string;
    isPrimary?: boolean;
    sortOrder?: number;
}
declare class CreateProductVariantDto {
    variantSku?: string;
    variantBarcode?: string;
    variantName: string;
    costPrice?: number;
    sellingPrice?: number;
    mrp?: number;
    weight?: number;
    imageUrl?: string;
}
export declare class CreateProductDto {
    sku?: string;
    barcode?: string;
    productName: string;
    shortName?: string;
    description?: string;
    categoryId?: string;
    brandId?: string;
    baseUomId: string;
    secondaryUomId?: string;
    uomConversionFactor?: number;
    productType?: ProductType;
    isStockable?: boolean;
    isPurchasable?: boolean;
    isSellable?: boolean;
    isActive?: boolean;
    trackSerial?: boolean;
    trackBatch?: boolean;
    trackExpiry?: boolean;
    shelfLifeDays?: number;
    hsnCode?: string;
    taxCategoryId?: string;
    costPrice?: number;
    sellingPrice?: number;
    mrp?: number;
    minimumPrice?: number;
    wholesalePrice?: number;
    weight?: number;
    weightUnit?: string;
    length?: number;
    width?: number;
    height?: number;
    dimensionUnit?: string;
    reorderLevel?: number;
    reorderQuantity?: number;
    minimumOrderQuantity?: number;
    maximumOrderQuantity?: number;
    leadTimeDays?: number;
    warrantyMonths?: number;
    notes?: string;
    images?: CreateProductImageDto[];
    variants?: CreateProductVariantDto[];
}
export {};
