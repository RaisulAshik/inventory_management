import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsUUID,
  IsDate,
  IsEnum,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  SalesReturnReason,
  RefundType,
} from '@entities/tenant/eCommerce/sales-return.entity';

class CreateReturnItemDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  variantId?: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(0.0001)
  quantity: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({ enum: ['GOOD', 'LIKE_NEW', 'DAMAGED', 'DEFECTIVE'] })
  @IsOptional()
  @IsString()
  condition?: string;
}

export class CreateReturnDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  salesOrderId: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  warehouseId?: string;

  @ApiProperty({ enum: RefundType, default: RefundType.ORIGINAL_PAYMENT })
  @IsEnum(RefundType)
  refundType: RefundType;

  @ApiProperty({ enum: SalesReturnReason })
  @IsEnum(SalesReturnReason)
  returnReason: SalesReturnReason;

  @ApiPropertyOptional({ type: 'string', format: 'date' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  returnDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reasonDetails?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  restockingFeePercent?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ type: [CreateReturnItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReturnItemDto)
  items: CreateReturnItemDto[];
}
