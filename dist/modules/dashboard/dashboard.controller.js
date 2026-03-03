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
exports.DashboardController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dashboard_service_1 = require("./dashboard.service");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
let DashboardController = class DashboardController {
    dashboardService;
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    async getOverviewStats() {
        return this.dashboardService.getOverviewStats();
    }
    async getSalesTrend(period = 'daily', days = 30) {
        return this.dashboardService.getSalesTrend(period, days);
    }
    async getTopSellingProducts(limit = 10) {
        return this.dashboardService.getTopSellingProducts(limit);
    }
    async getTopCustomers(limit = 10) {
        return this.dashboardService.getTopCustomers(limit);
    }
    async getLowStockProducts(limit = 20) {
        return this.dashboardService.getLowStockProducts(limit);
    }
    async getRecentOrders(limit = 10) {
        return this.dashboardService.getRecentOrders(limit);
    }
    async getPendingPurchaseOrders(limit = 10) {
        return this.dashboardService.getPendingPurchaseOrders(limit);
    }
    async getStockValuationByWarehouse() {
        return this.dashboardService.getStockValuationByWarehouse();
    }
    async getReceivablesSummary() {
        return this.dashboardService.getReceivablesSummary();
    }
    async getPayablesSummary() {
        return this.dashboardService.getPayablesSummary();
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)('overview'),
    (0, permissions_decorator_1.Permissions)('dashboard.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dashboard overview statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Overview statistics retrieved' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getOverviewStats", null);
__decorate([
    (0, common_1.Get)('sales-trend'),
    (0, permissions_decorator_1.Permissions)('dashboard.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get sales trend data' }),
    (0, swagger_1.ApiQuery)({
        name: 'period',
        enum: ['daily', 'weekly', 'monthly'],
        required: false,
    }),
    (0, swagger_1.ApiQuery)({ name: 'days', type: 'number', required: false }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('period')),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getSalesTrend", null);
__decorate([
    (0, common_1.Get)('top-products'),
    (0, permissions_decorator_1.Permissions)('dashboard.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get top selling products' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: 'number', required: false }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getTopSellingProducts", null);
__decorate([
    (0, common_1.Get)('top-customers'),
    (0, permissions_decorator_1.Permissions)('dashboard.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get top customers' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: 'number', required: false }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getTopCustomers", null);
__decorate([
    (0, common_1.Get)('low-stock'),
    (0, permissions_decorator_1.Permissions)('dashboard.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get low stock products' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: 'number', required: false }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getLowStockProducts", null);
__decorate([
    (0, common_1.Get)('recent-orders'),
    (0, permissions_decorator_1.Permissions)('dashboard.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recent orders' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: 'number', required: false }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getRecentOrders", null);
__decorate([
    (0, common_1.Get)('pending-purchase-orders'),
    (0, permissions_decorator_1.Permissions)('dashboard.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending purchase orders' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: 'number', required: false }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getPendingPurchaseOrders", null);
__decorate([
    (0, common_1.Get)('stock-valuation'),
    (0, permissions_decorator_1.Permissions)('dashboard.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get stock valuation by warehouse' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getStockValuationByWarehouse", null);
__decorate([
    (0, common_1.Get)('receivables'),
    (0, permissions_decorator_1.Permissions)('dashboard.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get receivables aging summary' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getReceivablesSummary", null);
__decorate([
    (0, common_1.Get)('payables'),
    (0, permissions_decorator_1.Permissions)('dashboard.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get payables aging summary' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getPayablesSummary", null);
exports.DashboardController = DashboardController = __decorate([
    (0, swagger_1.ApiTags)('Dashboard'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('dashboard'),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map