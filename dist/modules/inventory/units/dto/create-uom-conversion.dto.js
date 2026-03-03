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
exports.CreateUomConversionDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateUomConversionDto {
    fromUomId;
    toUomId;
    conversionFactor;
    static _OPENAPI_METADATA_FACTORY() {
        return { fromUomId: { required: true, type: () => String, format: "uuid" }, toUomId: { required: true, type: () => String, format: "uuid" }, conversionFactor: { required: true, type: () => Number, minimum: 0.000001 } };
    }
}
exports.CreateUomConversionDto = CreateUomConversionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ format: 'uuid', description: 'Source unit ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateUomConversionDto.prototype, "fromUomId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ format: 'uuid', description: 'Target unit ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateUomConversionDto.prototype, "toUomId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 12,
        description: 'Conversion factor (1 fromUom = X toUom)',
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.000001),
    __metadata("design:type", Number)
], CreateUomConversionDto.prototype, "conversionFactor", void 0);
//# sourceMappingURL=create-uom-conversion.dto.js.map