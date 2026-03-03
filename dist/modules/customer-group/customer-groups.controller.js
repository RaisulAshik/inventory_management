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
exports.CustomerGroupsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const customer_groups_service_1 = require("./customer-groups.service");
const create_customer_group_dto_1 = require("./dto/create-customer-group.dto");
const update_customer_group_dto_1 = require("./dto/update-customer-group.dto");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const assign_customers_dto_1 = require("./dto/assign-customers.dto");
let CustomerGroupsController = class CustomerGroupsController {
    customerGroupsService;
    constructor(customerGroupsService) {
        this.customerGroupsService = customerGroupsService;
    }
    async create(createDto, userId) {
        return this.customerGroupsService.create(createDto, userId);
    }
    async findAll(paginationDto) {
        return this.customerGroupsService.findAll(paginationDto);
    }
    async findAllSimple() {
        return this.customerGroupsService.findAllSimple();
    }
    async getStatistics() {
        return this.customerGroupsService.getStatistics();
    }
    async findDefault() {
        const defaultGroup = await this.customerGroupsService.findDefault();
        return { data: defaultGroup };
    }
    async findOne(id) {
        return this.customerGroupsService.findOne(id);
    }
    async findByCode(code) {
        return this.customerGroupsService.findByCode(code);
    }
    async update(id, updateDto, userId) {
        return this.customerGroupsService.update(id, updateDto, userId);
    }
    async remove(id) {
        return this.customerGroupsService.remove(id);
    }
    async getCustomersInGroup(id, paginationDto) {
        return this.customerGroupsService.getCustomersInGroup(id, paginationDto);
    }
    async getCustomerCount(id) {
        const count = await this.customerGroupsService.getCustomerCountByGroup(id);
        return { count };
    }
    async assignCustomers(id, assignDto) {
        return this.customerGroupsService.assignCustomersToGroup(id, assignDto.customerIds);
    }
};
exports.CustomerGroupsController = CustomerGroupsController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('customer_groups.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new customer group' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Customer group created successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Group code already exists' }),
    openapi.ApiResponse({ status: 201, type: require("../../entities/tenant/eCommerce/customer-group.entity").CustomerGroup }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_customer_group_dto_1.CreateCustomerGroupDto, String]),
    __metadata("design:returntype", Promise)
], CustomerGroupsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('customer_groups.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all customer groups with pagination' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Customer groups retrieved successfully',
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] }),
    (0, swagger_1.ApiQuery)({ name: 'isActive', required: false, type: Boolean }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], CustomerGroupsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('list'),
    (0, permissions_decorator_1.Permissions)('customer_groups.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active customer groups (for dropdowns)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Customer groups list retrieved' }),
    openapi.ApiResponse({ status: 200, type: [require("../../entities/tenant/eCommerce/customer-group.entity").CustomerGroup] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomerGroupsController.prototype, "findAllSimple", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, permissions_decorator_1.Permissions)('customer_groups.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer groups statistics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Statistics retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomerGroupsController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('default'),
    (0, permissions_decorator_1.Permissions)('customer_groups.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get default customer group' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Default group retrieved' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomerGroupsController.prototype, "findDefault", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('customer_groups.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer group by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Customer group ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Customer group retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Customer group not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../entities/tenant/eCommerce/customer-group.entity").CustomerGroup }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerGroupsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('code/:code'),
    (0, permissions_decorator_1.Permissions)('customer_groups.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer group by code' }),
    (0, swagger_1.ApiParam)({
        name: 'code',
        description: 'Customer group code',
        example: 'RETAIL',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Customer group retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Customer group not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../entities/tenant/eCommerce/customer-group.entity").CustomerGroup }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerGroupsController.prototype, "findByCode", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.Permissions)('customer_groups.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update customer group' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Customer group ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Customer group updated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Customer group not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Group code already exists' }),
    openapi.ApiResponse({ status: 200, type: require("../../entities/tenant/eCommerce/customer-group.entity").CustomerGroup }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_customer_group_dto_1.UpdateCustomerGroupDto, String]),
    __metadata("design:returntype", Promise)
], CustomerGroupsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('customer_groups.delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete customer group (soft delete)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Customer group ID' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Customer group deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Cannot delete - customers assigned',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Customer group not found' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerGroupsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/customers'),
    (0, permissions_decorator_1.Permissions)('customer_groups.read', 'customers.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customers in a group' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Customer group ID' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Customers retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Customer group not found' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], CustomerGroupsController.prototype, "getCustomersInGroup", null);
__decorate([
    (0, common_1.Get)(':id/customers/count'),
    (0, permissions_decorator_1.Permissions)('customer_groups.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer count in a group' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Customer group ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Count retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerGroupsController.prototype, "getCustomerCount", null);
__decorate([
    (0, common_1.Post)(':id/customers'),
    (0, permissions_decorator_1.Permissions)('customer_groups.update', 'customers.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign customers to a group' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Customer group ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Customers assigned successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Customer group not found' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assign_customers_dto_1.AssignCustomersDto]),
    __metadata("design:returntype", Promise)
], CustomerGroupsController.prototype, "assignCustomers", null);
exports.CustomerGroupsController = CustomerGroupsController = __decorate([
    (0, swagger_1.ApiTags)('Customer Groups'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('customer-groups'),
    __metadata("design:paramtypes", [customer_groups_service_1.CustomerGroupsService])
], CustomerGroupsController);
//# sourceMappingURL=customer-groups.controller.js.map