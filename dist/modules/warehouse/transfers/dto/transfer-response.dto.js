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
exports.TransferResponseDto = void 0;
const openapi = require("@nestjs/swagger");
const tenant_1 = require("../../../../entities/tenant");
const swagger_1 = require("@nestjs/swagger");
class TransferItemDto {
    id;
    productId;
    productName;
    productSku;
    variantId;
    variantName;
    quantityRequested;
    quantityShipped;
    quantityReceived;
    quantityDamaged;
    fromLocationId;
    toLocationId;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, productId: { required: true, type: () => String }, productName: { required: false, type: () => String }, productSku: { required: false, type: () => String }, variantId: { required: false, type: () => String }, variantName: { required: false, type: () => String }, quantityRequested: { required: true, type: () => Number }, quantityShipped: { required: true, type: () => Number }, quantityReceived: { required: true, type: () => Number }, quantityDamaged: { required: true, type: () => Number }, fromLocationId: { required: false, type: () => String }, toLocationId: { required: false, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TransferItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TransferItemDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], TransferItemDto.prototype, "productName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], TransferItemDto.prototype, "productSku", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], TransferItemDto.prototype, "variantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], TransferItemDto.prototype, "variantName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TransferItemDto.prototype, "quantityRequested", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TransferItemDto.prototype, "quantityShipped", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TransferItemDto.prototype, "quantityReceived", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TransferItemDto.prototype, "quantityDamaged", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], TransferItemDto.prototype, "fromLocationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], TransferItemDto.prototype, "toLocationId", void 0);
class TransferResponseDto {
    id;
    transferNumber;
    transferType;
    fromWarehouseId;
    fromWarehouseName;
    toWarehouseId;
    toWarehouseName;
    status;
    transferDate;
    expectedDeliveryDate;
    trackingNumber;
    reason;
    notes;
    approvedBy;
    approvedAt;
    shippedBy;
    shippedAt;
    receivedBy;
    receivedAt;
    items;
    createdAt;
    updatedAt;
    constructor(transfer) {
        this.id = transfer.id;
        this.transferNumber = transfer.transferNumber;
        this.transferType = transfer.transferType;
        this.fromWarehouseId = transfer.fromWarehouseId;
        this.fromWarehouseName = transfer.fromWarehouse?.warehouseName;
        this.toWarehouseId = transfer.toWarehouseId;
        this.toWarehouseName = transfer.toWarehouse?.warehouseName;
        this.status = transfer.status;
        this.transferDate = transfer.transferDate;
        this.expectedDeliveryDate = transfer.expectedDeliveryDate;
        this.trackingNumber = transfer.trackingNumber;
        this.reason = transfer.reason;
        this.notes = transfer.notes;
        this.approvedBy = transfer.approvedBy;
        this.approvedAt = transfer.approvedAt;
        this.shippedBy = transfer.shippedBy;
        this.shippedAt = transfer.shippedAt;
        this.receivedBy = transfer.receivedBy;
        this.receivedAt = transfer.receivedAt;
        this.createdAt = transfer.createdAt;
        this.updatedAt = transfer.updatedAt;
        if (transfer.items) {
            this.items = transfer.items.map((item) => ({
                id: item.id,
                productId: item.productId,
                productName: item.product?.productName,
                productSku: item.product?.sku,
                variantId: item.variantId,
                variantName: item.variant?.variantName,
                quantityRequested: Number(item.quantityRequested),
                quantityShipped: Number(item.quantityShipped) || 0,
                quantityReceived: Number(item.quantityReceived) || 0,
                quantityDamaged: Number(item.quantityDamaged) || 0,
                fromLocationId: item.fromLocationId,
                toLocationId: item.toLocationId,
            }));
        }
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, transferNumber: { required: true, type: () => String }, transferType: { required: true, enum: require("../../../../entities/tenant/warehouse/warehouse-transfer.entity").TransferType }, fromWarehouseId: { required: true, type: () => String }, fromWarehouseName: { required: false, type: () => String }, toWarehouseId: { required: true, type: () => String }, toWarehouseName: { required: false, type: () => String }, status: { required: true, enum: require("../../../../entities/tenant/warehouse/warehouse-transfer.entity").TransferStatus }, transferDate: { required: false, type: () => Date }, expectedDeliveryDate: { required: false, type: () => Date }, trackingNumber: { required: false, type: () => String }, reason: { required: false, type: () => String }, notes: { required: false, type: () => String }, approvedBy: { required: false, type: () => String }, approvedAt: { required: false, type: () => Date }, shippedBy: { required: false, type: () => String }, shippedAt: { required: false, type: () => Date }, receivedBy: { required: false, type: () => String }, receivedAt: { required: false, type: () => Date }, items: { required: false, type: () => [TransferItemDto] }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.TransferResponseDto = TransferResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TransferResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TransferResponseDto.prototype, "transferNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: tenant_1.TransferType }),
    __metadata("design:type", String)
], TransferResponseDto.prototype, "transferType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TransferResponseDto.prototype, "fromWarehouseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], TransferResponseDto.prototype, "fromWarehouseName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TransferResponseDto.prototype, "toWarehouseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], TransferResponseDto.prototype, "toWarehouseName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: tenant_1.TransferStatus }),
    __metadata("design:type", String)
], TransferResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], TransferResponseDto.prototype, "transferDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], TransferResponseDto.prototype, "expectedDeliveryDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], TransferResponseDto.prototype, "trackingNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], TransferResponseDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], TransferResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], TransferResponseDto.prototype, "approvedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], TransferResponseDto.prototype, "approvedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], TransferResponseDto.prototype, "shippedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], TransferResponseDto.prototype, "shippedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], TransferResponseDto.prototype, "receivedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], TransferResponseDto.prototype, "receivedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [TransferItemDto] }),
    __metadata("design:type", Array)
], TransferResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], TransferResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], TransferResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=transfer-response.dto.js.map