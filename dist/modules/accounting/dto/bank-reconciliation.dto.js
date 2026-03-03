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
exports.QueryBankReconciliationDto = exports.CompleteReconciliationDto = exports.UpdateBankReconciliationDto = exports.CreateBankReconciliationDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const mapped_types_1 = require("@nestjs/mapped-types");
const class_transformer_1 = require("class-transformer");
const tenant_1 = require("../../../entities/tenant");
class CreateBankReconciliationDto {
    bankAccountId;
    statementDate;
    statementStartDate;
    statementEndDate;
    openingBalanceBook;
    closingBalanceBook;
    openingBalanceBank;
    closingBalanceBank;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { bankAccountId: { required: true, type: () => String, format: "uuid" }, statementDate: { required: true, type: () => String }, statementStartDate: { required: true, type: () => String }, statementEndDate: { required: true, type: () => String }, openingBalanceBook: { required: true, type: () => Number }, closingBalanceBook: { required: true, type: () => Number }, openingBalanceBank: { required: true, type: () => Number }, closingBalanceBank: { required: true, type: () => Number }, notes: { required: false, type: () => String } };
    }
}
exports.CreateBankReconciliationDto = CreateBankReconciliationDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateBankReconciliationDto.prototype, "bankAccountId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateBankReconciliationDto.prototype, "statementDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateBankReconciliationDto.prototype, "statementStartDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateBankReconciliationDto.prototype, "statementEndDate", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateBankReconciliationDto.prototype, "openingBalanceBook", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateBankReconciliationDto.prototype, "closingBalanceBook", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateBankReconciliationDto.prototype, "openingBalanceBank", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateBankReconciliationDto.prototype, "closingBalanceBank", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBankReconciliationDto.prototype, "notes", void 0);
class UpdateBankReconciliationDto extends (0, mapped_types_1.PartialType)(CreateBankReconciliationDto) {
    totalDepositsBook;
    totalWithdrawalsBook;
    totalDepositsBank;
    totalWithdrawalsBank;
    depositsInTransit;
    outstandingCheques;
    bankErrors;
    bookErrors;
    static _OPENAPI_METADATA_FACTORY() {
        return { totalDepositsBook: { required: false, type: () => Number }, totalWithdrawalsBook: { required: false, type: () => Number }, totalDepositsBank: { required: false, type: () => Number }, totalWithdrawalsBank: { required: false, type: () => Number }, depositsInTransit: { required: false, type: () => Number }, outstandingCheques: { required: false, type: () => Number }, bankErrors: { required: false, type: () => Number }, bookErrors: { required: false, type: () => Number } };
    }
}
exports.UpdateBankReconciliationDto = UpdateBankReconciliationDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateBankReconciliationDto.prototype, "totalDepositsBook", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateBankReconciliationDto.prototype, "totalWithdrawalsBook", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateBankReconciliationDto.prototype, "totalDepositsBank", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateBankReconciliationDto.prototype, "totalWithdrawalsBank", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateBankReconciliationDto.prototype, "depositsInTransit", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateBankReconciliationDto.prototype, "outstandingCheques", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateBankReconciliationDto.prototype, "bankErrors", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateBankReconciliationDto.prototype, "bookErrors", void 0);
class CompleteReconciliationDto {
    reconciledTransactionIds;
    adjustedBalanceBook;
    adjustedBalanceBank;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { reconciledTransactionIds: { required: true, type: () => [String], format: "uuid" }, adjustedBalanceBook: { required: true, type: () => Number }, adjustedBalanceBank: { required: true, type: () => Number }, notes: { required: false, type: () => String } };
    }
}
exports.CompleteReconciliationDto = CompleteReconciliationDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], CompleteReconciliationDto.prototype, "reconciledTransactionIds", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CompleteReconciliationDto.prototype, "adjustedBalanceBook", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CompleteReconciliationDto.prototype, "adjustedBalanceBank", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CompleteReconciliationDto.prototype, "notes", void 0);
class QueryBankReconciliationDto {
    bankAccountId;
    status;
    startDate;
    endDate;
    page;
    limit;
    static _OPENAPI_METADATA_FACTORY() {
        return { bankAccountId: { required: false, type: () => String, format: "uuid" }, status: { required: false, enum: require("../../../entities/tenant/accounting/bank-reconciliation.entity").ReconciliationStatus }, startDate: { required: false, type: () => String }, endDate: { required: false, type: () => String }, page: { required: false, type: () => Number }, limit: { required: false, type: () => Number } };
    }
}
exports.QueryBankReconciliationDto = QueryBankReconciliationDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], QueryBankReconciliationDto.prototype, "bankAccountId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(tenant_1.ReconciliationStatus),
    __metadata("design:type", String)
], QueryBankReconciliationDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], QueryBankReconciliationDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], QueryBankReconciliationDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], QueryBankReconciliationDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], QueryBankReconciliationDto.prototype, "limit", void 0);
//# sourceMappingURL=bank-reconciliation.dto.js.map