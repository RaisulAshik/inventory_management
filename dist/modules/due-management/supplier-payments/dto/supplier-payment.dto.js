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
exports.SupplierPaymentFilterDto = exports.AllocatePaymentDto = exports.CreateSupplierPaymentDto = exports.PaymentAllocationDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const pagination_dto_1 = require("../../../../common/dto/pagination.dto");
class PaymentAllocationDto {
    supplierDueId;
    amount;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { supplierDueId: { required: true, type: () => String, format: "uuid" }, amount: { required: true, type: () => Number, minimum: 0.01 }, notes: { required: false, type: () => String } };
    }
}
exports.PaymentAllocationDto = PaymentAllocationDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], PaymentAllocationDto.prototype, "supplierDueId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], PaymentAllocationDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PaymentAllocationDto.prototype, "notes", void 0);
class CreateSupplierPaymentDto {
    supplierId;
    paymentMethodId;
    bankAccountId;
    amount;
    paymentDate;
    currency;
    exchangeRate;
    referenceNumber;
    chequeNumber;
    chequeDate;
    bankReference;
    transactionId;
    tdsPercentage;
    tdsAmount;
    notes;
    allocations;
    static _OPENAPI_METADATA_FACTORY() {
        return { supplierId: { required: true, type: () => String, format: "uuid" }, paymentMethodId: { required: true, type: () => String, format: "uuid" }, bankAccountId: { required: false, type: () => String, format: "uuid" }, amount: { required: true, type: () => Number, minimum: 0.01 }, paymentDate: { required: true, type: () => String }, currency: { required: false, type: () => String }, exchangeRate: { required: false, type: () => Number }, referenceNumber: { required: false, type: () => String }, chequeNumber: { required: false, type: () => String }, chequeDate: { required: false, type: () => String }, bankReference: { required: false, type: () => String }, transactionId: { required: false, type: () => String }, tdsPercentage: { required: false, type: () => Number }, tdsAmount: { required: false, type: () => Number }, notes: { required: false, type: () => String }, allocations: { required: false, type: () => [require("./supplier-payment.dto").PaymentAllocationDto] } };
    }
}
exports.CreateSupplierPaymentDto = CreateSupplierPaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateSupplierPaymentDto.prototype, "supplierId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateSupplierPaymentDto.prototype, "paymentMethodId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSupplierPaymentDto.prototype, "bankAccountId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], CreateSupplierPaymentDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateSupplierPaymentDto.prototype, "paymentDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSupplierPaymentDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateSupplierPaymentDto.prototype, "exchangeRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSupplierPaymentDto.prototype, "referenceNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSupplierPaymentDto.prototype, "chequeNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSupplierPaymentDto.prototype, "chequeDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSupplierPaymentDto.prototype, "bankReference", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSupplierPaymentDto.prototype, "transactionId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateSupplierPaymentDto.prototype, "tdsPercentage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateSupplierPaymentDto.prototype, "tdsAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSupplierPaymentDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [PaymentAllocationDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PaymentAllocationDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateSupplierPaymentDto.prototype, "allocations", void 0);
class AllocatePaymentDto {
    allocations;
    static _OPENAPI_METADATA_FACTORY() {
        return { allocations: { required: true, type: () => [require("./supplier-payment.dto").PaymentAllocationDto] } };
    }
}
exports.AllocatePaymentDto = AllocatePaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [PaymentAllocationDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PaymentAllocationDto),
    __metadata("design:type", Array)
], AllocatePaymentDto.prototype, "allocations", void 0);
class SupplierPaymentFilterDto extends pagination_dto_1.PaginationDto {
    status;
    supplierId;
    fromDate;
    toDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: false, type: () => String }, supplierId: { required: false, type: () => String, format: "uuid" }, fromDate: { required: false, type: () => String }, toDate: { required: false, type: () => String } };
    }
}
exports.SupplierPaymentFilterDto = SupplierPaymentFilterDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SupplierPaymentFilterDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SupplierPaymentFilterDto.prototype, "supplierId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SupplierPaymentFilterDto.prototype, "fromDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SupplierPaymentFilterDto.prototype, "toDate", void 0);
//# sourceMappingURL=supplier-payment.dto.js.map