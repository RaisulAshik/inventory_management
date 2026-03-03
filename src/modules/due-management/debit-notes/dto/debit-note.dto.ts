// src/modules/purchase/debit-notes/dto/debit-note.dto.ts

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
import { DebitNoteReason } from '@entities/tenant';
import { PaginationDto } from '@common/dto/pagination.dto';

export class DebitNoteItemDto {
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

export class CreateDebitNoteDto {
  @ApiProperty() @IsUUID() supplierId: string;
  @ApiPropertyOptional() @IsUUID() @IsOptional() purchaseOrderId?: string;
  @ApiPropertyOptional() @IsUUID() @IsOptional() grnId?: string;
  @ApiPropertyOptional() @IsUUID() @IsOptional() purchaseReturnId?: string;

  @ApiProperty({ enum: DebitNoteReason })
  @IsEnum(DebitNoteReason)
  reason: DebitNoteReason;

  @ApiPropertyOptional() @IsString() @IsOptional() reasonDetails?: string;
  @ApiProperty() @IsDateString() debitNoteDate: string;
  @ApiPropertyOptional() @IsString() @IsOptional() currency?: string;

  @ApiProperty() @IsNumber() @Min(0) subtotal: number;
  @ApiPropertyOptional() @IsNumber() @IsOptional() taxAmount?: number;
  @ApiProperty() @IsNumber() @Min(0.01) totalAmount: number;

  @ApiPropertyOptional() @IsString() @IsOptional() notes?: string;

  @ApiPropertyOptional({ type: [DebitNoteItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DebitNoteItemDto)
  @IsOptional()
  items?: DebitNoteItemDto[];
}

export class AcknowledgeDebitNoteDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  acknowledgementNumber?: string;
  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  acknowledgementDate?: string;
}

export class ApplyToSupplierDueDto {
  @ApiProperty() @IsUUID() supplierDueId: string;
  @ApiProperty() @IsNumber() @Min(0.01) amount: number;
}

export class DebitNoteFilterDto extends PaginationDto {
  //@IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsUUID() supplierId?: string;
  @IsOptional() @IsString() reason?: string;
  @IsOptional() @IsString() fromDate?: string;
  @IsOptional() @IsString() toDate?: string;
}
