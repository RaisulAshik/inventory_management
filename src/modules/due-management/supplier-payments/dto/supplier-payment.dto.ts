// src/modules/purchase/supplier-payments/dto/supplier-payment.dto.ts

import {
  IsUUID,
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '@common/dto/pagination.dto';

export class PaymentAllocationDto {
  @ApiProperty() @IsUUID() supplierDueId: string;
  @ApiProperty() @IsNumber() @Min(0.01) amount: number;
  @ApiPropertyOptional() @IsString() @IsOptional() notes?: string;
}

export class CreateSupplierPaymentDto {
  @ApiProperty() @IsUUID() supplierId: string;
  @ApiProperty() @IsUUID() paymentMethodId: string;
  @ApiPropertyOptional() @IsUUID() @IsOptional() bankAccountId?: string;

  @ApiProperty() @IsNumber() @Min(0.01) amount: number;
  @ApiProperty() @IsDateString() paymentDate: string;
  @ApiPropertyOptional() @IsString() @IsOptional() currency?: string;
  @ApiPropertyOptional() @IsNumber() @IsOptional() exchangeRate?: number;

  @ApiPropertyOptional() @IsString() @IsOptional() referenceNumber?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() chequeNumber?: string;
  @ApiPropertyOptional() @IsDateString() @IsOptional() chequeDate?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() bankReference?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() transactionId?: string;

  @ApiPropertyOptional() @IsNumber() @IsOptional() tdsPercentage?: number;
  @ApiPropertyOptional() @IsNumber() @IsOptional() tdsAmount?: number;

  @ApiPropertyOptional() @IsString() @IsOptional() notes?: string;

  @ApiPropertyOptional({ type: [PaymentAllocationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentAllocationDto)
  @IsOptional()
  allocations?: PaymentAllocationDto[];
}

export class AllocatePaymentDto {
  @ApiProperty({ type: [PaymentAllocationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentAllocationDto)
  allocations: PaymentAllocationDto[];
}

export class SupplierPaymentFilterDto extends PaginationDto {
  //@IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsUUID() supplierId?: string;
  @IsOptional() @IsString() fromDate?: string;
  @IsOptional() @IsString() toDate?: string;
}
