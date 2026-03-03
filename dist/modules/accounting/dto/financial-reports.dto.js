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
exports.FinancialReportQueryDto = exports.ReportType = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var ReportType;
(function (ReportType) {
    ReportType["BALANCE_SHEET"] = "BALANCE_SHEET";
    ReportType["INCOME_STATEMENT"] = "INCOME_STATEMENT";
    ReportType["TRIAL_BALANCE"] = "TRIAL_BALANCE";
    ReportType["CASH_FLOW"] = "CASH_FLOW";
    ReportType["GENERAL_LEDGER_REPORT"] = "GENERAL_LEDGER_REPORT";
    ReportType["BUDGET_VS_ACTUAL"] = "BUDGET_VS_ACTUAL";
    ReportType["AGED_RECEIVABLES"] = "AGED_RECEIVABLES";
    ReportType["AGED_PAYABLES"] = "AGED_PAYABLES";
    ReportType["BANK_SUMMARY"] = "BANK_SUMMARY";
})(ReportType || (exports.ReportType = ReportType = {}));
class FinancialReportQueryDto {
    reportType;
    fiscalYearId;
    fiscalPeriodId;
    asOfDate;
    startDate;
    endDate;
    costCenterId;
    accountId;
    budgetId;
    includeZeroBalances;
    showSubAccounts;
    comparePeriod;
    static _OPENAPI_METADATA_FACTORY() {
        return { reportType: { required: true, enum: require("./financial-reports.dto").ReportType }, fiscalYearId: { required: false, type: () => String, format: "uuid" }, fiscalPeriodId: { required: false, type: () => String, format: "uuid" }, asOfDate: { required: false, type: () => String }, startDate: { required: false, type: () => String }, endDate: { required: false, type: () => String }, costCenterId: { required: false, type: () => String, format: "uuid" }, accountId: { required: false, type: () => String, format: "uuid" }, budgetId: { required: false, type: () => String, format: "uuid" }, includeZeroBalances: { required: false, type: () => Boolean }, showSubAccounts: { required: false, type: () => Boolean }, comparePeriod: { required: false, type: () => String } };
    }
}
exports.FinancialReportQueryDto = FinancialReportQueryDto;
__decorate([
    (0, class_validator_1.IsEnum)(ReportType),
    __metadata("design:type", String)
], FinancialReportQueryDto.prototype, "reportType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], FinancialReportQueryDto.prototype, "fiscalYearId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], FinancialReportQueryDto.prototype, "fiscalPeriodId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], FinancialReportQueryDto.prototype, "asOfDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], FinancialReportQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], FinancialReportQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], FinancialReportQueryDto.prototype, "costCenterId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], FinancialReportQueryDto.prototype, "accountId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], FinancialReportQueryDto.prototype, "budgetId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], FinancialReportQueryDto.prototype, "includeZeroBalances", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], FinancialReportQueryDto.prototype, "showSubAccounts", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FinancialReportQueryDto.prototype, "comparePeriod", void 0);
//# sourceMappingURL=financial-reports.dto.js.map