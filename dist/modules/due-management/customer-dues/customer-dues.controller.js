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
exports.CustomerDuesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const customer_dues_service_1 = require("./customer-dues.service");
const due_filter_dto_1 = require("./dto/due-filter.dto");
const create_opening_balance_dto_1 = require("./dto/create-opening-balance.dto");
let CustomerDuesController = class CustomerDuesController {
    duesService;
    constructor(duesService) {
        this.duesService = duesService;
    }
    async findAll(filterDto) {
        return this.duesService.findAll(filterDto);
    }
    async getOverdue() {
        const dues = await this.duesService.getOverdueDues();
        return { data: dues };
    }
    async getDashboard() {
        return this.duesService.getDashboardSummary();
    }
    async findByCustomer(customerId) {
        return this.duesService.findByCustomer(customerId);
    }
    async getStatement(customerId, fromDate, toDate) {
        return this.duesService.getCustomerStatement(customerId, fromDate, toDate);
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
    async writeOff(id, dto, user) {
        return this.duesService.writeOff(id, dto, user.sub);
    }
};
exports.CustomerDuesController = CustomerDuesController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('customer_dues.read'),
    (0, swagger_1.ApiOperation)({ summary: 'List all customer dues with filters' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [due_filter_dto_1.DueFilterDto]),
    __metadata("design:returntype", Promise)
], CustomerDuesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('overdue'),
    (0, permissions_decorator_1.Permissions)('customer_dues.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all overdue dues' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomerDuesController.prototype, "getOverdue", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, permissions_decorator_1.Permissions)('customer_dues.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Dashboard summary with aging buckets' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomerDuesController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('customer/:customerId'),
    (0, permissions_decorator_1.Permissions)('customer_dues.read'),
    (0, swagger_1.ApiParam)({ name: 'customerId', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiOperation)({ summary: 'Dues by customer with summary' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('customerId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerDuesController.prototype, "findByCustomer", null);
__decorate([
    (0, common_1.Get)('customer/:customerId/statement'),
    (0, permissions_decorator_1.Permissions)('customer_dues.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Customer statement for date range' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('customerId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('fromDate')),
    __param(2, (0, common_1.Query)('toDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], CustomerDuesController.prototype, "getStatement", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('customer_dues.read'),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200, type: require("../../../entities/tenant/dueManagement/customer-due.entity").CustomerDue }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerDuesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('opening-balance'),
    (0, permissions_decorator_1.Permissions)('customer_dues.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create opening balance due' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/dueManagement/customer-due.entity").CustomerDue }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_opening_balance_dto_1.CreateOpeningBalanceDto, Object]),
    __metadata("design:returntype", Promise)
], CustomerDuesController.prototype, "createOpeningBalance", null);
__decorate([
    (0, common_1.Post)(':id/adjust'),
    (0, permissions_decorator_1.Permissions)('customer_dues.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Adjust due (discount/correction)' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/dueManagement/customer-due.entity").CustomerDue }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_opening_balance_dto_1.AdjustDueDto, Object]),
    __metadata("design:returntype", Promise)
], CustomerDuesController.prototype, "adjust", null);
__decorate([
    (0, common_1.Post)(':id/write-off'),
    (0, permissions_decorator_1.Permissions)('customer_dues.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Write off bad debt' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/dueManagement/customer-due.entity").CustomerDue }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_opening_balance_dto_1.WriteOffDueDto, Object]),
    __metadata("design:returntype", Promise)
], CustomerDuesController.prototype, "writeOff", null);
exports.CustomerDuesController = CustomerDuesController = __decorate([
    (0, swagger_1.ApiTags)('Customer Dues'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('customer-dues'),
    __metadata("design:paramtypes", [customer_dues_service_1.CustomerDuesService])
], CustomerDuesController);
//# sourceMappingURL=customer-dues.controller.js.map