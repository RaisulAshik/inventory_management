// src/modules/purchase/supplier-dues/dto/supplier-due.dto.ts

import {
  IsUUID,
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsEnum,
  IsBoolean,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '@common/dto/pagination.dto';
import { DueStatus } from '@common/enums';
import { Transform } from 'class-transformer';

export class CreateSupplierOpeningBalanceDto {
  @ApiProperty() @IsUUID() supplierId: string;
  @ApiProperty() @IsNumber() @Min(0.01) originalAmount: number;
  @ApiProperty() @IsDateString() dueDate: string;
  @ApiPropertyOptional() @IsString() @IsOptional() referenceNumber?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() billNumber?: string;
  @ApiPropertyOptional() @IsDateString() @IsOptional() billDate?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() currency?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() notes?: string;
}

export class AdjustSupplierDueDto {
  @ApiProperty() @IsNumber() @Min(0.01) amount: number;
  @ApiPropertyOptional() @IsString() @IsOptional() reason?: string;
}

export class SupplierDueFilterDto extends PaginationDto {
  //@IsOptional() @IsString() search?: string;
  @IsOptional() @IsEnum(DueStatus) status?: DueStatus;
  @IsOptional() @IsUUID() supplierId?: string;
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  overdueOnly?: boolean;
  @IsOptional() @IsString() fromDate?: string;
  @IsOptional() @IsString() toDate?: string;
}
