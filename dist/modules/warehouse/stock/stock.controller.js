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
exports.StockController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const stock_service_1 = require("./stock.service");
const pagination_dto_1 = require("../../../common/dto/pagination.dto");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const stock_filter_dto_1 = require("./dto/stock-filter.dto");
const stock_movement_dto_1 = require("./dto/stock-movement.dto");
let StockController = class StockController {
    stockService;
    constructor(stockService) {
        this.stockService = stockService;
    }
    async getStock(paginationDto, filterDto) {
        const result = await this.stockService.getStock(paginationDto, filterDto);
        return result;
    }
    async getLowStock(warehouseId) {
        const products = await this.stockService.getLowStockProducts(warehouseId);
        return { data: products };
    }
    async getValuation(warehouseId) {
        const valuation = await this.stockService.getStockValuation(warehouseId);
        return valuation;
    }
    async getMovements(paginationDto, productId, warehouseId, movementType, fromDate, toDate) {
        const result = await this.stockService.getMovements(paginationDto, {
            productId,
            warehouseId,
            movementType: movementType,
            fromDate: fromDate ? new Date(fromDate) : undefined,
            toDate: toDate ? new Date(toDate) : undefined,
        });
        return result;
    }
    async getStockByProduct(productId) {
        const stock = await this.stockService.getStockByProduct(productId);
        return { data: stock };
    }
    async getStockByWarehouse(warehouseId, paginationDto) {
        const result = await this.stockService.getStockByWarehouse(warehouseId, paginationDto);
        return result;
    }
    async getLocationInventory(warehouseId) {
        const inventory = await this.stockService.getLocationInventory(warehouseId);
        return { data: inventory };
    }
    async getAvailableQuantity(productId, warehouseId, variantId) {
        const quantity = await this.stockService.getAvailableQuantity(productId, warehouseId, variantId);
        return { availableQuantity: quantity };
    }
    async recordMovement(movementDto, currentUser) {
        const movement = await this.stockService.recordMovement(movementDto, currentUser.sub);
        return movement;
    }
    async reserveStock(body) {
        await this.stockService.reserveStock(body.productId, body.warehouseId, body.quantity, body.variantId);
        return { message: 'Stock reserved successfully' };
    }
    async releaseStock(body) {
        await this.stockService.releaseStock(body.productId, body.warehouseId, body.quantity, body.variantId);
        return { message: 'Stock released successfully' };
    }
};
exports.StockController = StockController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('stock.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get stock with filters and pagination' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto,
        stock_filter_dto_1.StockFilterDto]),
    __metadata("design:returntype", Promise)
], StockController.prototype, "getStock", null);
__decorate([
    (0, common_1.Get)('low-stock'),
    (0, permissions_decorator_1.Permissions)('stock.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get low stock products' }),
    (0, swagger_1.ApiQuery)({ name: 'warehouseId', required: false }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('warehouseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StockController.prototype, "getLowStock", null);
__decorate([
    (0, common_1.Get)('valuation'),
    (0, permissions_decorator_1.Permissions)('stock.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get stock valuation' }),
    (0, swagger_1.ApiQuery)({ name: 'warehouseId', required: false }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)('warehouseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StockController.prototype, "getValuation", null);
__decorate([
    (0, common_1.Get)('movements'),
    (0, permissions_decorator_1.Permissions)('stock.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get stock movements' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('productId')),
    __param(2, (0, common_1.Query)('warehouseId')),
    __param(3, (0, common_1.Query)('movementType')),
    __param(4, (0, common_1.Query)('fromDate')),
    __param(5, (0, common_1.Query)('toDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], StockController.prototype, "getMovements", null);
__decorate([
    (0, common_1.Get)('product/:productId'),
    (0, permissions_decorator_1.Permissions)('stock.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get stock by product' }),
    (0, swagger_1.ApiParam)({ name: 'productId', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('productId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StockController.prototype, "getStockByProduct", null);
__decorate([
    (0, common_1.Get)('warehouse/:warehouseId'),
    (0, permissions_decorator_1.Permissions)('stock.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get stock by warehouse' }),
    (0, swagger_1.ApiParam)({ name: 'warehouseId', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('warehouseId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], StockController.prototype, "getStockByWarehouse", null);
__decorate([
    (0, common_1.Get)('warehouse/:warehouseId/locations'),
    (0, permissions_decorator_1.Permissions)('stock.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get location-wise inventory for a warehouse' }),
    (0, swagger_1.ApiParam)({ name: 'warehouseId', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('warehouseId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StockController.prototype, "getLocationInventory", null);
__decorate([
    (0, common_1.Get)('available/:productId/:warehouseId'),
    (0, permissions_decorator_1.Permissions)('stock.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available quantity for a product' }),
    (0, swagger_1.ApiParam)({ name: 'productId', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiParam)({ name: 'warehouseId', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiQuery)({ name: 'variantId', required: false }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('productId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('warehouseId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Query)('variantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], StockController.prototype, "getAvailableQuantity", null);
__decorate([
    (0, common_1.Post)('movement'),
    (0, permissions_decorator_1.Permissions)('stock.write'),
    (0, swagger_1.ApiOperation)({ summary: 'Record stock movement' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/warehouse/stock-movement.entity").StockMovement }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [stock_movement_dto_1.StockMovementDto, Object]),
    __metadata("design:returntype", Promise)
], StockController.prototype, "recordMovement", null);
__decorate([
    (0, common_1.Post)('reserve'),
    (0, permissions_decorator_1.Permissions)('stock.write'),
    (0, swagger_1.ApiOperation)({ summary: 'Reserve stock' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StockController.prototype, "reserveStock", null);
__decorate([
    (0, common_1.Post)('release'),
    (0, permissions_decorator_1.Permissions)('stock.write'),
    (0, swagger_1.ApiOperation)({ summary: 'Release reserved stock' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StockController.prototype, "releaseStock", null);
exports.StockController = StockController = __decorate([
    (0, swagger_1.ApiTags)('Stock'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('stock'),
    __metadata("design:paramtypes", [stock_service_1.StockService])
], StockController);
//# sourceMappingURL=stock.controller.js.map