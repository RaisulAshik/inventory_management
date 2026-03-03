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
exports.GrnController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const grn_service_1 = require("./grn.service");
const pagination_dto_1 = require("../../../common/dto/pagination.dto");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const api_paginated_response_decorator_1 = require("../../../common/decorators/api-paginated-response.decorator");
const create_grn_dto_1 = require("./dto/create-grn.dto");
const grn_filter_dto_1 = require("./dto/grn-filter.dto");
const grn_response_dto_1 = require("./dto/grn-response.dto");
const update_grn_dto_1 = require("./dto/update-grn.dto");
let GrnController = class GrnController {
    grnService;
    constructor(grnService) {
        this.grnService = grnService;
    }
    async create(createDto, currentUser) {
        const grn = await this.grnService.create(createDto, currentUser.sub);
        return new grn_response_dto_1.GrnResponseDto(grn);
    }
    async findAll(paginationDto, filterDto) {
        const result = await this.grnService.findAll(paginationDto, filterDto);
        return {
            data: result.data.map((grn) => new grn_response_dto_1.GrnResponseDto(grn)),
            meta: result.meta,
        };
    }
    async getGrnsForPurchaseOrder(poId) {
        const grns = await this.grnService.getGrnsForPurchaseOrder(poId);
        return { data: grns.map((grn) => new grn_response_dto_1.GrnResponseDto(grn)) };
    }
    async findOne(id) {
        const grn = await this.grnService.findById(id);
        return new grn_response_dto_1.GrnResponseDto(grn);
    }
    async update(id, updateDto) {
        const grn = await this.grnService.update(id, updateDto);
        return new grn_response_dto_1.GrnResponseDto(grn);
    }
    async submitForApproval(id) {
        const grn = await this.grnService.submitForApproval(id);
        return new grn_response_dto_1.GrnResponseDto(grn);
    }
    async completeQc(id, currentUser) {
        const grn = await this.grnService.completeQc(id, currentUser.sub);
        return new grn_response_dto_1.GrnResponseDto(grn);
    }
    async approve(id, currentUser) {
        const grn = await this.grnService.approve(id, currentUser.sub);
        return new grn_response_dto_1.GrnResponseDto(grn);
    }
    async cancel(id, reason, currentUser) {
        const grn = await this.grnService.cancel(id, currentUser.sub, reason);
        return new grn_response_dto_1.GrnResponseDto(grn);
    }
    async remove(id) {
        await this.grnService.remove(id);
    }
};
exports.GrnController = GrnController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('grn.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new GRN' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'GRN created successfully',
        type: grn_response_dto_1.GrnResponseDto,
    }),
    openapi.ApiResponse({ status: 201, type: require("./dto/grn-response.dto").GrnResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_grn_dto_1.CreateGrnDto, Object]),
    __metadata("design:returntype", Promise)
], GrnController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('grn.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all GRNs with filters and pagination' }),
    (0, api_paginated_response_decorator_1.ApiPaginatedResponse)(grn_response_dto_1.GrnResponseDto),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto,
        grn_filter_dto_1.GrnFilterDto]),
    __metadata("design:returntype", Promise)
], GrnController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('purchase-order/:poId'),
    (0, permissions_decorator_1.Permissions)('grn.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get GRNs for a purchase order' }),
    (0, swagger_1.ApiParam)({ name: 'poId', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('poId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GrnController.prototype, "getGrnsForPurchaseOrder", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('grn.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get GRN by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'GRN found',
        type: grn_response_dto_1.GrnResponseDto,
    }),
    openapi.ApiResponse({ status: 200, type: require("./dto/grn-response.dto").GrnResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GrnController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('grn.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update GRN (draft only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200, type: require("./dto/grn-response.dto").GrnResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_grn_dto_1.UpdateGrnDto]),
    __metadata("design:returntype", Promise)
], GrnController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/submit'),
    (0, permissions_decorator_1.Permissions)('grn.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit GRN for QC/approval' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/grn-response.dto").GrnResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GrnController.prototype, "submitForApproval", null);
__decorate([
    (0, common_1.Post)(':id/complete-qc'),
    (0, permissions_decorator_1.Permissions)('grn.qc'),
    (0, swagger_1.ApiOperation)({ summary: 'Complete quality check' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/grn-response.dto").GrnResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GrnController.prototype, "completeQc", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, permissions_decorator_1.Permissions)('grn.approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve GRN and update stock' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/grn-response.dto").GrnResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GrnController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, permissions_decorator_1.Permissions)('grn.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel GRN' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/grn-response.dto").GrnResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('reason')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], GrnController.prototype, "cancel", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('grn.delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete GRN (draft only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GrnController.prototype, "remove", null);
exports.GrnController = GrnController = __decorate([
    (0, swagger_1.ApiTags)('Goods Receipt Notes'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('grn'),
    __metadata("design:paramtypes", [grn_service_1.GrnService])
], GrnController);
//# sourceMappingURL=grn.controller.js.map