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
exports.ReconcileTransactionsDto = exports.QueryBankTransactionDto = exports.UpdateBankTransactionDto = exports.CreateBankTransactionDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const mapped_types_1 = require("@nestjs/mapped-types");
const class_transformer_1 = require("class-transformer");
const tenant_1 = require("../../../entities/tenant");
class CreateBankTransactionDto {
    bankAccountId;
    transactionDate;
    valueDate;
    transactionType;
    amount;
    currency;
    description;
    referenceNumber;
    chequeNumber;
    chequeDate;
    payeePayerName;
    bankReference;
    journalEntryId;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { bankAccountId: { required: true, type: () => String, format: "uuid" }, transactionDate: { required: true, type: () => String }, valueDate: { required: false, type: () => String }, transactionType: { required: true, enum: require("../../../entities/tenant/accounting/bank-transaction.entity").BankTransactionType }, amount: { required: true, type: () => Number }, currency: { required: false, type: () => String, maxLength: 3 }, description: { required: true, type: () => String }, referenceNumber: { required: false, type: () => String, maxLength: 100 }, chequeNumber: { required: false, type: () => String, maxLength: 50 }, chequeDate: { required: false, type: () => String }, payeePayerName: { required: false, type: () => String, maxLength: 200 }, bankReference: { required: false, type: () => String, maxLength: 100 }, journalEntryId: { required: false, type: () => String, format: "uuid" }, notes: { required: false, type: () => String } };
    }
}
exports.CreateBankTransactionDto = CreateBankTransactionDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateBankTransactionDto.prototype, "bankAccountId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateBankTransactionDto.prototype, "transactionDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBankTransactionDto.prototype, "valueDate", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(tenant_1.BankTransactionType),
    __metadata("design:type", String)
], CreateBankTransactionDto.prototype, "transactionType", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateBankTransactionDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(3),
    __metadata("design:type", String)
], CreateBankTransactionDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBankTransactionDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateBankTransactionDto.prototype, "referenceNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateBankTransactionDto.prototype, "chequeNumber", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBankTransactionDto.prototype, "chequeDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateBankTransactionDto.prototype, "payeePayerName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateBankTransactionDto.prototype, "bankReference", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBankTransactionDto.prototype, "journalEntryId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBankTransactionDto.prototype, "notes", void 0);
class UpdateBankTransactionDto extends (0, mapped_types_1.PartialType)(CreateBankTransactionDto) {
    status;
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: false, enum: require("../../../entities/tenant/accounting/bank-transaction.entity").BankTransactionStatus } };
    }
}
exports.UpdateBankTransactionDto = UpdateBankTransactionDto;
__decorate([
    (0, class_validator_1.IsEnum)(tenant_1.BankTransactionStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBankTransactionDto.prototype, "status", void 0);
class QueryBankTransactionDto {
    bankAccountId;
    transactionType;
    status;
    startDate;
    endDate;
    minAmount;
    maxAmount;
    search;
    page;
    limit;
    static _OPENAPI_METADATA_FACTORY() {
        return { bankAccountId: { required: false, type: () => String, format: "uuid" }, transactionType: { required: false, enum: require("../../../entities/tenant/accounting/bank-transaction.entity").BankTransactionType }, status: { required: false, enum: require("../../../entities/tenant/accounting/bank-transaction.entity").BankTransactionStatus }, startDate: { required: false, type: () => String }, endDate: { required: false, type: () => String }, minAmount: { required: false, type: () => Number }, maxAmount: { required: false, type: () => Number }, search: { required: false, type: () => String }, page: { required: false, type: () => Number }, limit: { required: false, type: () => Number } };
    }
}
exports.QueryBankTransactionDto = QueryBankTransactionDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], QueryBankTransactionDto.prototype, "bankAccountId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(tenant_1.BankTransactionType),
    __metadata("design:type", String)
], QueryBankTransactionDto.prototype, "transactionType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(tenant_1.BankTransactionStatus),
    __metadata("design:type", String)
], QueryBankTransactionDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], QueryBankTransactionDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], QueryBankTransactionDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], QueryBankTransactionDto.prototype, "minAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], QueryBankTransactionDto.prototype, "maxAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryBankTransactionDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], QueryBankTransactionDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], QueryBankTransactionDto.prototype, "limit", void 0);
class ReconcileTransactionsDto {
    transactionIds;
    reconciliationId;
    static _OPENAPI_METADATA_FACTORY() {
        return { transactionIds: { required: true, type: () => [String], format: "uuid" }, reconciliationId: { required: false, type: () => String, format: "uuid" } };
    }
}
exports.ReconcileTransactionsDto = ReconcileTransactionsDto;
__decorate([
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], ReconcileTransactionsDto.prototype, "transactionIds", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReconcileTransactionsDto.prototype, "reconciliationId", void 0);
//# sourceMappingURL=bank-transactions.dto.js.map