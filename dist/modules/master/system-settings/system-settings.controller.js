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
exports.SystemSettingsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const system_settings_service_1 = require("./system-settings.service");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const public_decorator_1 = require("../../../common/decorators/public.decorator");
let SystemSettingsController = class SystemSettingsController {
    settingsService;
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    async findAll(category) {
        const settings = await this.settingsService.findAll(category);
        return { data: settings };
    }
    async findPublic() {
        const settings = await this.settingsService.findPublic();
        return { data: settings };
    }
    async findGrouped() {
        const grouped = await this.settingsService.findGroupedByCategory();
        return { data: grouped };
    }
    async findByKey(key) {
        const setting = await this.settingsService.findByKey(key);
        return { data: setting };
    }
    async setValue(body) {
        const setting = await this.settingsService.setValue(body.key, body.value, {
            valueType: body.valueType,
            category: body.category,
            description: body.description,
            isPublic: body.isPublic,
        });
        return setting;
    }
    async bulkUpdate(body) {
        const settings = await this.settingsService.bulkUpdate(body.settings);
        return { data: settings };
    }
    async remove(key) {
        await this.settingsService.remove(key);
    }
};
exports.SystemSettingsController = SystemSettingsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, permissions_decorator_1.Permissions)('master.settings.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all settings' }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SystemSettingsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('public'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get public settings' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SystemSettingsController.prototype, "findPublic", null);
__decorate([
    (0, common_1.Get)('grouped'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, permissions_decorator_1.Permissions)('master.settings.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get settings grouped by category' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SystemSettingsController.prototype, "findGrouped", null);
__decorate([
    (0, common_1.Get)(':key'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, permissions_decorator_1.Permissions)('master.settings.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get setting by key' }),
    (0, swagger_1.ApiParam)({ name: 'key', type: 'string' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SystemSettingsController.prototype, "findByKey", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, permissions_decorator_1.Permissions)('master.settings.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Set setting value' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/master/system-setting.entity").SystemSetting }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SystemSettingsController.prototype, "setValue", null);
__decorate([
    (0, common_1.Post)('bulk'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, permissions_decorator_1.Permissions)('master.settings.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk update settings' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SystemSettingsController.prototype, "bulkUpdate", null);
__decorate([
    (0, common_1.Delete)(':key'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, permissions_decorator_1.Permissions)('master.settings.delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete setting' }),
    (0, swagger_1.ApiParam)({ name: 'key', type: 'string' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SystemSettingsController.prototype, "remove", null);
exports.SystemSettingsController = SystemSettingsController = __decorate([
    (0, swagger_1.ApiTags)('System Settings (Master)'),
    (0, common_1.Controller)('master/settings'),
    __metadata("design:paramtypes", [system_settings_service_1.SystemSettingsService])
], SystemSettingsController);
//# sourceMappingURL=system-settings.controller.js.map