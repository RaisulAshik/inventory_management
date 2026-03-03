import {
  SalesReturn,
  SalesReturnStatus,
  SalesReturnReason,
  RefundType,
} from '@entities/tenant/eCommerce/sales-return.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ReturnItemDto {
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

  @ApiProperty()
  isRestocked: boolean;

  @ApiProperty()
  restockedQuantity: number;
}

export class ReturnResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  returnNumber: string;

  @ApiProperty()
  salesOrderId: string;

  @ApiPropertyOptional()
  orderNumber?: string;

  @ApiProperty()
  customerId: string;

  @ApiPropertyOptional()
  customerName?: string;

  @ApiProperty({ enum: RefundType })
  refundType: RefundType;

  @ApiProperty()
  returnDate: Date;

  @ApiProperty({ enum: SalesReturnStatus })
  status: SalesReturnStatus;

  @ApiProperty({ enum: SalesReturnReason })
  returnReason: SalesReturnReason;

  @ApiPropertyOptional()
  reasonDetails?: string;

  @ApiProperty()
  subtotal: number;

  @ApiProperty()
  taxAmount: number;

  @ApiProperty()
  restockingFee: number;

  @ApiProperty()
  shippingFeeDeduction: number;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  refundAmount: number;

  @ApiPropertyOptional()
  inspectionNotes?: string;

  @ApiPropertyOptional()
  approvedAt?: Date;

  @ApiPropertyOptional()
  receivedDate?: Date;

  @ApiPropertyOptional()
  refundedAt?: Date;

  @ApiPropertyOptional({ type: [ReturnItemDto] })
  items?: ReturnItemDto[];

  @ApiProperty()
  itemCount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(salesReturn: SalesReturn) {
    this.id = salesReturn.id;
    this.returnNumber = salesReturn.returnNumber;
    this.salesOrderId = salesReturn.salesOrderId;
    this.orderNumber = salesReturn.salesOrder?.orderNumber;
    this.customerId = salesReturn.customerId;
    this.customerName = salesReturn.customer?.fullName;
    this.refundType = salesReturn.refundType;
    this.returnDate = salesReturn.returnDate;
    this.status = salesReturn.status;
    this.returnReason = salesReturn.returnReason;
    this.reasonDetails = salesReturn.reasonDetails;
    this.subtotal = Number(salesReturn.subtotal);
    this.taxAmount = Number(salesReturn.taxAmount);
    this.restockingFee = Number(salesReturn.restockingFee);
    this.shippingFeeDeduction = Number(salesReturn.shippingFeeDeduction);
    this.totalAmount = Number(salesReturn.totalAmount);
    this.refundAmount = Number(salesReturn.refundAmount);
    this.inspectionNotes = salesReturn.inspectionNotes;
    this.approvedAt = salesReturn.approvedAt;
    this.receivedDate = salesReturn.receivedDate;
    this.refundedAt = salesReturn.refundedAt;
    this.createdAt = salesReturn.createdAt;
    this.updatedAt = salesReturn.updatedAt;

    if (salesReturn.items) {
      this.items = salesReturn.items.map((item: any) => ({
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
        isRestocked: item.isRestocked,
        restockedQuantity: Number(item.restockedQuantity) || 0,
      }));

      this.itemCount = salesReturn.items.length;
    } else {
      this.itemCount = 0;
    }
  }
}
