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
exports.PurchaseOrdersController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const purchase_orders_service_1 = require("./purchase-orders.service");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const api_paginated_response_decorator_1 = require("../../../common/decorators/api-paginated-response.decorator");
const create_purchase_order_dto_1 = require("./dto/create-purchase-order.dto");
const purchase_order_filter_dto_1 = require("./dto/purchase-order-filter.dto");
const purchase_order_response_dto_1 = require("./dto/purchase-order-response.dto");
const update_purchase_order_dto_1 = require("./dto/update-purchase-order.dto");
let PurchaseOrdersController = class PurchaseOrdersController {
    purchaseOrdersService;
    constructor(purchaseOrdersService) {
        this.purchaseOrdersService = purchaseOrdersService;
    }
    async create(createDto, currentUser) {
        const po = await this.purchaseOrdersService.create(createDto, currentUser.sub);
        return new purchase_order_response_dto_1.PurchaseOrderResponseDto(po);
    }
    async findAll(filterDto) {
        const result = await this.purchaseOrdersService.findAll(filterDto);
        return {
            data: result.data.map((po) => new purchase_order_response_dto_1.PurchaseOrderResponseDto(po)),
            meta: result.meta,
        };
    }
    async getOverdueOrders() {
        const orders = await this.purchaseOrdersService.getOverdueOrders();
        return { data: orders.map((po) => new purchase_order_response_dto_1.PurchaseOrderResponseDto(po)) };
    }
    async getPendingForSupplier(supplierId) {
        const orders = await this.purchaseOrdersService.getPendingOrdersForSupplier(supplierId);
        return { data: orders.map((po) => new purchase_order_response_dto_1.PurchaseOrderResponseDto(po)) };
    }
    async findByNumber(poNumber) {
        const po = await this.purchaseOrdersService.findByNumber(poNumber);
        return { data: po ? new purchase_order_response_dto_1.PurchaseOrderResponseDto(po) : null };
    }
    async findOne(id) {
        console.log('Fetching purchase order details for ID:', id);
        const po = await this.purchaseOrdersService.findById(id);
        return new purchase_order_response_dto_1.PurchaseOrderDetailResponseDto(po);
    }
    async update(id, updateDto) {
        const po = await this.purchaseOrdersService.update(id, updateDto);
        return new purchase_order_response_dto_1.PurchaseOrderResponseDto(po);
    }
    async submitForApproval(id, approverId, currentUser) {
        console.log('Submitting PO for approval', {
            id,
            approverId,
            userId: currentUser.sub,
        });
        const po = await this.purchaseOrdersService.submitForApproval(id, approverId, currentUser.sub);
        return new purchase_order_response_dto_1.PurchaseOrderResponseDto(po);
    }
    async approve(id, approverId, currentUser) {
        const po = await this.purchaseOrdersService.approve(id, approverId, currentUser.sub);
        return new purchase_order_response_dto_1.PurchaseOrderResponseDto(po);
    }
    async reject(id, reason, currentUser) {
        const po = await this.purchaseOrdersService.reject(id, currentUser.sub, reason);
        return new purchase_order_response_dto_1.PurchaseOrderResponseDto(po);
    }
    async sendToSupplier(id, senderId, currentUser) {
        const po = await this.purchaseOrdersService.sendToSupplier(id, senderId, currentUser.sub);
        return new purchase_order_response_dto_1.PurchaseOrderResponseDto(po);
    }
    async acknowledge(id, acknowledgementNumber) {
        const po = await this.purchaseOrdersService.acknowledge(id, acknowledgementNumber);
        return new purchase_order_response_dto_1.PurchaseOrderResponseDto(po);
    }
    async close(id) {
        const po = await this.purchaseOrdersService.close(id);
        return new purchase_order_response_dto_1.PurchaseOrderResponseDto(po);
    }
    async cancel(id, reason, currentUser) {
        const po = await this.purchaseOrdersService.cancel(id, currentUser.sub, reason);
        return new purchase_order_response_dto_1.PurchaseOrderResponseDto(po);
    }
    async remove(id) {
        await this.purchaseOrdersService.remove(id);
    }
};
exports.PurchaseOrdersController = PurchaseOrdersController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('purchase-orders.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new purchase order' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Purchase order created successfully',
        type: purchase_order_response_dto_1.PurchaseOrderResponseDto,
    }),
    openapi.ApiResponse({ status: 201, type: require("./dto/purchase-order-response.dto").PurchaseOrderResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_purchase_order_dto_1.CreatePurchaseOrderDto, Object]),
    __metadata("design:returntype", Promise)
], PurchaseOrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('purchase-orders.read'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all purchase orders with filters and pagination',
    }),
    (0, api_paginated_response_decorator_1.ApiPaginatedResponse)(purchase_order_response_dto_1.PurchaseOrderResponseDto),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [purchase_order_filter_dto_1.PurchaseOrderFilterDto]),
    __metadata("design:returntype", Promise)
], PurchaseOrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('overdue'),
    (0, permissions_decorator_1.Permissions)('purchase-orders.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get overdue purchase orders' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PurchaseOrdersController.prototype, "getOverdueOrders", null);
