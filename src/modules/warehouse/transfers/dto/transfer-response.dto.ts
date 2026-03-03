import {
  TransferType,
  TransferStatus,
  WarehouseTransfer,
} from '@entities/tenant';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class TransferItemDto {
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
  quantityRequested: number;

  @ApiProperty()
  quantityShipped: number;

  @ApiProperty()
  quantityReceived: number;

  @ApiProperty()
  quantityDamaged: number;

  @ApiPropertyOptional()
  fromLocationId?: string;

  @ApiPropertyOptional()
  toLocationId?: string;
}

export class TransferResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  transferNumber: string;

  @ApiProperty({ enum: TransferType })
  transferType: TransferType;

  @ApiProperty()
  fromWarehouseId: string;

  @ApiPropertyOptional()
  fromWarehouseName?: string;

  @ApiProperty()
  toWarehouseId: string;

  @ApiPropertyOptional()
  toWarehouseName?: string;

  @ApiProperty({ enum: TransferStatus })
  status: TransferStatus;

  @ApiPropertyOptional()
  transferDate?: Date;

  @ApiPropertyOptional()
  expectedDeliveryDate?: Date;

  @ApiPropertyOptional()
  trackingNumber?: string;

  @ApiPropertyOptional()
  reason?: string;

  @ApiPropertyOptional()
  notes?: string;

  @ApiPropertyOptional()
  approvedBy?: string;

  @ApiPropertyOptional()
  approvedAt?: Date;

  @ApiPropertyOptional()
  shippedBy?: string;

  @ApiPropertyOptional()
  shippedAt?: Date;

  @ApiPropertyOptional()
  receivedBy?: string;

  @ApiPropertyOptional()
  receivedAt?: Date;

  @ApiPropertyOptional({ type: [TransferItemDto] })
  items?: TransferItemDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(transfer: WarehouseTransfer) {
    this.id = transfer.id;
    this.transferNumber = transfer.transferNumber;
    this.transferType = transfer.transferType;
    this.fromWarehouseId = transfer.fromWarehouseId;
    this.fromWarehouseName = transfer.fromWarehouse?.warehouseName;
    this.toWarehouseId = transfer.toWarehouseId;
    this.toWarehouseName = transfer.toWarehouse?.warehouseName;
    this.status = transfer.status;
    this.transferDate = transfer.transferDate;
    this.expectedDeliveryDate = transfer.expectedDeliveryDate;
    this.trackingNumber = transfer.trackingNumber;
    this.reason = transfer.reason;
    this.notes = transfer.notes;
    this.approvedBy = transfer.approvedBy;
    this.approvedAt = transfer.approvedAt;
    this.shippedBy = transfer.shippedBy;
    this.shippedAt = transfer.shippedAt;
    this.receivedBy = transfer.receivedBy;
    this.receivedAt = transfer.receivedAt;
    this.createdAt = transfer.createdAt;
    this.updatedAt = transfer.updatedAt;

    if (transfer.items) {
      this.items = transfer.items.map((item: any) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product?.productName,
        productSku: item.product?.sku,
        variantId: item.variantId,
        variantName: item.variant?.variantName,
        quantityRequested: Number(item.quantityRequested),
        quantityShipped: Number(item.quantityShipped) || 0,
        quantityReceived: Number(item.quantityReceived) || 0,
        quantityDamaged: Number(item.quantityDamaged) || 0,
        fromLocationId: item.fromLocationId,
        toLocationId: item.toLocationId,
      }));
    }
  }
}
