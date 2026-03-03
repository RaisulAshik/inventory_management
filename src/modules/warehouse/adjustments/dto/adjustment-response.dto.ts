import {
  AdjustmentType,
  AdjustmentStatus,
  StockAdjustment,
} from '@entities/tenant';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class AdjustmentItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  productId: string;

  @ApiPropertyOptional()
  productName?: string;

  @ApiPropertyOptional()
  productSku?: string;

  @ApiPropertyOptional()
  variantId?: string;

  @ApiPropertyOptional()
  variantName?: string;

  @ApiProperty()
  systemQuantity: number;

  @ApiProperty()
  physicalQuantity: number;

  @ApiProperty()
  adjustmentQuantity: number;

  @ApiPropertyOptional()
  unitCost?: number;

  @ApiProperty()
  valueImpact: number;

  @ApiPropertyOptional()
  reason?: string;
}

export class AdjustmentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  adjustmentNumber: string;

  @ApiProperty()
  warehouseId: string;

  @ApiPropertyOptional()
  warehouseName?: string;

  @ApiProperty({ enum: AdjustmentType })
  adjustmentType: AdjustmentType;

  @ApiProperty()
  adjustmentDate: Date;

  @ApiProperty({ enum: AdjustmentStatus })
  status: AdjustmentStatus;

  @ApiProperty()
  reason: string;

  @ApiProperty()
  totalValueImpact: number;

  @ApiPropertyOptional()
  notes?: string;

  @ApiPropertyOptional()
  approvedBy?: string;

  @ApiPropertyOptional()
  approvedAt?: Date;

  @ApiPropertyOptional({ type: [AdjustmentItemDto] })
  items?: AdjustmentItemDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(adjustment: StockAdjustment) {
    this.id = adjustment.id;
    this.adjustmentNumber = adjustment.adjustmentNumber;
    this.warehouseId = adjustment.warehouseId;
    this.warehouseName = adjustment.warehouse?.warehouseName;
    this.adjustmentType = adjustment.adjustmentType;
    this.adjustmentDate = adjustment.adjustmentDate;
    this.status = adjustment.status;
    this.reason = adjustment.reason;
    this.totalValueImpact = Number(adjustment.totalValueImpact) || 0;
    this.notes = adjustment.notes;
    this.approvedBy = adjustment.approvedBy;
    this.approvedAt = adjustment.approvedAt;
    this.createdAt = adjustment.createdAt;
    this.updatedAt = adjustment.updatedAt;

    if (adjustment.items) {
      this.items = adjustment.items.map((item: any) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product?.productName,
        productSku: item.product?.sku,
        variantId: item.variantId,
        variantName: item.variant?.variantName,
        systemQuantity: Number(item.systemQuantity),
        physicalQuantity: Number(item.physicalQuantity),
        adjustmentQuantity: Number(item.adjustmentQuantity),
        unitCost: item.unitCost ? Number(item.unitCost) : undefined,
        valueImpact: Number(item.valueImpact) || 0,
        reason: item.reason,
      }));
    }
  }
}
