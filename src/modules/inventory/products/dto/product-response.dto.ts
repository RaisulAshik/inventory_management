import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Product } from '@entities/tenant/inventory/product.entity';
import { ProductType } from '@common/enums';

class CategoryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  categoryCode: string;

  @ApiProperty()
  categoryName: string;
}

class BrandDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  brandCode: string;

  @ApiProperty()
  brandName: string;
}

class UomDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  uomCode: string;

  @ApiProperty()
  uomName: string;
}

class ProductImageDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  imageUrl: string;

  @ApiPropertyOptional()
  thumbnailUrl?: string;

  @ApiPropertyOptional()
  altText?: string;

  @ApiProperty()
  isPrimary: boolean;

  @ApiProperty()
  sortOrder: number;
}

class ProductVariantDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  variantSku: string;

  @ApiPropertyOptional()
  variantBarcode?: string;

  @ApiProperty()
  variantName: string;

  @ApiPropertyOptional()
  costPrice?: number;

  @ApiPropertyOptional()
  sellingPrice?: number;

  @ApiPropertyOptional()
  mrp?: number;

  @ApiProperty()
  isActive: boolean;
}

export class ProductResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  sku: string;

  @ApiPropertyOptional()
  barcode?: string;

  @ApiProperty()
  productName: string;

  @ApiPropertyOptional()
  shortName?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: ProductType })
  productType: ProductType;

  @ApiProperty()
  isStockable: boolean;

  @ApiProperty()
  isPurchasable: boolean;

  @ApiProperty()
  isSellable: boolean;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  trackSerial: boolean;

  @ApiProperty()
  trackBatch: boolean;

  @ApiProperty()
  trackExpiry: boolean;

  @ApiPropertyOptional()
  shelfLifeDays?: number;

  @ApiPropertyOptional()
  hsnCode?: string;

  @ApiProperty()
  costPrice: number;

  @ApiProperty()
  sellingPrice: number;

  @ApiPropertyOptional()
  mrp?: number;

  @ApiPropertyOptional()
  minimumPrice?: number;

  @ApiPropertyOptional()
  wholesalePrice?: number;

  @ApiProperty()
  reorderLevel: number;

  @ApiProperty()
  reorderQuantity: number;

  @ApiProperty()
  minimumOrderQuantity: number;

  @ApiPropertyOptional()
  maximumOrderQuantity?: number;

  @ApiPropertyOptional({ type: CategoryDto })
  category?: CategoryDto;

  @ApiPropertyOptional({ type: BrandDto })
  brand?: BrandDto;

  @ApiPropertyOptional({ type: UomDto })
  baseUom?: UomDto;

  @ApiPropertyOptional({ type: [ProductImageDto] })
  images?: ProductImageDto[];

  @ApiPropertyOptional({ type: [ProductVariantDto] })
  variants?: ProductVariantDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(product: Product) {
    this.id = product.id;
    this.sku = product.sku;
    this.barcode = product.barcode;
    this.productName = product.productName;
    this.shortName = product.shortName;
    this.description = product.description;
    this.productType = product.productType;
    this.isStockable = product.isStockable;
    this.isPurchasable = product.isPurchasable;
    this.isSellable = product.isSellable;
    this.isActive = product.isActive;
    this.trackSerial = product.trackSerial;
    this.trackBatch = product.trackBatch;
    this.trackExpiry = product.trackExpiry;
    this.shelfLifeDays = product.shelfLifeDays;
    this.hsnCode = product.hsnCode;
    this.costPrice = Number(product.costPrice);
    this.sellingPrice = Number(product.sellingPrice);
    this.mrp = product.mrp ? Number(product.mrp) : undefined;
    this.minimumPrice = product.minimumPrice
      ? Number(product.minimumPrice)
      : undefined;
    this.wholesalePrice = product.wholesalePrice
      ? Number(product.wholesalePrice)
      : undefined;
    this.reorderLevel = Number(product.reorderLevel);
    this.reorderQuantity = Number(product.reorderQuantity);
    this.minimumOrderQuantity = Number(product.minimumOrderQuantity);
    this.maximumOrderQuantity = product.maximumOrderQuantity
      ? Number(product.maximumOrderQuantity)
      : undefined;
    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;

    if (product.category) {
      this.category = {
        id: product.category.id,
        categoryCode: product.category.categoryCode,
        categoryName: product.category.categoryName,
      };
    }

    if (product.brand) {
      this.brand = {
        id: product.brand.id,
        brandCode: product.brand.brandCode,
        brandName: product.brand.brandName,
      };
    }

    if (product.baseUom) {
      this.baseUom = {
        id: product.baseUom.id,
        uomCode: product.baseUom.uomCode,
        uomName: product.baseUom.uomName,
      };
    }

    if (product.images) {
      this.images = product.images.map((img: any) => ({
        id: img.id,
        imageUrl: img.imageUrl,
        thumbnailUrl: img.thumbnailUrl,
        altText: img.altText,
        isPrimary: img.isPrimary,
        sortOrder: img.sortOrder,
      }));
    }

    if (product.variants) {
      this.variants = product.variants.map((v: any) => ({
        id: v.id,
        variantSku: v.variantSku,
        variantBarcode: v.variantBarcode,
        variantName: v.variantName,
        costPrice: v.costPrice ? Number(v.costPrice) : undefined,
        sellingPrice: v.sellingPrice ? Number(v.sellingPrice) : undefined,
        mrp: v.mrp ? Number(v.mrp) : undefined,
        isActive: v.isActive,
      }));
    }
  }
}
