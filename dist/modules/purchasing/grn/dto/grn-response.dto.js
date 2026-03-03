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
exports.GrnResponseDto = void 0;
const openapi = require("@nestjs/swagger");
const enums_1 = require("../../../../common/enums");
const swagger_1 = require("@nestjs/swagger");
class GrnItemDto {
    id;
    productId;
    productName;
    variantId;
    receivedQuantity;
    acceptedQuantity;
    rejectedQuantity;
    unitPrice;
    taxAmount;
    lineTotal;
    batchNumber;
    expiryDate;
    locationId;
    rejectionReason;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, productId: { required: true, type: () => String }, productName: { required: false, type: () => String }, variantId: { required: false, type: () => String }, receivedQuantity: { required: true, type: () => Number }, acceptedQuantity: { required: true, type: () => Number }, rejectedQuantity: { required: true, type: () => Number }, unitPrice: { required: true, type: () => Number }, taxAmount: { required: true, type: () => Number }, lineTotal: { required: true, type: () => Number }, batchNumber: { required: false, type: () => String }, expiryDate: { required: false, type: () => Date }, locationId: { required: false, type: () => String }, rejectionReason: { required: false, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GrnItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GrnItemDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], GrnItemDto.prototype, "productName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], GrnItemDto.prototype, "variantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GrnItemDto.prototype, "receivedQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GrnItemDto.prototype, "acceptedQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GrnItemDto.prototype, "rejectedQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GrnItemDto.prototype, "unitPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GrnItemDto.prototype, "taxAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GrnItemDto.prototype, "lineTotal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], GrnItemDto.prototype, "batchNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], GrnItemDto.prototype, "expiryDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], GrnItemDto.prototype, "locationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], GrnItemDto.prototype, "rejectionReason", void 0);
class GrnResponseDto {
    id;
    grnNumber;
    purchaseOrderId;
    poNumber;
    supplierId;
    supplierName;
    warehouseId;
    warehouseName;
    receiptDate;
    status;
    supplierInvoiceNumber;
    supplierInvoiceDate;
    currency;
    subtotal;
    taxAmount;
    totalAmount;
    approvedAt;
    qcCompletedAt;
    notes;
    items;
    itemCount;
    totalReceivedQuantity;
    totalAcceptedQuantity;
    totalRejectedQuantity;
    createdAt;
    updatedAt;
    constructor(grn) {
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
            this.items = grn.items.map((item) => ({
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
            this.totalReceivedQuantity = grn.items.reduce((sum, item) => sum + Number(item.receivedQuantity), 0);
            this.totalAcceptedQuantity = grn.items.reduce((sum, item) => sum + Number(item.acceptedQuantity), 0);
            this.totalRejectedQuantity = grn.items.reduce((sum, item) => sum + Number(item.rejectedQuantity), 0);
        }
        else {
            this.itemCount = 0;
            this.totalReceivedQuantity = 0;
            this.totalAcceptedQuantity = 0;
            this.totalRejectedQuantity = 0;
        }
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, grnNumber: { required: true, type: () => String }, purchaseOrderId: { required: true, type: () => String }, poNumber: { required: false, type: () => String }, supplierId: { required: true, type: () => String }, supplierName: { required: false, type: () => String }, warehouseId: { required: true, type: () => String }, warehouseName: { required: false, type: () => String }, receiptDate: { required: true, type: () => Date }, status: { required: true, enum: require("../../../../common/enums/index").GRNStatus }, supplierInvoiceNumber: { required: false, type: () => String }, supplierInvoiceDate: { required: false, type: () => Date }, currency: { required: true, type: () => String }, subtotal: { required: true, type: () => Number }, taxAmount: { required: true, type: () => Number }, totalAmount: { required: true, type: () => Number }, approvedAt: { required: false, type: () => Date }, qcCompletedAt: { required: false, type: () => Date }, notes: { required: false, type: () => String }, items: { required: false, type: () => [GrnItemDto] }, itemCount: { required: true, type: () => Number }, totalReceivedQuantity: { required: true, type: () => Number }, totalAcceptedQuantity: { required: true, type: () => Number }, totalRejectedQuantity: { required: true, type: () => Number }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.GrnResponseDto = GrnResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GrnResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GrnResponseDto.prototype, "grnNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GrnResponseDto.prototype, "purchaseOrderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], GrnResponseDto.prototype, "poNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GrnResponseDto.prototype, "supplierId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], GrnResponseDto.prototype, "supplierName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GrnResponseDto.prototype, "warehouseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], GrnResponseDto.prototype, "warehouseName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], GrnResponseDto.prototype, "receiptDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.GRNStatus }),
    __metadata("design:type", String)
], GrnResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], GrnResponseDto.prototype, "supplierInvoiceNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], GrnResponseDto.prototype, "supplierInvoiceDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GrnResponseDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GrnResponseDto.prototype, "subtotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GrnResponseDto.prototype, "taxAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GrnResponseDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], GrnResponseDto.prototype, "approvedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], GrnResponseDto.prototype, "qcCompletedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], GrnResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [GrnItemDto] }),
    __metadata("design:type", Array)
], GrnResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GrnResponseDto.prototype, "itemCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GrnResponseDto.prototype, "totalReceivedQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GrnResponseDto.prototype, "totalAcceptedQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GrnResponseDto.prototype, "totalRejectedQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], GrnResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], GrnResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=grn-response.dto.js.map