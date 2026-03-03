"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuotationDetailResponseDto = exports.QuotationResponseDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
class QuotationResponseDto {
    id;
    quotationNumber;
    customerId;
    customerName;
    warehouseId;
    quotationDate;
    validUntil;
    status;
    subtotal;
    discountAmount;
    taxAmount;
    shippingAmount;
    totalAmount;
    salesOrderId;
    salesOrderNumber;
    itemCount;
    createdAt;
    constructor(quotation) {
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
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, quotationNumber: { required: true, type: () => String }, customerId: { required: true, type: () => String }, customerName: { required: true, type: () => String }, warehouseId: { required: true, type: () => String }, quotationDate: { required: true, type: () => Date }, validUntil: { required: true, type: () => Date }, status: { required: true, type: () => String }, subtotal: { required: true, type: () => Number }, discountAmount: { required: true, type: () => Number }, taxAmount: { required: true, type: () => Number }, shippingAmount: { required: true, type: () => Number }, totalAmount: { required: true, type: () => Number }, salesOrderId: { required: true, type: () => String }, salesOrderNumber: { required: true, type: () => String }, itemCount: { required: true, type: () => Number }, createdAt: { required: true, type: () => Date } };
    }
}
exports.QuotationResponseDto = QuotationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QuotationResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QuotationResponseDto.prototype, "quotationNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QuotationResponseDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QuotationResponseDto.prototype, "customerName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QuotationResponseDto.prototype, "warehouseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], QuotationResponseDto.prototype, "quotationDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], QuotationResponseDto.prototype, "validUntil", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QuotationResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], QuotationResponseDto.prototype, "subtotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], QuotationResponseDto.prototype, "discountAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], QuotationResponseDto.prototype, "taxAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], QuotationResponseDto.prototype, "shippingAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], QuotationResponseDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QuotationResponseDto.prototype, "salesOrderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QuotationResponseDto.prototype, "salesOrderNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], QuotationResponseDto.prototype, "itemCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], QuotationResponseDto.prototype, "createdAt", void 0);
class QuotationDetailResponseDto extends QuotationResponseDto {
    warehouseName;
    billingAddressId;
    shippingAddressId;
    referenceNumber;
    salesPersonId;
    paymentTermsId;
    currency;
    discountType;
    discountValue;
    notes;
    internalNotes;
    termsAndConditions;
    rejectionReason;
    createdBy;
    updatedAt;
    items;
    constructor(quotation) {
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
    static _OPENAPI_METADATA_FACTORY() {
        return { warehouseName: { required: true, type: () => String }, billingAddressId: { required: true, type: () => String }, shippingAddressId: { required: true, type: () => String }, referenceNumber: { required: true, type: () => String }, salesPersonId: { required: true, type: () => String }, paymentTermsId: { required: true, type: () => String }, currency: { required: true, type: () => String }, discountType: { required: true, type: () => String }, discountValue: { required: true, type: () => Number }, notes: { required: true, type: () => String }, internalNotes: { required: true, type: () => String }, termsAndConditions: { required: true, type: () => String }, rejectionReason: { required: true, type: () => String }, createdBy: { required: true, type: () => String }, updatedAt: { required: true, type: () => Date }, items: { required: true, type: () => [Object] } };
    }
}
exports.QuotationDetailResponseDto = QuotationDetailResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QuotationDetailResponseDto.prototype, "warehouseName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QuotationDetailResponseDto.prototype, "billingAddressId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QuotationDetailResponseDto.prototype, "shippingAddressId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QuotationDetailResponseDto.prototype, "referenceNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QuotationDetailResponseDto.prototype, "salesPersonId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QuotationDetailResponseDto.prototype, "paymentTermsId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QuotationDetailResponseDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QuotationDetailResponseDto.prototype, "discountType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], QuotationDetailResponseDto.prototype, "discountValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QuotationDetailResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QuotationDetailResponseDto.prototype, "internalNotes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QuotationDetailResponseDto.prototype, "termsAndConditions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QuotationDetailResponseDto.prototype, "rejectionReason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QuotationDetailResponseDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], QuotationDetailResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], QuotationDetailResponseDto.prototype, "items", void 0);
//# sourceMappingURL=quotation-response.dto.js.map