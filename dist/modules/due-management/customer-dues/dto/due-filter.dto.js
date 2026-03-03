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
exports.DueFilterDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const pagination_dto_1 = require("../../../../common/dto/pagination.dto");
const enums_1 = require("../../../../common/enums");
const class_transformer_1 = require("class-transformer");
class DueFilterDto extends pagination_dto_1.PaginationDto {
    status;
    customerId;
    overdueOnly;
    fromDate;
    toDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: false, enum: require("../../../../common/enums/index").DueStatus }, customerId: { required: false, type: () => String, format: "uuid" }, overdueOnly: { required: false, type: () => Boolean }, fromDate: { required: false, type: () => String }, toDate: { required: false, type: () => String } };
    }
}
exports.DueFilterDto = DueFilterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: enums_1.DueStatus }),
    (0, class_validator_1.IsEnum)(enums_1.DueStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DueFilterDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DueFilterDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], DueFilterDto.prototype, "overdueOnly", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DueFilterDto.prototype, "fromDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DueFilterDto.prototype, "toDate", void 0);
//# sourceMappingURL=due-filter.dto.js.map