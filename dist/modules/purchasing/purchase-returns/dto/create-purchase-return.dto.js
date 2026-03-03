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
exports.CreatePurchaseReturnDto = exports.PurchaseReturnType = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var PurchaseReturnType;
(function (PurchaseReturnType) {
    PurchaseReturnType["DAMAGED"] = "DAMAGED";
    PurchaseReturnType["DEFECTIVE"] = "DEFECTIVE";
    PurchaseReturnType["WRONG_ITEM"] = "WRONG_ITEM";
    PurchaseReturnType["QUALITY_ISSUE"] = "QUALITY_ISSUE";
    PurchaseReturnType["EXCESS_QUANTITY"] = "EXCESS_QUANTITY";
    PurchaseReturnType["OTHER"] = "OTHER";
})(PurchaseReturnType || (exports.PurchaseReturnType = PurchaseReturnType = {}));
class CreatePurchaseReturnItemDto {
    productId;
    variantId;
    quantity;
    uomId;
    unitPrice;
    taxAmount;
    reason;
    condition;
    static _OPENAPI_METADATA_FACTORY() {
        return { productId: { required: true, type: () => String, format: "uuid" }, variantId: { required: false, type: () => String, format: "uuid" }, quantity: { required: true, type: () => Number, minimum: 0.0001 }, uomId: { required: true, type: () => String, format: "uuid" }, unitPrice: { required: true, type: () => Number, minimum: 0 }, taxAmount: { required: false, type: () => Number, minimum: 0 }, reason: { required: false, type: () => String }, condition: { required: false, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ format: 'uuid' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePurchaseReturnItemDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ format: 'uuid' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePurchaseReturnItemDto.prototype, "variantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.0001),
    __metadata("design:type", Number)
], CreatePurchaseReturnItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ format: 'uuid' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePurchaseReturnItemDto.prototype, "uomId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePurchaseReturnItemDto.prototype, "unitPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePurchaseReturnItemDto.prototype, "taxAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePurchaseReturnItemDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: ['DAMAGED', 'DEFECTIVE', 'EXPIRED', 'WRONG_ITEM', 'OTHER'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePurchaseReturnItemDto.prototype, "condition", void 0);
class CreatePurchaseReturnDto {
    purchaseOrderId;
    grnId;
    warehouseId;
    returnDate;
    returnType;
    reason;
    reasonDetails;
    notes;
    items;
    static _OPENAPI_METADATA_FACTORY() {
        return { purchaseOrderId: { required: false, type: () => String, format: "uuid" }, grnId: { required: false, type: () => String, format: "uuid" }, warehouseId: { required: false, type: () => String, format: "uuid" }, returnDate: { required: false, type: () => Date }, returnType: { required: true, enum: require("./create-purchase-return.dto").PurchaseReturnType }, reason: { required: true, type: () => String }, reasonDetails: { required: false, type: () => String }, notes: { required: false, type: () => String }, items: { required: true, type: () => [CreatePurchaseReturnItemDto] } };
    }
}
exports.CreatePurchaseReturnDto = CreatePurchaseReturnDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ format: 'uuid' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePurchaseReturnDto.prototype, "purchaseOrderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ format: 'uuid' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePurchaseReturnDto.prototype, "grnId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ format: 'uuid' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePurchaseReturnDto.prototype, "warehouseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: 'string', format: 'date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreatePurchaseReturnDto.prototype, "returnDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: PurchaseReturnType }),
    (0, class_validator_1.IsEnum)(PurchaseReturnType),
    __metadata("design:type", String)
], CreatePurchaseReturnDto.prototype, "returnType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Goods received were damaged' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePurchaseReturnDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePurchaseReturnDto.prototype, "reasonDetails", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePurchaseReturnDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CreatePurchaseReturnItemDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreatePurchaseReturnItemDto),
    __metadata("design:type", Array)
], CreatePurchaseReturnDto.prototype, "items", void 0);
//# sourceMappingURL=create-purchase-return.dto.js.map