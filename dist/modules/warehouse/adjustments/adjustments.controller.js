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
exports.AdjustmentsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const adjustments_service_1 = require("./adjustments.service");
const pagination_dto_1 = require("../../../common/dto/pagination.dto");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const api_paginated_response_decorator_1 = require("../../../common/decorators/api-paginated-response.decorator");
const adjustment_filter_dto_1 = require("./dto/adjustment-filter.dto");
const adjustment_response_dto_1 = require("./dto/adjustment-response.dto");
const create_adjustment_item_dto_1 = require("./dto/create-adjustment-item.dto");
const create_adjustment_dto_1 = require("./dto/create-adjustment.dto");
const update_adjustment_dto_1 = require("./dto/update-adjustment.dto");
let AdjustmentsController = class AdjustmentsController {
    adjustmentsService;
    constructor(adjustmentsService) {
        this.adjustmentsService = adjustmentsService;
    }
    async create(createAdjustmentDto, currentUser) {
        const adjustment = await this.adjustmentsService.create(createAdjustmentDto, currentUser.sub);
        return new adjustment_response_dto_1.AdjustmentResponseDto(adjustment);
    }
    async findAll(paginationDto, filterDto) {
        const result = await this.adjustmentsService.findAll(paginationDto, filterDto);
        return {
            data: result.data.map((a) => new adjustment_response_dto_1.AdjustmentResponseDto(a)),
            meta: result.meta,
        };
    }
    async findOne(id) {
        const adjustment = await this.adjustmentsService.findById(id);
        return new adjustment_response_dto_1.AdjustmentResponseDto(adjustment);
    }
    async update(id, updateAdjustmentDto) {
        const adjustment = await this.adjustmentsService.update(id, updateAdjustmentDto);
        return new adjustment_response_dto_1.AdjustmentResponseDto(adjustment);
    }
    async submitForApproval(id, currentUser) {
        const adjustment = await this.adjustmentsService.submitForApproval(id, currentUser.sub);
        return new adjustment_response_dto_1.AdjustmentResponseDto(adjustment);
    }
    async approve(id, currentUser) {
        const adjustment = await this.adjustmentsService.approve(id, currentUser.sub);
        return new adjustment_response_dto_1.AdjustmentResponseDto(adjustment);
    }
    async reject(id, reason, currentUser) {
        const adjustment = await this.adjustmentsService.reject(id, currentUser.sub, reason);
        return new adjustment_response_dto_1.AdjustmentResponseDto(adjustment);
    }
    async cancel(id, reason, currentUser) {
        const adjustment = await this.adjustmentsService.cancel(id, currentUser.sub, reason);
        return new adjustment_response_dto_1.AdjustmentResponseDto(adjustment);
    }
    async remove(id) {
        await this.adjustmentsService.remove(id);
    }
    async addItem(id, itemDto) {
        const item = await this.adjustmentsService.addItem(id, itemDto);
        return item;
    }
    async updateItem(itemId, itemDto) {
        const item = await this.adjustmentsService.updateItem(itemId, itemDto);
        return item;
    }
    async removeItem(itemId) {
        await this.adjustmentsService.removeItem(itemId);
    }
};
exports.AdjustmentsController = AdjustmentsController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('adjustments.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new stock adjustment' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Adjustment created successfully',
        type: adjustment_response_dto_1.AdjustmentResponseDto,
    }),
    openapi.ApiResponse({ status: 201, type: require("./dto/adjustment-response.dto").AdjustmentResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_adjustment_dto_1.CreateAdjustmentDto, Object]),
    __metadata("design:returntype", Promise)
], AdjustmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('adjustments.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all adjustments with filters and pagination' }),
    (0, api_paginated_response_decorator_1.ApiPaginatedResponse)(adjustment_response_dto_1.AdjustmentResponseDto),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto,
        adjustment_filter_dto_1.AdjustmentFilterDto]),
    __metadata("design:returntype", Promise)
], AdjustmentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('adjustments.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get adjustment by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Adjustment found',
        type: adjustment_response_dto_1.AdjustmentResponseDto,
    }),
    openapi.ApiResponse({ status: 200, type: require("./dto/adjustment-response.dto").AdjustmentResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdjustmentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('adjustments.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update adjustment' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200, type: require("./dto/adjustment-response.dto").AdjustmentResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_adjustment_dto_1.UpdateAdjustmentDto]),
    __metadata("design:returntype", Promise)
], AdjustmentsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/submit'),
    (0, permissions_decorator_1.Permissions)('adjustments.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit adjustment for approval' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/adjustment-response.dto").AdjustmentResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdjustmentsController.prototype, "submitForApproval", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, permissions_decorator_1.Permissions)('adjustments.approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve adjustment' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/adjustment-response.dto").AdjustmentResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdjustmentsController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, permissions_decorator_1.Permissions)('adjustments.approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject adjustment' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/adjustment-response.dto").AdjustmentResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('reason')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AdjustmentsController.prototype, "reject", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, permissions_decorator_1.Permissions)('adjustments.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel adjustment' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/adjustment-response.dto").AdjustmentResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('reason')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AdjustmentsController.prototype, "cancel", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('adjustments.delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete adjustment (draft only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdjustmentsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/items'),
    (0, permissions_decorator_1.Permissions)('adjustments.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Add item to adjustment' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/warehouse/stock-adjustment-item.entity").StockAdjustmentItem }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_adjustment_item_dto_1.CreateAdjustmentItemDto]),
    __metadata("design:returntype", Promise)
], AdjustmentsController.prototype, "addItem", null);
__decorate([
    (0, common_1.Patch)('items/:itemId'),
    (0, permissions_decorator_1.Permissions)('adjustments.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update adjustment item' }),
    (0, swagger_1.ApiParam)({ name: 'itemId', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200, type: require("../../../entities/tenant/warehouse/stock-adjustment-item.entity").StockAdjustmentItem }),
    __param(0, (0, common_1.Param)('itemId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdjustmentsController.prototype, "updateItem", null);
__decorate([
    (0, common_1.Delete)('items/:itemId'),
    (0, permissions_decorator_1.Permissions)('adjustments.update'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Remove adjustment item' }),
    (0, swagger_1.ApiParam)({ name: 'itemId', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('itemId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdjustmentsController.prototype, "removeItem", null);
exports.AdjustmentsController = AdjustmentsController = __decorate([
    (0, swagger_1.ApiTags)('Stock Adjustments'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('adjustments'),
    __metadata("design:paramtypes", [adjustments_service_1.AdjustmentsService])
], AdjustmentsController);
//# sourceMappingURL=adjustments.controller.js.map