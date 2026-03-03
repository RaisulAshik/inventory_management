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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemSetting = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
let SystemSetting = class SystemSetting {
    id;
    settingKey;
    settingValue;
    valueType;
    category;
    description;
    isPublic;
    isEditable;
    createdAt;
    updatedAt;
    getValue() {
        if (this.settingValue === null)
            return null;
        switch (this.valueType) {
            case 'number':
                return Number(this.settingValue);
            case 'boolean':
                return (this.settingValue === 'true' || this.settingValue === '1');
            case 'json':
                return JSON.parse(this.settingValue);
            default:
                return this.settingValue;
        }
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, settingKey: { required: true, type: () => String }, settingValue: { required: true, type: () => String }, valueType: { required: true, type: () => String }, category: { required: true, type: () => String }, description: { required: true, type: () => String }, isPublic: { required: true, type: () => Boolean }, isEditable: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.SystemSetting = SystemSetting;
__decorate([
    (0, typeorm_1.PrimaryColumn)('char', { length: 36 }),
    __metadata("design:type", String)
], SystemSetting.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'setting_key', length: 100 }),
    __metadata("design:type", String)
], SystemSetting.prototype, "settingKey", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'setting_value', nullable: true }),
    __metadata("design:type", String)
], SystemSetting.prototype, "settingValue", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'value_type', length: 20, default: 'string' }),
    __metadata("design:type", String)
], SystemSetting.prototype, "valueType", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 100, nullable: true }),
    __metadata("design:type", String)
], SystemSetting.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], SystemSetting.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { name: 'is_public', default: false }),
    __metadata("design:type", Boolean)
], SystemSetting.prototype, "isPublic", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { name: 'is_editable', default: true }),
    __metadata("design:type", Boolean)
], SystemSetting.prototype, "isEditable", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SystemSetting.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], SystemSetting.prototype, "updatedAt", void 0);
exports.SystemSetting = SystemSetting = __decorate([
    (0, typeorm_1.Entity)('system_settings'),
    (0, typeorm_1.Index)(['settingKey'], { unique: true }),
    (0, typeorm_1.Index)(['category'])
], SystemSetting);
//# sourceMappingURL=system-setting.entity.js.map