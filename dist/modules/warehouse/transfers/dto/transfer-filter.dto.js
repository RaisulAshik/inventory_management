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
exports.TransferFilterDto = void 0;
const openapi = require("@nestjs/swagger");
const tenant_1 = require("../../../../entities/tenant");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class TransferFilterDto {
    status;
    fromWarehouseId;
    toWarehouseId;
    fromDate;
    toDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: false, enum: require("../../../../entities/tenant/warehouse/warehouse-transfer.entity").TransferStatus }, fromWarehouseId: { required: false, type: () => String, format: "uuid" }, toWarehouseId: { required: false, type: () => String, format: "uuid" }, fromDate: { required: false, type: () => String }, toDate: { required: false, type: () => String } };
    }
}
exports.TransferFilterDto = TransferFilterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: tenant_1.TransferStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(tenant_1.TransferStatus),
    __metadata("design:type", String)
], TransferFilterDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ format: 'uuid' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], TransferFilterDto.prototype, "fromWarehouseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ format: 'uuid' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], TransferFilterDto.prototype, "toWarehouseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: 'string', format: 'date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], TransferFilterDto.prototype, "fromDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: 'string', format: 'date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], TransferFilterDto.prototype, "toDate", void 0);
//# sourceMappingURL=transfer-filter.dto.js.map