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
exports.LocationResponseDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../../../common/enums");
class LocationResponseDto {
    id;
    warehouseId;
    warehouseName;
    zoneId;
    zoneName;
    locationCode;
    locationName;
    aisle;
    rack;
    shelf;
    bin;
    fullPath;
    locationType;
    barcode;
    status;
    maxWeightKg;
    maxVolumeCbm;
    maxUnits;
    currentWeightKg;
    currentVolumeCbm;
    currentUnits;
    createdAt;
    updatedAt;
    constructor(location) {
        this.id = location.id;
        this.warehouseId = location.warehouseId;
        this.warehouseName = location.warehouse?.warehouseName;
        this.zoneId = location.zoneId;
        this.zoneName = location.zone?.zoneName;
        this.locationCode = location.locationCode;
        this.locationName = location.locationName;
        this.aisle = location.aisle;
        this.rack = location.rack;
        this.shelf = location.shelf;
        this.bin = location.bin;
        this.fullPath = location.fullPath;
        this.locationType = location.locationType;
        this.barcode = location.barcode;
        this.status = location.status;
        this.maxWeightKg = location.maxWeightKg
            ? Number(location.maxWeightKg)
            : undefined;
        this.maxVolumeCbm = location.maxVolumeCbm
            ? Number(location.maxVolumeCbm)
            : undefined;
        this.maxUnits = location.maxUnits;
        this.currentWeightKg = Number(location.currentWeightKg) || 0;
        this.currentVolumeCbm = Number(location.currentVolumeCbm) || 0;
        this.currentUnits = Number(location.currentUnits) || 0;
        this.createdAt = location.createdAt;
        this.updatedAt = location.updatedAt;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, warehouseId: { required: true, type: () => String }, warehouseName: { required: false, type: () => String }, zoneId: { required: false, type: () => String }, zoneName: { required: false, type: () => String }, locationCode: { required: true, type: () => String }, locationName: { required: true, type: () => String }, aisle: { required: false, type: () => String }, rack: { required: false, type: () => String }, shelf: { required: false, type: () => String }, bin: { required: false, type: () => String }, fullPath: { required: true, type: () => String }, locationType: { required: true, enum: require("../../../../common/enums/index").LocationType }, barcode: { required: false, type: () => String }, status: { required: true, enum: require("../../../../common/enums/index").LocationStatus }, maxWeightKg: { required: false, type: () => Number }, maxVolumeCbm: { required: false, type: () => Number }, maxUnits: { required: false, type: () => Number }, currentWeightKg: { required: true, type: () => Number }, currentVolumeCbm: { required: true, type: () => Number }, currentUnits: { required: true, type: () => Number }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.LocationResponseDto = LocationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LocationResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LocationResponseDto.prototype, "warehouseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], LocationResponseDto.prototype, "warehouseName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], LocationResponseDto.prototype, "zoneId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], LocationResponseDto.prototype, "zoneName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LocationResponseDto.prototype, "locationCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LocationResponseDto.prototype, "locationName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], LocationResponseDto.prototype, "aisle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], LocationResponseDto.prototype, "rack", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], LocationResponseDto.prototype, "shelf", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], LocationResponseDto.prototype, "bin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LocationResponseDto.prototype, "fullPath", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.LocationType }),
    __metadata("design:type", String)
], LocationResponseDto.prototype, "locationType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], LocationResponseDto.prototype, "barcode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.LocationStatus }),
    __metadata("design:type", String)
], LocationResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], LocationResponseDto.prototype, "maxWeightKg", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], LocationResponseDto.prototype, "maxVolumeCbm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], LocationResponseDto.prototype, "maxUnits", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], LocationResponseDto.prototype, "currentWeightKg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], LocationResponseDto.prototype, "currentVolumeCbm", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], LocationResponseDto.prototype, "currentUnits", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], LocationResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], LocationResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=location-response.dto.js.map