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
exports.CreateReturnDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const sales_return_entity_1 = require("../../../../entities/tenant/eCommerce/sales-return.entity");
class CreateReturnItemDto {
    productId;
    variantId;
    quantity;
    reason;
    condition;
    static _OPENAPI_METADATA_FACTORY() {
        return { productId: { required: true, type: () => String, format: "uuid" }, variantId: { required: false, type: () => String, format: "uuid" }, quantity: { required: true, type: () => Number, minimum: 0.0001 }, reason: { required: false, type: () => String }, condition: { required: false, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ format: 'uuid' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateReturnItemDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ format: 'uuid' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateReturnItemDto.prototype, "variantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.0001),
    __metadata("design:type", Number)
], CreateReturnItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReturnItemDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['GOOD', 'LIKE_NEW', 'DAMAGED', 'DEFECTIVE'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReturnItemDto.prototype, "condition", void 0);
class CreateReturnDto {
    salesOrderId;
    warehouseId;
    refundType;
    returnReason;
    returnDate;
    reasonDetails;
    restockingFeePercent;
    notes;
    items;
    static _OPENAPI_METADATA_FACTORY() {
        return { salesOrderId: { required: true, type: () => String, format: "uuid" }, warehouseId: { required: false, type: () => String, format: "uuid" }, refundType: { required: true, enum: require("../../../../entities/tenant/eCommerce/sales-return.entity").RefundType }, returnReason: { required: true, enum: require("../../../../entities/tenant/eCommerce/sales-return.entity").SalesReturnReason }, returnDate: { required: false, type: () => Date }, reasonDetails: { required: false, type: () => String }, restockingFeePercent: { required: false, type: () => Number, minimum: 0 }, notes: { required: false, type: () => String }, items: { required: true, type: () => [CreateReturnItemDto] } };
    }
}
exports.CreateReturnDto = CreateReturnDto;
__decorate([
    (0, swagger_1.ApiProperty)({ format: 'uuid' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateReturnDto.prototype, "salesOrderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ format: 'uuid' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateReturnDto.prototype, "warehouseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: sales_return_entity_1.RefundType, default: sales_return_entity_1.RefundType.ORIGINAL_PAYMENT }),
    (0, class_validator_1.IsEnum)(sales_return_entity_1.RefundType),
    __metadata("design:type", String)
], CreateReturnDto.prototype, "refundType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: sales_return_entity_1.SalesReturnReason }),
    (0, class_validator_1.IsEnum)(sales_return_entity_1.SalesReturnReason),
    __metadata("design:type", String)
], CreateReturnDto.prototype, "returnReason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: 'string', format: 'date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateReturnDto.prototype, "returnDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReturnDto.prototype, "reasonDetails", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateReturnDto.prototype, "restockingFeePercent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReturnDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CreateReturnItemDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateReturnItemDto),
    __metadata("design:type", Array)
], CreateReturnDto.prototype, "items", void 0);
//# sourceMappingURL=create-return.dto.js.map