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
exports.CollectionsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const collections_service_1 = require("./collections.service");
const create_collection_dto_1 = require("./dto/create-collection.dto");
let CollectionsController = class CollectionsController {
    collectionsService;
    constructor(collectionsService) {
        this.collectionsService = collectionsService;
    }
    async create(dto, user) {
        return this.collectionsService.create(dto, user.sub);
    }
    async findAll(filterDto) {
        return this.collectionsService.findAll(filterDto);
    }
    async findOne(id) {
        return this.collectionsService.findById(id);
    }
    async confirm(id, user) {
        return this.collectionsService.confirm(id, user.sub);
    }
    async deposit(id, dto, user) {
        return this.collectionsService.deposit(id, dto, user.sub);
    }
    async bounce(id, dto, user) {
        return this.collectionsService.bounce(id, dto, user.sub);
    }
    async allocate(id, dto, user) {
        return this.collectionsService.allocate(id, dto, user.sub);
    }
    async cancel(id, reason, user) {
        return this.collectionsService.cancel(id, reason, user.sub);
    }
};
exports.CollectionsController = CollectionsController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('collections.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create collection (with optional allocation)' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/dueManagement/customer-due-collection.entity").CustomerDueCollection }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_collection_dto_1.CreateCollectionDto, Object]),
    __metadata("design:returntype", Promise)
], CollectionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('collections.read'),
    (0, swagger_1.ApiOperation)({ summary: 'List collections with filters' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_collection_dto_1.CollectionFilterDto]),
    __metadata("design:returntype", Promise)
], CollectionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('collections.read'),
    (0, swagger_1.ApiParam)({ name: 'id', format: 'uuid' }),
    openapi.ApiResponse({ status: 200, type: require("../../../entities/tenant/dueManagement/customer-due-collection.entity").CustomerDueCollection }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CollectionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/confirm'),
    (0, permissions_decorator_1.Permissions)('collections.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm collection (for cheque payments)' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/dueManagement/customer-due-collection.entity").CustomerDueCollection }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CollectionsController.prototype, "confirm", null);
__decorate([
    (0, common_1.Post)(':id/deposit'),
    (0, permissions_decorator_1.Permissions)('collections.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Deposit cheque to bank' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/dueManagement/customer-due-collection.entity").CustomerDueCollection }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_collection_dto_1.DepositDto, Object]),
    __metadata("design:returntype", Promise)
], CollectionsController.prototype, "deposit", null);
__decorate([
    (0, common_1.Post)(':id/bounce'),
    (0, permissions_decorator_1.Permissions)('collections.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Cheque bounce — reverses all allocations' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/dueManagement/customer-due-collection.entity").CustomerDueCollection }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_collection_dto_1.BounceDto, Object]),
    __metadata("design:returntype", Promise)
], CollectionsController.prototype, "bounce", null);
__decorate([
    (0, common_1.Post)(':id/allocate'),
    (0, permissions_decorator_1.Permissions)('collections.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Allocate unallocated amount to dues' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/dueManagement/customer-due-collection.entity").CustomerDueCollection }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_collection_dto_1.AllocateCollectionDto, Object]),
    __metadata("design:returntype", Promise)
], CollectionsController.prototype, "allocate", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, permissions_decorator_1.Permissions)('collections.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel collection (draft/pending only)' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/dueManagement/customer-due-collection.entity").CustomerDueCollection }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('reason')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CollectionsController.prototype, "cancel", null);
exports.CollectionsController = CollectionsController = __decorate([
    (0, swagger_1.ApiTags)('Collections'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('collections'),
    __metadata("design:paramtypes", [collections_service_1.CollectionsService])
], CollectionsController);
//# sourceMappingURL=collections.controller.js.map