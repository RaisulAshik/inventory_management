// src/modules/quotations/dto/quotation-response.dto.ts

import { Quotation } from '@/entities/tenant';
import { ApiProperty } from '@nestjs/swagger';

export class QuotationResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() quotationNumber: string;
  @ApiProperty() customerId: string;
  @ApiProperty() customerName: string;
  @ApiProperty() warehouseId: string;
  @ApiProperty() quotationDate: Date;
  @ApiProperty() validUntil: Date;
  @ApiProperty() status: string;
  @ApiProperty() subtotal: number;
  @ApiProperty() discountAmount: number;
  @ApiProperty() taxAmount: number;
  @ApiProperty() shippingAmount: number;
  @ApiProperty() totalAmount: number;
  @ApiProperty() salesOrderId: string;
  @ApiProperty() salesOrderNumber: string;
  @ApiProperty() itemCount: number;
  @ApiProperty() createdAt: Date;

  constructor(quotation: Quotation) {
    this.id = quotation.id;
    this.quotationNumber = quotation.quotationNumber;
    this.customerId = quotation.customerId;
    this.customerName = quotation.customer?.companyName ?? '';
    this.warehouseId = quotation.warehouseId;
    this.quotationDate = quotation.quotationDate;
    this.validUntil = quotation.validUntil;
    this.status = quotation.status;
    this.subtotal = Number(quotation.subtotal ?? 0);
    this.discountAmount = Number(quotation.discountAmount ?? 0);
    this.taxAmount = Number(quotation.taxAmount ?? 0);
    this.shippingAmount = Number(quotation.shippingAmount ?? 0);
    this.totalAmount = Number(quotation.totalAmount ?? 0);
    this.salesOrderId = quotation.salesOrderId;
    this.salesOrderNumber = quotation.salesOrderNumber;
    this.itemCount = quotation.items?.length ?? 0;
    this.createdAt = quotation.createdAt;
  }
}

export class QuotationDetailResponseDto extends QuotationResponseDto {
  @ApiProperty() warehouseName: string;
  @ApiProperty() billingAddressId: string;
  @ApiProperty() shippingAddressId: string;
  @ApiProperty() referenceNumber: string;
  @ApiProperty() salesPersonId: string;
  @ApiProperty() paymentTermsId: string;
  @ApiProperty() currency: string;
  @ApiProperty() discountType: string;
  @ApiProperty() discountValue: number;
  @ApiProperty() notes: string;
  @ApiProperty() internalNotes: string;
  @ApiProperty() termsAndConditions: string;
  @ApiProperty() rejectionReason: string;
  @ApiProperty() createdBy: string;
  @ApiProperty() updatedAt: Date;
  @ApiProperty() items: any[];

  constructor(quotation: Quotation) {
    super(quotation);
    this.warehouseName = quotation.warehouse?.warehouseName ?? '';
    this.billingAddressId = quotation.billingAddressId;
    this.shippingAddressId = quotation.shippingAddressId;
    this.referenceNumber = quotation.referenceNumber;
    this.salesPersonId = quotation.salesPersonId;
    this.paymentTermsId = quotation.paymentTermsId;
    this.currency = quotation.currency;
    this.discountType = quotation.discountType;
    this.discountValue = Number(quotation.discountValue ?? 0);
    this.notes = quotation.notes;
    this.internalNotes = quotation.internalNotes;
    this.termsAndConditions = quotation.termsAndConditions;
    this.rejectionReason = quotation.rejectionReason;
    this.createdBy = quotation.createdBy;
    this.updatedAt = quotation.updatedAt;
    this.items = (quotation.items ?? []).map((item) => ({
      id: item.id,
      productId: item.productId,
      variantId: item.variantId,
      productName: item.productName,
      sku: item.sku,
      quantity: Number(item.quantity ?? 0),
      unitPrice: Number(item.unitPrice ?? 0),
      discountType: item.discountType,
      discountValue: Number(item.discountValue ?? 0),
      discountAmount: Number(item.discountAmount ?? 0),
      taxRate: Number(item.taxRate ?? 0),
      taxAmount: Number(item.taxAmount ?? 0),
      lineTotal: Number(item.lineTotal ?? 0),
      notes: item.notes,
    }));
  }
}
