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
exports.PurchaseReturnResponseDto = void 0;
const openapi = require("@nestjs/swagger");
const tenant_1 = require("../../../../entities/tenant");
const swagger_1 = require("@nestjs/swagger");
class PurchaseReturnItemDto {
    id;
    productId;
    productName;
    variantId;
    quantity;
    unitPrice;
    taxAmount;
    lineTotal;
    reason;
    condition;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, productId: { required: true, type: () => String }, productName: { required: false, type: () => String }, variantId: { required: false, type: () => String }, quantity: { required: true, type: () => Number }, unitPrice: { required: true, type: () => Number }, taxAmount: { required: true, type: () => Number }, lineTotal: { required: true, type: () => Number }, reason: { required: false, type: () => String }, condition: { required: true, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PurchaseReturnItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PurchaseReturnItemDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PurchaseReturnItemDto.prototype, "productName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PurchaseReturnItemDto.prototype, "variantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseReturnItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseReturnItemDto.prototype, "unitPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseReturnItemDto.prototype, "taxAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseReturnItemDto.prototype, "lineTotal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PurchaseReturnItemDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PurchaseReturnItemDto.prototype, "condition", void 0);
class PurchaseReturnResponseDto {
    id;
    returnNumber;
    purchaseOrderId;
    poNumber;
    grnId;
    grnNumber;
    supplierId;
    supplierName;
    warehouseId;
    warehouseName;
    returnDate;
    status;
    returnType;
    reason;
    reasonDetails;
    currency;
    subtotal;
    taxAmount;
    totalAmount;
    trackingNumber;
    creditNoteNumber;
    creditNoteAmount;
    creditNoteDate;
    approvedAt;
    shippedAt;
    receivedBySupplierAt;
    rejectionReason;
    items;
    itemCount;
    totalQuantity;
    createdAt;
    updatedAt;
    constructor(purchaseReturn) {
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
            this.items = purchaseReturn.items.map((item) => ({
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
            this.totalQuantity = purchaseReturn.items.reduce((sum, item) => sum + Number(item.quantity), 0);
        }
        else {
            this.itemCount = 0;
            this.totalQuantity = 0;
        }
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, returnNumber: { required: true, type: () => String }, purchaseOrderId: { required: false, type: () => String }, poNumber: { required: false, type: () => String }, grnId: { required: false, type: () => String }, grnNumber: { required: false, type: () => String }, supplierId: { required: true, type: () => String }, supplierName: { required: false, type: () => String }, warehouseId: { required: true, type: () => String }, warehouseName: { required: false, type: () => String }, returnDate: { required: true, type: () => Date }, status: { required: true, enum: require("../../../../entities/tenant/purchase/purchase-return.entity").PurchaseReturnStatus }, returnType: { required: true, type: () => String }, reason: { required: true, type: () => String }, reasonDetails: { required: false, type: () => String }, currency: { required: true, type: () => String }, subtotal: { required: true, type: () => Number }, taxAmount: { required: true, type: () => Number }, totalAmount: { required: true, type: () => Number }, trackingNumber: { required: false, type: () => String }, creditNoteNumber: { required: false, type: () => String }, creditNoteAmount: { required: false, type: () => Number }, creditNoteDate: { required: false, type: () => Date }, approvedAt: { required: false, type: () => Date }, shippedAt: { required: false, type: () => Date }, receivedBySupplierAt: { required: false, type: () => Date }, rejectionReason: { required: false, type: () => String }, items: { required: false, type: () => [PurchaseReturnItemDto] }, itemCount: { required: true, type: () => Number }, totalQuantity: { required: true, type: () => Number }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.PurchaseReturnResponseDto = PurchaseReturnResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PurchaseReturnResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PurchaseReturnResponseDto.prototype, "returnNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PurchaseReturnResponseDto.prototype, "purchaseOrderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PurchaseReturnResponseDto.prototype, "poNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PurchaseReturnResponseDto.prototype, "grnId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PurchaseReturnResponseDto.prototype, "grnNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PurchaseReturnResponseDto.prototype, "supplierId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PurchaseReturnResponseDto.prototype, "supplierName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PurchaseReturnResponseDto.prototype, "warehouseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PurchaseReturnResponseDto.prototype, "warehouseName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], PurchaseReturnResponseDto.prototype, "returnDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: tenant_1.PurchaseReturnStatus }),
    __metadata("design:type", String)
], PurchaseReturnResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PurchaseReturnResponseDto.prototype, "returnType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PurchaseReturnResponseDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PurchaseReturnResponseDto.prototype, "reasonDetails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PurchaseReturnResponseDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseReturnResponseDto.prototype, "subtotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseReturnResponseDto.prototype, "taxAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseReturnResponseDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PurchaseReturnResponseDto.prototype, "trackingNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PurchaseReturnResponseDto.prototype, "creditNoteNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], PurchaseReturnResponseDto.prototype, "creditNoteAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], PurchaseReturnResponseDto.prototype, "creditNoteDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], PurchaseReturnResponseDto.prototype, "approvedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], PurchaseReturnResponseDto.prototype, "shippedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], PurchaseReturnResponseDto.prototype, "receivedBySupplierAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PurchaseReturnResponseDto.prototype, "rejectionReason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [PurchaseReturnItemDto] }),
    __metadata("design:type", Array)
], PurchaseReturnResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseReturnResponseDto.prototype, "itemCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseReturnResponseDto.prototype, "totalQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], PurchaseReturnResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], PurchaseReturnResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=purchase-return-response.dto.js.map