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
exports.UnitsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const units_service_1 = require("./units.service");
const pagination_dto_1 = require("../../../common/dto/pagination.dto");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const api_paginated_response_decorator_1 = require("../../../common/decorators/api-paginated-response.decorator");
const create_unit_dto_1 = require("./dto/create-unit.dto");
const create_uom_conversion_dto_1 = require("./dto/create-uom-conversion.dto");
const unit_response_dto_1 = require("./dto/unit-response.dto");
const update_unit_dto_1 = require("./dto/update-unit.dto");
let UnitsController = class UnitsController {
    unitsService;
    constructor(unitsService) {
        this.unitsService = unitsService;
    }
    async create(createUnitDto) {
        const unit = await this.unitsService.create(createUnitDto);
        return new unit_response_dto_1.UnitResponseDto(unit);
    }
    async findAll(paginationDto) {
        const result = await this.unitsService.findAll(paginationDto);
        return {
            data: result.data.map((unit) => new unit_response_dto_1.UnitResponseDto(unit)),
            meta: result.meta,
        };
    }
    async findAllActive() {
        const units = await this.unitsService.findAllActive();
        return { data: units.map((unit) => new unit_response_dto_1.UnitResponseDto(unit)) };
    }
    async findByType(type) {
        const units = await this.unitsService.findByType(type);
        return { data: units.map((unit) => new unit_response_dto_1.UnitResponseDto(unit)) };
    }
    async convert(fromUomId, toUomId, quantity) {
        const convertedQuantity = await this.unitsService.convert(fromUomId, toUomId, Number(quantity));
        return { convertedQuantity };
    }
    async findOne(id) {
        const unit = await this.unitsService.findById(id);
        return new unit_response_dto_1.UnitResponseDto(unit);
    }
    async getConversions(id) {
        const conversions = await this.unitsService.getConversions(id);
        return { data: conversions };
    }
    async update(id, updateUnitDto) {
        const unit = await this.unitsService.update(id, updateUnitDto);
        return new unit_response_dto_1.UnitResponseDto(unit);
    }
    async remove(id) {
        await this.unitsService.remove(id);
    }
    async createConversion(dto) {
        const conversion = await this.unitsService.createConversion(dto);
        return conversion;
    }
    async updateConversion(conversionId, conversionFactor) {
        const conversion = await this.unitsService.updateConversion(conversionId, conversionFactor);
        return conversion;
    }
    async removeConversion(conversionId) {
        await this.unitsService.removeConversion(conversionId);
    }
};
exports.UnitsController = UnitsController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('units.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new unit of measure' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Unit created successfully',
        type: unit_response_dto_1.UnitResponseDto,
    }),
    openapi.ApiResponse({ status: 201, type: require("./dto/unit-response.dto").UnitResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_unit_dto_1.CreateUnitDto]),
    __metadata("design:returntype", Promise)
], UnitsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('units.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all units with pagination' }),
    (0, api_paginated_response_decorator_1.ApiPaginatedResponse)(unit_response_dto_1.UnitResponseDto),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], UnitsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, permissions_decorator_1.Permissions)('units.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active units (for dropdowns)' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UnitsController.prototype, "findAllActive", null);
__decorate([
    (0, common_1.Get)('type/:type'),
    (0, permissions_decorator_1.Permissions)('units.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get units by type' }),
    (0, swagger_1.ApiParam)({ name: 'type', type: 'string' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UnitsController.prototype, "findByType", null);
__decorate([
    (0, common_1.Get)('convert'),
    (0, permissions_decorator_1.Permissions)('units.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Convert quantity between units' }),
    (0, swagger_1.ApiQuery)({ name: 'fromUomId', type: 'string' }),
    (0, swagger_1.ApiQuery)({ name: 'toUomId', type: 'string' }),
    (0, swagger_1.ApiQuery)({ name: 'quantity', type: 'number' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('fromUomId')),
    __param(1, (0, common_1.Query)('toUomId')),
    __param(2, (0, common_1.Query)('quantity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], UnitsController.prototype, "convert", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('units.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get unit by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Unit found',
        type: unit_response_dto_1.UnitResponseDto,
    }),
    openapi.ApiResponse({ status: 200, type: require("./dto/unit-response.dto").UnitResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UnitsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/conversions'),
    (0, permissions_decorator_1.Permissions)('units.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get conversions for a unit' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UnitsController.prototype, "getConversions", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('units.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update unit' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200, type: require("./dto/unit-response.dto").UnitResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_unit_dto_1.UpdateUnitDto]),
    __metadata("design:returntype", Promise)
], UnitsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('units.delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete unit' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UnitsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('conversions'),
    (0, permissions_decorator_1.Permissions)('units.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Create unit conversion' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/inventory/uom-conversion.entity").UomConversion }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_uom_conversion_dto_1.CreateUomConversionDto]),
    __metadata("design:returntype", Promise)
], UnitsController.prototype, "createConversion", null);
__decorate([
    (0, common_1.Patch)('conversions/:conversionId'),
    (0, permissions_decorator_1.Permissions)('units.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update unit conversion' }),
    (0, swagger_1.ApiParam)({ name: 'conversionId', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200, type: require("../../../entities/tenant/inventory/uom-conversion.entity").UomConversion }),
    __param(0, (0, common_1.Param)('conversionId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('conversionFactor')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], UnitsController.prototype, "updateConversion", null);
__decorate([
    (0, common_1.Delete)('conversions/:conversionId'),
    (0, permissions_decorator_1.Permissions)('units.update'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete unit conversion' }),
    (0, swagger_1.ApiParam)({ name: 'conversionId', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('conversionId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UnitsController.prototype, "removeConversion", null);
exports.UnitsController = UnitsController = __decorate([
    (0, swagger_1.ApiTags)('Units of Measure'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('units'),
    __metadata("design:paramtypes", [units_service_1.UnitsService])
], UnitsController);
//# sourceMappingURL=units.controller.js.map