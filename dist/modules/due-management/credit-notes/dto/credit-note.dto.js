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
exports.CreditNoteFilterDto = exports.ApplyToDueDto = exports.CreateCreditNoteDto = exports.CreditNoteItemDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const tenant_1 = require("../../../../entities/tenant");
const pagination_dto_1 = require("../../../../common/dto/pagination.dto");
class CreditNoteItemDto {
    productId;
    variantId;
    productName;
    sku;
    quantity;
    unitPrice;
    taxRate;
    taxAmount;
    lineTotal;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { productId: { required: true, type: () => String, format: "uuid" }, variantId: { required: false, type: () => String, format: "uuid" }, productName: { required: true, type: () => String }, sku: { required: true, type: () => String }, quantity: { required: true, type: () => Number, minimum: 0.0001 }, unitPrice: { required: true, type: () => Number, minimum: 0 }, taxRate: { required: false, type: () => Number }, taxAmount: { required: false, type: () => Number }, lineTotal: { required: true, type: () => Number }, notes: { required: false, type: () => String } };
    }
}
exports.CreditNoteItemDto = CreditNoteItemDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreditNoteItemDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreditNoteItemDto.prototype, "variantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreditNoteItemDto.prototype, "productName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreditNoteItemDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.0001),
    __metadata("design:type", Number)
], CreditNoteItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreditNoteItemDto.prototype, "unitPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreditNoteItemDto.prototype, "taxRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreditNoteItemDto.prototype, "taxAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreditNoteItemDto.prototype, "lineTotal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreditNoteItemDto.prototype, "notes", void 0);
class CreateCreditNoteDto {
    customerId;
    salesOrderId;
    salesReturnId;
    reason;
    reasonDetails;
    creditNoteDate;
    validUntil;
    currency;
    subtotal;
    taxAmount;
    totalAmount;
    notes;
    items;
    static _OPENAPI_METADATA_FACTORY() {
        return { customerId: { required: true, type: () => String, format: "uuid" }, salesOrderId: { required: false, type: () => String, format: "uuid" }, salesReturnId: { required: false, type: () => String, format: "uuid" }, reason: { required: true, enum: require("../../../../entities/tenant/dueManagement/credit-note.entity").CreditNoteReason }, reasonDetails: { required: false, type: () => String }, creditNoteDate: { required: true, type: () => String }, validUntil: { required: false, type: () => String }, currency: { required: false, type: () => String }, subtotal: { required: true, type: () => Number, minimum: 0 }, taxAmount: { required: false, type: () => Number }, totalAmount: { required: true, type: () => Number, minimum: 0.01 }, notes: { required: false, type: () => String }, items: { required: false, type: () => [require("./credit-note.dto").CreditNoteItemDto] } };
    }
}
exports.CreateCreditNoteDto = CreateCreditNoteDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateCreditNoteDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCreditNoteDto.prototype, "salesOrderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCreditNoteDto.prototype, "salesReturnId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: tenant_1.CreditNoteReason }),
    (0, class_validator_1.IsEnum)(tenant_1.CreditNoteReason),
    __metadata("design:type", String)
], CreateCreditNoteDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCreditNoteDto.prototype, "reasonDetails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateCreditNoteDto.prototype, "creditNoteDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCreditNoteDto.prototype, "validUntil", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCreditNoteDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateCreditNoteDto.prototype, "subtotal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateCreditNoteDto.prototype, "taxAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], CreateCreditNoteDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCreditNoteDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [CreditNoteItemDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreditNoteItemDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateCreditNoteDto.prototype, "items", void 0);
class ApplyToDueDto {
    customerDueId;
    amount;
    static _OPENAPI_METADATA_FACTORY() {
        return { customerDueId: { required: true, type: () => String, format: "uuid" }, amount: { required: true, type: () => Number, minimum: 0.01 } };
    }
}
exports.ApplyToDueDto = ApplyToDueDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ApplyToDueDto.prototype, "customerDueId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], ApplyToDueDto.prototype, "amount", void 0);
class CreditNoteFilterDto extends pagination_dto_1.PaginationDto {
    status;
    customerId;
    reason;
    fromDate;
    toDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: false, type: () => String }, customerId: { required: false, type: () => String, format: "uuid" }, reason: { required: false, type: () => String }, fromDate: { required: false, type: () => String }, toDate: { required: false, type: () => String } };
    }
}
exports.CreditNoteFilterDto = CreditNoteFilterDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreditNoteFilterDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreditNoteFilterDto.prototype, "customerId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreditNoteFilterDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreditNoteFilterDto.prototype, "fromDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreditNoteFilterDto.prototype, "toDate", void 0);
//# sourceMappingURL=credit-note.dto.js.map