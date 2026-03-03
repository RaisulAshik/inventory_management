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
exports.QuotationsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const quotations_service_1 = require("./quotations.service");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const api_paginated_response_decorator_1 = require("../../common/decorators/api-paginated-response.decorator");
const create_quotation_dto_1 = require("./dto/create-quotation.dto");
const quotation_response_dto_1 = require("./dto/quotation-response.dto");
const update_quotation_dto_1 = require("./dto/update-quotation.dto");
const quotation_filter_dto_1 = require("./dto/quotation-filter.dto");
let QuotationsController = class QuotationsController {
    quotationsService;
    constructor(quotationsService) {
        this.quotationsService = quotationsService;
    }
    async create(createDto, currentUser) {
        const quotation = await this.quotationsService.create(createDto, currentUser.sub);
        return new quotation_response_dto_1.QuotationResponseDto(quotation);
    }
    async findAll(filterDto) {
        const result = await this.quotationsService.findAll(filterDto);
        return {
            data: result.data.map((q) => new quotation_response_dto_1.QuotationResponseDto(q)),
            meta: result.meta,
        };
    }
    async findByNumber(quotationNumber) {
        const quotation = await this.quotationsService.findByNumber(quotationNumber);
        return { data: quotation ? new quotation_response_dto_1.QuotationResponseDto(quotation) : null };
    }
    async findOne(id) {
        const quotation = await this.quotationsService.findOne(id);
        return new quotation_response_dto_1.QuotationDetailResponseDto(quotation);
    }
    async update(id, updateDto) {
        const quotation = await this.quotationsService.update(id, updateDto);
        return new quotation_response_dto_1.QuotationResponseDto(quotation);
    }
    async remove(id) {
        await this.quotationsService.remove(id);
    }
    async send(id, sendId, currentUser) {
        const quotation = await this.quotationsService.send(id, currentUser.sub);
        return new quotation_response_dto_1.QuotationResponseDto(quotation);
    }
    async accept(id, acceptId, currentUser) {
        const quotation = await this.quotationsService.accept(id, currentUser.sub);
        return new quotation_response_dto_1.QuotationResponseDto(quotation);
    }
    async reject(id, reason, currentUser) {
        const quotation = await this.quotationsService.reject(id, currentUser.sub, reason);
        return new quotation_response_dto_1.QuotationResponseDto(quotation);
    }
    async cancel(id, reason, currentUser) {
        const quotation = await this.quotationsService.cancel(id, currentUser.sub, reason);
        return new quotation_response_dto_1.QuotationResponseDto(quotation);
    }
    async convertToSalesOrder(id, orderId, currentUser) {
        const result = await this.quotationsService.convertToSalesOrder(id, currentUser.sub);
        return {
            message: `Quotation converted to Sales Order ${result.salesOrder.orderNumber}`,
            quotation: new quotation_response_dto_1.QuotationResponseDto(result.quotation),
            salesOrder: {
                id: result.salesOrder.id,
                orderNumber: result.salesOrder.orderNumber,
                status: result.salesOrder.status,
                totalAmount: result.salesOrder.totalAmount,
            },
        };
    }
};
exports.QuotationsController = QuotationsController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('quotations.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new quotation' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Quotation created',
        type: quotation_response_dto_1.QuotationResponseDto,
    }),
    openapi.ApiResponse({ status: 201, type: require("./dto/quotation-response.dto").QuotationResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_quotation_dto_1.CreateQuotationDto, Object]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('quotations.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all quotations with filters and pagination' }),
    (0, api_paginated_response_decorator_1.ApiPaginatedResponse)(quotation_response_dto_1.QuotationResponseDto),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [quotation_filter_dto_1.QuotationFilterDto]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('search/number/:quotationNumber'),
    (0, permissions_decorator_1.Permissions)('quotations.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Find quotation by number' }),
    (0, swagger_1.ApiParam)({ name: 'quotationNumber', type: 'string' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('quotationNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "findByNumber", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('quotations.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get quotation by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: quotation_response_dto_1.QuotationDetailResponseDto }),
    openapi.ApiResponse({ status: 200, type: require("./dto/quotation-response.dto").QuotationDetailResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('quotations.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update quotation (DRAFT only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200, type: require("./dto/quotation-response.dto").QuotationResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_quotation_dto_1.UpdateQuotationDto]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('quotations.delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete quotation (DRAFT only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/send'),
    (0, permissions_decorator_1.Permissions)('quotations.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Send quotation to customer (DRAFT → SENT)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/quotation-response.dto").QuotationResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('sendId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "send", null);
__decorate([
    (0, common_1.Post)(':id/accept'),
    (0, permissions_decorator_1.Permissions)('quotations.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark quotation as accepted (SENT → ACCEPTED)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/quotation-response.dto").QuotationResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('acceptId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "accept", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, permissions_decorator_1.Permissions)('quotations.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject quotation' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/quotation-response.dto").QuotationResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('reason')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "reject", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, permissions_decorator_1.Permissions)('quotations.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel quotation' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/quotation-response.dto").QuotationResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('reason')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "cancel", null);
__decorate([
    (0, common_1.Post)(':id/convert-to-sales-order'),
    (0, permissions_decorator_1.Permissions)('quotations.update', 'sales_orders.create'),
    (0, swagger_1.ApiOperation)({
        summary: 'Convert quotation to Sales Order',
        description: 'Creates a new Sales Order (DRAFT) from the quotation data, copies all items, and marks the quotation as CONVERTED.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Sales Order created from quotation',
        schema: {
            properties: {
                quotation: {
                    type: 'object',
                    description: 'Updated quotation with CONVERTED status',
                },
                salesOrder: {
                    type: 'object',
                    description: 'Newly created Sales Order',
                },
            },
        },
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('orderId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "convertToSalesOrder", null);
exports.QuotationsController = QuotationsController = __decorate([
    (0, swagger_1.ApiTags)('Quotations'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('quotations'),
    __metadata("design:paramtypes", [quotations_service_1.QuotationsService])
], QuotationsController);
//# sourceMappingURL=quotations.controller.js.map