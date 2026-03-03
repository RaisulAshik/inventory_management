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
exports.AdjustmentResponseDto = void 0;
const openapi = require("@nestjs/swagger");
const tenant_1 = require("../../../../entities/tenant");
const swagger_1 = require("@nestjs/swagger");
class AdjustmentItemDto {
    id;
    productId;
    productName;
    productSku;
    variantId;
    variantName;
    systemQuantity;
    physicalQuantity;
    adjustmentQuantity;
    unitCost;
    valueImpact;
    reason;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, productId: { required: true, type: () => String }, productName: { required: false, type: () => String }, productSku: { required: false, type: () => String }, variantId: { required: false, type: () => String }, variantName: { required: false, type: () => String }, systemQuantity: { required: true, type: () => Number }, physicalQuantity: { required: true, type: () => Number }, adjustmentQuantity: { required: true, type: () => Number }, unitCost: { required: false, type: () => Number }, valueImpact: { required: true, type: () => Number }, reason: { required: false, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AdjustmentItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AdjustmentItemDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], AdjustmentItemDto.prototype, "productName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], AdjustmentItemDto.prototype, "productSku", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], AdjustmentItemDto.prototype, "variantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], AdjustmentItemDto.prototype, "variantName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AdjustmentItemDto.prototype, "systemQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AdjustmentItemDto.prototype, "physicalQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AdjustmentItemDto.prototype, "adjustmentQuantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], AdjustmentItemDto.prototype, "unitCost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AdjustmentItemDto.prototype, "valueImpact", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], AdjustmentItemDto.prototype, "reason", void 0);
class AdjustmentResponseDto {
    id;
    adjustmentNumber;
    warehouseId;
    warehouseName;
    adjustmentType;
    adjustmentDate;
    status;
    reason;
    totalValueImpact;
    notes;
    approvedBy;
    approvedAt;
    items;
    createdAt;
    updatedAt;
    constructor(adjustment) {
        this.id = adjustment.id;
        this.adjustmentNumber = adjustment.adjustmentNumber;
        this.warehouseId = adjustment.warehouseId;
        this.warehouseName = adjustment.warehouse?.warehouseName;
        this.adjustmentType = adjustment.adjustmentType;
        this.adjustmentDate = adjustment.adjustmentDate;
        this.status = adjustment.status;
        this.reason = adjustment.reason;
        this.totalValueImpact = Number(adjustment.totalValueImpact) || 0;
        this.notes = adjustment.notes;
        this.approvedBy = adjustment.approvedBy;
        this.approvedAt = adjustment.approvedAt;
        this.createdAt = adjustment.createdAt;
        this.updatedAt = adjustment.updatedAt;
        if (adjustment.items) {
            this.items = adjustment.items.map((item) => ({
                id: item.id,
                productId: item.productId,
                productName: item.product?.productName,
                productSku: item.product?.sku,
                variantId: item.variantId,
                variantName: item.variant?.variantName,
                systemQuantity: Number(item.systemQuantity),
                physicalQuantity: Number(item.physicalQuantity),
                adjustmentQuantity: Number(item.adjustmentQuantity),
                unitCost: item.unitCost ? Number(item.unitCost) : undefined,
                valueImpact: Number(item.valueImpact) || 0,
                reason: item.reason,
            }));
        }
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, adjustmentNumber: { required: true, type: () => String }, warehouseId: { required: true, type: () => String }, warehouseName: { required: false, type: () => String }, adjustmentType: { required: true, enum: require("../../../../entities/tenant/warehouse/stock-adjustment.entity").AdjustmentType }, adjustmentDate: { required: true, type: () => Date }, status: { required: true, enum: require("../../../../entities/tenant/warehouse/stock-adjustment.entity").AdjustmentStatus }, reason: { required: true, type: () => String }, totalValueImpact: { required: true, type: () => Number }, notes: { required: false, type: () => String }, approvedBy: { required: false, type: () => String }, approvedAt: { required: false, type: () => Date }, items: { required: false, type: () => [AdjustmentItemDto] }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.AdjustmentResponseDto = AdjustmentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AdjustmentResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AdjustmentResponseDto.prototype, "adjustmentNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AdjustmentResponseDto.prototype, "warehouseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], AdjustmentResponseDto.prototype, "warehouseName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: tenant_1.AdjustmentType }),
    __metadata("design:type", String)
], AdjustmentResponseDto.prototype, "adjustmentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], AdjustmentResponseDto.prototype, "adjustmentDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: tenant_1.AdjustmentStatus }),
    __metadata("design:type", String)
], AdjustmentResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AdjustmentResponseDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AdjustmentResponseDto.prototype, "totalValueImpact", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], AdjustmentResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], AdjustmentResponseDto.prototype, "approvedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], AdjustmentResponseDto.prototype, "approvedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [AdjustmentItemDto] }),
    __metadata("design:type", Array)
], AdjustmentResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], AdjustmentResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], AdjustmentResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=adjustment-response.dto.js.map