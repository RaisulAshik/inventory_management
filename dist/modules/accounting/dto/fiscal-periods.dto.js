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
exports.QueryFiscalPeriodDto = exports.UpdateFiscalPeriodDto = exports.CreateFiscalPeriodDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const mapped_types_1 = require("@nestjs/mapped-types");
const class_transformer_1 = require("class-transformer");
class CreateFiscalPeriodDto {
    fiscalYearId;
    periodNumber;
    periodName;
    startDate;
    endDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { fiscalYearId: { required: true, type: () => String, format: "uuid" }, periodNumber: { required: true, type: () => Number }, periodName: { required: true, type: () => String, maxLength: 50 }, startDate: { required: true, type: () => String }, endDate: { required: true, type: () => String } };
    }
}
exports.CreateFiscalPeriodDto = CreateFiscalPeriodDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateFiscalPeriodDto.prototype, "fiscalYearId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateFiscalPeriodDto.prototype, "periodNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateFiscalPeriodDto.prototype, "periodName", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateFiscalPeriodDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateFiscalPeriodDto.prototype, "endDate", void 0);
class UpdateFiscalPeriodDto extends (0, mapped_types_1.PartialType)(CreateFiscalPeriodDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateFiscalPeriodDto = UpdateFiscalPeriodDto;
class QueryFiscalPeriodDto {
    fiscalYearId;
    status;
    page;
    limit;
    static _OPENAPI_METADATA_FACTORY() {
        return { fiscalYearId: { required: false, type: () => String, format: "uuid" }, status: { required: false, type: () => String }, page: { required: false, type: () => Number }, limit: { required: false, type: () => Number } };
    }
}
exports.QueryFiscalPeriodDto = QueryFiscalPeriodDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], QueryFiscalPeriodDto.prototype, "fiscalYearId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryFiscalPeriodDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], QueryFiscalPeriodDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], QueryFiscalPeriodDto.prototype, "limit", void 0);
//# sourceMappingURL=fiscal-periods.dto.js.map