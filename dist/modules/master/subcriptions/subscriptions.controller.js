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
exports.SubscriptionsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const subscriptions_service_1 = require("./subscriptions.service");
const pagination_dto_1 = require("../../../common/dto/pagination.dto");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const api_paginated_response_decorator_1 = require("../../../common/decorators/api-paginated-response.decorator");
const create_subscription_dto_1 = require("./dto/create-subscription.dto");
const subscription_response_dto_1 = require("./dto/subscription-response.dto");
const update_subscription_dto_1 = require("./dto/update-subscription.dto");
let SubscriptionsController = class SubscriptionsController {
    subscriptionsService;
    constructor(subscriptionsService) {
        this.subscriptionsService = subscriptionsService;
    }
    async create(createDto) {
        const subscription = await this.subscriptionsService.create(createDto);
        return new subscription_response_dto_1.SubscriptionResponseDto(subscription);
    }
    async findAll(paginationDto) {
        const result = await this.subscriptionsService.findAll(paginationDto);
        return {
            data: result.data.map((s) => new subscription_response_dto_1.SubscriptionResponseDto(s)),
            meta: result.meta,
        };
    }
    async findByTenantId(tenantId) {
        const subscription = await this.subscriptionsService.findByTenantId(tenantId);
        return {
            data: subscription ? new subscription_response_dto_1.SubscriptionResponseDto(subscription) : null,
        };
    }
    async getBillingHistory(tenantId) {
        const history = await this.subscriptionsService.getBillingHistory(tenantId);
        return { data: history };
    }
    async findOne(id) {
        const subscription = await this.subscriptionsService.findById(id);
        return new subscription_response_dto_1.SubscriptionResponseDto(subscription);
    }
    async update(id, updateDto) {
        const subscription = await this.subscriptionsService.update(id, updateDto);
        return new subscription_response_dto_1.SubscriptionResponseDto(subscription);
    }
    async changePlan(id, dto) {
        const subscription = await this.subscriptionsService.changePlan(id, dto.newPlanId, dto.billingCycle);
        return new subscription_response_dto_1.SubscriptionResponseDto(subscription);
    }
    async cancel(id, cancelImmediately = false) {
        const subscription = await this.subscriptionsService.cancel(id, cancelImmediately);
        return new subscription_response_dto_1.SubscriptionResponseDto(subscription);
    }
    async reactivate(id) {
        const subscription = await this.subscriptionsService.reactivate(id);
        return new subscription_response_dto_1.SubscriptionResponseDto(subscription);
    }
    async renew(id) {
        const subscription = await this.subscriptionsService.renew(id);
        return new subscription_response_dto_1.SubscriptionResponseDto(subscription);
    }
};
exports.SubscriptionsController = SubscriptionsController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('master.subscriptions.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new subscription' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Subscription created successfully',
        type: subscription_response_dto_1.SubscriptionResponseDto,
    }),
    openapi.ApiResponse({ status: 201, type: require("./dto/subscription-response.dto").SubscriptionResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_subscription_dto_1.CreateSubscriptionDto]),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('master.subscriptions.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all subscriptions with pagination' }),
    (0, api_paginated_response_decorator_1.ApiPaginatedResponse)(subscription_response_dto_1.SubscriptionResponseDto),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('tenant/:tenantId'),
    (0, permissions_decorator_1.Permissions)('master.subscriptions.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get subscription by tenant ID' }),
    (0, swagger_1.ApiParam)({ name: 'tenantId', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('tenantId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "findByTenantId", null);
__decorate([
    (0, common_1.Get)('tenant/:tenantId/billing'),
    (0, permissions_decorator_1.Permissions)('master.subscriptions.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get billing history for a tenant' }),
    (0, swagger_1.ApiParam)({ name: 'tenantId', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('tenantId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "getBillingHistory", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('master.subscriptions.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get subscription by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Subscription found',
        type: subscription_response_dto_1.SubscriptionResponseDto,
    }),
    openapi.ApiResponse({ status: 200, type: require("./dto/subscription-response.dto").SubscriptionResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('master.subscriptions.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update subscription' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200, type: require("./dto/subscription-response.dto").SubscriptionResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_subscription_dto_1.UpdateSubscriptionDto]),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/change-plan'),
    openapi.ApiResponse({ status: 200, type: require("./dto/subscription-response.dto").SubscriptionResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_subscription_dto_1.ChangePlanDto]),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "changePlan", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, permissions_decorator_1.Permissions)('master.subscriptions.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel subscription' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/subscription-response.dto").SubscriptionResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('cancelImmediately')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "cancel", null);
__decorate([
    (0, common_1.Post)(':id/reactivate'),
    (0, permissions_decorator_1.Permissions)('master.subscriptions.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Reactivate subscription' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/subscription-response.dto").SubscriptionResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "reactivate", null);
__decorate([
    (0, common_1.Post)(':id/renew'),
    (0, permissions_decorator_1.Permissions)('master.subscriptions.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Renew subscription' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/subscription-response.dto").SubscriptionResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "renew", null);
exports.SubscriptionsController = SubscriptionsController = __decorate([
    (0, swagger_1.ApiTags)('Subscriptions (Master)'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('master/subscriptions'),
    __metadata("design:paramtypes", [subscriptions_service_1.SubscriptionsService])
], SubscriptionsController);
//# sourceMappingURL=subscriptions.controller.js.map