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
exports.FinancialReportsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const financial_reports_dto_1 = require("../dto/financial-reports.dto");
const financial_reports_service_1 = require("../service/financial-reports.service");
let FinancialReportsController = class FinancialReportsController {
    reportsService;
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    generateReport(query) {
        return this.reportsService.generateReport(query);
    }
    balanceSheet(query) {
        return this.reportsService.balanceSheet(query);
    }
    incomeStatement(query) {
        return this.reportsService.incomeStatement(query);
    }
    cashFlow(query) {
        return this.reportsService.cashFlowStatement(query);
    }
    bankSummary(query) {
        return this.reportsService.bankSummary(query);
    }
};
exports.FinancialReportsController = FinancialReportsController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('accounting.reports.read'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [financial_reports_dto_1.FinancialReportQueryDto]),
    __metadata("design:returntype", void 0)
], FinancialReportsController.prototype, "generateReport", null);
__decorate([
    (0, common_1.Get)('balance-sheet'),
    (0, permissions_decorator_1.Permissions)('accounting.reports.read'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [financial_reports_dto_1.FinancialReportQueryDto]),
    __metadata("design:returntype", void 0)
], FinancialReportsController.prototype, "balanceSheet", null);
__decorate([
    (0, common_1.Get)('income-statement'),
    (0, permissions_decorator_1.Permissions)('accounting.reports.read'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [financial_reports_dto_1.FinancialReportQueryDto]),
    __metadata("design:returntype", void 0)
], FinancialReportsController.prototype, "incomeStatement", null);
__decorate([
    (0, common_1.Get)('cash-flow'),
    (0, permissions_decorator_1.Permissions)('accounting.reports.read'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [financial_reports_dto_1.FinancialReportQueryDto]),
    __metadata("design:returntype", void 0)
], FinancialReportsController.prototype, "cashFlow", null);
__decorate([
    (0, common_1.Get)('bank-summary'),
    (0, permissions_decorator_1.Permissions)('accounting.reports.read'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [financial_reports_dto_1.FinancialReportQueryDto]),
    __metadata("design:returntype", void 0)
], FinancialReportsController.prototype, "bankSummary", null);
exports.FinancialReportsController = FinancialReportsController = __decorate([
    (0, common_1.Controller)('api/v1/accounting/reports'),
    __metadata("design:paramtypes", [financial_reports_service_1.FinancialReportsService])
], FinancialReportsController);
//# sourceMappingURL=financial-reports.controller.js.map