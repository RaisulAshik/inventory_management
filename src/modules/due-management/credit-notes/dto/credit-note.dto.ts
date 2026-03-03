// src/modules/sales/credit-notes/dto/credit-note.dto.ts

import {
  IsUUID,
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsEnum,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreditNoteReason } from '@entities/tenant';
import { PaginationDto } from '@common/dto/pagination.dto';

export class CreditNoteItemDto {
  @ApiProperty() @IsUUID() productId: string;
  @ApiPropertyOptional() @IsUUID() @IsOptional() variantId?: string;
  @ApiProperty() @IsString() productName: string;
  @ApiProperty() @IsString() sku: string;
  @ApiProperty() @IsNumber() @Min(0.0001) quantity: number;
  @ApiProperty() @IsNumber() @Min(0) unitPrice: number;
  @ApiPropertyOptional() @IsNumber() @IsOptional() taxRate?: number;
  @ApiPropertyOptional() @IsNumber() @IsOptional() taxAmount?: number;
  @ApiProperty() @IsNumber() lineTotal: number;
  @ApiPropertyOptional() @IsString() @IsOptional() notes?: string;
}

export class CreateCreditNoteDto {
  @ApiProperty() @IsUUID() customerId: string;
  @ApiPropertyOptional() @IsUUID() @IsOptional() salesOrderId?: string;
  @ApiPropertyOptional() @IsUUID() @IsOptional() salesReturnId?: string;

  @ApiProperty({ enum: CreditNoteReason })
  @IsEnum(CreditNoteReason)
  reason: CreditNoteReason;

  @ApiPropertyOptional() @IsString() @IsOptional() reasonDetails?: string;
  @ApiProperty() @IsDateString() creditNoteDate: string;
  @ApiPropertyOptional() @IsDateString() @IsOptional() validUntil?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() currency?: string;

  @ApiProperty() @IsNumber() @Min(0) subtotal: number;
  @ApiPropertyOptional() @IsNumber() @IsOptional() taxAmount?: number;
  @ApiProperty() @IsNumber() @Min(0.01) totalAmount: number;

  @ApiPropertyOptional() @IsString() @IsOptional() notes?: string;

  @ApiPropertyOptional({ type: [CreditNoteItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreditNoteItemDto)
  @IsOptional()
  items?: CreditNoteItemDto[];
}

export class ApplyToDueDto {
  @ApiProperty() @IsUUID() customerDueId: string;
  @ApiProperty() @IsNumber() @Min(0.01) amount: number;
}

export class CreditNoteFilterDto extends PaginationDto {
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsUUID() customerId?: string;
  @IsOptional() @IsString() reason?: string;
  @IsOptional() @IsString() fromDate?: string;
  @IsOptional() @IsString() toDate?: string;
}
