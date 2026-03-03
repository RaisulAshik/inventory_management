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
exports.QuotationFilterDto = exports.UpdateQuotationDto = exports.CreateQuotationDto = exports.CreateQuotationItemDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateQuotationItemDto {
    productId;
    variantId;
    productName;
    productSku;
    description;
    unit;
    unitPrice;
    quantity;
    discountPercentage;
    discountAmount;
    taxRate;
    taxAmount;
    lineTotal;
    sortOrder;
    notes;
    discountType;
    discountValue;
    static _OPENAPI_METADATA_FACTORY() {
        return { productId: { required: true, type: () => String, format: "uuid" }, variantId: { required: false, type: () => String, format: "uuid" }, productName: { required: true, type: () => String }, productSku: { required: false, type: () => String }, description: { required: false, type: () => String }, unit: { required: false, type: () => String }, unitPrice: { required: true, type: () => Number, minimum: 0 }, quantity: { required: true, type: () => Number, minimum: 1 }, discountPercentage: { required: false, type: () => Number, minimum: 0 }, discountAmount: { required: false, type: () => Number, minimum: 0 }, taxRate: { required: false, type: () => Number, minimum: 0 }, taxAmount: { required: false, type: () => Number, minimum: 0 }, lineTotal: { required: true, type: () => Number, minimum: 0 }, sortOrder: { required: false, type: () => Number }, notes: { required: false, type: () => String }, discountType: { required: true, type: () => String }, discountValue: { required: true, type: () => Number } };
    }
}
exports.CreateQuotationItemDto = CreateQuotationItemDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateQuotationItemDto.prototype, "productId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateQuotationItemDto.prototype, "variantId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateQuotationItemDto.prototype, "productName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQuotationItemDto.prototype, "productSku", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQuotationItemDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQuotationItemDto.prototype, "unit", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateQuotationItemDto.prototype, "unitPrice", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateQuotationItemDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateQuotationItemDto.prototype, "discountPercentage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateQuotationItemDto.prototype, "discountAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateQuotationItemDto.prototype, "taxRate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateQuotationItemDto.prototype, "taxAmount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateQuotationItemDto.prototype, "lineTotal", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateQuotationItemDto.prototype, "sortOrder", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQuotationItemDto.prototype, "notes", void 0);
class CreateQuotationDto {
    customerId;
    salesPersonId;
    quotationDate;
    validUntil;
    currency;
    items;
    subtotal;
    discountAmount;
    discountPercentage;
    taxAmount;
    shippingAmount;
    totalAmount;
    notes;
    internalNotes;
    termsAndConditions;
    customerReferenceNumber;
    discountType;
    discountValue;
    static _OPENAPI_METADATA_FACTORY() {
        return { customerId: { required: true, type: () => String, format: "uuid" }, salesPersonId: { required: false, type: () => String, format: "uuid" }, quotationDate: { required: true, type: () => String }, validUntil: { required: true, type: () => String }, currency: { required: false, type: () => String }, items: { required: true, type: () => [require("./quotation.dto").CreateQuotationItemDto] }, subtotal: { required: false, type: () => Number }, discountAmount: { required: false, type: () => Number }, discountPercentage: { required: false, type: () => Number }, taxAmount: { required: false, type: () => Number }, shippingAmount: { required: false, type: () => Number }, totalAmount: { required: false, type: () => Number }, notes: { required: false, type: () => String }, internalNotes: { required: false, type: () => String }, termsAndConditions: { required: false, type: () => String }, customerReferenceNumber: { required: false, type: () => String }, discountType: { required: true, type: () => String }, discountValue: { required: true, type: () => Number } };
    }
}
exports.CreateQuotationDto = CreateQuotationDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateQuotationDto.prototype, "customerId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateQuotationDto.prototype, "salesPersonId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateQuotationDto.prototype, "quotationDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateQuotationDto.prototype, "validUntil", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQuotationDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateQuotationItemDto),
    __metadata("design:type", Array)
], CreateQuotationDto.prototype, "items", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateQuotationDto.prototype, "subtotal", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateQuotationDto.prototype, "discountAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateQuotationDto.prototype, "discountPercentage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateQuotationDto.prototype, "taxAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateQuotationDto.prototype, "shippingAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateQuotationDto.prototype, "totalAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQuotationDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQuotationDto.prototype, "internalNotes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQuotationDto.prototype, "termsAndConditions", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQuotationDto.prototype, "customerReferenceNumber", void 0);
const mapped_types_1 = require("@nestjs/mapped-types");
class UpdateQuotationDto extends (0, mapped_types_1.PartialType)(CreateQuotationDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateQuotationDto = UpdateQuotationDto;
class QuotationFilterDto {
    quotationNumber;
    status;
    customerId;
    salesPersonId;
    fromDate;
    toDate;
    page;
    limit;
    static _OPENAPI_METADATA_FACTORY() {
        return { quotationNumber: { required: false, type: () => String }, status: { required: false, type: () => String }, customerId: { required: false, type: () => String, format: "uuid" }, salesPersonId: { required: false, type: () => String, format: "uuid" }, fromDate: { required: false, type: () => String }, toDate: { required: false, type: () => String }, page: { required: false, type: () => Number }, limit: { required: false, type: () => Number } };
    }
}
exports.QuotationFilterDto = QuotationFilterDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QuotationFilterDto.prototype, "quotationNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)([
        'DRAFT',
        'SENT',
        'ACCEPTED',
        'REJECTED',
        'EXPIRED',
        'CANCELLED',
        'CONVERTED',
    ]),
    __metadata("design:type", String)
], QuotationFilterDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], QuotationFilterDto.prototype, "customerId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], QuotationFilterDto.prototype, "salesPersonId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], QuotationFilterDto.prototype, "fromDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], QuotationFilterDto.prototype, "toDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], QuotationFilterDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], QuotationFilterDto.prototype, "limit", void 0);
//# sourceMappingURL=quotation.dto.js.map