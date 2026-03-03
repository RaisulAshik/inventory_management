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
exports.ChartOfAccountsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const chat_of_accounts_dto_1 = require("../dto/chat-of-accounts.dto");
const chart_of_accounts_service_1 = require("../service/chart-of-accounts.service");
let ChartOfAccountsController = class ChartOfAccountsController {
    accountsService;
    constructor(accountsService) {
        this.accountsService = accountsService;
    }
    create(dto, currentUser) {
        return this.accountsService.create(dto, currentUser.sub);
    }
    findAll(query) {
        return this.accountsService.findAll(query);
    }
    getTree() {
        return this.accountsService.getTree();
    }
    findByCode(code) {
        return this.accountsService.findByCode(code);
    }
    findOne(id) {
        return this.accountsService.findOne(id);
    }
    update(id, dto) {
        return this.accountsService.update(id, dto);
    }
    remove(id) {
        return this.accountsService.remove(id);
    }
};
exports.ChartOfAccountsController = ChartOfAccountsController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('accounting.chart-of-accounts.create'),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/accounting/chart-of-accounts.entity").ChartOfAccounts }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_of_accounts_dto_1.CreateChartOfAccountDto, Object]),
    __metadata("design:returntype", void 0)
], ChartOfAccountsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('accounting.chart-of-accounts.read'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_of_accounts_dto_1.QueryChartOfAccountDto]),
    __metadata("design:returntype", void 0)
], ChartOfAccountsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('tree'),
    (0, permissions_decorator_1.Permissions)('accounting.chart-of-accounts.read'),
    openapi.ApiResponse({ status: 200, type: [require("../../../entities/tenant/accounting/chart-of-accounts.entity").ChartOfAccounts] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChartOfAccountsController.prototype, "getTree", null);
__decorate([
    (0, common_1.Get)('by-code/:code'),
    (0, permissions_decorator_1.Permissions)('accounting.chart-of-accounts.read'),
    openapi.ApiResponse({ status: 200, type: require("../../../entities/tenant/accounting/chart-of-accounts.entity").ChartOfAccounts }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChartOfAccountsController.prototype, "findByCode", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('accounting.chart-of-accounts.read'),
    openapi.ApiResponse({ status: 200, type: require("../../../entities/tenant/accounting/chart-of-accounts.entity").ChartOfAccounts }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChartOfAccountsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.Permissions)('accounting.chart-of-accounts.update'),
    openapi.ApiResponse({ status: 200, type: require("../../../entities/tenant/accounting/chart-of-accounts.entity").ChartOfAccounts }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, chat_of_accounts_dto_1.UpdateChartOfAccountDto]),
    __metadata("design:returntype", void 0)
], ChartOfAccountsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('accounting.chart-of-accounts.delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChartOfAccountsController.prototype, "remove", null);
exports.ChartOfAccountsController = ChartOfAccountsController = __decorate([
    (0, common_1.Controller)('api/v1/accounting/chart-of-accounts'),
    __metadata("design:paramtypes", [chart_of_accounts_service_1.ChartOfAccountsService])
], ChartOfAccountsController);
//# sourceMappingURL=chart-of-accounts.controller.js.map