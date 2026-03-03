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
exports.TenantsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tenants_service_1 = require("./tenants.service");
const create_tenant_dto_1 = require("./dto/create-tenant.dto");
const update_tenant_dto_1 = require("./dto/update-tenant.dto");
const tenant_filter_dto_1 = require("./dto/tenant-filter.dto");
const add_tenant_user_dto_1 = require("./dto/add-tenant-user.dto");
const tenant_response_dto_1 = require("./dto/tenant-response.dto");
const pagination_dto_1 = require("../../../common/dto/pagination.dto");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const api_paginated_response_decorator_1 = require("../../../common/decorators/api-paginated-response.decorator");
let TenantsController = class TenantsController {
    tenantsService;
    constructor(tenantsService) {
        this.tenantsService = tenantsService;
    }
    async create(createTenantDto) {
        const tenant = await this.tenantsService.create(createTenantDto);
        return new tenant_response_dto_1.TenantResponseDto(tenant);
    }
    async findAll(paginationDto, filterDto) {
        const result = await this.tenantsService.findAll(paginationDto, filterDto);
        return {
            data: result.data.map((t) => new tenant_response_dto_1.TenantResponseDto(t)),
            meta: result.meta,
        };
    }
    async getStatistics() {
        return this.tenantsService.getStatistics();
    }
    async findByCode(code) {
        const tenant = await this.tenantsService.findByCode(code);
        return { data: tenant ? new tenant_response_dto_1.TenantResponseDto(tenant) : null };
    }
    async findOne(id) {
        const tenant = await this.tenantsService.findById(id);
        return new tenant_response_dto_1.TenantResponseDto(tenant);
    }
    async getUsers(id) {
        const users = await this.tenantsService.getUsers(id);
        return { data: users };
    }
    async update(id, updateTenantDto) {
        const tenant = await this.tenantsService.update(id, updateTenantDto);
        return new tenant_response_dto_1.TenantResponseDto(tenant);
    }
    async provisionDatabase(id) {
        await this.tenantsService.provisionDatabase(id);
        return { message: 'Database provisioned successfully' };
    }
    async activate(id) {
        const tenant = await this.tenantsService.activate(id);
        return new tenant_response_dto_1.TenantResponseDto(tenant);
    }
    async suspend(id, reason) {
        const tenant = await this.tenantsService.suspend(id, reason);
        return new tenant_response_dto_1.TenantResponseDto(tenant);
    }
    async reactivate(id) {
        const tenant = await this.tenantsService.reactivate(id);
        return new tenant_response_dto_1.TenantResponseDto(tenant);
    }
    async addUser(id, userDto) {
        const user = await this.tenantsService.addUser(id, userDto);
        return user;
    }
    async remove(id) {
        await this.tenantsService.remove(id);
    }
};
exports.TenantsController = TenantsController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('master.tenants.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new tenant' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Tenant created successfully',
        type: tenant_response_dto_1.TenantResponseDto,
    }),
    openapi.ApiResponse({ status: 201, type: require("./dto/tenant-response.dto").TenantResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tenant_dto_1.CreateTenantDto]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('master.tenants.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all tenants with filters and pagination' }),
    (0, api_paginated_response_decorator_1.ApiPaginatedResponse)(tenant_response_dto_1.TenantResponseDto),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto,
        tenant_filter_dto_1.TenantFilterDto]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, permissions_decorator_1.Permissions)('master.tenants.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get tenant statistics' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('search/code/:code'),
    (0, permissions_decorator_1.Permissions)('master.tenants.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Find tenant by code' }),
    (0, swagger_1.ApiParam)({ name: 'code', type: 'string' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "findByCode", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('master.tenants.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get tenant by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Tenant found',
        type: tenant_response_dto_1.TenantResponseDto,
    }),
    openapi.ApiResponse({ status: 200, type: require("./dto/tenant-response.dto").TenantResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/users'),
    (0, permissions_decorator_1.Permissions)('master.tenants.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get tenant users' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('master.tenants.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update tenant' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200, type: require("./dto/tenant-response.dto").TenantResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_tenant_dto_1.UpdateTenantDto]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/provision'),
    (0, permissions_decorator_1.Permissions)('master.tenants.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Provision tenant database' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "provisionDatabase", null);
__decorate([
    (0, common_1.Post)(':id/activate'),
    (0, permissions_decorator_1.Permissions)('master.tenants.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Activate tenant' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/tenant-response.dto").TenantResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "activate", null);
__decorate([
    (0, common_1.Post)(':id/suspend'),
    (0, permissions_decorator_1.Permissions)('master.tenants.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Suspend tenant' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/tenant-response.dto").TenantResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "suspend", null);
__decorate([
    (0, common_1.Post)(':id/reactivate'),
    (0, permissions_decorator_1.Permissions)('master.tenants.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Reactivate suspended tenant' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/tenant-response.dto").TenantResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "reactivate", null);
__decorate([
    (0, common_1.Post)(':id/users'),
    (0, permissions_decorator_1.Permissions)('master.tenants.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Add user to tenant' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/master/tenant-user.entity").TenantUser }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_tenant_user_dto_1.AddTenantUserDto]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "addUser", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('master.tenants.delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete tenant (soft delete)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "remove", null);
exports.TenantsController = TenantsController = __decorate([
    (0, swagger_1.ApiTags)('Tenants (Master)'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('master/tenants'),
    __metadata("design:paramtypes", [tenants_service_1.TenantsService])
], TenantsController);
//# sourceMappingURL=tenants.controller.js.map