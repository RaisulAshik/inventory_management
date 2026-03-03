// src/modules/sales/collections/dto/create-collection.dto.ts

import {
  IsUUID,
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsArray,
  ValidateNested,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CollectionAllocationDto {
  @ApiProperty()
  @IsUUID()
  customerDueId: string;

  @ApiProperty()
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateCollectionDto {
  @ApiProperty()
  @IsUUID()
  customerId: string;

  @ApiProperty()
  @IsUUID()
  paymentMethodId: string;

  @ApiProperty()
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty()
  @IsDateString()
  collectionDate: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  referenceNumber?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  chequeNumber?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  chequeDate?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  chequeBank?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ type: [CollectionAllocationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CollectionAllocationDto)
  @IsOptional()
  allocations?: CollectionAllocationDto[];
}

export class AllocateCollectionDto {
  @ApiProperty({ type: [CollectionAllocationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CollectionAllocationDto)
  allocations: CollectionAllocationDto[];
}

export class DepositDto {
  @ApiProperty()
  @IsUUID()
  bankAccountId: string;

  @ApiProperty()
  @IsDateString()
  depositDate: string;
}

export class BounceDto {
  @ApiProperty()
  @IsDateString()
  bounceDate: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bounceReason: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  bounceCharges?: number;
}

export class CollectionFilterDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsUUID() customerId?: string;
  @IsOptional() @IsString() fromDate?: string;
  @IsOptional() @IsString() toDate?: string;
  @IsOptional() @IsString() sortBy?: string;
  @IsOptional() @IsString() sortOrder?: 'ASC' | 'DESC';
  @IsOptional() @IsNumber() page?: number;
  @IsOptional() @IsNumber() limit?: number;
}
