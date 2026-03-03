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
exports.PriceListsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const price_lists_service_1 = require("./price-lists.service");
const pagination_dto_1 = require("../../../common/dto/pagination.dto");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const api_paginated_response_decorator_1 = require("../../../common/decorators/api-paginated-response.decorator");
const tenant_1 = require("../../../entities/tenant");
const create_price_list_item_dto_1 = require("./dto/create-price-list-item.dto");
const create_price_list_dto_1 = require("./dto/create-price-list.dto");
const price_list_response_dto_1 = require("./dto/price-list-response.dto");
const update_price_list_dto_1 = require("./dto/update-price-list.dto");
let PriceListsController = class PriceListsController {
    priceListsService;
    constructor(priceListsService) {
        this.priceListsService = priceListsService;
    }
    async create(createPriceListDto, currentUser) {
        const priceList = await this.priceListsService.create(createPriceListDto, currentUser.sub);
        return new price_list_response_dto_1.PriceListResponseDto(priceList);
    }
    async findAll(paginationDto) {
        const result = await this.priceListsService.findAll(paginationDto);
        return {
            data: result.data.map((pl) => new price_list_response_dto_1.PriceListResponseDto(pl)),
            meta: result.meta,
        };
    }
    async findAllActive() {
        const priceLists = await this.priceListsService.findAllActive();
        return { data: priceLists.map((pl) => new price_list_response_dto_1.PriceListResponseDto(pl)) };
    }
    async findByType(type) {
        const priceLists = await this.priceListsService.findByType(type);
        return { data: priceLists.map((pl) => new price_list_response_dto_1.PriceListResponseDto(pl)) };
    }
    async getDefault(type) {
        const priceList = await this.priceListsService.getDefault(type);
        return { data: priceList ? new price_list_response_dto_1.PriceListResponseDto(priceList) : null };
    }
    async getProductPrice(priceListId, productId, quantity, variantId) {
        const price = await this.priceListsService.getProductPrice(priceListId, productId, quantity ? Number(quantity) : 1, variantId);
        return { price };
    }
    async findOne(id) {
        const priceList = await this.priceListsService.findById(id);
        return new price_list_response_dto_1.PriceListResponseDto(priceList);
    }
    async getItems(id) {
        const items = await this.priceListsService.getItems(id);
        return { data: items };
    }
    async update(id, updatePriceListDto) {
        const priceList = await this.priceListsService.update(id, updatePriceListDto);
        return new price_list_response_dto_1.PriceListResponseDto(priceList);
    }
    async remove(id) {
        await this.priceListsService.remove(id);
    }
    async copyPriceList(id, body, currentUser) {
        const priceList = await this.priceListsService.copyPriceList(id, body.newCode, body.newName, currentUser.sub);
        return new price_list_response_dto_1.PriceListResponseDto(priceList);
    }
    async addItem(id, itemDto) {
        const item = await this.priceListsService.addItem(id, itemDto);
        return item;
    }
    async bulkAddItems(id, body) {
        const result = await this.priceListsService.bulkAddItems(id, body.items);
        return result;
    }
    async updateItem(itemId, itemDto) {
        const item = await this.priceListsService.updateItem(itemId, itemDto);
        return item;
    }
    async removeItem(itemId) {
        await this.priceListsService.removeItem(itemId);
    }
};
exports.PriceListsController = PriceListsController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('price-lists.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new price list' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Price list created successfully',
        type: price_list_response_dto_1.PriceListResponseDto,
    }),
    openapi.ApiResponse({ status: 201, type: require("./dto/price-list-response.dto").PriceListResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_price_list_dto_1.CreatePriceListDto, Object]),
    __metadata("design:returntype", Promise)
], PriceListsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('price-lists.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all price lists with pagination' }),
    (0, api_paginated_response_decorator_1.ApiPaginatedResponse)(price_list_response_dto_1.PriceListResponseDto),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], PriceListsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, permissions_decorator_1.Permissions)('price-lists.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active price lists (for dropdowns)' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PriceListsController.prototype, "findAllActive", null);
__decorate([
    (0, common_1.Get)('type/:type'),
    (0, permissions_decorator_1.Permissions)('price-lists.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get price lists by type' }),
    (0, swagger_1.ApiParam)({ name: 'type', enum: tenant_1.PriceListType }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PriceListsController.prototype, "findByType", null);
__decorate([
    (0, common_1.Get)('default/:type'),
    (0, permissions_decorator_1.Permissions)('price-lists.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get default price list by type' }),
    (0, swagger_1.ApiParam)({ name: 'type', enum: tenant_1.PriceListType }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PriceListsController.prototype, "getDefault", null);
__decorate([
    (0, common_1.Get)('price'),
    (0, permissions_decorator_1.Permissions)('price-lists.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get product price from a price list' }),
    (0, swagger_1.ApiQuery)({ name: 'priceListId', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'productId', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'quantity', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'variantId', required: false }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('priceListId')),
    __param(1, (0, common_1.Query)('productId')),
    __param(2, (0, common_1.Query)('quantity')),
    __param(3, (0, common_1.Query)('variantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, String]),
    __metadata("design:returntype", Promise)
], PriceListsController.prototype, "getProductPrice", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('price-lists.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get price list by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Price list found',
        type: price_list_response_dto_1.PriceListResponseDto,
    }),
    openapi.ApiResponse({ status: 200, type: require("./dto/price-list-response.dto").PriceListResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PriceListsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/items'),
    (0, permissions_decorator_1.Permissions)('price-lists.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get price list items' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PriceListsController.prototype, "getItems", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('price-lists.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update price list' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200, type: require("./dto/price-list-response.dto").PriceListResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_price_list_dto_1.UpdatePriceListDto]),
    __metadata("design:returntype", Promise)
], PriceListsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('price-lists.delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete price list' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PriceListsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/copy'),
    (0, permissions_decorator_1.Permissions)('price-lists.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Copy price list' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/price-list-response.dto").PriceListResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PriceListsController.prototype, "copyPriceList", null);
__decorate([
    (0, common_1.Post)(':id/items'),
    (0, permissions_decorator_1.Permissions)('price-lists.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Add item to price list' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/inventory/price-list-item.entity").PriceListItem }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_price_list_item_dto_1.CreatePriceListItemDto]),
    __metadata("design:returntype", Promise)
], PriceListsController.prototype, "addItem", null);
__decorate([
    (0, common_1.Post)(':id/items/bulk'),
    (0, permissions_decorator_1.Permissions)('price-lists.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk add items to price list' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PriceListsController.prototype, "bulkAddItems", null);
__decorate([
    (0, common_1.Patch)('items/:itemId'),
    (0, permissions_decorator_1.Permissions)('price-lists.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update price list item' }),
    (0, swagger_1.ApiParam)({ name: 'itemId', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200, type: require("../../../entities/tenant/inventory/price-list-item.entity").PriceListItem }),
    __param(0, (0, common_1.Param)('itemId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PriceListsController.prototype, "updateItem", null);
__decorate([
    (0, common_1.Delete)('items/:itemId'),
    (0, permissions_decorator_1.Permissions)('price-lists.update'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Remove price list item' }),
    (0, swagger_1.ApiParam)({ name: 'itemId', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('itemId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PriceListsController.prototype, "removeItem", null);
exports.PriceListsController = PriceListsController = __decorate([
    (0, swagger_1.ApiTags)('Price Lists'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('price-lists'),
    __metadata("design:paramtypes", [price_lists_service_1.PriceListsService])
], PriceListsController);
//# sourceMappingURL=price-lists.controller.js.map