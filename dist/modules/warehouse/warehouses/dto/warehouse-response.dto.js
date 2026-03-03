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
exports.WarehouseResponseDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../../../common/enums");
class ZoneResponseDto {
    id;
    zoneCode;
    zoneName;
    zoneType;
    description;
    temperatureMin;
    temperatureMax;
    locationCount;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, zoneCode: { required: true, type: () => String }, zoneName: { required: true, type: () => String }, zoneType: { required: true, type: () => String }, description: { required: false, type: () => String }, temperatureMin: { required: false, type: () => Number }, temperatureMax: { required: false, type: () => Number }, locationCount: { required: false, type: () => Number } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ZoneResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ZoneResponseDto.prototype, "zoneCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ZoneResponseDto.prototype, "zoneName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ZoneResponseDto.prototype, "zoneType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ZoneResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], ZoneResponseDto.prototype, "temperatureMin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], ZoneResponseDto.prototype, "temperatureMax", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], ZoneResponseDto.prototype, "locationCount", void 0);
class WarehouseResponseDto {
    id;
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
    createdAt;
    updatedAt;
    constructor(warehouse) {
        this.id = warehouse.id;
        this.warehouseCode = warehouse.warehouseCode;
        this.warehouseName = warehouse.warehouseName;
        this.warehouseType = warehouse.warehouseType;
        this.addressLine1 = warehouse.addressLine1;
        this.addressLine2 = warehouse.addressLine2;
        this.city = warehouse.city;
        this.state = warehouse.state;
        this.country = warehouse.country;
        this.postalCode = warehouse.postalCode;
        this.phone = warehouse.phone;
        this.email = warehouse.email;
        this.contactPerson = warehouse.contactPerson;
        this.totalAreaSqft = warehouse.totalAreaSqft
            ? Number(warehouse.totalAreaSqft)
            : undefined;
        this.usableAreaSqft = warehouse.usableAreaSqft
            ? Number(warehouse.usableAreaSqft)
            : undefined;
        this.isActive = warehouse.isActive;
        this.isDefault = warehouse.isDefault;
        this.allowNegativeStock = warehouse.allowNegativeStock;
        this.createdAt = warehouse.createdAt;
        this.updatedAt = warehouse.updatedAt;
        if (warehouse.zones) {
            this.zones = warehouse.zones.map((z) => ({
                id: z.id,
                zoneCode: z.zoneCode,
                zoneName: z.zoneName,
                zoneType: z.zoneType,
                description: z.description,
                temperatureMin: z.temperatureMin ? Number(z.temperatureMin) : undefined,
                temperatureMax: z.temperatureMax ? Number(z.temperatureMax) : undefined,
                locationCount: z.locations?.length || 0,
            }));
        }
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, warehouseCode: { required: true, type: () => String }, warehouseName: { required: true, type: () => String }, warehouseType: { required: true, enum: require("../../../../common/enums/index").WarehouseType }, addressLine1: { required: false, type: () => String }, addressLine2: { required: false, type: () => String }, city: { required: false, type: () => String }, state: { required: false, type: () => String }, country: { required: false, type: () => String }, postalCode: { required: false, type: () => String }, phone: { required: false, type: () => String }, email: { required: false, type: () => String }, contactPerson: { required: false, type: () => String }, totalAreaSqft: { required: false, type: () => Number }, usableAreaSqft: { required: false, type: () => Number }, isActive: { required: true, type: () => Boolean }, isDefault: { required: true, type: () => Boolean }, allowNegativeStock: { required: true, type: () => Boolean }, zones: { required: false, type: () => [ZoneResponseDto] }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.WarehouseResponseDto = WarehouseResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], WarehouseResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], WarehouseResponseDto.prototype, "warehouseCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], WarehouseResponseDto.prototype, "warehouseName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.WarehouseType }),
    __metadata("design:type", String)
], WarehouseResponseDto.prototype, "warehouseType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], WarehouseResponseDto.prototype, "addressLine1", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], WarehouseResponseDto.prototype, "addressLine2", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], WarehouseResponseDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], WarehouseResponseDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], WarehouseResponseDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], WarehouseResponseDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], WarehouseResponseDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], WarehouseResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], WarehouseResponseDto.prototype, "contactPerson", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], WarehouseResponseDto.prototype, "totalAreaSqft", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], WarehouseResponseDto.prototype, "usableAreaSqft", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], WarehouseResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], WarehouseResponseDto.prototype, "isDefault", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], WarehouseResponseDto.prototype, "allowNegativeStock", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [ZoneResponseDto] }),
    __metadata("design:type", Array)
], WarehouseResponseDto.prototype, "zones", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], WarehouseResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], WarehouseResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=warehouse-response.dto.js.map