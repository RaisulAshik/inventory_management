import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsEnum, IsDateString, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaymentStatus } from '@common/enums';

export class InvoiceCustomerFilterDto {
  @IsOptional()
  @IsString()
  name?: string;
}

export class InvoiceFilterDto extends PaginationDto {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @ApiPropertyOptional({ enum: PaymentStatus })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @ApiPropertyOptional({ type: 'string', format: 'date' })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({ type: 'string', format: 'date' })
  @IsOptional()
  @IsDateString()
  toDate?: string;

  @ApiPropertyOptional({ description: 'Filter by invoice number (partial match)' })
  @IsOptional()
  @IsString()
  invoiceNumber?: string;

  @ApiPropertyOptional({ description: 'Filter by customer name (partial match)' })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiPropertyOptional({ type: () => InvoiceCustomerFilterDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => InvoiceCustomerFilterDto)
  customer?: InvoiceCustomerFilterDto;
}
