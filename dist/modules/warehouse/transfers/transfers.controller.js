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
exports.TransfersController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const transfers_service_1 = require("./transfers.service");
const pagination_dto_1 = require("../../../common/dto/pagination.dto");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const api_paginated_response_decorator_1 = require("../../../common/decorators/api-paginated-response.decorator");
const create_transfer_item_dto_1 = require("./dto/create-transfer-item.dto");
const create_transfer_dto_1 = require("./dto/create-transfer.dto");
const receive_transfer_dto_1 = require("./dto/receive-transfer.dto");
const transfer_filter_dto_1 = require("./dto/transfer-filter.dto");
const transfer_response_dto_1 = require("./dto/transfer-response.dto");
const update_transfer_dto_1 = require("./dto/update-transfer.dto");
let TransfersController = class TransfersController {
    transfersService;
    constructor(transfersService) {
        this.transfersService = transfersService;
    }
    async create(createTransferDto, currentUser) {
        const transfer = await this.transfersService.create(createTransferDto, currentUser.sub);
        return new transfer_response_dto_1.TransferResponseDto(transfer);
    }
    async findAll(paginationDto, filterDto) {
        const result = await this.transfersService.findAll(paginationDto, filterDto);
        return {
            data: result.data.map((t) => new transfer_response_dto_1.TransferResponseDto(t)),
            meta: result.meta,
        };
    }
    async findOne(id) {
        const transfer = await this.transfersService.findById(id);
        return new transfer_response_dto_1.TransferResponseDto(transfer);
    }
    async update(id, updateTransferDto) {
        const transfer = await this.transfersService.update(id, updateTransferDto);
        return new transfer_response_dto_1.TransferResponseDto(transfer);
    }
    async submitForApproval(id, currentUser) {
        const transfer = await this.transfersService.submitForApproval(id, currentUser.sub);
        return new transfer_response_dto_1.TransferResponseDto(transfer);
    }
    async approve(id, currentUser) {
        const transfer = await this.transfersService.approve(id, currentUser.sub);
        return new transfer_response_dto_1.TransferResponseDto(transfer);
    }
    async reject(id, reason, currentUser) {
        const transfer = await this.transfersService.reject(id, currentUser.sub, reason);
        return new transfer_response_dto_1.TransferResponseDto(transfer);
    }
    async ship(id, trackingNumber, currentUser) {
        const transfer = await this.transfersService.ship(id, currentUser.sub, trackingNumber);
        return new transfer_response_dto_1.TransferResponseDto(transfer);
    }
    async receive(id, receiveDto, currentUser) {
        const transfer = await this.transfersService.receive(id, currentUser.sub, receiveDto.items);
        return new transfer_response_dto_1.TransferResponseDto(transfer);
    }
    async cancel(id, reason, currentUser) {
        const transfer = await this.transfersService.cancel(id, currentUser.sub, reason);
        return new transfer_response_dto_1.TransferResponseDto(transfer);
    }
    async remove(id) {
        await this.transfersService.remove(id);
    }
    async addItem(id, itemDto) {
        const item = await this.transfersService.addItem(id, itemDto);
        return item;
    }
    async updateItem(itemId, itemDto) {
        const item = await this.transfersService.updateItem(itemId, itemDto);
        return item;
    }
    async removeItem(itemId) {
        await this.transfersService.removeItem(itemId);
    }
};
exports.TransfersController = TransfersController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('transfers.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new transfer' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Transfer created successfully',
        type: transfer_response_dto_1.TransferResponseDto,
    }),
    openapi.ApiResponse({ status: 201, type: require("./dto/transfer-response.dto").TransferResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_transfer_dto_1.CreateTransferDto, Object]),
    __metadata("design:returntype", Promise)
], TransfersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('transfers.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all transfers with filters and pagination' }),
    (0, api_paginated_response_decorator_1.ApiPaginatedResponse)(transfer_response_dto_1.TransferResponseDto),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto,
        transfer_filter_dto_1.TransferFilterDto]),
    __metadata("design:returntype", Promise)
], TransfersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('transfers.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get transfer by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Transfer found',
        type: transfer_response_dto_1.TransferResponseDto,
    }),
    openapi.ApiResponse({ status: 200, type: require("./dto/transfer-response.dto").TransferResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransfersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('transfers.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update transfer' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200, type: require("./dto/transfer-response.dto").TransferResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_transfer_dto_1.UpdateTransferDto]),
    __metadata("design:returntype", Promise)
], TransfersController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/submit'),
    (0, permissions_decorator_1.Permissions)('transfers.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit transfer for approval' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/transfer-response.dto").TransferResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TransfersController.prototype, "submitForApproval", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, permissions_decorator_1.Permissions)('transfers.approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve transfer' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/transfer-response.dto").TransferResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TransfersController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, permissions_decorator_1.Permissions)('transfers.approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject transfer' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/transfer-response.dto").TransferResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('reason')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], TransfersController.prototype, "reject", null);
__decorate([
    (0, common_1.Post)(':id/ship'),
    (0, permissions_decorator_1.Permissions)('transfers.ship'),
    (0, swagger_1.ApiOperation)({ summary: 'Ship transfer' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/transfer-response.dto").TransferResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('trackingNumber')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], TransfersController.prototype, "ship", null);
__decorate([
    (0, common_1.Post)(':id/receive'),
    (0, permissions_decorator_1.Permissions)('transfers.receive'),
    (0, swagger_1.ApiOperation)({ summary: 'Receive transfer' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/transfer-response.dto").TransferResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, receive_transfer_dto_1.ReceiveTransferDto, Object]),
    __metadata("design:returntype", Promise)
], TransfersController.prototype, "receive", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, permissions_decorator_1.Permissions)('transfers.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel transfer' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/transfer-response.dto").TransferResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('reason')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], TransfersController.prototype, "cancel", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('transfers.delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete transfer (draft only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransfersController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/items'),
    (0, permissions_decorator_1.Permissions)('transfers.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Add item to transfer' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/warehouse/warehouse-transfer-item.entity").WarehouseTransferItem }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_transfer_item_dto_1.CreateTransferItemDto]),
    __metadata("design:returntype", Promise)
], TransfersController.prototype, "addItem", null);
__decorate([
    (0, common_1.Patch)('items/:itemId'),
    (0, permissions_decorator_1.Permissions)('transfers.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update transfer item' }),
    (0, swagger_1.ApiParam)({ name: 'itemId', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200, type: require("../../../entities/tenant/warehouse/warehouse-transfer-item.entity").WarehouseTransferItem }),
    __param(0, (0, common_1.Param)('itemId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TransfersController.prototype, "updateItem", null);
__decorate([
    (0, common_1.Delete)('items/:itemId'),
    (0, permissions_decorator_1.Permissions)('transfers.update'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Remove transfer item' }),
    (0, swagger_1.ApiParam)({ name: 'itemId', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('itemId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransfersController.prototype, "removeItem", null);
exports.TransfersController = TransfersController = __decorate([
    (0, swagger_1.ApiTags)('Warehouse Transfers'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('transfers'),
    __metadata("design:paramtypes", [transfers_service_1.TransfersService])
], TransfersController);
//# sourceMappingURL=transfers.controller.js.map