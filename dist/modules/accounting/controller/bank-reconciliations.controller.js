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
exports.BankReconciliationsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const bank_reconciliation_dto_1 = require("../dto/bank-reconciliation.dto");
const bank_reconciliation_service_1 = require("../service/bank-reconciliation.service");
let BankReconciliationsController = class BankReconciliationsController {
    reconciliationsService;
    constructor(reconciliationsService) {
        this.reconciliationsService = reconciliationsService;
    }
    create(dto, currentUser) {
        return this.reconciliationsService.create(dto, currentUser.sub);
    }
    findAll(query) {
        return this.reconciliationsService.findAll(query);
    }
    findOne(id) {
        return this.reconciliationsService.findOne(id);
    }
    getSummary(id) {
        return this.reconciliationsService.getReconciliationSummary(id);
    }
    update(id, dto) {
        return this.reconciliationsService.update(id, dto);
    }
    start(id) {
        return this.reconciliationsService.startReconciliation(id);
    }
    complete(id, dto, currentUser) {
        return this.reconciliationsService.complete(id, dto, currentUser.sub);
    }
    cancel(id) {
        return this.reconciliationsService.cancel(id);
    }
};
exports.BankReconciliationsController = BankReconciliationsController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('accounting.bank-reconciliations.create'),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/accounting/bank-reconciliation.entity").BankReconciliation }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bank_reconciliation_dto_1.CreateBankReconciliationDto, Object]),
    __metadata("design:returntype", void 0)
], BankReconciliationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('accounting.bank-reconciliations.read'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bank_reconciliation_dto_1.QueryBankReconciliationDto]),
    __metadata("design:returntype", void 0)
], BankReconciliationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('accounting.bank-reconciliations.read'),
    openapi.ApiResponse({ status: 200, type: require("../../../entities/tenant/accounting/bank-reconciliation.entity").BankReconciliation }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BankReconciliationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/summary'),
    (0, permissions_decorator_1.Permissions)('accounting.bank-reconciliations.read'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BankReconciliationsController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.Permissions)('accounting.bank-reconciliations.update'),
    openapi.ApiResponse({ status: 200, type: require("../../../entities/tenant/accounting/bank-reconciliation.entity").BankReconciliation }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, bank_reconciliation_dto_1.UpdateBankReconciliationDto]),
    __metadata("design:returntype", void 0)
], BankReconciliationsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/start'),
    (0, permissions_decorator_1.Permissions)('accounting.bank-reconciliations.update'),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/accounting/bank-reconciliation.entity").BankReconciliation }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BankReconciliationsController.prototype, "start", null);
__decorate([
    (0, common_1.Post)(':id/complete'),
    (0, permissions_decorator_1.Permissions)('accounting.bank-reconciliations.complete'),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/accounting/bank-reconciliation.entity").BankReconciliation }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, bank_reconciliation_dto_1.CompleteReconciliationDto, Object]),
    __metadata("design:returntype", void 0)
], BankReconciliationsController.prototype, "complete", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, permissions_decorator_1.Permissions)('accounting.bank-reconciliations.update'),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/accounting/bank-reconciliation.entity").BankReconciliation }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BankReconciliationsController.prototype, "cancel", null);
exports.BankReconciliationsController = BankReconciliationsController = __decorate([
    (0, common_1.Controller)('api/v1/accounting/bank-reconciliations'),
    __metadata("design:paramtypes", [bank_reconciliation_service_1.BankReconciliationsService])
], BankReconciliationsController);
//# sourceMappingURL=bank-reconciliations.controller.js.map