import { PurchaseOrderStatus } from '@common/enums';
import { PurchaseOrder } from '@entities/tenant';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class PurchaseOrderItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  lineNumber: number;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  uomId: string;

  @ApiProperty()
  uomName: string;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  productSku: string;

  @ApiPropertyOptional()
  variantId?: string;

  @ApiProperty()
  quantityOrdered: number;

  @ApiProperty()
  receivedQuantity: number;

  @ApiProperty()
  pendingQuantity: number;

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

class SupplierDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  supplierCode: string;

  @ApiProperty()
  companyName: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  phone?: string;
}

export class PurchaseOrderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  poNumber: string;

  @ApiProperty({ enum: PurchaseOrderStatus })
  status: PurchaseOrderStatus;

  @ApiProperty()
  poDate: Date;

  @ApiProperty()
  orderDate: Date;

  @ApiPropertyOptional()
  expectedDeliveryDate?: Date;

  @ApiPropertyOptional({ type: SupplierDto })
  supplier?: SupplierDto;

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
  otherCharges: number;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  paidAmount: number;

  @ApiProperty()
  balanceAmount: number;

  @ApiPropertyOptional()
  approvedAt?: Date;

  @ApiPropertyOptional()
  sentAt?: Date;

  @ApiPropertyOptional()
  acknowledgedAt?: Date;

  @ApiPropertyOptional()
  supplierReferenceNumber?: string;

  @ApiPropertyOptional()
  notes?: string;

  @ApiPropertyOptional({ type: [PurchaseOrderItemDto] })
  items?: PurchaseOrderItemDto[];

  @ApiProperty()
  itemCount: number;

  @ApiProperty()
  totalQuantity: number;

  @ApiProperty()
  receivedQuantity: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(po: PurchaseOrder) {
    this.id = po.id;
    this.poNumber = po.poNumber;
    this.status = po.status;
    this.orderDate = po.poDate;
    this.expectedDeliveryDate = po.expectedDate;
    this.warehouseId = po.warehouseId;
    this.warehouseName = po.warehouse?.warehouseName;
    this.currency = po.currency;
    this.exchangeRate = Number(po.exchangeRate);
    this.subtotal = Number(po.subtotal);
    this.discountPercentage = Number(po.discountValue);
    this.discountAmount = Number(po.discountAmount);
    this.taxAmount = Number(po.taxAmount);
    this.shippingAmount = Number(po.shippingAmount);
    this.otherCharges = Number(po.otherCharges);
    this.totalAmount = Number(po.totalAmount);
    this.paidAmount = Number(po.paidAmount);
    this.balanceAmount = Number(po.totalAmount) - Number(po.paidAmount);
    this.approvedAt = po.approvedAt;
    this.sentAt = po.sentAt;
    this.acknowledgedAt = po.acknowledgedAt;
    this.supplierReferenceNumber = po.supplierReferenceNumber;
    this.notes = po.notes;
    this.createdAt = po.createdAt;
    this.updatedAt = po.updatedAt;

    if (po.supplier) {
      this.supplier = {
        id: po.supplier.id,
        supplierCode: po.supplier.supplierCode,
        companyName: po.supplier.companyName,
        email: po.supplier.email,
        phone: po.supplier.phone,
      };
    }

    if (po.items) {
      this.items = po.items.map((item: any) => ({
        id: item.id,
        lineNumber: item.lineNumber,
        productId: item.productId,
        productName: item.product?.productName || item.productName,
        uomId: item.product?.uomId || item.uomId,
        uomName: item.product?.uom?.uomName || item.uomName,
        productSku: item.product?.sku || item.sku,
        variantId: item.variantId,
        quantityOrdered: Number(item.quantityOrdered),
        receivedQuantity: Number(item.receivedQuantity) || 0,
        pendingQuantity:
          Number(item.quantityOrdered) - (Number(item.receivedQuantity) || 0),
        unitPrice: Number(item.unitPrice),
        discountPercentage: Number(item.discountPercentage),
        discountAmount: Number(item.discountAmount),
        taxPercentage: Number(item.taxPercentage),
        taxAmount: Number(item.taxAmount),
        lineTotal: Number(item.lineTotal),
      }));

      this.itemCount = po.items.length;
      this.totalQuantity = po.items.reduce(
        (sum: any, item: any) => sum + Number(item.quantityOrdered),
        0,
      );
      this.receivedQuantity = po.items.reduce(
        (sum: any, item: any) => sum + (Number(item.receivedQuantity) || 0),
        0,
      );
    } else {
      this.itemCount = 0;
      this.totalQuantity = 0;
      this.receivedQuantity = 0;
    }
  }
}

