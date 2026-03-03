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
exports.DebitNoteFilterDto = exports.ApplyToSupplierDueDto = exports.AcknowledgeDebitNoteDto = exports.CreateDebitNoteDto = exports.DebitNoteItemDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const tenant_1 = require("../../../../entities/tenant");
const pagination_dto_1 = require("../../../../common/dto/pagination.dto");
class DebitNoteItemDto {
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
exports.DebitNoteItemDto = DebitNoteItemDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], DebitNoteItemDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DebitNoteItemDto.prototype, "variantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DebitNoteItemDto.prototype, "productName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DebitNoteItemDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.0001),
    __metadata("design:type", Number)
], DebitNoteItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], DebitNoteItemDto.prototype, "unitPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], DebitNoteItemDto.prototype, "taxRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], DebitNoteItemDto.prototype, "taxAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DebitNoteItemDto.prototype, "lineTotal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DebitNoteItemDto.prototype, "notes", void 0);
class CreateDebitNoteDto {
    supplierId;
    purchaseOrderId;
    grnId;
    purchaseReturnId;
    reason;
    reasonDetails;
    debitNoteDate;
    currency;
    subtotal;
    taxAmount;
    totalAmount;
    notes;
    items;
    static _OPENAPI_METADATA_FACTORY() {
        return { supplierId: { required: true, type: () => String, format: "uuid" }, purchaseOrderId: { required: false, type: () => String, format: "uuid" }, grnId: { required: false, type: () => String, format: "uuid" }, purchaseReturnId: { required: false, type: () => String, format: "uuid" }, reason: { required: true, enum: require("../../../../entities/tenant/dueManagement/debit-note.entity").DebitNoteReason }, reasonDetails: { required: false, type: () => String }, debitNoteDate: { required: true, type: () => String }, currency: { required: false, type: () => String }, subtotal: { required: true, type: () => Number, minimum: 0 }, taxAmount: { required: false, type: () => Number }, totalAmount: { required: true, type: () => Number, minimum: 0.01 }, notes: { required: false, type: () => String }, items: { required: false, type: () => [require("./debit-note.dto").DebitNoteItemDto] } };
    }
}
exports.CreateDebitNoteDto = CreateDebitNoteDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateDebitNoteDto.prototype, "supplierId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDebitNoteDto.prototype, "purchaseOrderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDebitNoteDto.prototype, "grnId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDebitNoteDto.prototype, "purchaseReturnId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: tenant_1.DebitNoteReason }),
    (0, class_validator_1.IsEnum)(tenant_1.DebitNoteReason),
    __metadata("design:type", String)
], CreateDebitNoteDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDebitNoteDto.prototype, "reasonDetails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateDebitNoteDto.prototype, "debitNoteDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDebitNoteDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateDebitNoteDto.prototype, "subtotal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateDebitNoteDto.prototype, "taxAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], CreateDebitNoteDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDebitNoteDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [DebitNoteItemDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => DebitNoteItemDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateDebitNoteDto.prototype, "items", void 0);
class AcknowledgeDebitNoteDto {
    acknowledgementNumber;
    acknowledgementDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { acknowledgementNumber: { required: false, type: () => String }, acknowledgementDate: { required: false, type: () => String } };
    }
}
exports.AcknowledgeDebitNoteDto = AcknowledgeDebitNoteDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AcknowledgeDebitNoteDto.prototype, "acknowledgementNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AcknowledgeDebitNoteDto.prototype, "acknowledgementDate", void 0);
class ApplyToSupplierDueDto {
    supplierDueId;
    amount;
    static _OPENAPI_METADATA_FACTORY() {
        return { supplierDueId: { required: true, type: () => String, format: "uuid" }, amount: { required: true, type: () => Number, minimum: 0.01 } };
    }
}
exports.ApplyToSupplierDueDto = ApplyToSupplierDueDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ApplyToSupplierDueDto.prototype, "supplierDueId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], ApplyToSupplierDueDto.prototype, "amount", void 0);
class DebitNoteFilterDto extends pagination_dto_1.PaginationDto {
    status;
    supplierId;
    reason;
    fromDate;
    toDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: false, type: () => String }, supplierId: { required: false, type: () => String, format: "uuid" }, reason: { required: false, type: () => String }, fromDate: { required: false, type: () => String }, toDate: { required: false, type: () => String } };
    }
}
exports.DebitNoteFilterDto = DebitNoteFilterDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DebitNoteFilterDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], DebitNoteFilterDto.prototype, "supplierId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DebitNoteFilterDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DebitNoteFilterDto.prototype, "fromDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DebitNoteFilterDto.prototype, "toDate", void 0);
//# sourceMappingURL=debit-note.dto.js.map