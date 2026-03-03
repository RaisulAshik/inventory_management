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
exports.TaxController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tax_service_1 = require("./tax.service");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const taxRate_dto_1 = require("./dto/taxRate.dto");
let TaxController = class TaxController {
    taxService;
    constructor(taxService) {
        this.taxService = taxService;
    }
    getAllCategories() {
        return this.taxService.findAllCategories();
    }
    getCategory(code) {
        return this.taxService.findCategoryByCode(code);
    }
    getAllRates(categoryId) {
        return this.taxService.findAllRates(categoryId);
    }
    getActiveRates(categoryId) {
        return this.taxService.findActiveRates(categoryId);
    }
    getRateById(id) {
        return this.taxService.findRateById(id);
    }
    createRate(createRateDto) {
        return this.taxService.createRate(createRateDto);
    }
};
exports.TaxController = TaxController;
__decorate([
    (0, common_1.Get)('categories'),
    (0, permissions_decorator_1.Permissions)('tax.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all tax categories with their rates' }),
    openapi.ApiResponse({ status: 200, type: [require("../../../entities/tenant/inventory/tax-category.entity").TaxCategory] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TaxController.prototype, "getAllCategories", null);
__decorate([
    (0, common_1.Get)('categories/:code'),
    (0, permissions_decorator_1.Permissions)('tax.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get tax category by code' }),
    (0, swagger_1.ApiParam)({
        name: 'code',
        type: 'string',
        description: 'Tax code e.g. GST, VAT',
    }),
    openapi.ApiResponse({ status: 200, type: require("../../../entities/tenant/inventory/tax-category.entity").TaxCategory }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TaxController.prototype, "getCategory", null);
__decorate([
    (0, common_1.Get)('rates'),
    (0, permissions_decorator_1.Permissions)('tax.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all tax rates' }),
    (0, swagger_1.ApiQuery)({
        name: 'categoryId',
        required: false,
        description: 'Filter by tax category ID',
    }),
    openapi.ApiResponse({ status: 200, type: [require("../../../entities/tenant/inventory/tax-rate.entity").TaxRate] }),
    __param(0, (0, common_1.Query)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TaxController.prototype, "getAllRates", null);
__decorate([
    (0, common_1.Get)('rates/active'),
    (0, permissions_decorator_1.Permissions)('tax.read'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get currently active tax rates (within effective date range)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'categoryId',
        required: false,
        description: 'Filter by tax category ID',
    }),
    openapi.ApiResponse({ status: 200, type: [require("../../../entities/tenant/inventory/tax-rate.entity").TaxRate] }),
    __param(0, (0, common_1.Query)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TaxController.prototype, "getActiveRates", null);
__decorate([
    (0, common_1.Get)('rates/:id'),
    (0, permissions_decorator_1.Permissions)('tax.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get tax rate by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200, type: require("../../../entities/tenant/inventory/tax-rate.entity").TaxRate }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TaxController.prototype, "getRateById", null);
__decorate([
    (0, common_1.Post)('rates'),
    (0, permissions_decorator_1.Permissions)('tax.write'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new tax rate' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Tax rate created successfully' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/inventory/tax-rate.entity").TaxRate }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [taxRate_dto_1.CreateTaxRateDto]),
    __metadata("design:returntype", void 0)
], TaxController.prototype, "createRate", null);
exports.TaxController = TaxController = __decorate([
    (0, swagger_1.ApiTags)('Tax'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('tax'),
    __metadata("design:paramtypes", [tax_service_1.TaxService])
], TaxController);
//# sourceMappingURL=tax.controller.js.map