__decorate([
    (0, common_1.Get)('supplier/:supplierId/pending'),
    (0, permissions_decorator_1.Permissions)('purchase-orders.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending orders for a supplier' }),
    (0, swagger_1.ApiParam)({ name: 'supplierId', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('supplierId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PurchaseOrdersController.prototype, "getPendingForSupplier", null);
__decorate([
    (0, common_1.Get)('search/number/:poNumber'),
    (0, permissions_decorator_1.Permissions)('purchase-orders.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Find purchase order by number' }),
    (0, swagger_1.ApiParam)({ name: 'poNumber', type: 'string' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('poNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PurchaseOrdersController.prototype, "findByNumber", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('purchase-orders.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get purchase order by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Purchase order found',
        type: purchase_order_response_dto_1.PurchaseOrderDetailResponseDto,
    }),
    openapi.ApiResponse({ status: 200, type: require("./dto/purchase-order-response.dto").PurchaseOrderDetailResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PurchaseOrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('purchase-orders.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update purchase order' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200, type: require("./dto/purchase-order-response.dto").PurchaseOrderResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_purchase_order_dto_1.UpdatePurchaseOrderDto]),
    __metadata("design:returntype", Promise)
], PurchaseOrdersController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/submit'),
    (0, permissions_decorator_1.Permissions)('purchase-orders.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit purchase order for approval' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/purchase-order-response.dto").PurchaseOrderResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('approverId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PurchaseOrdersController.prototype, "submitForApproval", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, permissions_decorator_1.Permissions)('purchase-orders.approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve purchase order' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/purchase-order-response.dto").PurchaseOrderResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('approverId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PurchaseOrdersController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, permissions_decorator_1.Permissions)('purchase-orders.approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject purchase order' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/purchase-order-response.dto").PurchaseOrderResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('reason')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PurchaseOrdersController.prototype, "reject", null);
__decorate([
    (0, common_1.Post)(':id/send'),
    (0, permissions_decorator_1.Permissions)('purchase-orders.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Send purchase order to supplier' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/purchase-order-response.dto").PurchaseOrderResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('senderId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PurchaseOrdersController.prototype, "sendToSupplier", null);
__decorate([
    (0, common_1.Post)(':id/acknowledge'),
    (0, permissions_decorator_1.Permissions)('purchase-orders.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark purchase order as acknowledged by supplier' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/purchase-order-response.dto").PurchaseOrderResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('acknowledgementNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PurchaseOrdersController.prototype, "acknowledge", null);
__decorate([
    (0, common_1.Post)(':id/close'),
    (0, permissions_decorator_1.Permissions)('purchase-orders.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Close purchase order' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/purchase-order-response.dto").PurchaseOrderResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PurchaseOrdersController.prototype, "close", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, permissions_decorator_1.Permissions)('purchase-orders.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel purchase order' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/purchase-order-response.dto").PurchaseOrderResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('reason')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PurchaseOrdersController.prototype, "cancel", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('purchase-orders.delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete purchase order (draft only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PurchaseOrdersController.prototype, "remove", null);
exports.PurchaseOrdersController = PurchaseOrdersController = __decorate([
    (0, swagger_1.ApiTags)('Purchase Orders'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('purchase-orders'),
    __metadata("design:paramtypes", [purchase_orders_service_1.PurchaseOrdersService])
], PurchaseOrdersController);
//# sourceMappingURL=purchase-orders.controller.js.map