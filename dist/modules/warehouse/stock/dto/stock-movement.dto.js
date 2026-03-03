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
exports.StockMovementDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const enums_1 = require("../../../../common/enums");
class StockMovementDto {
    movementType;
    productId;
    variantId;
    batchId;
    warehouseId;
    fromWarehouseId;
    toWarehouseId;
    fromLocationId;
    toLocationId;
    quantity;
    uomId;
    unitCost;
    referenceType;
    referenceId;
    referenceNumber;
    reason;
    static _OPENAPI_METADATA_FACTORY() {
        return { movementType: { required: true, enum: require("../../../../common/enums/index").StockMovementType }, productId: { required: true, type: () => String, format: "uuid" }, variantId: { required: false, type: () => String, format: "uuid" }, batchId: { required: false, type: () => String, format: "uuid" }, warehouseId: { required: false, type: () => String, format: "uuid" }, fromWarehouseId: { required: false, type: () => String, format: "uuid" }, toWarehouseId: { required: false, type: () => String, format: "uuid" }, fromLocationId: { required: false, type: () => String, format: "uuid" }, toLocationId: { required: false, type: () => String, format: "uuid" }, quantity: { required: true, type: () => Number, minimum: 0.0001 }, uomId: { required: true, type: () => String, format: "uuid" }, unitCost: { required: false, type: () => Number, minimum: 0 }, referenceType: { required: false, type: () => String }, referenceId: { required: false, type: () => String, format: "uuid" }, referenceNumber: { required: false, type: () => String }, reason: { required: false, type: () => String } };
    }
}
exports.StockMovementDto = StockMovementDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.StockMovementType }),
    (0, class_validator_1.IsEnum)(enums_1.StockMovementType),
    __metadata("design:type", String)
], StockMovementDto.prototype, "movementType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ format: 'uuid' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], StockMovementDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ format: 'uuid' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], StockMovementDto.prototype, "variantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ format: 'uuid' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], StockMovementDto.prototype, "batchId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ format: 'uuid' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], StockMovementDto.prototype, "warehouseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ format: 'uuid' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], StockMovementDto.prototype, "fromWarehouseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ format: 'uuid' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], StockMovementDto.prototype, "toWarehouseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ format: 'uuid' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], StockMovementDto.prototype, "fromLocationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ format: 'uuid' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], StockMovementDto.prototype, "toLocationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.0001),
    __metadata("design:type", Number)
], StockMovementDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ format: 'uuid' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], StockMovementDto.prototype, "uomId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], StockMovementDto.prototype, "unitCost", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StockMovementDto.prototype, "referenceType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], StockMovementDto.prototype, "referenceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StockMovementDto.prototype, "referenceNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StockMovementDto.prototype, "reason", void 0);
//# sourceMappingURL=stock-movement.dto.js.map