import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { SalesOrderStatus } from '@common/enums';

/** Dimension the sales report is aggregated over. */
export enum SalesReportGroupBy {
  DAY = 'day',
  MONTH = 'month',
  YEAR = 'year',
  CUSTOMER = 'customer',
}

export class OrderReportQueryDto {
  @ApiProperty({ enum: SalesReportGroupBy, example: SalesReportGroupBy.MONTH })
  @IsEnum(SalesReportGroupBy)
  groupBy: SalesReportGroupBy;

  @ApiPropertyOptional({ example: '2026-01-01' })
  @IsDateString()
  @IsOptional()
  fromDate?: string;

  @ApiPropertyOptional({ example: '2026-12-31' })
  @IsDateString()
  @IsOptional()
  toDate?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  customerId?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  warehouseId?: string;

  @ApiPropertyOptional({ enum: SalesOrderStatus })
  @IsEnum(SalesOrderStatus)
  @IsOptional()
  status?: SalesOrderStatus;

  @ApiPropertyOptional({ enum: ['PAID', 'UNPAID', 'PARTIAL'] })
  @IsString()
  @IsOptional()
  paymentStatus?: 'PAID' | 'UNPAID' | 'PARTIAL';

  /**
   * Cancelled orders are excluded by default — they are not revenue. Set true
   * to include them, e.g. when reconciling against the raw order list.
   */
  @ApiPropertyOptional({ default: false })
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  @IsOptional()
  includeCancelled?: boolean;
}
