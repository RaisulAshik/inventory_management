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
exports.WarehousesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const warehouses_service_1 = require("./warehouses.service");
const create_warehouse_dto_1 = require("./dto/create-warehouse.dto");
const update_warehouse_dto_1 = require("./dto/update-warehouse.dto");
const warehouse_response_dto_1 = require("./dto/warehouse-response.dto");
const create_zone_dto_1 = require("./dto/create-zone.dto");
const pagination_dto_1 = require("../../../common/dto/pagination.dto");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const api_paginated_response_decorator_1 = require("../../../common/decorators/api-paginated-response.decorator");
let WarehousesController = class WarehousesController {
    warehousesService;
    constructor(warehousesService) {
        this.warehousesService = warehousesService;
    }
    async create(createWarehouseDto, currentUser) {
        const warehouse = await this.warehousesService.create(createWarehouseDto, currentUser.sub);
        return new warehouse_response_dto_1.WarehouseResponseDto(warehouse);
    }
    async findAll(paginationDto) {
        const result = await this.warehousesService.findAll(paginationDto);
        return {
            data: result.data.map((w) => new warehouse_response_dto_1.WarehouseResponseDto(w)),
            meta: result.meta,
        };
    }
    async findAllActive() {
        const warehouses = await this.warehousesService.findAllActive();
        return { data: warehouses.map((w) => new warehouse_response_dto_1.WarehouseResponseDto(w)) };
    }
    async getDefault() {
        const warehouse = await this.warehousesService.getDefault();
        return { data: warehouse ? new warehouse_response_dto_1.WarehouseResponseDto(warehouse) : null };
    }
    async findOne(id) {
        const warehouse = await this.warehousesService.findById(id);
        return new warehouse_response_dto_1.WarehouseResponseDto(warehouse);
    }
    async getZones(id) {
        const zones = await this.warehousesService.getZones(id);
        return { data: zones };
    }
    async getStockSummary(id) {
        const summary = await this.warehousesService.getStockSummary(id);
        return summary;
    }
    async update(id, updateWarehouseDto) {
        const warehouse = await this.warehousesService.update(id, updateWarehouseDto);
        return new warehouse_response_dto_1.WarehouseResponseDto(warehouse);
    }
    async remove(id) {
        await this.warehousesService.remove(id);
    }
    async addZone(id, zoneDto) {
        const zone = await this.warehousesService.addZone(id, zoneDto);
        return zone;
    }
    async updateZone(zoneId, zoneDto) {
        const zone = await this.warehousesService.updateZone(zoneId, zoneDto);
        return zone;
    }
    async removeZone(zoneId) {
        await this.warehousesService.removeZone(zoneId);
    }
};
exports.WarehousesController = WarehousesController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('warehouses.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new warehouse' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Warehouse created successfully',
        type: warehouse_response_dto_1.WarehouseResponseDto,
    }),
    openapi.ApiResponse({ status: 201, type: require("./dto/warehouse-response.dto").WarehouseResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_warehouse_dto_1.CreateWarehouseDto, Object]),
    __metadata("design:returntype", Promise)
], WarehousesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('warehouses.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all warehouses with pagination' }),
    (0, api_paginated_response_decorator_1.ApiPaginatedResponse)(warehouse_response_dto_1.WarehouseResponseDto),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], WarehousesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, permissions_decorator_1.Permissions)('warehouses.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active warehouses (for dropdowns)' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WarehousesController.prototype, "findAllActive", null);
__decorate([
    (0, common_1.Get)('default'),
    (0, permissions_decorator_1.Permissions)('warehouses.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get default warehouse' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WarehousesController.prototype, "getDefault", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('warehouses.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get warehouse by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Warehouse found',
        type: warehouse_response_dto_1.WarehouseResponseDto,
    }),
    openapi.ApiResponse({ status: 200, type: require("./dto/warehouse-response.dto").WarehouseResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WarehousesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/zones'),
    (0, permissions_decorator_1.Permissions)('warehouses.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get warehouse zones' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WarehousesController.prototype, "getZones", null);
__decorate([
    (0, common_1.Get)(':id/stock-summary'),
    (0, permissions_decorator_1.Permissions)('warehouses.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get warehouse stock summary' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WarehousesController.prototype, "getStockSummary", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('warehouses.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update warehouse' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200, type: require("./dto/warehouse-response.dto").WarehouseResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_warehouse_dto_1.UpdateWarehouseDto]),
    __metadata("design:returntype", Promise)
], WarehousesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('warehouses.delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete warehouse' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WarehousesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/zones'),
    (0, permissions_decorator_1.Permissions)('warehouses.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Add zone to warehouse' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/warehouse/warehouse-zone.entity").WarehouseZone }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_zone_dto_1.CreateZoneDto]),
    __metadata("design:returntype", Promise)
], WarehousesController.prototype, "addZone", null);
__decorate([
    (0, common_1.Patch)('zones/:zoneId'),
    (0, permissions_decorator_1.Permissions)('warehouses.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update warehouse zone' }),
    (0, swagger_1.ApiParam)({ name: 'zoneId', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200, type: require("../../../entities/tenant/warehouse/warehouse-zone.entity").WarehouseZone }),
    __param(0, (0, common_1.Param)('zoneId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_zone_dto_1.CreateZoneDto]),
    __metadata("design:returntype", Promise)
], WarehousesController.prototype, "updateZone", null);
__decorate([
    (0, common_1.Delete)('zones/:zoneId'),
    (0, permissions_decorator_1.Permissions)('warehouses.update'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete warehouse zone' }),
    (0, swagger_1.ApiParam)({ name: 'zoneId', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('zoneId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WarehousesController.prototype, "removeZone", null);
exports.WarehousesController = WarehousesController = __decorate([
    (0, swagger_1.ApiTags)('Warehouses'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('warehouses'),
    __metadata("design:paramtypes", [warehouses_service_1.WarehousesService])
], WarehousesController);
//# sourceMappingURL=warehouses.controller.js.map