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
exports.QueryBankAccountDto = exports.UpdateBankAccountDto = exports.CreateBankAccountDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const mapped_types_1 = require("@nestjs/mapped-types");
const class_transformer_1 = require("class-transformer");
const tenant_1 = require("../../../entities/tenant");
class CreateBankAccountDto {
    accountCode;
    accountName;
    accountType;
    bankName;
    branchName;
    accountNumber;
    ifscCode;
    swiftCode;
    micrCode;
    currency;
    glAccountId;
    openingBalance;
    overdraftLimit;
    interestRate;
    contactPerson;
    contactPhone;
    contactEmail;
    address;
    isPrimary;
    isActive;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { accountCode: { required: true, type: () => String, maxLength: 50 }, accountName: { required: true, type: () => String, maxLength: 200 }, accountType: { required: false, enum: require("../../../entities/tenant/accounting/bank-account.entity").BankAccountType }, bankName: { required: true, type: () => String, maxLength: 200 }, branchName: { required: false, type: () => String, maxLength: 200 }, accountNumber: { required: true, type: () => String, maxLength: 50 }, ifscCode: { required: false, type: () => String, maxLength: 20 }, swiftCode: { required: false, type: () => String, maxLength: 20 }, micrCode: { required: false, type: () => String, maxLength: 20 }, currency: { required: false, type: () => String, maxLength: 3 }, glAccountId: { required: false, type: () => String, format: "uuid" }, openingBalance: { required: false, type: () => Number }, overdraftLimit: { required: false, type: () => Number }, interestRate: { required: false, type: () => Number }, contactPerson: { required: false, type: () => String, maxLength: 200 }, contactPhone: { required: false, type: () => String, maxLength: 50 }, contactEmail: { required: false, type: () => String, maxLength: 255, format: "email" }, address: { required: false, type: () => String }, isPrimary: { required: false, type: () => Boolean }, isActive: { required: false, type: () => Boolean }, notes: { required: false, type: () => String } };
    }
}
exports.CreateBankAccountDto = CreateBankAccountDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateBankAccountDto.prototype, "accountCode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateBankAccountDto.prototype, "accountName", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(tenant_1.BankAccountType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBankAccountDto.prototype, "accountType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateBankAccountDto.prototype, "bankName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateBankAccountDto.prototype, "branchName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateBankAccountDto.prototype, "accountNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreateBankAccountDto.prototype, "ifscCode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreateBankAccountDto.prototype, "swiftCode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreateBankAccountDto.prototype, "micrCode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(3),
    __metadata("design:type", String)
], CreateBankAccountDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBankAccountDto.prototype, "glAccountId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateBankAccountDto.prototype, "openingBalance", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateBankAccountDto.prototype, "overdraftLimit", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateBankAccountDto.prototype, "interestRate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateBankAccountDto.prototype, "contactPerson", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateBankAccountDto.prototype, "contactPhone", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateBankAccountDto.prototype, "contactEmail", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBankAccountDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateBankAccountDto.prototype, "isPrimary", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateBankAccountDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBankAccountDto.prototype, "notes", void 0);
class UpdateBankAccountDto extends (0, mapped_types_1.PartialType)(CreateBankAccountDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateBankAccountDto = UpdateBankAccountDto;
class QueryBankAccountDto {
    accountType;
    isActive;
    bankName;
    search;
    page;
    limit;
    static _OPENAPI_METADATA_FACTORY() {
        return { accountType: { required: false, enum: require("../../../entities/tenant/accounting/bank-account.entity").BankAccountType }, isActive: { required: false, type: () => Boolean }, bankName: { required: false, type: () => String }, search: { required: false, type: () => String }, page: { required: false, type: () => Number }, limit: { required: false, type: () => Number } };
    }
}
exports.QueryBankAccountDto = QueryBankAccountDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(tenant_1.BankAccountType),
    __metadata("design:type", String)
], QueryBankAccountDto.prototype, "accountType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], QueryBankAccountDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryBankAccountDto.prototype, "bankName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryBankAccountDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], QueryBankAccountDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], QueryBankAccountDto.prototype, "limit", void 0);
//# sourceMappingURL=bank-accounts.dto.js.map