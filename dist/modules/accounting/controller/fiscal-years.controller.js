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
exports.FiscalYearsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const fiscal_years_dto_1 = require("../dto/fiscal-years.dto");
const fiscal_years_service_1 = require("../service/fiscal-years.service");
let FiscalYearsController = class FiscalYearsController {
    fiscalYearsService;
    constructor(fiscalYearsService) {
        this.fiscalYearsService = fiscalYearsService;
    }
    create(dto) {
        return this.fiscalYearsService.create(dto);
    }
    findAll(query) {
        return this.fiscalYearsService.findAll(query);
    }
    findCurrent() {
        return this.fiscalYearsService.findCurrent();
    }
    findOne(id) {
        return this.fiscalYearsService.findOne(id);
    }
    update(id, dto) {
        return this.fiscalYearsService.update(id, dto);
    }
    close(id, dto, currentUser) {
        return this.fiscalYearsService.close(id, dto, currentUser.sub);
    }
    remove(id) {
        return this.fiscalYearsService.remove(id);
    }
};
exports.FiscalYearsController = FiscalYearsController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('accounting.fiscal-years.create'),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/accounting/fiscal-year.entity").FiscalYear }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fiscal_years_dto_1.CreateFiscalYearDto]),
    __metadata("design:returntype", void 0)
], FiscalYearsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('accounting.fiscal-years.read'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fiscal_years_dto_1.QueryFiscalYearDto]),
    __metadata("design:returntype", void 0)
], FiscalYearsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('current'),
    (0, permissions_decorator_1.Permissions)('accounting.fiscal-years.read'),
    openapi.ApiResponse({ status: 200, type: require("../../../entities/tenant/accounting/fiscal-year.entity").FiscalYear }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FiscalYearsController.prototype, "findCurrent", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('accounting.fiscal-years.read'),
    openapi.ApiResponse({ status: 200, type: require("../../../entities/tenant/accounting/fiscal-year.entity").FiscalYear }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FiscalYearsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.Permissions)('accounting.fiscal-years.update'),
    openapi.ApiResponse({ status: 200, type: require("../../../entities/tenant/accounting/fiscal-year.entity").FiscalYear }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, fiscal_years_dto_1.UpdateFiscalYearDto]),
    __metadata("design:returntype", void 0)
], FiscalYearsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/close'),
    (0, permissions_decorator_1.Permissions)('accounting.fiscal-years.close'),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/accounting/fiscal-year.entity").FiscalYear }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, fiscal_years_dto_1.CloseFiscalYearDto, Object]),
    __metadata("design:returntype", void 0)
], FiscalYearsController.prototype, "close", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('accounting.fiscal-years.delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FiscalYearsController.prototype, "remove", null);
exports.FiscalYearsController = FiscalYearsController = __decorate([
    (0, common_1.Controller)('api/v1/accounting/fiscal-years'),
    __metadata("design:paramtypes", [fiscal_years_service_1.FiscalYearsService])
], FiscalYearsController);
//# sourceMappingURL=fiscal-years.controller.js.map