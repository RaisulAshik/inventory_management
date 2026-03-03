import { PriceListType, PriceList } from '@entities/tenant';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class PriceListItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  productId: string;

  @ApiPropertyOptional()
  productName?: string;

  @ApiPropertyOptional()
  productSku?: string;

  @ApiPropertyOptional()
  variantId?: string;

  @ApiPropertyOptional()
  variantName?: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  minQuantity: number;

  @ApiPropertyOptional()
  maxQuantity?: number;

  @ApiProperty()
  discountPercentage: number;

  @ApiProperty()
  discountAmount: number;

  @ApiPropertyOptional()
  effectiveFrom?: Date;

  @ApiPropertyOptional()
  effectiveTo?: Date;
}

export class PriceListResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  priceListCode: string;

  @ApiProperty()
  priceListName: string;

  @ApiProperty({ enum: PriceListType })
  priceListType: PriceListType;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  isTaxInclusive: boolean;

  @ApiPropertyOptional()
  effectiveFrom?: Date;

  @ApiPropertyOptional()
  effectiveTo?: Date;

  @ApiPropertyOptional()
  minOrderAmount?: number;

  @ApiProperty()
  discountPercentage: number;

  @ApiProperty()
  priority: number;

  @ApiProperty()
  isDefault: boolean;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isEffective: boolean;

  @ApiPropertyOptional({ type: [PriceListItemDto] })
  items?: PriceListItemDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(priceList: PriceList) {
    this.id = priceList.id;
    this.priceListCode = priceList.priceListCode;
    this.priceListName = priceList.priceListName;
    this.priceListType = priceList.priceListType;
    this.description = priceList.description;
    this.currency = priceList.currency;
    this.isTaxInclusive = priceList.isTaxInclusive;
    this.effectiveFrom = priceList.effectiveFrom;
    this.effectiveTo = priceList.effectiveTo;
    this.minOrderAmount = priceList.minOrderAmount
      ? Number(priceList.minOrderAmount)
      : undefined;
    this.discountPercentage = Number(priceList.discountPercentage);
    this.priority = priceList.priority;
    this.isDefault = priceList.isDefault;
    this.isActive = priceList.isActive;
    this.isEffective = priceList.isEffective;
    this.createdAt = priceList.createdAt;
    this.updatedAt = priceList.updatedAt;

    if (priceList.items) {
      this.items = priceList.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product?.productName,
        productSku: item.product?.sku,
        variantId: item.variantId,
        variantName: item.variant?.variantName,
        price: Number(item.price),
        minQuantity: Number(item.minQuantity),
        maxQuantity: item.maxQuantity ? Number(item.maxQuantity) : undefined,
        discountPercentage: Number(item.discountPercentage),
        discountAmount: Number(item.discountAmount),
        effectiveFrom: item.effectiveFrom,
        effectiveTo: item.effectiveTo,
      }));
    }
  }
}
