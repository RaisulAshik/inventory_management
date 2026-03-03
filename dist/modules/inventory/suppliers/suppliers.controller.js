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
exports.SuppliersController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const suppliers_service_1 = require("./suppliers.service");
const pagination_dto_1 = require("../../../common/dto/pagination.dto");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const api_paginated_response_decorator_1 = require("../../../common/decorators/api-paginated-response.decorator");
const create_supplier_dto_1 = require("./dto/create-supplier.dto");
const supplier_filter_dto_1 = require("./dto/supplier-filter.dto");
const supplier_response_dto_1 = require("./dto/supplier-response.dto");
const update_supplier_dto_1 = require("./dto/update-supplier.dto");
const create_supplier_contact_dto_1 = require("./dto/create-supplier-contact.dto");
const create_supplier_product_dto_1 = require("./dto/create-supplier-product.dto");
let SuppliersController = class SuppliersController {
    suppliersService;
    constructor(suppliersService) {
        this.suppliersService = suppliersService;
    }
    async create(createSupplierDto, currentUser) {
        const supplier = await this.suppliersService.create(createSupplierDto, currentUser.sub);
        return new supplier_response_dto_1.SupplierResponseDto(supplier);
    }
    async findAll(paginationDto, filterDto) {
        const result = await this.suppliersService.findAll(paginationDto, filterDto);
        return {
            data: result.data.map((supplier) => new supplier_response_dto_1.SupplierResponseDto(supplier)),
            meta: result.meta,
        };
    }
    async findAllActive() {
        const suppliers = await this.suppliersService.findAllActive();
        return { data: suppliers.map((s) => new supplier_response_dto_1.SupplierResponseDto(s)) };
    }
    async findOne(id) {
        const supplier = await this.suppliersService.findById(id);
        return new supplier_response_dto_1.SupplierResponseDto(supplier);
    }
    async getOutstandingBalance(id) {
        const balance = await this.suppliersService.getOutstandingBalance(id);
        return { balance };
    }
    async getProducts(id) {
        const products = await this.suppliersService.getSupplierProducts(id);
        return { data: products };
    }
    async update(id, updateSupplierDto) {
        const supplier = await this.suppliersService.update(id, updateSupplierDto);
        return new supplier_response_dto_1.SupplierResponseDto(supplier);
    }
    async remove(id) {
        await this.suppliersService.remove(id);
    }
    async addContact(id, contactDto) {
        const contact = await this.suppliersService.addContact(id, contactDto);
        return contact;
    }
    async updateContact(contactId, contactDto) {
        const contact = await this.suppliersService.updateContact(contactId, contactDto);
        return contact;
    }
    async removeContact(contactId) {
        await this.suppliersService.removeContact(contactId);
    }
    async addProduct(id, productDto) {
        const product = await this.suppliersService.addProduct(id, productDto);
        return product;
    }
    async updateProduct(productId, productDto) {
        const product = await this.suppliersService.updateProduct(productId, productDto);
        return product;
    }
    async removeProduct(productId) {
        await this.suppliersService.removeProduct(productId);
    }
};
exports.SuppliersController = SuppliersController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('suppliers.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new supplier' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Supplier created successfully',
        type: supplier_response_dto_1.SupplierResponseDto,
    }),
    openapi.ApiResponse({ status: 201, type: require("./dto/supplier-response.dto").SupplierResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_supplier_dto_1.CreateSupplierDto, Object]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('suppliers.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all suppliers with pagination and filters' }),
    (0, api_paginated_response_decorator_1.ApiPaginatedResponse)(supplier_response_dto_1.SupplierResponseDto),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto,
        supplier_filter_dto_1.SupplierFilterDto]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, permissions_decorator_1.Permissions)('suppliers.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active suppliers (for dropdowns)' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "findAllActive", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('suppliers.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get supplier by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Supplier found',
        type: supplier_response_dto_1.SupplierResponseDto,
    }),
    openapi.ApiResponse({ status: 200, type: require("./dto/supplier-response.dto").SupplierResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/balance'),
    (0, permissions_decorator_1.Permissions)('suppliers.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get supplier outstanding balance' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "getOutstandingBalance", null);
__decorate([
    (0, common_1.Get)(':id/products'),
    (0, permissions_decorator_1.Permissions)('suppliers.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get supplier product catalog' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "getProducts", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('suppliers.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update supplier' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200, type: require("./dto/supplier-response.dto").SupplierResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_supplier_dto_1.UpdateSupplierDto]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('suppliers.delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete supplier (soft delete)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/contacts'),
    (0, permissions_decorator_1.Permissions)('suppliers.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Add contact to supplier' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/inventory/supplier-contact.entity").SupplierContact }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_supplier_contact_dto_1.CreateSupplierContactDto]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "addContact", null);
__decorate([
    (0, common_1.Patch)('contacts/:contactId'),
    (0, permissions_decorator_1.Permissions)('suppliers.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update supplier contact' }),
    (0, swagger_1.ApiParam)({ name: 'contactId', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200, type: require("../../../entities/tenant/inventory/supplier-contact.entity").SupplierContact }),
    __param(0, (0, common_1.Param)('contactId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_supplier_contact_dto_1.CreateSupplierContactDto]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "updateContact", null);
__decorate([
    (0, common_1.Delete)('contacts/:contactId'),
    (0, permissions_decorator_1.Permissions)('suppliers.update'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Remove supplier contact' }),
    (0, swagger_1.ApiParam)({ name: 'contactId', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('contactId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "removeContact", null);
__decorate([
    (0, common_1.Post)(':id/products'),
    (0, permissions_decorator_1.Permissions)('suppliers.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Add product to supplier catalog' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/inventory/supplier-product.entity").SupplierProduct }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_supplier_product_dto_1.CreateSupplierProductDto]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "addProduct", null);
__decorate([
    (0, common_1.Patch)('products/:productId'),
    (0, permissions_decorator_1.Permissions)('suppliers.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update supplier product' }),
    (0, swagger_1.ApiParam)({ name: 'productId', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200, type: require("../../../entities/tenant/inventory/supplier-product.entity").SupplierProduct }),
    __param(0, (0, common_1.Param)('productId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_supplier_product_dto_1.CreateSupplierProductDto]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Delete)('products/:productId'),
    (0, permissions_decorator_1.Permissions)('suppliers.update'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Remove product from supplier catalog' }),
    (0, swagger_1.ApiParam)({ name: 'productId', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('productId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "removeProduct", null);
exports.SuppliersController = SuppliersController = __decorate([
    (0, swagger_1.ApiTags)('Suppliers'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('suppliers'),
    __metadata("design:paramtypes", [suppliers_service_1.SuppliersService])
], SuppliersController);
//# sourceMappingURL=suppliers.controller.js.map