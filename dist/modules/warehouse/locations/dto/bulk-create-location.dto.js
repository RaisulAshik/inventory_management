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
exports.BulkCreateLocationDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class LocationConfigDto {
    aisleStart;
    aisleEnd;
    rackStart;
    rackEnd;
    shelfStart;
    shelfEnd;
    binStart;
    binEnd;
    locationType;
    static _OPENAPI_METADATA_FACTORY() {
        return { aisleStart: { required: true, type: () => String }, aisleEnd: { required: true, type: () => String }, rackStart: { required: true, type: () => String }, rackEnd: { required: true, type: () => String }, shelfStart: { required: true, type: () => Number }, shelfEnd: { required: true, type: () => Number }, binStart: { required: false, type: () => Number }, binEnd: { required: false, type: () => Number }, locationType: { required: true, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'A' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LocationConfigDto.prototype, "aisleStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'D' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LocationConfigDto.prototype, "aisleEnd", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '01' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LocationConfigDto.prototype, "rackStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '10' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LocationConfigDto.prototype, "rackEnd", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], LocationConfigDto.prototype, "shelfStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], LocationConfigDto.prototype, "shelfEnd", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], LocationConfigDto.prototype, "binStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], LocationConfigDto.prototype, "binEnd", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PICKING' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LocationConfigDto.prototype, "locationType", void 0);
class BulkCreateLocationDto {
    warehouseId;
    zoneId;
    config;
    static _OPENAPI_METADATA_FACTORY() {
        return { warehouseId: { required: true, type: () => String, format: "uuid" }, zoneId: { required: true, type: () => String, format: "uuid" }, config: { required: true, type: () => LocationConfigDto } };
    }
}
exports.BulkCreateLocationDto = BulkCreateLocationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ format: 'uuid' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BulkCreateLocationDto.prototype, "warehouseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ format: 'uuid' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BulkCreateLocationDto.prototype, "zoneId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: LocationConfigDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => LocationConfigDto),
    __metadata("design:type", LocationConfigDto)
], BulkCreateLocationDto.prototype, "config", void 0);
//# sourceMappingURL=bulk-create-location.dto.js.map