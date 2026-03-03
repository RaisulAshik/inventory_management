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
exports.SystemSettingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const uuid_1 = require("uuid");
const system_setting_entity_1 = require("../../../entities/master/system-setting.entity");
let SystemSettingsService = class SystemSettingsService {
    settingRepository;
    constructor(settingRepository) {
        this.settingRepository = settingRepository;
    }
    async findAll(category) {
        const where = {};
        if (category) {
            where.category = category;
        }
        return this.settingRepository.find({
            where,
            order: { category: 'ASC', settingKey: 'ASC' },
        });
    }
    async findPublic() {
        return this.settingRepository.find({
            where: { isPublic: true },
            order: { category: 'ASC', settingKey: 'ASC' },
        });
    }
    async findByKey(key) {
        return this.settingRepository.findOne({
            where: { settingKey: key },
        });
    }
    async getValue(key, defaultValue) {
        const setting = await this.findByKey(key);
        if (!setting) {
            return defaultValue;
        }
        return setting.getValue();
    }
    async setValue(key, value, options) {
        let setting = await this.findByKey(key);
        if (!setting) {
            setting = this.settingRepository.create({
                id: (0, uuid_1.v4)(),
                settingKey: key,
                valueType: options?.valueType || typeof value,
                category: options?.category,
                description: options?.description,
                isPublic: options?.isPublic || false,
            });
        }
        if (!setting.isEditable) {
            throw new common_1.BadRequestException(`Setting ${key} is not editable`);
        }
        if (typeof value === 'object') {
            setting.settingValue = JSON.stringify(value);
            setting.valueType = 'json';
        }
        else {
            setting.settingValue = String(value);
        }
        return this.settingRepository.save(setting);
    }
    async remove(key) {
        const setting = await this.findByKey(key);
        if (!setting) {
            throw new common_1.NotFoundException(`Setting ${key} not found`);
        }
        if (!setting.isEditable) {
            throw new common_1.BadRequestException(`Setting ${key} cannot be deleted`);
        }
        await this.settingRepository.delete(setting.id);
    }
    async findGroupedByCategory() {
        const settings = await this.findAll();
        return settings.reduce((acc, setting) => {
            const category = setting.category || 'general';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(setting);
            return acc;
        }, {});
    }
    async bulkUpdate(settings) {
        const results = [];
        for (const item of settings) {
            const result = await this.setValue(item.key, item.value);
            results.push(result);
        }
        return results;
    }
};
exports.SystemSettingsService = SystemSettingsService;
exports.SystemSettingsService = SystemSettingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(system_setting_entity_1.SystemSetting, 'master')),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SystemSettingsService);
//# sourceMappingURL=system-settings.service.js.map