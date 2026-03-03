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
exports.CreateUnitDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const enums_1 = require("../../../../common/enums");
class CreateUnitDto {
    uomCode;
    uomName;
    uomType;
    symbol;
    decimalPlaces;
    description;
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { uomCode: { required: true, type: () => String, maxLength: 20 }, uomName: { required: true, type: () => String, maxLength: 100 }, uomType: { required: false, enum: require("../../../../common/enums/index").UomType }, symbol: { required: false, type: () => String, maxLength: 20 }, decimalPlaces: { required: false, type: () => Number, minimum: 0, maximum: 8 }, description: { required: false, type: () => String }, isActive: { required: false, type: () => Boolean } };
    }
}
exports.CreateUnitDto = CreateUnitDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PCS' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreateUnitDto.prototype, "uomCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Pieces' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateUnitDto.prototype, "uomName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: enums_1.UomType, default: enums_1.UomType.UNIT }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.UomType),
    __metadata("design:type", String)
], CreateUnitDto.prototype, "uomType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'PCS' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreateUnitDto.prototype, "symbol", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(8),
    __metadata("design:type", Number)
], CreateUnitDto.prototype, "decimalPlaces", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUnitDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateUnitDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-unit.dto.js.map