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
exports.QueryBudgetDto = exports.ApproveBudgetDto = exports.UpdateBudgetLineDto = exports.UpdateBudgetDto = exports.CreateBudgetDto = exports.CreateBudgetLineDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const mapped_types_1 = require("@nestjs/mapped-types");
const class_transformer_1 = require("class-transformer");
const tenant_1 = require("../../../entities/tenant");
class CreateBudgetLineDto {
    accountId;
    fiscalPeriodId;
    description;
    budgetAmount;
    januaryAmount;
    februaryAmount;
    marchAmount;
    aprilAmount;
    mayAmount;
    juneAmount;
    julyAmount;
    augustAmount;
    septemberAmount;
    octoberAmount;
    novemberAmount;
    decemberAmount;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { accountId: { required: true, type: () => String, format: "uuid" }, fiscalPeriodId: { required: false, type: () => String, format: "uuid" }, description: { required: false, type: () => String }, budgetAmount: { required: true, type: () => Number }, januaryAmount: { required: false, type: () => Number }, februaryAmount: { required: false, type: () => Number }, marchAmount: { required: false, type: () => Number }, aprilAmount: { required: false, type: () => Number }, mayAmount: { required: false, type: () => Number }, juneAmount: { required: false, type: () => Number }, julyAmount: { required: false, type: () => Number }, augustAmount: { required: false, type: () => Number }, septemberAmount: { required: false, type: () => Number }, octoberAmount: { required: false, type: () => Number }, novemberAmount: { required: false, type: () => Number }, decemberAmount: { required: false, type: () => Number }, notes: { required: false, type: () => String } };
    }
}
exports.CreateBudgetLineDto = CreateBudgetLineDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateBudgetLineDto.prototype, "accountId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBudgetLineDto.prototype, "fiscalPeriodId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBudgetLineDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateBudgetLineDto.prototype, "budgetAmount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateBudgetLineDto.prototype, "januaryAmount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateBudgetLineDto.prototype, "februaryAmount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateBudgetLineDto.prototype, "marchAmount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateBudgetLineDto.prototype, "aprilAmount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateBudgetLineDto.prototype, "mayAmount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateBudgetLineDto.prototype, "juneAmount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateBudgetLineDto.prototype, "julyAmount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateBudgetLineDto.prototype, "augustAmount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateBudgetLineDto.prototype, "septemberAmount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateBudgetLineDto.prototype, "octoberAmount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateBudgetLineDto.prototype, "novemberAmount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateBudgetLineDto.prototype, "decemberAmount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBudgetLineDto.prototype, "notes", void 0);
class CreateBudgetDto {
    budgetCode;
    budgetName;
    description;
    budgetType;
    fiscalYearId;
    costCenterId;
    currency;
    totalBudgetAmount;
    startDate;
    endDate;
    allowOverBudget;
    overBudgetTolerancePercentage;
    notes;
    lines;
    static _OPENAPI_METADATA_FACTORY() {
        return { budgetCode: { required: true, type: () => String, maxLength: 50 }, budgetName: { required: true, type: () => String, maxLength: 200 }, description: { required: false, type: () => String }, budgetType: { required: false, enum: require("../../../entities/tenant/accounting/budget.entity").BudgetType }, fiscalYearId: { required: true, type: () => String, format: "uuid" }, costCenterId: { required: false, type: () => String, format: "uuid" }, currency: { required: false, type: () => String, maxLength: 3 }, totalBudgetAmount: { required: true, type: () => Number }, startDate: { required: true, type: () => String }, endDate: { required: true, type: () => String }, allowOverBudget: { required: false, type: () => Boolean }, overBudgetTolerancePercentage: { required: false, type: () => Number }, notes: { required: false, type: () => String }, lines: { required: false, type: () => [require("./budgets.dto").CreateBudgetLineDto] } };
    }
}
exports.CreateBudgetDto = CreateBudgetDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateBudgetDto.prototype, "budgetCode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateBudgetDto.prototype, "budgetName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBudgetDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(tenant_1.BudgetType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBudgetDto.prototype, "budgetType", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateBudgetDto.prototype, "fiscalYearId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBudgetDto.prototype, "costCenterId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(3),
    __metadata("design:type", String)
], CreateBudgetDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateBudgetDto.prototype, "totalBudgetAmount", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateBudgetDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateBudgetDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateBudgetDto.prototype, "allowOverBudget", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateBudgetDto.prototype, "overBudgetTolerancePercentage", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBudgetDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateBudgetLineDto),
    __metadata("design:type", Array)
], CreateBudgetDto.prototype, "lines", void 0);
class UpdateBudgetDto extends (0, mapped_types_1.PartialType)(CreateBudgetDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateBudgetDto = UpdateBudgetDto;
class UpdateBudgetLineDto extends (0, mapped_types_1.PartialType)(CreateBudgetLineDto) {
    revisedAmount;
    static _OPENAPI_METADATA_FACTORY() {
        return { revisedAmount: { required: false, type: () => Number } };
    }
}
exports.UpdateBudgetLineDto = UpdateBudgetLineDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateBudgetLineDto.prototype, "revisedAmount", void 0);
class ApproveBudgetDto {
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { notes: { required: false, type: () => String } };
    }
}
exports.ApproveBudgetDto = ApproveBudgetDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ApproveBudgetDto.prototype, "notes", void 0);
class QueryBudgetDto {
    budgetType;
    status;
    fiscalYearId;
    costCenterId;
    search;
    page;
    limit;
    static _OPENAPI_METADATA_FACTORY() {
        return { budgetType: { required: false, enum: require("../../../entities/tenant/accounting/budget.entity").BudgetType }, status: { required: false, enum: require("../../../entities/tenant/accounting/budget.entity").BudgetStatus }, fiscalYearId: { required: false, type: () => String, format: "uuid" }, costCenterId: { required: false, type: () => String, format: "uuid" }, search: { required: false, type: () => String }, page: { required: false, type: () => Number }, limit: { required: false, type: () => Number } };
    }
}
exports.QueryBudgetDto = QueryBudgetDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(tenant_1.BudgetType),
    __metadata("design:type", String)
], QueryBudgetDto.prototype, "budgetType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(tenant_1.BudgetStatus),
    __metadata("design:type", String)
], QueryBudgetDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], QueryBudgetDto.prototype, "fiscalYearId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], QueryBudgetDto.prototype, "costCenterId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryBudgetDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], QueryBudgetDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], QueryBudgetDto.prototype, "limit", void 0);
//# sourceMappingURL=budgets.dto.js.map