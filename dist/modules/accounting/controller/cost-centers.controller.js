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
exports.CostCentersController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const cost_centers_dto_1 = require("../dto/cost-centers.dto");
const cost_centers_service_1 = require("../service/cost-centers.service");
let CostCentersController = class CostCentersController {
    costCentersService;
    constructor(costCentersService) {
        this.costCentersService = costCentersService;
    }
    create(dto) {
        return this.costCentersService.create(dto);
    }
    findAll(query) {
        return this.costCentersService.findAll(query);
    }
    getTree() {
        return this.costCentersService.getTree();
    }
    findOne(id) {
        return this.costCentersService.findOne(id);
    }
    update(id, dto) {
        return this.costCentersService.update(id, dto);
    }
    remove(id) {
        return this.costCentersService.remove(id);
    }
};
exports.CostCentersController = CostCentersController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('accounting.cost-centers.create'),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/accounting/cost-center.entity").CostCenter }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cost_centers_dto_1.CreateCostCenterDto]),
    __metadata("design:returntype", void 0)
], CostCentersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('accounting.cost-centers.read'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cost_centers_dto_1.QueryCostCenterDto]),
    __metadata("design:returntype", void 0)
], CostCentersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('tree'),
    (0, permissions_decorator_1.Permissions)('accounting.cost-centers.read'),
    openapi.ApiResponse({ status: 200, type: [require("../../../entities/tenant/accounting/cost-center.entity").CostCenter] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CostCentersController.prototype, "getTree", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('accounting.cost-centers.read'),
    openapi.ApiResponse({ status: 200, type: require("../../../entities/tenant/accounting/cost-center.entity").CostCenter }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CostCentersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.Permissions)('accounting.cost-centers.update'),
    openapi.ApiResponse({ status: 200, type: require("../../../entities/tenant/accounting/cost-center.entity").CostCenter }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, cost_centers_dto_1.UpdateCostCenterDto]),
    __metadata("design:returntype", void 0)
], CostCentersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('accounting.cost-centers.delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CostCentersController.prototype, "remove", null);
exports.CostCentersController = CostCentersController = __decorate([
    (0, common_1.Controller)('api/v1/accounting/cost-centers'),
    __metadata("design:paramtypes", [cost_centers_service_1.CostCentersService])
], CostCentersController);
//# sourceMappingURL=cost-centers.controller.js.map