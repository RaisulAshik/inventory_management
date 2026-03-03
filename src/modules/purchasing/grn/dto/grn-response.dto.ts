import { GRNStatus } from '@common/enums';
import { GoodsReceivedNote } from '@entities/tenant';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class GrnItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  productId: string;

  @ApiPropertyOptional()
  productName?: string;

  @ApiPropertyOptional()
  variantId?: string;

  @ApiProperty()
  receivedQuantity: number;

  @ApiProperty()
  acceptedQuantity: number;

  @ApiProperty()
  rejectedQuantity: number;

  @ApiProperty()
  unitPrice: number;

  @ApiProperty()
  taxAmount: number;

  @ApiProperty()
  lineTotal: number;

  @ApiPropertyOptional()
  batchNumber?: string;

  @ApiPropertyOptional()
  expiryDate?: Date;

  @ApiPropertyOptional()
  locationId?: string;

  @ApiPropertyOptional()
  rejectionReason?: string;
}

export class GrnResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  grnNumber: string;

  @ApiProperty()
  purchaseOrderId: string;

  @ApiPropertyOptional()
  poNumber?: string;

  @ApiProperty()
  supplierId: string;

  @ApiPropertyOptional()
  supplierName?: string;

  @ApiProperty()
  warehouseId: string;

  @ApiPropertyOptional()
  warehouseName?: string;

  @ApiProperty()
  receiptDate: Date;

  @ApiProperty({ enum: GRNStatus })
  status: GRNStatus;

  @ApiPropertyOptional()
  supplierInvoiceNumber?: string;

  @ApiPropertyOptional()
  supplierInvoiceDate?: Date;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  subtotal: number;

  @ApiProperty()
  taxAmount: number;

  @ApiProperty()
  totalAmount: number;

  @ApiPropertyOptional()
  approvedAt?: Date;

  @ApiPropertyOptional()
  qcCompletedAt?: Date;

  @ApiPropertyOptional()
  notes?: string;

  @ApiPropertyOptional({ type: [GrnItemDto] })
  items?: GrnItemDto[];

  @ApiProperty()
  itemCount: number;

  @ApiProperty()
  totalReceivedQuantity: number;

  @ApiProperty()
  totalAcceptedQuantity: number;

  @ApiProperty()
  totalRejectedQuantity: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(grn: GoodsReceivedNote) {
    this.id = grn.id;
    this.grnNumber = grn.grnNumber;
    this.purchaseOrderId = grn.purchaseOrderId;
    this.poNumber = grn.purchaseOrder?.poNumber;
    this.supplierId = grn.supplierId;
    this.supplierName = grn.supplier?.companyName;
    this.warehouseId = grn.warehouseId;
    this.warehouseName = grn.warehouse?.warehouseName;
    this.receiptDate = grn.receiptDate;
    this.status = grn.status;
    this.supplierInvoiceNumber = grn.supplierInvoiceNumber;
    this.supplierInvoiceDate = grn.supplierInvoiceDate;
    this.currency = grn.currency;
    this.subtotal = Number(grn.subtotal);
    this.taxAmount = Number(grn.taxAmount);
    this.totalAmount = Number(grn.totalValue);
    this.approvedAt = grn.approvedAt;
    this.qcCompletedAt = grn.qcAt;
    this.notes = grn.notes;
    this.createdAt = grn.createdAt;
    this.updatedAt = grn.updatedAt;

    if (grn.items) {
      this.items = grn.items.map((item: any) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product?.productName,
        variantId: item.variantId,
        receivedQuantity: Number(item.receivedQuantity),
        acceptedQuantity: Number(item.acceptedQuantity),
        rejectedQuantity: Number(item.rejectedQuantity),
        unitPrice: Number(item.unitPrice),
        taxAmount: Number(item.taxAmount),
        lineTotal: Number(item.lineTotal),
        batchNumber: item.batchNumber,
        expiryDate: item.expiryDate,
        locationId: item.locationId,
        rejectionReason: item.rejectionReason,
      }));

      this.itemCount = grn.items.length;
      this.totalReceivedQuantity = grn.items.reduce(
        (sum: any, item: any) => sum + Number(item.receivedQuantity),
        0,
      );
      this.totalAcceptedQuantity = grn.items.reduce(
        (sum: any, item: any) => sum + Number(item.acceptedQuantity),
        0,
      );
      this.totalRejectedQuantity = grn.items.reduce(
        (sum: any, item: any) => sum + Number(item.rejectedQuantity),
        0,
      );
    } else {
      this.itemCount = 0;
      this.totalReceivedQuantity = 0;
      this.totalAcceptedQuantity = 0;
      this.totalRejectedQuantity = 0;
    }
  }
}