export class PurchaseOrderDetailResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  poNumber: string;

  @ApiProperty({ enum: PurchaseOrderStatus })
  status: PurchaseOrderStatus;

  @ApiProperty()
  poDate: Date;

  @ApiProperty()
  orderDate: Date;

  @ApiPropertyOptional()
  expectedDeliveryDate?: Date;

  @ApiPropertyOptional({ type: SupplierDto })
  supplier?: SupplierDto;

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
  otherCharges: number;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  paidAmount: number;

  @ApiProperty()
  balanceAmount: number;

  @ApiPropertyOptional()
  approvedAt?: Date;

  @ApiPropertyOptional()
  sentAt?: Date;

  @ApiPropertyOptional()
  acknowledgedAt?: Date;

  @ApiPropertyOptional()
  supplierReferenceNumber?: string;

  @ApiPropertyOptional()
  notes?: string;

  @ApiPropertyOptional({ type: [PurchaseOrderItemDto] })
  items?: PurchaseOrderItemDto[];

  @ApiProperty()
  itemCount: number;

  @ApiProperty()
  totalQuantity: number;

  @ApiProperty()
  receivedQuantity: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(po: PurchaseOrder) {
    this.id = po.id;
    this.poNumber = po.poNumber;
    this.status = po.status;
    this.orderDate = po.poDate;
    this.expectedDeliveryDate = po.expectedDate;
    this.warehouseId = po.warehouseId;
    this.warehouseName = po.warehouse?.warehouseName;
    this.currency = po.currency;
    this.exchangeRate = Number(po.exchangeRate);
    this.subtotal = Number(po.subtotal);
    this.discountPercentage = Number(po.discountValue);
    this.discountAmount = Number(po.discountAmount);
    this.taxAmount = Number(po.taxAmount);
    this.shippingAmount = Number(po.shippingAmount);
    this.otherCharges = Number(po.otherCharges);
    this.totalAmount = Number(po.totalAmount);
    this.paidAmount = Number(po.paidAmount);
    this.balanceAmount = Number(po.totalAmount) - Number(po.paidAmount);
    this.approvedAt = po.approvedAt;
    this.sentAt = po.sentAt;
    this.acknowledgedAt = po.acknowledgedAt;
    this.supplierReferenceNumber = po.supplierReferenceNumber;
    this.notes = po.notes;
    this.createdAt = po.createdAt;
    this.updatedAt = po.updatedAt;

    if (po.supplier) {
      this.supplier = {
        id: po.supplier.id,
        supplierCode: po.supplier.supplierCode,
        companyName: po.supplier.companyName,
        email: po.supplier.email,
        phone: po.supplier.phone,
      };
    }

    if (po.items) {
      this.items = po.items.map((item: any) => ({
        id: item.id,
        lineNumber: item.lineNumber,
        productId: item.productId,
        productName: item.product?.productName || item.productName, // ← fix
        productSku: item.product?.sku || item.sku,
        uomId: item.product?.uomId || item.uomId,
        uomName: item.product?.uom?.uomName || item.uomName,

        // productSku: item.sku,
        variantId: item.variantId,
        quantityOrdered: Number(item.quantityOrdered),
        receivedQuantity: Number(item.receivedQuantity) || 0,
        pendingQuantity:
          Number(item.quantityOrdered) - (Number(item.receivedQuantity) || 0),
        unitPrice: Number(item.unitPrice),
        discountPercentage: Number(item.discountPercentage),
        discountAmount: Number(item.discountAmount),
        taxPercentage: Number(item.taxPercentage),
        taxAmount: Number(item.taxAmount),
        lineTotal: Number(item.lineTotal),
      }));

      this.itemCount = po.items.length;
      this.totalQuantity = po.items.reduce(
        (sum: any, item: any) => sum + Number(item.quantityOrdered),
        0,
      );
      this.receivedQuantity = po.items.reduce(
        (sum: any, item: any) => sum + (Number(item.receivedQuantity) || 0),
        0,
      );
    } else {
      this.itemCount = 0;
      this.totalQuantity = 0;
      this.receivedQuantity = 0;
    }
  }
}
