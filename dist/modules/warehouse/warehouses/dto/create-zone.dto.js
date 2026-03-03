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
exports.CreateZoneDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const enums_1 = require("../../../../common/enums");
class CreateZoneDto {
    zoneCode;
    zoneName;
    zoneType;
    description;
    temperatureMin;
    temperatureMax;
    static _OPENAPI_METADATA_FACTORY() {
        return { zoneCode: { required: true, type: () => String, maxLength: 50 }, zoneName: { required: true, type: () => String, maxLength: 200 }, zoneType: { required: false, enum: require("../../../../common/enums/index").ZoneType }, description: { required: false, type: () => String }, temperatureMin: { required: false, type: () => Number }, temperatureMax: { required: false, type: () => Number } };
    }
}
exports.CreateZoneDto = CreateZoneDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ZONE-A' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateZoneDto.prototype, "zoneCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Zone A - General Storage' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateZoneDto.prototype, "zoneName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: enums_1.ZoneType, default: enums_1.ZoneType.GENERAL }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.ZoneType),
    __metadata("design:type", String)
], CreateZoneDto.prototype, "zoneType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateZoneDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateZoneDto.prototype, "temperatureMin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateZoneDto.prototype, "temperatureMax", void 0);
//# sourceMappingURL=create-zone.dto.js.map