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
exports.OrdersController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const orders_service_1 = require("./orders.service");
const create_order_dto_1 = require("./dto/create-order.dto");
const update_order_dto_1 = require("./dto/update-order.dto");
const order_filter_dto_1 = require("./dto/order-filter.dto");
const add_payment_dto_1 = require("./dto/add-payment.dto");
const ship_order_dto_1 = require("./dto/ship-order.dto");
const order_response_dto_1 = require("./dto/order-response.dto");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const api_paginated_response_decorator_1 = require("../../../common/decorators/api-paginated-response.decorator");
let OrdersController = class OrdersController {
    ordersService;
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    async create(createOrderDto, currentUser) {
        const order = await this.ordersService.create(createOrderDto, currentUser.sub);
        return new order_response_dto_1.OrderResponseDto(order);
    }
    async findAll(filterDto) {
        const result = await this.ordersService.findAll(filterDto);
        return {
            data: result.data.map((o) => new order_response_dto_1.OrderResponseDto(o)),
            meta: result.meta,
        };
    }
    async getStatistics(fromDate, toDate, warehouseId) {
        const stats = await this.ordersService.getStatistics(fromDate ? new Date(fromDate) : undefined, toDate ? new Date(toDate) : undefined, warehouseId);
        return stats;
    }
    async findByNumber(orderNumber) {
        const order = await this.ordersService.findByNumber(orderNumber);
        return { data: order ? new order_response_dto_1.OrderResponseDto(order) : null };
    }
    async findOne(id) {
        const order = await this.ordersService.findById(id);
        return new order_response_dto_1.OrderResponseDto(order);
    }
    async getPayments(id) {
        const payments = await this.ordersService.getPayments(id);
        return { data: payments };
    }
    async update(id, updateOrderDto) {
        const order = await this.ordersService.update(id, updateOrderDto);
        return new order_response_dto_1.OrderResponseDto(order);
    }
    async confirm(id, currentUser) {
        const order = await this.ordersService.confirm(id, currentUser.sub);
        return new order_response_dto_1.OrderResponseDto(order);
    }
    async process(id, currentUser) {
        const order = await this.ordersService.process(id, currentUser.sub);
        return new order_response_dto_1.OrderResponseDto(order);
    }
    async ship(id, shipDto, currentUser) {
        const order = await this.ordersService.ship(id, currentUser.sub, shipDto);
        return new order_response_dto_1.OrderResponseDto(order);
    }
    async deliver(id, currentUser) {
        const order = await this.ordersService.deliver(id, currentUser.sub);
        return new order_response_dto_1.OrderResponseDto(order);
    }
    async complete(id) {
        const order = await this.ordersService.complete(id);
        return new order_response_dto_1.OrderResponseDto(order);
    }
    async cancel(id, reason, currentUser) {
        const order = await this.ordersService.cancel(id, currentUser.sub, reason);
        return new order_response_dto_1.OrderResponseDto(order);
    }
    async addPayment(id, paymentDto, currentUser) {
        const order = await this.ordersService.addPayment(id, paymentDto, currentUser.sub);
        return new order_response_dto_1.OrderResponseDto(order);
    }
    async remove(id) {
        await this.ordersService.remove(id);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('orders.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new sales order' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Order created successfully',
        type: order_response_dto_1.OrderResponseDto,
    }),
    openapi.ApiResponse({ status: 201, type: require("./dto/order-response.dto").OrderResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('orders.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all orders with filters and pagination' }),
    (0, api_paginated_response_decorator_1.ApiPaginatedResponse)(order_response_dto_1.OrderResponseDto),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_filter_dto_1.OrderFilterDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, permissions_decorator_1.Permissions)('orders.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get order statistics' }),
    (0, swagger_1.ApiQuery)({ name: 'fromDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'toDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'warehouseId', required: false }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)('fromDate')),
    __param(1, (0, common_1.Query)('toDate')),
    __param(2, (0, common_1.Query)('warehouseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('search/number/:orderNumber'),
    (0, permissions_decorator_1.Permissions)('orders.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Find order by number' }),
    (0, swagger_1.ApiParam)({ name: 'orderNumber', type: 'string' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('orderNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findByNumber", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('orders.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get order by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Order found',
        type: order_response_dto_1.OrderResponseDto,
    }),
    openapi.ApiResponse({ status: 200, type: require("./dto/order-response.dto").OrderResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/payments'),
    (0, permissions_decorator_1.Permissions)('orders.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get order payments' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getPayments", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('orders.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update order (draft/pending only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200, type: require("./dto/order-response.dto").OrderResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_dto_1.UpdateOrderDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/confirm'),
    (0, permissions_decorator_1.Permissions)('orders.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm order' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/order-response.dto").OrderResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "confirm", null);
__decorate([
    (0, common_1.Post)(':id/process'),
    (0, permissions_decorator_1.Permissions)('orders.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark order as processing' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/order-response.dto").OrderResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "process", null);
__decorate([
    (0, common_1.Post)(':id/ship'),
    (0, permissions_decorator_1.Permissions)('orders.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Ship order' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/order-response.dto").OrderResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ship_order_dto_1.ShipOrderDto, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "ship", null);
__decorate([
    (0, common_1.Post)(':id/deliver'),
    (0, permissions_decorator_1.Permissions)('orders.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark order as delivered' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/order-response.dto").OrderResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "deliver", null);
__decorate([
    (0, common_1.Post)(':id/complete'),
    (0, permissions_decorator_1.Permissions)('orders.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Complete order' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/order-response.dto").OrderResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "complete", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, permissions_decorator_1.Permissions)('orders.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel order' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/order-response.dto").OrderResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('reason')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "cancel", null);
__decorate([
    (0, common_1.Post)(':id/payments'),
    (0, permissions_decorator_1.Permissions)('orders.payment'),
    (0, swagger_1.ApiOperation)({ summary: 'Add payment to order' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/order-response.dto").OrderResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_payment_dto_1.AddPaymentDto, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "addPayment", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('orders.delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete order (draft only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "remove", null);
exports.OrdersController = OrdersController = __decorate([
    (0, swagger_1.ApiTags)('Sales Orders'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map