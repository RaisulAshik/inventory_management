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
exports.UnitResponseDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../../../common/enums");
class UnitResponseDto {
    id;
    uomCode;
    uomName;
    uomType;
    symbol;
    decimalPlaces;
    description;
    isActive;
    createdAt;
    updatedAt;
    constructor(uom) {
        this.id = uom.id;
        this.uomCode = uom.uomCode;
        this.uomName = uom.uomName;
        this.uomType = uom.uomType;
        this.symbol = uom.symbol;
        this.decimalPlaces = uom.decimalPlaces;
        this.description = uom.description;
        this.isActive = uom.isActive;
        this.createdAt = uom.createdAt;
        this.updatedAt = uom.updatedAt;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, uomCode: { required: true, type: () => String }, uomName: { required: true, type: () => String }, uomType: { required: true, enum: require("../../../../common/enums/index").UomType }, symbol: { required: false, type: () => String }, decimalPlaces: { required: true, type: () => Number }, description: { required: false, type: () => String }, isActive: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.UnitResponseDto = UnitResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UnitResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UnitResponseDto.prototype, "uomCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UnitResponseDto.prototype, "uomName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.UomType }),
    __metadata("design:type", String)
], UnitResponseDto.prototype, "uomType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], UnitResponseDto.prototype, "symbol", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UnitResponseDto.prototype, "decimalPlaces", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], UnitResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], UnitResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], UnitResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], UnitResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=unit-response.dto.js.map