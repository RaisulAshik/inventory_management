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
exports.ReturnResponseDto = void 0;
const openapi = require("@nestjs/swagger");
const sales_return_entity_1 = require("../../../../entities/tenant/eCommerce/sales-return.entity");
const swagger_1 = require("@nestjs/swagger");
class ReturnItemDto {
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
    isRestocked;
    restockedQuantity;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, productId: { required: true, type: () => String }, productName: { required: false, type: () => String }, variantId: { required: false, type: () => String }, quantity: { required: true, type: () => Number }, unitPrice: { required: true, type: () => Number }, taxAmount: { required: true, type: () => Number }, lineTotal: { required: true, type: () => Number }, reason: { required: false, type: () => String }, condition: { required: true, type: () => String }, isRestocked: { required: true, type: () => Boolean }, restockedQuantity: { required: true, type: () => Number } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ReturnItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ReturnItemDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ReturnItemDto.prototype, "productName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ReturnItemDto.prototype, "variantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ReturnItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ReturnItemDto.prototype, "unitPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ReturnItemDto.prototype, "taxAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ReturnItemDto.prototype, "lineTotal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ReturnItemDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ReturnItemDto.prototype, "condition", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ReturnItemDto.prototype, "isRestocked", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ReturnItemDto.prototype, "restockedQuantity", void 0);
class ReturnResponseDto {
    id;
    returnNumber;
    salesOrderId;
    orderNumber;
    customerId;
    customerName;
    refundType;
    returnDate;
    status;
    returnReason;
    reasonDetails;
    subtotal;
    taxAmount;
    restockingFee;
    shippingFeeDeduction;
    totalAmount;
    refundAmount;
    inspectionNotes;
    approvedAt;
    receivedDate;
    refundedAt;
    items;
    itemCount;
    createdAt;
    updatedAt;
    constructor(salesReturn) {
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
            this.items = salesReturn.items.map((item) => ({
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
        }
        else {
            this.itemCount = 0;
        }
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, returnNumber: { required: true, type: () => String }, salesOrderId: { required: true, type: () => String }, orderNumber: { required: false, type: () => String }, customerId: { required: true, type: () => String }, customerName: { required: false, type: () => String }, refundType: { required: true, enum: require("../../../../entities/tenant/eCommerce/sales-return.entity").RefundType }, returnDate: { required: true, type: () => Date }, status: { required: true, enum: require("../../../../entities/tenant/eCommerce/sales-return.entity").SalesReturnStatus }, returnReason: { required: true, enum: require("../../../../entities/tenant/eCommerce/sales-return.entity").SalesReturnReason }, reasonDetails: { required: false, type: () => String }, subtotal: { required: true, type: () => Number }, taxAmount: { required: true, type: () => Number }, restockingFee: { required: true, type: () => Number }, shippingFeeDeduction: { required: true, type: () => Number }, totalAmount: { required: true, type: () => Number }, refundAmount: { required: true, type: () => Number }, inspectionNotes: { required: false, type: () => String }, approvedAt: { required: false, type: () => Date }, receivedDate: { required: false, type: () => Date }, refundedAt: { required: false, type: () => Date }, items: { required: false, type: () => [ReturnItemDto] }, itemCount: { required: true, type: () => Number }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.ReturnResponseDto = ReturnResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ReturnResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ReturnResponseDto.prototype, "returnNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ReturnResponseDto.prototype, "salesOrderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ReturnResponseDto.prototype, "orderNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ReturnResponseDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ReturnResponseDto.prototype, "customerName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: sales_return_entity_1.RefundType }),
    __metadata("design:type", String)
], ReturnResponseDto.prototype, "refundType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ReturnResponseDto.prototype, "returnDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: sales_return_entity_1.SalesReturnStatus }),
    __metadata("design:type", String)
], ReturnResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: sales_return_entity_1.SalesReturnReason }),
    __metadata("design:type", String)
], ReturnResponseDto.prototype, "returnReason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ReturnResponseDto.prototype, "reasonDetails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ReturnResponseDto.prototype, "subtotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ReturnResponseDto.prototype, "taxAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ReturnResponseDto.prototype, "restockingFee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ReturnResponseDto.prototype, "shippingFeeDeduction", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ReturnResponseDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ReturnResponseDto.prototype, "refundAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ReturnResponseDto.prototype, "inspectionNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], ReturnResponseDto.prototype, "approvedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], ReturnResponseDto.prototype, "receivedDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], ReturnResponseDto.prototype, "refundedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [ReturnItemDto] }),
    __metadata("design:type", Array)
], ReturnResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ReturnResponseDto.prototype, "itemCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ReturnResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ReturnResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=return-response.dto.js.map