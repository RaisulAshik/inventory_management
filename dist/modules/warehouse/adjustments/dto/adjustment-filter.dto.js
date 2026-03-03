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
exports.AdjustmentFilterDto = void 0;
const openapi = require("@nestjs/swagger");
const tenant_1 = require("../../../../entities/tenant");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AdjustmentFilterDto {
    status;
    adjustmentType;
    warehouseId;
    fromDate;
    toDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: false, enum: require("../../../../entities/tenant/warehouse/stock-adjustment.entity").AdjustmentStatus }, adjustmentType: { required: false, enum: require("../../../../entities/tenant/warehouse/stock-adjustment.entity").AdjustmentType }, warehouseId: { required: false, type: () => String, format: "uuid" }, fromDate: { required: false, type: () => String }, toDate: { required: false, type: () => String } };
    }
}
exports.AdjustmentFilterDto = AdjustmentFilterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: tenant_1.AdjustmentStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(tenant_1.AdjustmentStatus),
    __metadata("design:type", String)
], AdjustmentFilterDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: tenant_1.AdjustmentType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(tenant_1.AdjustmentType),
    __metadata("design:type", String)
], AdjustmentFilterDto.prototype, "adjustmentType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ format: 'uuid' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AdjustmentFilterDto.prototype, "warehouseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: 'string', format: 'date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AdjustmentFilterDto.prototype, "fromDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: 'string', format: 'date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AdjustmentFilterDto.prototype, "toDate", void 0);
//# sourceMappingURL=adjustment-filter.dto.js.map