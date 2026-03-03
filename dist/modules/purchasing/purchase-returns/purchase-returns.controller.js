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
exports.PurchaseReturnsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const purchase_returns_service_1 = require("./purchase-returns.service");
const pagination_dto_1 = require("../../../common/dto/pagination.dto");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const api_paginated_response_decorator_1 = require("../../../common/decorators/api-paginated-response.decorator");
const create_purchase_return_dto_1 = require("./dto/create-purchase-return.dto");
const process_credit_note_dto_1 = require("./dto/process-credit-note.dto");
const purchase_return_filter_dto_1 = require("./dto/purchase-return-filter.dto");
const purchase_return_response_dto_1 = require("./dto/purchase-return-response.dto");
const update_purchase_return_dto_1 = require("./dto/update-purchase-return.dto");
let PurchaseReturnsController = class PurchaseReturnsController {
    purchaseReturnsService;
    constructor(purchaseReturnsService) {
        this.purchaseReturnsService = purchaseReturnsService;
    }
    async create(createDto, currentUser) {
        const purchaseReturn = await this.purchaseReturnsService.create(createDto, currentUser.sub);
        return new purchase_return_response_dto_1.PurchaseReturnResponseDto(purchaseReturn);
    }
    async findAll(paginationDto, filterDto) {
        const result = await this.purchaseReturnsService.findAll(paginationDto, filterDto);
        return {
            data: result.data.map((r) => new purchase_return_response_dto_1.PurchaseReturnResponseDto(r)),
            meta: result.meta,
        };
    }
    async findOne(id) {
        const purchaseReturn = await this.purchaseReturnsService.findById(id);
        return new purchase_return_response_dto_1.PurchaseReturnResponseDto(purchaseReturn);
    }
    async update(id, updateDto) {
        const purchaseReturn = await this.purchaseReturnsService.update(id, updateDto);
        return new purchase_return_response_dto_1.PurchaseReturnResponseDto(purchaseReturn);
    }
    async submitForApproval(id) {
        const purchaseReturn = await this.purchaseReturnsService.submitForApproval(id);
        return new purchase_return_response_dto_1.PurchaseReturnResponseDto(purchaseReturn);
    }
    async approve(id, currentUser) {
        const purchaseReturn = await this.purchaseReturnsService.approve(id, currentUser.sub);
        return new purchase_return_response_dto_1.PurchaseReturnResponseDto(purchaseReturn);
    }
    async reject(id, reason, currentUser) {
        const purchaseReturn = await this.purchaseReturnsService.reject(id, currentUser.sub, reason);
        return new purchase_return_response_dto_1.PurchaseReturnResponseDto(purchaseReturn);
    }
    async ship(id, trackingNumber, currentUser) {
        const purchaseReturn = await this.purchaseReturnsService.ship(id, currentUser.sub, trackingNumber);
        return new purchase_return_response_dto_1.PurchaseReturnResponseDto(purchaseReturn);
    }
    async confirmReceipt(id) {
        const purchaseReturn = await this.purchaseReturnsService.confirmReceipt(id);
        return new purchase_return_response_dto_1.PurchaseReturnResponseDto(purchaseReturn);
    }
    async processCreditNote(id, creditNoteDto, currentUser) {
        const purchaseReturn = await this.purchaseReturnsService.processCreditNote(id, creditNoteDto.creditNoteNumber, creditNoteDto.creditAmount, currentUser.sub);
        return new purchase_return_response_dto_1.PurchaseReturnResponseDto(purchaseReturn);
    }
    async complete(id) {
        const purchaseReturn = await this.purchaseReturnsService.complete(id);
        return new purchase_return_response_dto_1.PurchaseReturnResponseDto(purchaseReturn);
    }
    async cancel(id, reason, currentUser) {
        const purchaseReturn = await this.purchaseReturnsService.cancel(id, currentUser.sub, reason);
        return new purchase_return_response_dto_1.PurchaseReturnResponseDto(purchaseReturn);
    }
    async remove(id) {
        await this.purchaseReturnsService.remove(id);
    }
};
exports.PurchaseReturnsController = PurchaseReturnsController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('purchase-returns.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new purchase return' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Purchase return created successfully',
        type: purchase_return_response_dto_1.PurchaseReturnResponseDto,
    }),
    openapi.ApiResponse({ status: 201, type: require("./dto/purchase-return-response.dto").PurchaseReturnResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_purchase_return_dto_1.CreatePurchaseReturnDto, Object]),
    __metadata("design:returntype", Promise)
], PurchaseReturnsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('purchase-returns.read'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all purchase returns with filters and pagination',
    }),
    (0, api_paginated_response_decorator_1.ApiPaginatedResponse)(purchase_return_response_dto_1.PurchaseReturnResponseDto),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto,
        purchase_return_filter_dto_1.PurchaseReturnFilterDto]),
    __metadata("design:returntype", Promise)
], PurchaseReturnsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('purchase-returns.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get purchase return by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Purchase return found',
        type: purchase_return_response_dto_1.PurchaseReturnResponseDto,
    }),
    openapi.ApiResponse({ status: 200, type: require("./dto/purchase-return-response.dto").PurchaseReturnResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PurchaseReturnsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('purchase-returns.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update purchase return (draft only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200, type: require("./dto/purchase-return-response.dto").PurchaseReturnResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_purchase_return_dto_1.UpdatePurchaseReturnDto]),
    __metadata("design:returntype", Promise)
], PurchaseReturnsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/submit'),
    (0, permissions_decorator_1.Permissions)('purchase-returns.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit purchase return for approval' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/purchase-return-response.dto").PurchaseReturnResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PurchaseReturnsController.prototype, "submitForApproval", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, permissions_decorator_1.Permissions)('purchase-returns.approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve purchase return' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/purchase-return-response.dto").PurchaseReturnResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PurchaseReturnsController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, permissions_decorator_1.Permissions)('purchase-returns.approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject purchase return' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/purchase-return-response.dto").PurchaseReturnResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('reason')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PurchaseReturnsController.prototype, "reject", null);
__decorate([
    (0, common_1.Post)(':id/ship'),
    (0, permissions_decorator_1.Permissions)('purchase-returns.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Ship return to supplier' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/purchase-return-response.dto").PurchaseReturnResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('trackingNumber')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PurchaseReturnsController.prototype, "ship", null);
__decorate([
    (0, common_1.Post)(':id/confirm-receipt'),
    (0, permissions_decorator_1.Permissions)('purchase-returns.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm supplier received the return' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/purchase-return-response.dto").PurchaseReturnResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PurchaseReturnsController.prototype, "confirmReceipt", null);
__decorate([
    (0, common_1.Post)(':id/credit-note'),
    (0, permissions_decorator_1.Permissions)('purchase-returns.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Process credit note from supplier' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/purchase-return-response.dto").PurchaseReturnResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, process_credit_note_dto_1.ProcessCreditNoteDto, Object]),
    __metadata("design:returntype", Promise)
], PurchaseReturnsController.prototype, "processCreditNote", null);
__decorate([
    (0, common_1.Post)(':id/complete'),
    (0, permissions_decorator_1.Permissions)('purchase-returns.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Complete purchase return' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/purchase-return-response.dto").PurchaseReturnResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PurchaseReturnsController.prototype, "complete", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, permissions_decorator_1.Permissions)('purchase-returns.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel purchase return' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/purchase-return-response.dto").PurchaseReturnResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('reason')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PurchaseReturnsController.prototype, "cancel", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('purchase-returns.delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete purchase return (draft only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PurchaseReturnsController.prototype, "remove", null);
exports.PurchaseReturnsController = PurchaseReturnsController = __decorate([
    (0, swagger_1.ApiTags)('Purchase Returns'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('purchase-returns'),
    __metadata("design:paramtypes", [purchase_returns_service_1.PurchaseReturnsService])
], PurchaseReturnsController);
//# sourceMappingURL=purchase-returns.controller.js.map