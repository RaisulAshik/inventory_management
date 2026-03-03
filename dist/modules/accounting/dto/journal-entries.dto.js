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
exports.QueryJournalEntryDto = exports.ReverseJournalEntryDto = exports.PostJournalEntryDto = exports.UpdateJournalEntryDto = exports.CreateJournalEntryDto = exports.CreateJournalEntryLineDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const mapped_types_1 = require("@nestjs/mapped-types");
const class_transformer_1 = require("class-transformer");
const enums_1 = require("../../../common/enums");
const tenant_1 = require("../../../entities/tenant");
class CreateJournalEntryLineDto {
    lineNumber;
    accountId;
    costCenterId;
    description;
    debitAmount;
    creditAmount;
    currency;
    exchangeRate;
    partyType;
    partyId;
    taxCategoryId;
    static _OPENAPI_METADATA_FACTORY() {
        return { lineNumber: { required: true, type: () => Number }, accountId: { required: true, type: () => String, format: "uuid" }, costCenterId: { required: false, type: () => String, format: "uuid" }, description: { required: false, type: () => String, maxLength: 500 }, debitAmount: { required: true, type: () => Number }, creditAmount: { required: true, type: () => Number }, currency: { required: false, type: () => String, maxLength: 3 }, exchangeRate: { required: false, type: () => Number }, partyType: { required: false, enum: require("../../../entities/tenant/accounting/journal-entry-line.entity").PartyType }, partyId: { required: false, type: () => String, format: "uuid" }, taxCategoryId: { required: false, type: () => String, format: "uuid" } };
    }
}
exports.CreateJournalEntryLineDto = CreateJournalEntryLineDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateJournalEntryLineDto.prototype, "lineNumber", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateJournalEntryLineDto.prototype, "accountId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateJournalEntryLineDto.prototype, "costCenterId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateJournalEntryLineDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateJournalEntryLineDto.prototype, "debitAmount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateJournalEntryLineDto.prototype, "creditAmount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(3),
    __metadata("design:type", String)
], CreateJournalEntryLineDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateJournalEntryLineDto.prototype, "exchangeRate", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(tenant_1.PartyType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateJournalEntryLineDto.prototype, "partyType", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateJournalEntryLineDto.prototype, "partyId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateJournalEntryLineDto.prototype, "taxCategoryId", void 0);
class CreateJournalEntryDto {
    entryDate;
    fiscalYearId;
    fiscalPeriodId;
    entryType;
    referenceType;
    referenceId;
    referenceNumber;
    description;
    currency;
    exchangeRate;
    notes;
    lines;
    static _OPENAPI_METADATA_FACTORY() {
        return { entryDate: { required: true, type: () => String }, fiscalYearId: { required: true, type: () => String, format: "uuid" }, fiscalPeriodId: { required: true, type: () => String, format: "uuid" }, entryType: { required: false, enum: require("../../../common/enums/index").JournalEntryType }, referenceType: { required: false, type: () => String, maxLength: 50 }, referenceId: { required: false, type: () => String, format: "uuid" }, referenceNumber: { required: false, type: () => String, maxLength: 50 }, description: { required: true, type: () => String }, currency: { required: false, type: () => String, maxLength: 3 }, exchangeRate: { required: false, type: () => Number }, notes: { required: false, type: () => String }, lines: { required: true, type: () => [require("./journal-entries.dto").CreateJournalEntryLineDto] } };
    }
}
exports.CreateJournalEntryDto = CreateJournalEntryDto;
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateJournalEntryDto.prototype, "entryDate", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateJournalEntryDto.prototype, "fiscalYearId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateJournalEntryDto.prototype, "fiscalPeriodId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(enums_1.JournalEntryType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateJournalEntryDto.prototype, "entryType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateJournalEntryDto.prototype, "referenceType", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateJournalEntryDto.prototype, "referenceId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateJournalEntryDto.prototype, "referenceNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateJournalEntryDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(3),
    __metadata("design:type", String)
], CreateJournalEntryDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateJournalEntryDto.prototype, "exchangeRate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateJournalEntryDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateJournalEntryLineDto),
    __metadata("design:type", Array)
], CreateJournalEntryDto.prototype, "lines", void 0);
class UpdateJournalEntryDto extends (0, mapped_types_1.PartialType)(CreateJournalEntryDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateJournalEntryDto = UpdateJournalEntryDto;
class PostJournalEntryDto {
    id;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String, format: "uuid" } };
    }
}
exports.PostJournalEntryDto = PostJournalEntryDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], PostJournalEntryDto.prototype, "id", void 0);
class ReverseJournalEntryDto {
    reversalDate;
    description;
    static _OPENAPI_METADATA_FACTORY() {
        return { reversalDate: { required: true, type: () => String }, description: { required: false, type: () => String } };
    }
}
exports.ReverseJournalEntryDto = ReverseJournalEntryDto;
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ReverseJournalEntryDto.prototype, "reversalDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReverseJournalEntryDto.prototype, "description", void 0);
class QueryJournalEntryDto {
    entryType;
    status;
    fiscalYearId;
    fiscalPeriodId;
    startDate;
    endDate;
    accountId;
    isAutoGenerated;
    search;
    page;
    limit;
    static _OPENAPI_METADATA_FACTORY() {
        return { entryType: { required: false, enum: require("../../../common/enums/index").JournalEntryType }, status: { required: false, enum: require("../../../common/enums/index").JournalEntryStatus }, fiscalYearId: { required: false, type: () => String, format: "uuid" }, fiscalPeriodId: { required: false, type: () => String, format: "uuid" }, startDate: { required: false, type: () => String }, endDate: { required: false, type: () => String }, accountId: { required: false, type: () => String, format: "uuid" }, isAutoGenerated: { required: false, type: () => Boolean }, search: { required: false, type: () => String }, page: { required: false, type: () => Number }, limit: { required: false, type: () => Number } };
    }
}
exports.QueryJournalEntryDto = QueryJournalEntryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.JournalEntryType),
    __metadata("design:type", String)
], QueryJournalEntryDto.prototype, "entryType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.JournalEntryStatus),
    __metadata("design:type", String)
], QueryJournalEntryDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], QueryJournalEntryDto.prototype, "fiscalYearId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], QueryJournalEntryDto.prototype, "fiscalPeriodId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], QueryJournalEntryDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], QueryJournalEntryDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], QueryJournalEntryDto.prototype, "accountId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], QueryJournalEntryDto.prototype, "isAutoGenerated", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryJournalEntryDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], QueryJournalEntryDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], QueryJournalEntryDto.prototype, "limit", void 0);
//# sourceMappingURL=journal-entries.dto.js.map