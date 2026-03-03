import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SalesOrderStatus } from '@common/enums';
import { SalesOrder } from '@entities/tenant';

class OrderItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  lineNumber: number;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  productSku: string;

  @ApiPropertyOptional()
  variantId?: string;

  @ApiPropertyOptional()
  variantName?: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  shippedQuantity: number;

  @ApiProperty()
  returnedQuantity: number;

  @ApiProperty()
  unitPrice: number;

  @ApiProperty()
  discountPercentage: number;

  @ApiProperty()
  discountAmount: number;

  @ApiProperty()
  taxPercentage: number;

  @ApiProperty()
  taxAmount: number;

  @ApiProperty()
  lineTotal: number;
}

class OrderPaymentDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  paymentMethodName: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  paymentDate: Date;

  @ApiPropertyOptional()
  referenceNumber?: string;

  @ApiProperty()
  status: string;
}

class CustomerDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  customerCode: string;

  @ApiProperty()
  displayName: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  phone?: string;
}

export class OrderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  orderNumber: string;

  @ApiProperty({ enum: SalesOrderStatus })
  status: SalesOrderStatus;

  @ApiProperty()
  orderDate: Date;

  @ApiPropertyOptional()
  expectedDeliveryDate?: Date;

  @ApiPropertyOptional({ type: CustomerDto })
  customer?: CustomerDto;

  @ApiPropertyOptional()
  warehouseId?: string;

  @ApiPropertyOptional()
  warehouseName?: string;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  exchangeRate: number;

  @ApiProperty()
  subtotal: number;

  @ApiProperty()
  discountPercentage: number;

  @ApiProperty()
  discountAmount: number;

  @ApiProperty()
  taxAmount: number;

  @ApiProperty()
  shippingAmount: number;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  paidAmount: number;

  @ApiProperty()
  balanceAmount: number;

  @ApiProperty()
  paymentStatus: string;

  @ApiPropertyOptional()
  trackingNumber?: string;

  @ApiPropertyOptional()
  shippingCarrier?: string;

  @ApiPropertyOptional()
  shippedAt?: Date;

  @ApiPropertyOptional()
  deliveredAt?: Date;

  @ApiPropertyOptional()
  notes?: string;

  @ApiPropertyOptional({ type: [OrderItemDto] })
  items?: OrderItemDto[];

  @ApiPropertyOptional({ type: [OrderPaymentDto] })
  payments?: OrderPaymentDto[];

  @ApiProperty()
  itemCount: number;

  @ApiProperty()
  totalQuantity: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(order: SalesOrder) {
    this.id = order.id;
    this.orderNumber = order.orderNumber;
    this.status = order.status;
    this.orderDate = order.orderDate;
    this.expectedDeliveryDate = order.expectedDeliveryDate;
    this.warehouseId = order.warehouseId;
    this.warehouseName = order.warehouse?.warehouseName;
    this.currency = order.currency;
    this.exchangeRate = Number(order.exchangeRate);
    this.subtotal = Number(order.subtotal);
    this.discountPercentage = Number(order.discountPercentage);
    this.discountAmount = Number(order.discountAmount);
    this.taxAmount = Number(order.taxAmount);
    this.shippingAmount = Number(order.shippingAmount);
    this.totalAmount = Number(order.totalAmount);
    this.paidAmount = Number(order.paidAmount);
    this.balanceAmount = Number(order.totalAmount) - Number(order.paidAmount);
    this.trackingNumber = order.trackingNumber;
    this.shippingCarrier = order.shippingCarrier;
    this.shippedAt = order.shippedAt;
    this.deliveredAt = order.deliveredAt;
    this.notes = order.notes;
    this.createdAt = order.createdAt;
    this.updatedAt = order.updatedAt;

    // Calculate payment status
    if (Number(order.paidAmount) >= Number(order.totalAmount)) {
      this.paymentStatus = 'PAID';
    } else if (Number(order.paidAmount) > 0) {
      this.paymentStatus = 'PARTIAL';
    } else {
      this.paymentStatus = 'UNPAID';
    }

    if (order.customer) {
      this.customer = {
        id: order.customer.id,
        customerCode: order.customer.customerCode,
        displayName: order.customer.displayName,
        email: order.customer.email,
        phone: order.customer.phone,
      };
    }

    if (order.items) {
      this.items = order.items.map((item: any) => ({
        id: item.id,
        lineNumber: item.lineNumber,
        productId: item.productId,
        productName: item.productName,
        productSku: item.productSku,
        variantId: item.variantId,
        variantName: item.variant?.variantName,
        quantity: Number(item.quantity),
        shippedQuantity: Number(item.shippedQuantity) || 0,
        returnedQuantity: Number(item.returnedQuantity) || 0,
        unitPrice: Number(item.unitPrice),
        discountPercentage: Number(item.discountPercentage),
        discountAmount: Number(item.discountAmount),
        taxPercentage: Number(item.taxPercentage),
        taxAmount: Number(item.taxAmount),
        lineTotal: Number(item.lineTotal),
      }));

      this.itemCount = order.items.length;
      this.totalQuantity = order.items.reduce(
        (sum: any, item: any) => sum + Number(item.quantity),
        0,
      );
    } else {
      this.itemCount = 0;
      this.totalQuantity = 0;
    }

    if (order.payments) {
      this.payments = order.payments.map((payment: any) => ({
        id: payment.id,
        paymentMethodName: payment.paymentMethod?.methodName || 'Unknown',
        amount: Number(payment.amount),
        paymentDate: payment.paymentDate,
        referenceNumber: payment.referenceNumber,
        status: payment.status,
      }));
    }
  }
}
