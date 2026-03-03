import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsUUID, IsDateString } from 'class-validator';
import {
  SalesReturnStatus,
  RefundType,
} from '@entities/tenant/eCommerce/sales-return.entity';

export class ReturnFilterDto {
  @ApiPropertyOptional({ enum: SalesReturnStatus })
  @IsOptional()
  @IsEnum(SalesReturnStatus)
  status?: SalesReturnStatus;

  @ApiPropertyOptional({ enum: RefundType })
  @IsOptional()
  @IsEnum(RefundType)
  refundType?: RefundType;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @ApiPropertyOptional({ type: 'string', format: 'date' })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({ type: 'string', format: 'date' })
  @IsOptional()
  @IsDateString()
  toDate?: string;
}
