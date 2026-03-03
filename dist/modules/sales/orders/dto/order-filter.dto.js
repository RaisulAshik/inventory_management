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
exports.OrderFilterDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const enums_1 = require("../../../../common/enums");
const pagination_dto_1 = require("../../../../common/dto/pagination.dto");
class OrderFilterDto extends pagination_dto_1.PaginationDto {
    status;
    customerId;
    warehouseId;
    fromDate;
    toDate;
    paymentStatus;
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: false, enum: require("../../../../common/enums/index").SalesOrderStatus }, customerId: { required: false, type: () => String, format: "uuid" }, warehouseId: { required: false, type: () => String, format: "uuid" }, fromDate: { required: false, type: () => String }, toDate: { required: false, type: () => String }, paymentStatus: { required: false, type: () => Object, enum: ['PAID', 'UNPAID', 'PARTIAL'] } };
    }
}
exports.OrderFilterDto = OrderFilterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: enums_1.SalesOrderStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.SalesOrderStatus),
    __metadata("design:type", String)
], OrderFilterDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ format: 'uuid' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], OrderFilterDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ format: 'uuid' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], OrderFilterDto.prototype, "warehouseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: 'string', format: 'date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], OrderFilterDto.prototype, "fromDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: 'string', format: 'date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], OrderFilterDto.prototype, "toDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['PAID', 'UNPAID', 'PARTIAL'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['PAID', 'UNPAID', 'PARTIAL']),
    __metadata("design:type", String)
], OrderFilterDto.prototype, "paymentStatus", void 0);
//# sourceMappingURL=order-filter.dto.js.map