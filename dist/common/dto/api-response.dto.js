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
exports.ApiResponseDto = exports.PaginatedResponseDto = exports.MetaDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
class MetaDto {
    total;
    page;
    limit;
    totalPages;
    hasNextPage;
    hasPrevPage;
    static _OPENAPI_METADATA_FACTORY() {
        return { total: { required: false, type: () => Number }, page: { required: false, type: () => Number }, limit: { required: false, type: () => Number }, totalPages: { required: false, type: () => Number }, hasNextPage: { required: false, type: () => Boolean }, hasPrevPage: { required: false, type: () => Boolean } };
    }
}
exports.MetaDto = MetaDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MetaDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MetaDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MetaDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MetaDto.prototype, "totalPages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], MetaDto.prototype, "hasNextPage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], MetaDto.prototype, "hasPrevPage", void 0);
class PaginatedResponseDto {
    data;
    meta;
    static _OPENAPI_METADATA_FACTORY() {
        return { data: { required: false }, meta: { required: false, type: () => require("./api-response.dto").MetaDto } };
    }
}
exports.PaginatedResponseDto = PaginatedResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true }),
    __metadata("design:type", Array)
], PaginatedResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: MetaDto }),
    __metadata("design:type", MetaDto)
], PaginatedResponseDto.prototype, "meta", void 0);
class ApiResponseDto {
    success;
    message;
    data;
    errors;
    timestamp;
    static _OPENAPI_METADATA_FACTORY() {
        return { success: { required: false, type: () => Boolean }, message: { required: false, type: () => String }, data: { required: false }, errors: { required: false, type: () => [Object] }, timestamp: { required: false, type: () => String } };
    }
}
exports.ApiResponseDto = ApiResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ApiResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ApiResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ApiResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Array)
], ApiResponseDto.prototype, "errors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ApiResponseDto.prototype, "timestamp", void 0);
//# sourceMappingURL=api-response.dto.js.map