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
exports.QueryChartOfAccountDto = exports.UpdateChartOfAccountDto = exports.CreateChartOfAccountDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const mapped_types_1 = require("@nestjs/mapped-types");
const class_transformer_1 = require("class-transformer");
const enums_1 = require("../../../common/enums");
class CreateChartOfAccountDto {
    accountCode;
    accountName;
    accountType;
    accountSubtype;
    parentId;
    normalBalance;
    isHeader;
    isSystem;
    isActive;
    isBankAccount;
    isCashAccount;
    isReceivable;
    isPayable;
    currency;
    openingBalanceDebit;
    openingBalanceCredit;
    description;
    static _OPENAPI_METADATA_FACTORY() {
        return { accountCode: { required: true, type: () => String, maxLength: 50 }, accountName: { required: true, type: () => String, maxLength: 200 }, accountType: { required: true, enum: require("../../../common/enums/index").AccountType }, accountSubtype: { required: false, type: () => String, maxLength: 50 }, parentId: { required: false, type: () => String, format: "uuid" }, normalBalance: { required: true, enum: require("../../../common/enums/index").NormalBalance }, isHeader: { required: false, type: () => Boolean }, isSystem: { required: false, type: () => Boolean }, isActive: { required: false, type: () => Boolean }, isBankAccount: { required: false, type: () => Boolean }, isCashAccount: { required: false, type: () => Boolean }, isReceivable: { required: false, type: () => Boolean }, isPayable: { required: false, type: () => Boolean }, currency: { required: false, type: () => String, maxLength: 3 }, openingBalanceDebit: { required: false, type: () => Number }, openingBalanceCredit: { required: false, type: () => Number }, description: { required: false, type: () => String } };
    }
}
exports.CreateChartOfAccountDto = CreateChartOfAccountDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateChartOfAccountDto.prototype, "accountCode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateChartOfAccountDto.prototype, "accountName", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(enums_1.AccountType),
    __metadata("design:type", String)
], CreateChartOfAccountDto.prototype, "accountType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateChartOfAccountDto.prototype, "accountSubtype", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateChartOfAccountDto.prototype, "parentId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(enums_1.NormalBalance),
    __metadata("design:type", String)
], CreateChartOfAccountDto.prototype, "normalBalance", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateChartOfAccountDto.prototype, "isHeader", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateChartOfAccountDto.prototype, "isSystem", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateChartOfAccountDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateChartOfAccountDto.prototype, "isBankAccount", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateChartOfAccountDto.prototype, "isCashAccount", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateChartOfAccountDto.prototype, "isReceivable", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateChartOfAccountDto.prototype, "isPayable", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(3),
    __metadata("design:type", String)
], CreateChartOfAccountDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateChartOfAccountDto.prototype, "openingBalanceDebit", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateChartOfAccountDto.prototype, "openingBalanceCredit", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateChartOfAccountDto.prototype, "description", void 0);
class UpdateChartOfAccountDto extends (0, mapped_types_1.PartialType)(CreateChartOfAccountDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateChartOfAccountDto = UpdateChartOfAccountDto;
class QueryChartOfAccountDto {
    accountType;
    parentId;
    isActive;
    isHeader;
    isBankAccount;
    search;
    page;
    limit;
    static _OPENAPI_METADATA_FACTORY() {
        return { accountType: { required: false, enum: require("../../../common/enums/index").AccountType }, parentId: { required: false, type: () => String, format: "uuid" }, isActive: { required: false, type: () => Boolean }, isHeader: { required: false, type: () => Boolean }, isBankAccount: { required: false, type: () => Boolean }, search: { required: false, type: () => String }, page: { required: false, type: () => Number }, limit: { required: false, type: () => Number } };
    }
}
exports.QueryChartOfAccountDto = QueryChartOfAccountDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.AccountType),
    __metadata("design:type", String)
], QueryChartOfAccountDto.prototype, "accountType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], QueryChartOfAccountDto.prototype, "parentId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], QueryChartOfAccountDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], QueryChartOfAccountDto.prototype, "isHeader", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], QueryChartOfAccountDto.prototype, "isBankAccount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryChartOfAccountDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], QueryChartOfAccountDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], QueryChartOfAccountDto.prototype, "limit", void 0);
//# sourceMappingURL=chat-of-accounts.dto.js.map