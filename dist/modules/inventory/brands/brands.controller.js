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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const brands_service_1 = require("./brands.service");
const create_brand_dto_1 = require("./dto/create-brand.dto");
const update_brand_dto_1 = require("./dto/update-brand.dto");
const brand_response_dto_1 = require("./dto/brand-response.dto");
const pagination_dto_1 = require("../../../common/dto/pagination.dto");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const api_paginated_response_decorator_1 = require("../../../common/decorators/api-paginated-response.decorator");
let BrandsController = class BrandsController {
    brandsService;
    constructor(brandsService) {
        this.brandsService = brandsService;
    }
    async create(createBrandDto) {
        const brand = await this.brandsService.create(createBrandDto);
        return new brand_response_dto_1.BrandResponseDto(brand);
    }
    async findAll(paginationDto) {
        const result = await this.brandsService.findAll(paginationDto);
        return {
            data: result.data.map((brand) => new brand_response_dto_1.BrandResponseDto(brand)),
            meta: result.meta,
        };
    }
    async findAllActive() {
        const brands = await this.brandsService.findAllActive();
        return { data: brands.map((brand) => new brand_response_dto_1.BrandResponseDto(brand)) };
    }
    async findOne(id) {
        const brand = await this.brandsService.findById(id);
        return new brand_response_dto_1.BrandResponseDto(brand);
    }
    async update(id, updateBrandDto) {
        const brand = await this.brandsService.update(id, updateBrandDto);
        return new brand_response_dto_1.BrandResponseDto(brand);
    }
    async remove(id) {
        await this.brandsService.remove(id);
    }
};
exports.BrandsController = BrandsController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('brands.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new brand' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Brand created successfully',
        type: brand_response_dto_1.BrandResponseDto,
    }),
    openapi.ApiResponse({ status: 201, type: require("./dto/brand-response.dto").BrandResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_brand_dto_1.CreateBrandDto]),
    __metadata("design:returntype", Promise)
], BrandsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('brands.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all brands with pagination' }),
    (0, api_paginated_response_decorator_1.ApiPaginatedResponse)(brand_response_dto_1.BrandResponseDto),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], BrandsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, permissions_decorator_1.Permissions)('brands.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active brands (for dropdowns)' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BrandsController.prototype, "findAllActive", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('brands.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get brand by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Brand found',
        type: brand_response_dto_1.BrandResponseDto,
    }),
    openapi.ApiResponse({ status: 200, type: require("./dto/brand-response.dto").BrandResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BrandsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('brands.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update brand' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200, type: require("./dto/brand-response.dto").BrandResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_brand_dto_1.UpdateBrandDto]),
    __metadata("design:returntype", Promise)
], BrandsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('brands.delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete brand' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BrandsController.prototype, "remove", null);
exports.BrandsController = BrandsController = __decorate([
    (0, swagger_1.ApiTags)('Brands'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('brands'),
    __metadata("design:paramtypes", [brands_service_1.BrandsService])
], BrandsController);
//# sourceMappingURL=brands.controller.js.map