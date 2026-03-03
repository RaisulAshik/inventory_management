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
exports.CreateQuotationDto = exports.CreateQuotationItemDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class CreateQuotationItemDto {
    productId;
    variantId;
    uomId;
    quantity;
    unitPrice;
    discountType;
    discountValue;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { productId: { required: true, type: () => String, format: "uuid" }, variantId: { required: false, type: () => String, format: "uuid" }, uomId: { required: false, type: () => String, format: "uuid" }, quantity: { required: true, type: () => Number, minimum: 0.0001 }, unitPrice: { required: true, type: () => Number, minimum: 0 }, discountType: { required: false, type: () => Object }, discountValue: { required: false, type: () => Number }, notes: { required: false, type: () => String } };
    }
}
exports.CreateQuotationItemDto = CreateQuotationItemDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateQuotationItemDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateQuotationItemDto.prototype, "variantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateQuotationItemDto.prototype, "uomId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.0001),
    __metadata("design:type", Number)
], CreateQuotationItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateQuotationItemDto.prototype, "unitPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['PERCENTAGE', 'FIXED'] }),
    (0, class_validator_1.IsEnum)(['PERCENTAGE', 'FIXED']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateQuotationItemDto.prototype, "discountType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateQuotationItemDto.prototype, "discountValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateQuotationItemDto.prototype, "notes", void 0);
class CreateQuotationDto {
    customerId;
    warehouseId;
    quotationDate;
    validUntil;
    billingAddressId;
    shippingAddressId;
    paymentTermsId;
    salesPersonId;
    referenceNumber;
    notes;
    internalNotes;
    termsAndConditions;
    items;
    discountType;
    discountValue;
    shippingAmount;
    static _OPENAPI_METADATA_FACTORY() {
        return { customerId: { required: true, type: () => String, format: "uuid" }, warehouseId: { required: true, type: () => String, format: "uuid" }, quotationDate: { required: true, type: () => String }, validUntil: { required: false, type: () => String }, billingAddressId: { required: false, type: () => String, format: "uuid" }, shippingAddressId: { required: false, type: () => String, format: "uuid" }, paymentTermsId: { required: false, type: () => String, format: "uuid" }, salesPersonId: { required: false, type: () => String, format: "uuid" }, referenceNumber: { required: false, type: () => String }, notes: { required: false, type: () => String }, internalNotes: { required: false, type: () => String }, termsAndConditions: { required: false, type: () => String }, items: { required: true, type: () => [require("./create-quotation.dto").CreateQuotationItemDto] }, discountType: { required: false, type: () => String }, discountValue: { required: false, type: () => Number }, shippingAmount: { required: false, type: () => Number } };
    }
}
exports.CreateQuotationDto = CreateQuotationDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateQuotationDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateQuotationDto.prototype, "warehouseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateQuotationDto.prototype, "quotationDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateQuotationDto.prototype, "validUntil", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateQuotationDto.prototype, "billingAddressId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateQuotationDto.prototype, "shippingAddressId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateQuotationDto.prototype, "paymentTermsId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateQuotationDto.prototype, "salesPersonId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateQuotationDto.prototype, "referenceNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateQuotationDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateQuotationDto.prototype, "internalNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateQuotationDto.prototype, "termsAndConditions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CreateQuotationItemDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateQuotationItemDto),
    __metadata("design:type", Array)
], CreateQuotationDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['PERCENTAGE', 'FIXED'] }),
    (0, class_validator_1.IsEnum)(['PERCENTAGE', 'FIXED']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateQuotationDto.prototype, "discountType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateQuotationDto.prototype, "discountValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateQuotationDto.prototype, "shippingAmount", void 0);
//# sourceMappingURL=create-quotation.dto.js.map