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
exports.CreateLocationDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const enums_1 = require("../../../../common/enums");
class CreateLocationDto {
    warehouseId;
    zoneId;
    locationCode;
    locationName;
    aisle;
    rack;
    shelf;
    bin;
    locationType;
    barcode;
    maxWeightKg;
    maxVolumeCbm;
    maxUnits;
    static _OPENAPI_METADATA_FACTORY() {
        return { warehouseId: { required: true, type: () => String, format: "uuid" }, zoneId: { required: false, type: () => String, format: "uuid" }, locationCode: { required: true, type: () => String, maxLength: 50 }, locationName: { required: true, type: () => String, maxLength: 200 }, aisle: { required: false, type: () => String, maxLength: 10 }, rack: { required: false, type: () => String, maxLength: 10 }, shelf: { required: false, type: () => String, maxLength: 10 }, bin: { required: false, type: () => String, maxLength: 10 }, locationType: { required: true, enum: require("../../../../common/enums/index").LocationType }, barcode: { required: false, type: () => String, maxLength: 100 }, maxWeightKg: { required: false, type: () => Number, minimum: 0 }, maxVolumeCbm: { required: false, type: () => Number, minimum: 0 }, maxUnits: { required: false, type: () => Number, minimum: 0 } };
    }
}
exports.CreateLocationDto = CreateLocationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ format: 'uuid' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLocationDto.prototype, "warehouseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ format: 'uuid' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateLocationDto.prototype, "zoneId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'A-01-01-01' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateLocationDto.prototype, "locationCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Aisle A, Rack 1, Shelf 1, Bin 1' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateLocationDto.prototype, "locationName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'A' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10),
    __metadata("design:type", String)
], CreateLocationDto.prototype, "aisle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '01' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10),
    __metadata("design:type", String)
], CreateLocationDto.prototype, "rack", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '01' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10),
    __metadata("design:type", String)
], CreateLocationDto.prototype, "shelf", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '01' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10),
    __metadata("design:type", String)
], CreateLocationDto.prototype, "bin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.LocationType, default: enums_1.LocationType.PICKING }),
    (0, class_validator_1.IsEnum)(enums_1.LocationType),
    __metadata("design:type", String)
], CreateLocationDto.prototype, "locationType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'LOC-A-01-01-01' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateLocationDto.prototype, "barcode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 500 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateLocationDto.prototype, "maxWeightKg", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateLocationDto.prototype, "maxVolumeCbm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateLocationDto.prototype, "maxUnits", void 0);
//# sourceMappingURL=create-location.dto.js.map