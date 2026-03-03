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
exports.BankTransactionsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const bank_transactions_dto_1 = require("../dto/bank-transactions.dto");
const bank_transactions_service_1 = require("../service/bank-transactions.service");
let BankTransactionsController = class BankTransactionsController {
    bankTxnService;
    constructor(bankTxnService) {
        this.bankTxnService = bankTxnService;
    }
    create(dto, currentUser) {
        return this.bankTxnService.create(dto, currentUser.sub);
    }
    findAll(query) {
        return this.bankTxnService.findAll(query);
    }
    getUnreconciled(bankAccountId) {
        return this.bankTxnService.getUnreconciledTransactions(bankAccountId);
    }
    findOne(id) {
        return this.bankTxnService.findOne(id);
    }
    update(id, dto) {
        return this.bankTxnService.update(id, dto);
    }
    clear(id) {
        return this.bankTxnService.clearTransaction(id);
    }
    bounce(id) {
        return this.bankTxnService.bounceTransaction(id);
    }
    remove(id) {
        return this.bankTxnService.remove(id);
    }
};
exports.BankTransactionsController = BankTransactionsController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('accounting.bank-transactions.create'),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/accounting/bank-transaction.entity").BankTransaction }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bank_transactions_dto_1.CreateBankTransactionDto, Object]),
    __metadata("design:returntype", void 0)
], BankTransactionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('accounting.bank-transactions.read'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bank_transactions_dto_1.QueryBankTransactionDto]),
    __metadata("design:returntype", void 0)
], BankTransactionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('unreconciled/:bankAccountId'),
    (0, permissions_decorator_1.Permissions)('accounting.bank-transactions.read'),
    openapi.ApiResponse({ status: 200, type: [require("../../../entities/tenant/accounting/bank-transaction.entity").BankTransaction] }),
    __param(0, (0, common_1.Param)('bankAccountId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BankTransactionsController.prototype, "getUnreconciled", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('accounting.bank-transactions.read'),
    openapi.ApiResponse({ status: 200, type: require("../../../entities/tenant/accounting/bank-transaction.entity").BankTransaction }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BankTransactionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.Permissions)('accounting.bank-transactions.update'),
    openapi.ApiResponse({ status: 200, type: require("../../../entities/tenant/accounting/bank-transaction.entity").BankTransaction }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, bank_transactions_dto_1.UpdateBankTransactionDto]),
    __metadata("design:returntype", void 0)
], BankTransactionsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/clear'),
    (0, permissions_decorator_1.Permissions)('accounting.bank-transactions.update'),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/accounting/bank-transaction.entity").BankTransaction }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BankTransactionsController.prototype, "clear", null);
__decorate([
    (0, common_1.Post)(':id/bounce'),
    (0, permissions_decorator_1.Permissions)('accounting.bank-transactions.update'),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/accounting/bank-transaction.entity").BankTransaction }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BankTransactionsController.prototype, "bounce", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('accounting.bank-transactions.delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BankTransactionsController.prototype, "remove", null);
exports.BankTransactionsController = BankTransactionsController = __decorate([
    (0, common_1.Controller)('api/v1/accounting/bank-transactions'),
    __metadata("design:paramtypes", [bank_transactions_service_1.BankTransactionsService])
], BankTransactionsController);
//# sourceMappingURL=bank-transactions.controller.js.map