// src/modules/quotations/dto/create-quotation.dto.ts

import {
  IsString,
  IsUUID,
  IsOptional,
  IsArray,
  IsNumber,
  IsEnum,
  ValidateNested,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateQuotationItemDto {
  @ApiProperty()
  @IsUUID()
  productId: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  variantId?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  uomId?: string;

  @ApiProperty()
  @IsNumber()
  @Min(0.0001)
  quantity: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiPropertyOptional({ enum: ['PERCENTAGE', 'FIXED'] })
  @IsEnum(['PERCENTAGE', 'FIXED'])
  @IsOptional()
  discountType?: 'PERCENTAGE' | 'FIXED';

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  discountValue?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateQuotationDto {
  @ApiProperty()
  @IsUUID()
  customerId: string;

  @ApiProperty()
  @IsUUID()
  warehouseId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  quotationDate: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  validUntil?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  billingAddressId?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  shippingAddressId?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  paymentTermsId?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  salesPersonId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  referenceNumber?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  internalNotes?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  termsAndConditions?: string;

  @ApiProperty({ type: [CreateQuotationItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuotationItemDto)
  items: CreateQuotationItemDto[];

  @ApiPropertyOptional({ enum: ['PERCENTAGE', 'FIXED'] })
  @IsEnum(['PERCENTAGE', 'FIXED'])
  @IsOptional()
  discountType?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  discountValue?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  shippingAmount?: number;
}
