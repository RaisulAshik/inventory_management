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
exports.SupplierDuesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const supplier_dues_service_1 = require("./supplier-dues.service");
const supplier_due_dto_1 = require("./dto/supplier-due.dto");
let SupplierDuesController = class SupplierDuesController {
    duesService;
    constructor(duesService) {
        this.duesService = duesService;
    }
    async findAll(filterDto) {
        return this.duesService.findAll(filterDto);
    }
    async getDashboard() {
        return this.duesService.getDashboardSummary();
    }
    async getUpcoming(days) {
        return this.duesService.getUpcomingPayments(days || 7);
    }
    async findBySupplier(supplierId) {
        return this.duesService.findBySupplier(supplierId);
    }
    async findOne(id) {
        return this.duesService.findById(id);
    }
    async createOpeningBalance(dto, user) {
        return this.duesService.createOpeningBalance(dto, user.sub);
    }
    async adjust(id, dto, user) {
        return this.duesService.adjustDue(id, dto, user.sub);
    }
};
exports.SupplierDuesController = SupplierDuesController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('supplier_dues.read'),
    (0, swagger_1.ApiOperation)({ summary: 'List supplier dues with filters' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [supplier_due_dto_1.SupplierDueFilterDto]),
    __metadata("design:returntype", Promise)
], SupplierDuesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, permissions_decorator_1.Permissions)('supplier_dues.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Payables dashboard with aging' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SupplierDuesController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('upcoming'),
    (0, permissions_decorator_1.Permissions)('supplier_dues.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Supplier dues coming up in next N days' }),
    (0, swagger_1.ApiQuery)({ name: 'days', required: false, type: Number }),
    openapi.ApiResponse({ status: 200, type: [require("../../../entities/tenant/dueManagement/supplier-due.entity").SupplierDue] }),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SupplierDuesController.prototype, "getUpcoming", null);
__decorate([
    (0, common_1.Get)('supplier/:supplierId'),
    (0, permissions_decorator_1.Permissions)('supplier_dues.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Dues by supplier with summary' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('supplierId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupplierDuesController.prototype, "findBySupplier", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('supplier_dues.read'),
    (0, swagger_1.ApiParam)({ name: 'id', format: 'uuid' }),
    openapi.ApiResponse({ status: 200, type: require("../../../entities/tenant/dueManagement/supplier-due.entity").SupplierDue }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupplierDuesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('opening-balance'),
    (0, permissions_decorator_1.Permissions)('supplier_dues.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create opening balance' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/dueManagement/supplier-due.entity").SupplierDue }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [supplier_due_dto_1.CreateSupplierOpeningBalanceDto, Object]),
    __metadata("design:returntype", Promise)
], SupplierDuesController.prototype, "createOpeningBalance", null);
__decorate([
    (0, common_1.Post)(':id/adjust'),
    (0, permissions_decorator_1.Permissions)('supplier_dues.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Adjust supplier due' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/dueManagement/supplier-due.entity").SupplierDue }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, supplier_due_dto_1.AdjustSupplierDueDto, Object]),
    __metadata("design:returntype", Promise)
], SupplierDuesController.prototype, "adjust", null);
exports.SupplierDuesController = SupplierDuesController = __decorate([
    (0, swagger_1.ApiTags)('Supplier Dues'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('supplier-dues'),
    __metadata("design:paramtypes", [supplier_dues_service_1.SupplierDuesService])
], SupplierDuesController);
//# sourceMappingURL=supplier-dues.controller.js.map