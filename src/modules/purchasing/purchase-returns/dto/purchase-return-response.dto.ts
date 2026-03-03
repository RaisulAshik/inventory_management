import { PurchaseReturnStatus, PurchaseReturn } from '@entities/tenant';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class PurchaseReturnItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  productId: string;

  @ApiPropertyOptional()
  productName?: string;

  @ApiPropertyOptional()
  variantId?: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unitPrice: number;

  @ApiProperty()
  taxAmount: number;

  @ApiProperty()
  lineTotal: number;

  @ApiPropertyOptional()
  reason?: string;

  @ApiProperty()
  condition: string;
}

export class PurchaseReturnResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  returnNumber: string;

  @ApiPropertyOptional()
  purchaseOrderId?: string;

  @ApiPropertyOptional()
  poNumber?: string;

  @ApiPropertyOptional()
  grnId?: string;

  @ApiPropertyOptional()
  grnNumber?: string;

  @ApiProperty()
  supplierId: string;

  @ApiPropertyOptional()
  supplierName?: string;

  @ApiProperty()
  warehouseId: string;

  @ApiPropertyOptional()
  warehouseName?: string;

  @ApiProperty()
  returnDate: Date;

  @ApiProperty({ enum: PurchaseReturnStatus })
  status: PurchaseReturnStatus;

  @ApiProperty()
  returnType: string;

  @ApiProperty()
  reason: string;

  @ApiPropertyOptional()
  reasonDetails?: string;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  subtotal: number;

  @ApiProperty()
  taxAmount: number;

  @ApiProperty()
  totalAmount: number;

  @ApiPropertyOptional()
  trackingNumber?: string;

  @ApiPropertyOptional()
  creditNoteNumber?: string;

  @ApiPropertyOptional()
  creditNoteAmount?: number;

  @ApiPropertyOptional()
  creditNoteDate?: Date;

  @ApiPropertyOptional()
  approvedAt?: Date;

  @ApiPropertyOptional()
  shippedAt?: Date;

  @ApiPropertyOptional()
  receivedBySupplierAt?: Date;

  @ApiPropertyOptional()
  rejectionReason?: string;

  @ApiPropertyOptional({ type: [PurchaseReturnItemDto] })
  items?: PurchaseReturnItemDto[];

  @ApiProperty()
  itemCount: number;

  @ApiProperty()
  totalQuantity: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(purchaseReturn: PurchaseReturn) {
    this.id = purchaseReturn.id;
    this.returnNumber = purchaseReturn.returnNumber;
    this.purchaseOrderId = purchaseReturn.purchaseOrderId;
    this.poNumber = purchaseReturn.purchaseOrder?.poNumber;
    this.grnId = purchaseReturn.grnId;
    this.grnNumber = purchaseReturn.grn?.grnNumber;
    this.supplierId = purchaseReturn.supplierId;
    this.supplierName = purchaseReturn.supplier?.companyName;
    this.warehouseId = purchaseReturn.warehouseId;
    this.warehouseName = purchaseReturn.warehouse?.warehouseName;
    this.returnDate = purchaseReturn.returnDate;
    this.status = purchaseReturn.status;
    this.returnType = purchaseReturn.returnType;
    this.reason = purchaseReturn.reason;
    this.reasonDetails = purchaseReturn.reasonDetails;
    this.currency = purchaseReturn.currency;
    this.subtotal = Number(purchaseReturn.subtotal);
    this.taxAmount = Number(purchaseReturn.taxAmount);
    this.totalAmount = Number(purchaseReturn.totalAmount);
    this.trackingNumber = purchaseReturn.trackingNumber;
    this.creditNoteNumber = purchaseReturn.creditNoteNumber;
    this.creditNoteAmount = purchaseReturn.creditNoteAmount
      ? Number(purchaseReturn.creditNoteAmount)
      : undefined;
    this.creditNoteDate = purchaseReturn.creditNoteDate;
    this.approvedAt = purchaseReturn.approvedAt;
    this.shippedAt = purchaseReturn.shippedAt;
    this.receivedBySupplierAt = purchaseReturn.receivedBySupplierAt;
    this.rejectionReason = purchaseReturn.rejectionReason;
    this.createdAt = purchaseReturn.createdAt;
    this.updatedAt = purchaseReturn.updatedAt;

    if (purchaseReturn.items) {
      this.items = purchaseReturn.items.map((item: any) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product?.productName,
        variantId: item.variantId,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        taxAmount: Number(item.taxAmount),
        lineTotal: Number(item.lineTotal),
        reason: item.reason,
        condition: item.condition,
      }));

      this.itemCount = purchaseReturn.items.length;
      this.totalQuantity = purchaseReturn.items.reduce(
        (sum: any, item: any) => sum + Number(item.quantity),
        0,
      );
    } else {
      this.itemCount = 0;
      this.totalQuantity = 0;
    }
  }
}
