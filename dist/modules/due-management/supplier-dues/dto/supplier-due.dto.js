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
exports.SupplierDueFilterDto = exports.AdjustSupplierDueDto = exports.CreateSupplierOpeningBalanceDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const pagination_dto_1 = require("../../../../common/dto/pagination.dto");
const enums_1 = require("../../../../common/enums");
const class_transformer_1 = require("class-transformer");
class CreateSupplierOpeningBalanceDto {
    supplierId;
    originalAmount;
    dueDate;
    referenceNumber;
    billNumber;
    billDate;
    currency;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { supplierId: { required: true, type: () => String, format: "uuid" }, originalAmount: { required: true, type: () => Number, minimum: 0.01 }, dueDate: { required: true, type: () => String }, referenceNumber: { required: false, type: () => String }, billNumber: { required: false, type: () => String }, billDate: { required: false, type: () => String }, currency: { required: false, type: () => String }, notes: { required: false, type: () => String } };
    }
}
exports.CreateSupplierOpeningBalanceDto = CreateSupplierOpeningBalanceDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateSupplierOpeningBalanceDto.prototype, "supplierId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], CreateSupplierOpeningBalanceDto.prototype, "originalAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateSupplierOpeningBalanceDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSupplierOpeningBalanceDto.prototype, "referenceNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSupplierOpeningBalanceDto.prototype, "billNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSupplierOpeningBalanceDto.prototype, "billDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSupplierOpeningBalanceDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSupplierOpeningBalanceDto.prototype, "notes", void 0);
class AdjustSupplierDueDto {
    amount;
    reason;
    static _OPENAPI_METADATA_FACTORY() {
        return { amount: { required: true, type: () => Number, minimum: 0.01 }, reason: { required: false, type: () => String } };
    }
}
exports.AdjustSupplierDueDto = AdjustSupplierDueDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], AdjustSupplierDueDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AdjustSupplierDueDto.prototype, "reason", void 0);
class SupplierDueFilterDto extends pagination_dto_1.PaginationDto {
    status;
    supplierId;
    overdueOnly;
    fromDate;
    toDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: false, enum: require("../../../../common/enums/index").DueStatus }, supplierId: { required: false, type: () => String, format: "uuid" }, overdueOnly: { required: false, type: () => Boolean }, fromDate: { required: false, type: () => String }, toDate: { required: false, type: () => String } };
    }
}
exports.SupplierDueFilterDto = SupplierDueFilterDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.DueStatus),
    __metadata("design:type", String)
], SupplierDueFilterDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SupplierDueFilterDto.prototype, "supplierId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true'),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SupplierDueFilterDto.prototype, "overdueOnly", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SupplierDueFilterDto.prototype, "fromDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SupplierDueFilterDto.prototype, "toDate", void 0);
//# sourceMappingURL=supplier-due.dto.js.map