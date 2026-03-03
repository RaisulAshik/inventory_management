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
exports.FiscalPeriodsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const fiscal_periods_dto_1 = require("../dto/fiscal-periods.dto");
const fiscal_periods_service_1 = require("../service/fiscal-periods.service");
let FiscalPeriodsController = class FiscalPeriodsController {
    fiscalPeriodsService;
    constructor(fiscalPeriodsService) {
        this.fiscalPeriodsService = fiscalPeriodsService;
    }
    create(dto) {
        return this.fiscalPeriodsService.create(dto);
    }
    findAll(query) {
        return this.fiscalPeriodsService.findAll(query);
    }
    findOne(id) {
        return this.fiscalPeriodsService.findOne(id);
    }
    update(id, dto) {
        return this.fiscalPeriodsService.update(id, dto);
    }
    close(id, currentUser) {
        return this.fiscalPeriodsService.close(id, currentUser.sub);
    }
    reopen(id) {
        return this.fiscalPeriodsService.reopen(id);
    }
};
exports.FiscalPeriodsController = FiscalPeriodsController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('accounting.fiscal-periods.create'),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/accounting/fiscal-period.entity").FiscalPeriod }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fiscal_periods_dto_1.CreateFiscalPeriodDto]),
    __metadata("design:returntype", void 0)
], FiscalPeriodsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('accounting.fiscal-periods.read'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fiscal_periods_dto_1.QueryFiscalPeriodDto]),
    __metadata("design:returntype", void 0)
], FiscalPeriodsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('accounting.fiscal-periods.read'),
    openapi.ApiResponse({ status: 200, type: require("../../../entities/tenant/accounting/fiscal-period.entity").FiscalPeriod }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FiscalPeriodsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.Permissions)('accounting.fiscal-periods.update'),
    openapi.ApiResponse({ status: 200, type: require("../../../entities/tenant/accounting/fiscal-period.entity").FiscalPeriod }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, fiscal_periods_dto_1.UpdateFiscalPeriodDto]),
    __metadata("design:returntype", void 0)
], FiscalPeriodsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/close'),
    (0, permissions_decorator_1.Permissions)('accounting.fiscal-periods.close'),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/accounting/fiscal-period.entity").FiscalPeriod }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FiscalPeriodsController.prototype, "close", null);
__decorate([
    (0, common_1.Post)(':id/reopen'),
    (0, permissions_decorator_1.Permissions)('accounting.fiscal-periods.reopen'),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/accounting/fiscal-period.entity").FiscalPeriod }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FiscalPeriodsController.prototype, "reopen", null);
exports.FiscalPeriodsController = FiscalPeriodsController = __decorate([
    (0, common_1.Controller)('api/v1/accounting/fiscal-periods'),
    __metadata("design:paramtypes", [fiscal_periods_service_1.FiscalPeriodsService])
], FiscalPeriodsController);
//# sourceMappingURL=fiscal-periods.controller.js.map