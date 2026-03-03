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
exports.ProductsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const products_service_1 = require("./products.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const product_filter_dto_1 = require("./dto/product-filter.dto");
const product_response_dto_1 = require("./dto/product-response.dto");
const pagination_dto_1 = require("../../../common/dto/pagination.dto");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const api_paginated_response_decorator_1 = require("../../../common/decorators/api-paginated-response.decorator");
let ProductsController = class ProductsController {
    productsService;
    constructor(productsService) {
        this.productsService = productsService;
    }
    async create(createProductDto, currentUser) {
        const product = await this.productsService.create(createProductDto, currentUser.sub);
        return new product_response_dto_1.ProductResponseDto(product);
    }
    async findAll(paginationDto, filterDto) {
        const result = await this.productsService.findAll(paginationDto, filterDto);
        return {
            data: result.data.map((product) => new product_response_dto_1.ProductResponseDto(product)),
            meta: result.meta,
        };
    }
    async getLowStock(warehouseId) {
        const products = await this.productsService.getLowStockProducts(warehouseId);
        return { data: products };
    }
    async findBySku(sku) {
        const product = await this.productsService.findBySku(sku);
        if (!product) {
            return { data: null };
        }
        return { data: new product_response_dto_1.ProductResponseDto(product) };
    }
    async findByBarcode(barcode) {
        const product = await this.productsService.findByBarcode(barcode);
        if (!product) {
            return { data: null };
        }
        return { data: new product_response_dto_1.ProductResponseDto(product) };
    }
    async findOne(id) {
        const product = await this.productsService.findById(id);
        return new product_response_dto_1.ProductResponseDto(product);
    }
    async getStock(id) {
        const stock = await this.productsService.getProductStock(id);
        return { data: stock };
    }
    async update(id, updateProductDto) {
        const product = await this.productsService.update(id, updateProductDto);
        return new product_response_dto_1.ProductResponseDto(product);
    }
    async remove(id) {
        await this.productsService.remove(id);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('products.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new product' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Product created successfully',
        type: product_response_dto_1.ProductResponseDto,
    }),
    openapi.ApiResponse({ status: 201, type: require("./dto/product-response.dto").ProductResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('products.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all products with pagination and filters' }),
    (0, api_paginated_response_decorator_1.ApiPaginatedResponse)(product_response_dto_1.ProductResponseDto),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto,
        product_filter_dto_1.ProductFilterDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('low-stock'),
    (0, permissions_decorator_1.Permissions)('products.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get low stock products' }),
    (0, swagger_1.ApiQuery)({ name: 'warehouseId', required: false }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('warehouseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getLowStock", null);
__decorate([
    (0, common_1.Get)('search/sku/:sku'),
    (0, permissions_decorator_1.Permissions)('products.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Find product by SKU' }),
    (0, swagger_1.ApiParam)({ name: 'sku', type: 'string' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('sku')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findBySku", null);
__decorate([
    (0, common_1.Get)('search/barcode/:barcode'),
    (0, permissions_decorator_1.Permissions)('products.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Find product by barcode' }),
    (0, swagger_1.ApiParam)({ name: 'barcode', type: 'string' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('barcode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findByBarcode", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('products.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get product by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Product found',
        type: product_response_dto_1.ProductResponseDto,
    }),
    openapi.ApiResponse({ status: 200, type: require("./dto/product-response.dto").ProductResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/stock'),
    (0, permissions_decorator_1.Permissions)('products.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get product stock across all warehouses' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getStock", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('products.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update product' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200, type: require("./dto/product-response.dto").ProductResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('products.delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete product (soft delete)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "remove", null);
exports.ProductsController = ProductsController = __decorate([
    (0, swagger_1.ApiTags)('Products'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map