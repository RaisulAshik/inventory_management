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
exports.LocationsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const locations_service_1 = require("./locations.service");
const pagination_dto_1 = require("../../../common/dto/pagination.dto");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const api_paginated_response_decorator_1 = require("../../../common/decorators/api-paginated-response.decorator");
const enums_1 = require("../../../common/enums");
const bulk_create_location_dto_1 = require("./dto/bulk-create-location.dto");
const create_location_dto_1 = require("./dto/create-location.dto");
const location_filter_dto_1 = require("./dto/location-filter.dto");
const location_response_dto_1 = require("./dto/location-response.dto");
const update_location_dto_1 = require("./dto/update-location.dto");
let LocationsController = class LocationsController {
    locationsService;
    constructor(locationsService) {
        this.locationsService = locationsService;
    }
    async create(createLocationDto) {
        const location = await this.locationsService.create(createLocationDto);
        return new location_response_dto_1.LocationResponseDto(location);
    }
    async bulkCreate(dto) {
        const result = await this.locationsService.bulkCreate(dto.warehouseId, dto.zoneId, dto.config);
        return result;
    }
    async findAll(paginationDto, filterDto) {
        const result = await this.locationsService.findAll(paginationDto, filterDto);
        return {
            data: result.data.map((loc) => new location_response_dto_1.LocationResponseDto(loc)),
            meta: result.meta,
        };
    }
    async findByWarehouse(warehouseId) {
        const locations = await this.locationsService.findByWarehouse(warehouseId);
        return { data: locations.map((loc) => new location_response_dto_1.LocationResponseDto(loc)) };
    }
    async findByZone(zoneId) {
        const locations = await this.locationsService.findByZone(zoneId);
        return { data: locations.map((loc) => new location_response_dto_1.LocationResponseDto(loc)) };
    }
    async getAvailableLocations(warehouseId, zoneId) {
        const locations = await this.locationsService.getAvailableLocations(warehouseId, zoneId);
        return { data: locations.map((loc) => new location_response_dto_1.LocationResponseDto(loc)) };
    }
    async findByBarcode(barcode) {
        const location = await this.locationsService.findByBarcode(barcode);
        return { data: location ? new location_response_dto_1.LocationResponseDto(location) : null };
    }
    async findOne(id) {
        const location = await this.locationsService.findById(id);
        return new location_response_dto_1.LocationResponseDto(location);
    }
    async getInventory(id) {
        const inventory = await this.locationsService.getInventory(id);
        return { data: inventory };
    }
    async getUtilization(id) {
        const utilization = await this.locationsService.getUtilization(id);
        return utilization;
    }
    async update(id, updateLocationDto) {
        const location = await this.locationsService.update(id, updateLocationDto);
        return new location_response_dto_1.LocationResponseDto(location);
    }
    async updateStatus(id, status) {
        const location = await this.locationsService.updateStatus(id, status);
        return new location_response_dto_1.LocationResponseDto(location);
    }
    async remove(id) {
        await this.locationsService.remove(id);
    }
};
exports.LocationsController = LocationsController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('locations.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new location' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Location created successfully',
        type: location_response_dto_1.LocationResponseDto,
    }),
    openapi.ApiResponse({ status: 201, type: require("./dto/location-response.dto").LocationResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_location_dto_1.CreateLocationDto]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('bulk'),
    (0, permissions_decorator_1.Permissions)('locations.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk create locations' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bulk_create_location_dto_1.BulkCreateLocationDto]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "bulkCreate", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('locations.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all locations with filters and pagination' }),
    (0, api_paginated_response_decorator_1.ApiPaginatedResponse)(location_response_dto_1.LocationResponseDto),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto,
        location_filter_dto_1.LocationFilterDto]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('warehouse/:warehouseId'),
    (0, permissions_decorator_1.Permissions)('locations.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get locations by warehouse' }),
    (0, swagger_1.ApiParam)({ name: 'warehouseId', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('warehouseId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "findByWarehouse", null);
__decorate([
    (0, common_1.Get)('zone/:zoneId'),
    (0, permissions_decorator_1.Permissions)('locations.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get locations by zone' }),
    (0, swagger_1.ApiParam)({ name: 'zoneId', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('zoneId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "findByZone", null);
__decorate([
    (0, common_1.Get)('available/:warehouseId'),
    (0, permissions_decorator_1.Permissions)('locations.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available locations for putaway' }),
    (0, swagger_1.ApiParam)({ name: 'warehouseId', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiQuery)({ name: 'zoneId', required: false }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('warehouseId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('zoneId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "getAvailableLocations", null);
__decorate([
    (0, common_1.Get)('barcode/:barcode'),
    (0, permissions_decorator_1.Permissions)('locations.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Find location by barcode' }),
    (0, swagger_1.ApiParam)({ name: 'barcode', type: 'string' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('barcode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "findByBarcode", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('locations.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get location by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Location found',
        type: location_response_dto_1.LocationResponseDto,
    }),
    openapi.ApiResponse({ status: 200, type: require("./dto/location-response.dto").LocationResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/inventory'),
    (0, permissions_decorator_1.Permissions)('locations.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get location inventory' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "getInventory", null);
__decorate([
    (0, common_1.Get)(':id/utilization'),
    (0, permissions_decorator_1.Permissions)('locations.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get location utilization' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "getUtilization", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('locations.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update location' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200, type: require("./dto/location-response.dto").LocationResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_location_dto_1.UpdateLocationDto]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, permissions_decorator_1.Permissions)('locations.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update location status' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200, type: require("./dto/location-response.dto").LocationResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('locations.delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete location' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "remove", null);
exports.LocationsController = LocationsController = __decorate([
    (0, swagger_1.ApiTags)('Warehouse Locations'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('locations'),
    __metadata("design:paramtypes", [locations_service_1.LocationsService])
], LocationsController);
//# sourceMappingURL=locations.controller.js.map