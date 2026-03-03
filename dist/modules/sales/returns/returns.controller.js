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
exports.ReturnsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const returns_service_1 = require("./returns.service");
const pagination_dto_1 = require("../../../common/dto/pagination.dto");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const api_paginated_response_decorator_1 = require("../../../common/decorators/api-paginated-response.decorator");
const create_return_dto_1 = require("./dto/create-return.dto");
const return_filter_dto_1 = require("./dto/return-filter.dto");
const return_response_dto_1 = require("./dto/return-response.dto");
const update_return_dto_1 = require("./dto/update-return.dto");
let ReturnsController = class ReturnsController {
    returnsService;
    constructor(returnsService) {
        this.returnsService = returnsService;
    }
    async create(createReturnDto, currentUser) {
        const salesReturn = await this.returnsService.create(createReturnDto, currentUser.sub);
        return new return_response_dto_1.ReturnResponseDto(salesReturn);
    }
    async findAll(paginationDto, filterDto) {
        const result = await this.returnsService.findAll(paginationDto, filterDto);
        return {
            data: result.data.map((r) => new return_response_dto_1.ReturnResponseDto(r)),
            meta: result.meta,
        };
    }
    async findOne(id) {
        const salesReturn = await this.returnsService.findById(id);
        return new return_response_dto_1.ReturnResponseDto(salesReturn);
    }
    async update(id, updateReturnDto) {
        const salesReturn = await this.returnsService.update(id, updateReturnDto);
        return new return_response_dto_1.ReturnResponseDto(salesReturn);
    }
    async approve(id, currentUser) {
        const salesReturn = await this.returnsService.approve(id, currentUser.sub);
        return new return_response_dto_1.ReturnResponseDto(salesReturn);
    }
    async receive(id, currentUser) {
        const salesReturn = await this.returnsService.receive(id, currentUser.sub);
        return new return_response_dto_1.ReturnResponseDto(salesReturn);
    }
    async processRefund(id, refundAmount, currentUser) {
        const salesReturn = await this.returnsService.processRefund(id, refundAmount, currentUser.sub);
        return new return_response_dto_1.ReturnResponseDto(salesReturn);
    }
    async complete(id) {
        const salesReturn = await this.returnsService.complete(id);
        return new return_response_dto_1.ReturnResponseDto(salesReturn);
    }
    async reject(id, reason, currentUser) {
        const salesReturn = await this.returnsService.reject(id, currentUser.sub, reason);
        return new return_response_dto_1.ReturnResponseDto(salesReturn);
    }
    async cancel(id, reason, currentUser) {
        const salesReturn = await this.returnsService.cancel(id, currentUser.sub, reason);
        return new return_response_dto_1.ReturnResponseDto(salesReturn);
    }
    async remove(id) {
        await this.returnsService.remove(id);
    }
};
exports.ReturnsController = ReturnsController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('returns.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new sales return' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Return created successfully',
        type: return_response_dto_1.ReturnResponseDto,
    }),
    openapi.ApiResponse({ status: 201, type: require("./dto/return-response.dto").ReturnResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_return_dto_1.CreateReturnDto, Object]),
    __metadata("design:returntype", Promise)
], ReturnsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('returns.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all returns with filters and pagination' }),
    (0, api_paginated_response_decorator_1.ApiPaginatedResponse)(return_response_dto_1.ReturnResponseDto),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto,
        return_filter_dto_1.ReturnFilterDto]),
    __metadata("design:returntype", Promise)
], ReturnsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('returns.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get return by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Return found',
        type: return_response_dto_1.ReturnResponseDto,
    }),
    openapi.ApiResponse({ status: 200, type: require("./dto/return-response.dto").ReturnResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReturnsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('returns.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update return (pending only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200, type: require("./dto/return-response.dto").ReturnResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_return_dto_1.UpdateReturnDto]),
    __metadata("design:returntype", Promise)
], ReturnsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, permissions_decorator_1.Permissions)('returns.approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve return' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/return-response.dto").ReturnResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReturnsController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/receive'),
    (0, permissions_decorator_1.Permissions)('returns.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Receive returned items' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/return-response.dto").ReturnResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReturnsController.prototype, "receive", null);
__decorate([
    (0, common_1.Post)(':id/refund'),
    (0, permissions_decorator_1.Permissions)('returns.refund'),
    (0, swagger_1.ApiOperation)({ summary: 'Process refund' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/return-response.dto").ReturnResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('refundAmount')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], ReturnsController.prototype, "processRefund", null);
__decorate([
    (0, common_1.Post)(':id/complete'),
    (0, permissions_decorator_1.Permissions)('returns.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Complete return' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/return-response.dto").ReturnResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReturnsController.prototype, "complete", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, permissions_decorator_1.Permissions)('returns.approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject return' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/return-response.dto").ReturnResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('reason')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ReturnsController.prototype, "reject", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, permissions_decorator_1.Permissions)('returns.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel return' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/return-response.dto").ReturnResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('reason')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ReturnsController.prototype, "cancel", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('returns.delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete return (pending only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReturnsController.prototype, "remove", null);
exports.ReturnsController = ReturnsController = __decorate([
    (0, swagger_1.ApiTags)('Sales Returns'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('returns'),
    __metadata("design:paramtypes", [returns_service_1.ReturnsService])
], ReturnsController);
//# sourceMappingURL=returns.controller.js.map