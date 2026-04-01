// src/modules/quotations/dto/quotation-filter.dto.ts

import { IsOptional, IsString, IsEnum, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '@common/dto/pagination.dto';
import { QuotationStatus } from '@/entities/tenant';

export class QuotationFilterDto extends PaginationDto {
  @ApiPropertyOptional({ enum: QuotationStatus })
  @IsEnum(QuotationStatus)
  @IsOptional()
  status?: QuotationStatus;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  customerId?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  warehouseId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  fromDate?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  toDate?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  sortField?: string;

  @ApiPropertyOptional({ description: 'Filter by quotation number (partial match)' })
  @IsString()
  @IsOptional()
  quotationNumber?: string;
}
