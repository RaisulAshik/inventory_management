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
exports.PlansController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const pagination_dto_1 = require("../../../common/dto/pagination.dto");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const api_paginated_response_decorator_1 = require("../../../common/decorators/api-paginated-response.decorator");
const public_decorator_1 = require("../../../common/decorators/public.decorator");
const create_plan_dto_1 = require("./dto/create-plan.dto");
const plan_response_dto_1 = require("./dto/plan-response.dto");
const update_plan_dto_1 = require("./dto/update-plan.dto");
const plans_service_1 = require("./plans.service");
let PlansController = class PlansController {
    plansService;
    constructor(plansService) {
        this.plansService = plansService;
    }
    async create(createDto) {
        const plan = await this.plansService.create(createDto);
        return new plan_response_dto_1.PlanResponseDto(plan);
    }
    async findAll(paginationDto) {
        const result = await this.plansService.findAll(paginationDto);
        return {
            data: result.data.map((p) => new plan_response_dto_1.PlanResponseDto(p)),
            meta: result.meta,
        };
    }
    async findAllActive() {
        const plans = await this.plansService.findAllActive();
        return { data: plans.map((p) => new plan_response_dto_1.PlanResponseDto(p)) };
    }
    async comparePlans(planIds) {
        const ids = Array.isArray(planIds) ? planIds : [planIds];
        return this.plansService.comparePlans(ids);
    }
    async findOne(id) {
        const plan = await this.plansService.findById(id);
        return new plan_response_dto_1.PlanResponseDto(plan);
    }
    async update(id, updateDto) {
        const plan = await this.plansService.update(id, updateDto);
        return new plan_response_dto_1.PlanResponseDto(plan);
    }
    async addFeature(id, featureDto) {
        const feature = await this.plansService.addFeature(id, featureDto);
        return feature;
    }
    async updateFeature(featureId, isEnabled) {
        const feature = await this.plansService.updateFeature(featureId, isEnabled);
        return feature;
    }
    async removeFeature(featureId) {
        await this.plansService.removeFeature(featureId);
    }
    async remove(id) {
        await this.plansService.remove(id);
    }
};
exports.PlansController = PlansController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, permissions_decorator_1.Permissions)('master.plans.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new subscription plan' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Plan created successfully',
        type: plan_response_dto_1.PlanResponseDto,
    }),
    openapi.ApiResponse({ status: 201, type: require("./dto/plan-response.dto").PlanResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_plan_dto_1.CreatePlanDto]),
    __metadata("design:returntype", Promise)
], PlansController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, permissions_decorator_1.Permissions)('master.plans.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all plans with pagination' }),
    (0, api_paginated_response_decorator_1.ApiPaginatedResponse)(plan_response_dto_1.PlanResponseDto),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], PlansController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active plans (public)' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PlansController.prototype, "findAllActive", null);
__decorate([
    (0, common_1.Get)('compare'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Compare plans' }),
    (0, swagger_1.ApiQuery)({ name: 'planIds', type: 'string', isArray: true }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)('planIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], PlansController.prototype, "comparePlans", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, permissions_decorator_1.Permissions)('master.plans.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get plan by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Plan found',
        type: plan_response_dto_1.PlanResponseDto,
    }),
    openapi.ApiResponse({ status: 200, type: require("./dto/plan-response.dto").PlanResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlansController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, permissions_decorator_1.Permissions)('master.plans.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update plan' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200, type: require("./dto/plan-response.dto").PlanResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_plan_dto_1.UpdatePlanDto]),
    __metadata("design:returntype", Promise)
], PlansController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/features'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, permissions_decorator_1.Permissions)('master.plans.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Add feature to plan' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/master/plan-feature.entity").PlanFeature }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PlansController.prototype, "addFeature", null);
__decorate([
    (0, common_1.Patch)('features/:featureId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, permissions_decorator_1.Permissions)('master.plans.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update feature' }),
    (0, swagger_1.ApiParam)({ name: 'featureId', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: 200, type: require("../../../entities/master/plan-feature.entity").PlanFeature }),
    __param(0, (0, common_1.Param)('featureId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('isEnabled')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], PlansController.prototype, "updateFeature", null);
__decorate([
    (0, common_1.Delete)('features/:featureId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, permissions_decorator_1.Permissions)('master.plans.update'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Remove feature from plan' }),
    (0, swagger_1.ApiParam)({ name: 'featureId', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('featureId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlansController.prototype, "removeFeature", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, permissions_decorator_1.Permissions)('master.plans.delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete plan' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlansController.prototype, "remove", null);
exports.PlansController = PlansController = __decorate([
    (0, swagger_1.ApiTags)('Subscription Plans (Master)'),
    (0, common_1.Controller)('master/plans'),
    __metadata("design:paramtypes", [plans_service_1.PlansService])
], PlansController);
//# sourceMappingURL=plans.controller.js.map