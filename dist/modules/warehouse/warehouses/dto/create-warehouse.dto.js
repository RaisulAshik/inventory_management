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
exports.CreateWarehouseDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
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
class CreateWarehouseDto {
    warehouseCode;
    warehouseName;
    warehouseType;
    addressLine1;
    addressLine2;
    city;
    state;
    country;
    postalCode;
    phone;
    email;
    contactPerson;
    totalAreaSqft;
    usableAreaSqft;
    isActive;
    isDefault;
    allowNegativeStock;
    zones;
    static _OPENAPI_METADATA_FACTORY() {
        return { warehouseCode: { required: true, type: () => String, maxLength: 50 }, warehouseName: { required: true, type: () => String, maxLength: 200 }, warehouseType: { required: false, enum: require("../../../../common/enums/index").WarehouseType }, addressLine1: { required: false, type: () => String, maxLength: 255 }, addressLine2: { required: false, type: () => String, maxLength: 255 }, city: { required: false, type: () => String, maxLength: 100 }, state: { required: false, type: () => String, maxLength: 100 }, country: { required: false, type: () => String, maxLength: 100 }, postalCode: { required: false, type: () => String, maxLength: 20 }, phone: { required: false, type: () => String, maxLength: 50 }, email: { required: false, type: () => String, maxLength: 255 }, contactPerson: { required: false, type: () => String, maxLength: 200 }, totalAreaSqft: { required: false, type: () => Number, minimum: 0 }, usableAreaSqft: { required: false, type: () => Number, minimum: 0 }, isActive: { required: false, type: () => Boolean }, isDefault: { required: false, type: () => Boolean }, allowNegativeStock: { required: false, type: () => Boolean }, zones: { required: false, type: () => [CreateZoneDto] } };
    }
}
exports.CreateWarehouseDto = CreateWarehouseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'WH-001' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateWarehouseDto.prototype, "warehouseCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Main Warehouse' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateWarehouseDto.prototype, "warehouseName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: enums_1.WarehouseType, default: enums_1.WarehouseType.MAIN }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.WarehouseType),
    __metadata("design:type", String)
], CreateWarehouseDto.prototype, "warehouseType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '123 Industrial Area' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateWarehouseDto.prototype, "addressLine1", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateWarehouseDto.prototype, "addressLine2", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Mumbai' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateWarehouseDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Maharashtra' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateWarehouseDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Bangladesh' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateWarehouseDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '400001' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreateWarehouseDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+880-22-12345678' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateWarehouseDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'warehouse@example.com' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateWarehouseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'John Doe' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateWarehouseDto.prototype, "contactPerson", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 50000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateWarehouseDto.prototype, "totalAreaSqft", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 45000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateWarehouseDto.prototype, "usableAreaSqft", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateWarehouseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateWarehouseDto.prototype, "isDefault", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateWarehouseDto.prototype, "allowNegativeStock", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [CreateZoneDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateZoneDto),
    __metadata("design:type", Array)
], CreateWarehouseDto.prototype, "zones", void 0);
//# sourceMappingURL=create-warehouse.dto.js.map