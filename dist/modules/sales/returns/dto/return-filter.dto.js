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
exports.ReturnFilterDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const sales_return_entity_1 = require("../../../../entities/tenant/eCommerce/sales-return.entity");
class ReturnFilterDto {
    status;
    refundType;
    customerId;
    fromDate;
    toDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: false, enum: require("../../../../entities/tenant/eCommerce/sales-return.entity").SalesReturnStatus }, refundType: { required: false, enum: require("../../../../entities/tenant/eCommerce/sales-return.entity").RefundType }, customerId: { required: false, type: () => String, format: "uuid" }, fromDate: { required: false, type: () => String }, toDate: { required: false, type: () => String } };
    }
}
exports.ReturnFilterDto = ReturnFilterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: sales_return_entity_1.SalesReturnStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(sales_return_entity_1.SalesReturnStatus),
    __metadata("design:type", String)
], ReturnFilterDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: sales_return_entity_1.RefundType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(sales_return_entity_1.RefundType),
    __metadata("design:type", String)
], ReturnFilterDto.prototype, "refundType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ format: 'uuid' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ReturnFilterDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: 'string', format: 'date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ReturnFilterDto.prototype, "fromDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: 'string', format: 'date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ReturnFilterDto.prototype, "toDate", void 0);
//# sourceMappingURL=return-filter.dto.js.map