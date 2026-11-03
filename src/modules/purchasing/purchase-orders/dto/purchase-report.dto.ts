import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

/** Dimension the purchase report is aggregated over. */
export enum PurchaseReportGroupBy {
  DAY = 'day',
  MONTH = 'month',
  YEAR = 'year',
  SUPPLIER = 'supplier',
}

/**
 * Which document the figures come from.
 *
 *  PO  — what was committed to (purchase_orders, by order date)
 *  GRN — what actually arrived (goods_received_notes, by receipt date)
 *
 * GRN is the one that matches the payable, since the supplier due is raised
 * on GRN approval.
 */
export enum PurchaseReportBasis {
  PO = 'PO',
  GRN = 'GRN',
}

export class PurchaseReportQueryDto {
  @ApiProperty({ enum: PurchaseReportGroupBy, example: PurchaseReportGroupBy.MONTH })
  @IsEnum(PurchaseReportGroupBy)
  groupBy: PurchaseReportGroupBy;

  @ApiPropertyOptional({ enum: PurchaseReportBasis, default: PurchaseReportBasis.GRN })
  @IsEnum(PurchaseReportBasis)
  @IsOptional()
  basis?: PurchaseReportBasis;

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
  supplierId?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  warehouseId?: string;

  @ApiPropertyOptional({ description: 'Status of the PO or GRN, depending on basis' })
  @IsString()
  @IsOptional()
  status?: string;

  /** Cancelled documents are excluded unless this is set. */
  @ApiPropertyOptional({ default: false })
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  @IsOptional()
  includeCancelled?: boolean;
}
