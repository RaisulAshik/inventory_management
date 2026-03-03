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
exports.CustomersController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const customers_service_1 = require("./customers.service");
const pagination_dto_1 = require("../../../common/dto/pagination.dto");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const api_paginated_response_decorator_1 = require("../../../common/decorators/api-paginated-response.decorator");
const create_customer_address_dto_1 = require("./dto/create-customer-address.dto");
const create_customer_dto_1 = require("./dto/create-customer.dto");
const customer_filter_dto_1 = require("./dto/customer-filter.dto");
const customer_response_dto_1 = require("./dto/customer-response.dto");
const update_customer_dto_1 = require("./dto/update-customer.dto");
let CustomersController = class CustomersController {
    customersService;
    constructor(customersService) {
        this.customersService = customersService;
    }
    async create(createCustomerDto, currentUser) {
        const customer = await this.customersService.create(createCustomerDto, currentUser.sub);
        return new customer_response_dto_1.CustomerResponseDto(customer);
    }
    async findAll(filterDto) {
        const result = await this.customersService.findAll(filterDto);
        return {
            data: result.data.map((c) => new customer_response_dto_1.CustomerResponseDto(c)),
            meta: result.meta,
        };
    }
    async findByEmail(email) {
        const customer = await this.customersService.findByEmail(email);
        return { data: customer ? new customer_response_dto_1.CustomerResponseDto(customer) : null };
    }
    async findByCode(code) {
        const customer = await this.customersService.findByCode(code);
        return { data: customer ? new customer_response_dto_1.CustomerResponseDto(customer) : null };
    }
    async findOne(id) {
        const customer = await this.customersService.findById(id);
        return new customer_response_dto_1.CustomerResponseDto(customer);
    }
    async getOutstandingBalance(id) {
        const balance = await this.customersService.getOutstandingBalance(id);
        return { balance };
    }
    async getDues(id) {
        const dues = await this.customersService.getDues(id);
        return { data: dues };
    }
    async getOrderHistory(id, paginationDto) {
        const result = await this.customersService.getOrderHistory(id, paginationDto);
        return result;
    }
    async getAddresses(id) {
        const addresses = await this.customersService.getAddresses(id);
        return { data: addresses };
    }
    async checkCreditLimit(id, amount) {
        const isWithinLimit = await this.customersService.checkCreditLimit(id, Number(amount));
        return { isWithinLimit };
    }
    async update(id, updateCustomerDto) {
        const customer = await this.customersService.update(id, updateCustomerDto);
        return new customer_response_dto_1.CustomerResponseDto(customer);
    }
    async updateCreditLimit(id, creditLimit) {
        const customer = await this.customersService.updateCreditLimit(id, creditLimit);
        return new customer_response_dto_1.CustomerResponseDto(customer);
    }
    async remove(id) {
        await this.customersService.remove(id);
    }
    async addAddress(id, addressDto) {
        const address = await this.customersService.addAddress(id, addressDto);
        return address;
    }
    async updateAddress(addressId, addressDto) {
        const address = await this.customersService.updateAddress(addressId, addressDto);
        return address;
    }
    async removeAddress(addressId) {
        await this.customersService.removeAddress(addressId);
    }
};
exports.CustomersController = CustomersController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('customers.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new customer' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Customer created successfully',
        type: customer_response_dto_1.CustomerResponseDto,
    }),
    openapi.ApiResponse({ status: 201, type: require("./dto/customer-response.dto").CustomerResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_customer_dto_1.CreateCustomerDto, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('customers.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all customers with filters and pagination' }),
    (0, api_paginated_response_decorator_1.ApiPaginatedResponse)(customer_response_dto_1.CustomerResponseDto),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_filter_dto_1.CustomerFilterDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('search/email/:email'),
    (0, permissions_decorator_1.Permissions)('customers.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Find customer by email' }),
    (0, swagger_1.ApiParam)({ name: 'email', type: 'string' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "findByEmail", null);
__decorate([
    (0, common_1.Get)('search/code/:code'),
    (0, permissions_decorator_1.Permissions)('customers.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Find customer by code' }),
    (0, swagger_1.ApiParam)({ name: 'code', type: 'string' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "findByCode", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('customers.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Customer found',
        type: customer_response_dto_1.CustomerResponseDto,
    }),
    openapi.ApiResponse({ status: 200, type: require("./dto/customer-response.dto").CustomerResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/balance'),
    (0, permissions_decorator_1.Permissions)('customers.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer outstanding balance' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getOutstandingBalance", null);
__decorate([
    (0, common_1.Get)(':id/dues'),
    (0, permissions_decorator_1.Permissions)('customers.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer dues' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getDues", null);
__decorate([
    (0, common_1.Get)(':id/orders'),
    (0, permissions_decorator_1.Permissions)('customers.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer order history' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getOrderHistory", null);
__decorate([
    (0, common_1.Get)(':id/addresses'),
    (0, permissions_decorator_1.Permissions)('customers.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer addresses' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getAddresses", null);
__decorate([
    (0, common_1.Get)(':id/check-credit'),
    (0, permissions_decorator_1.Permissions)('customers.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if order amount is within credit limit' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiQuery)({ name: 'amount', type: 'number' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('amount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "checkCreditLimit", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('customers.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update customer' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200, type: require("./dto/customer-response.dto").CustomerResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_customer_dto_1.UpdateCustomerDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/credit-limit'),
    (0, permissions_decorator_1.Permissions)('customers.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update customer credit limit' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200, type: require("./dto/customer-response.dto").CustomerResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('creditLimit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "updateCreditLimit", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('customers.delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete customer (soft delete)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/addresses'),
    (0, permissions_decorator_1.Permissions)('customers.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Add address to customer' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/eCommerce/customer-address.entity").CustomerAddress }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_customer_address_dto_1.CreateCustomerAddressDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "addAddress", null);
__decorate([
    (0, common_1.Patch)('addresses/:addressId'),
    (0, permissions_decorator_1.Permissions)('customers.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update customer address' }),
    (0, swagger_1.ApiParam)({ name: 'addressId', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200, type: require("../../../entities/tenant/eCommerce/customer-address.entity").CustomerAddress }),
    __param(0, (0, common_1.Param)('addressId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "updateAddress", null);
__decorate([
    (0, common_1.Delete)('addresses/:addressId'),
    (0, permissions_decorator_1.Permissions)('customers.update'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Remove customer address' }),
    (0, swagger_1.ApiParam)({ name: 'addressId', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('addressId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "removeAddress", null);
exports.CustomersController = CustomersController = __decorate([
    (0, swagger_1.ApiTags)('Customers'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('customers'),
    __metadata("design:paramtypes", [customers_service_1.CustomersService])
], CustomersController);
//# sourceMappingURL=customers.controller.js.map