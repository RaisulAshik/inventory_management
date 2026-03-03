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
exports.BudgetsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const budgets_dto_1 = require("../dto/budgets.dto");
const budgets_service_1 = require("../service/budgets.service");
let BudgetsController = class BudgetsController {
    budgetsService;
    constructor(budgetsService) {
        this.budgetsService = budgetsService;
    }
    create(dto, currentUser) {
        return this.budgetsService.create(dto, currentUser.sub);
    }
    findAll(query) {
        return this.budgetsService.findAll(query);
    }
    findOne(id) {
        return this.budgetsService.findOne(id);
    }
    getBudgetVsActual(id) {
        return this.budgetsService.getBudgetVsActual(id);
    }
    update(id, dto) {
        return this.budgetsService.update(id, dto);
    }
    addLine(id, dto) {
        return this.budgetsService.addLine(id, dto);
    }
    updateLine(lineId, dto) {
        return this.budgetsService.updateLine(lineId, dto);
    }
    removeLine(lineId) {
        return this.budgetsService.removeLine(lineId);
    }
    submit(id) {
        return this.budgetsService.submitForApproval(id);
    }
    approve(id, dto, currentUser) {
        return this.budgetsService.approve(id, dto, currentUser.sub);
    }
    reject(id, dto, currentUser) {
        return this.budgetsService.reject(id, dto, currentUser.sub);
    }
    activate(id) {
        return this.budgetsService.activate(id);
    }
    close(id) {
        return this.budgetsService.close(id);
    }
    remove(id) {
        return this.budgetsService.remove(id);
    }
};
exports.BudgetsController = BudgetsController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('accounting.budgets.create'),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/accounting/budget.entity").Budget }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [budgets_dto_1.CreateBudgetDto, Object]),
    __metadata("design:returntype", void 0)
], BudgetsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('accounting.budgets.read'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [budgets_dto_1.QueryBudgetDto]),
    __metadata("design:returntype", void 0)
], BudgetsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('accounting.budgets.read'),
    openapi.ApiResponse({ status: 200, type: require("../../../entities/tenant/accounting/budget.entity").Budget }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BudgetsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/vs-actual'),
    (0, permissions_decorator_1.Permissions)('accounting.budgets.read'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BudgetsController.prototype, "getBudgetVsActual", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.Permissions)('accounting.budgets.update'),
    openapi.ApiResponse({ status: 200, type: require("../../../entities/tenant/accounting/budget.entity").Budget }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, budgets_dto_1.UpdateBudgetDto]),
    __metadata("design:returntype", void 0)
], BudgetsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/lines'),
    (0, permissions_decorator_1.Permissions)('accounting.budgets.update'),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/accounting/budget-line.entity").BudgetLine }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, budgets_dto_1.CreateBudgetLineDto]),
    __metadata("design:returntype", void 0)
], BudgetsController.prototype, "addLine", null);
__decorate([
    (0, common_1.Put)('lines/:lineId'),
    (0, permissions_decorator_1.Permissions)('accounting.budgets.update'),
    openapi.ApiResponse({ status: 200, type: require("../../../entities/tenant/accounting/budget-line.entity").BudgetLine }),
    __param(0, (0, common_1.Param)('lineId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, budgets_dto_1.UpdateBudgetLineDto]),
    __metadata("design:returntype", void 0)
], BudgetsController.prototype, "updateLine", null);
__decorate([
    (0, common_1.Delete)('lines/:lineId'),
    (0, permissions_decorator_1.Permissions)('accounting.budgets.update'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('lineId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BudgetsController.prototype, "removeLine", null);
__decorate([
    (0, common_1.Post)(':id/submit'),
    (0, permissions_decorator_1.Permissions)('accounting.budgets.submit'),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/accounting/budget.entity").Budget }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BudgetsController.prototype, "submit", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, permissions_decorator_1.Permissions)('accounting.budgets.approve'),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/accounting/budget.entity").Budget }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, budgets_dto_1.ApproveBudgetDto, Object]),
    __metadata("design:returntype", void 0)
], BudgetsController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, permissions_decorator_1.Permissions)('accounting.budgets.approve'),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/accounting/budget.entity").Budget }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, budgets_dto_1.ApproveBudgetDto, Object]),
    __metadata("design:returntype", void 0)
], BudgetsController.prototype, "reject", null);
__decorate([
    (0, common_1.Post)(':id/activate'),
    (0, permissions_decorator_1.Permissions)('accounting.budgets.activate'),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/accounting/budget.entity").Budget }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BudgetsController.prototype, "activate", null);
__decorate([
    (0, common_1.Post)(':id/close'),
    (0, permissions_decorator_1.Permissions)('accounting.budgets.close'),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/accounting/budget.entity").Budget }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BudgetsController.prototype, "close", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('accounting.budgets.delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BudgetsController.prototype, "remove", null);
exports.BudgetsController = BudgetsController = __decorate([
    (0, common_1.Controller)('api/v1/accounting/budgets'),
    __metadata("design:paramtypes", [budgets_service_1.BudgetsService])
], BudgetsController);
//# sourceMappingURL=budgets.controller.js.map