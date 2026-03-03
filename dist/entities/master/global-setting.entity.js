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
exports.GlobalSetting = exports.SettingType = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
var SettingType;
(function (SettingType) {
    SettingType["STRING"] = "STRING";
    SettingType["NUMBER"] = "NUMBER";
    SettingType["BOOLEAN"] = "BOOLEAN";
    SettingType["JSON"] = "JSON";
})(SettingType || (exports.SettingType = SettingType = {}));
let GlobalSetting = class GlobalSetting {
    id;
    settingKey;
    settingValue;
    settingType;
    description;
    isPublic;
    createdAt;
    updatedAt;
    getValue() {
        if (!this.settingValue)
            return null;
        switch (this.settingType) {
            case SettingType.NUMBER:
                return parseFloat(this.settingValue);
            case SettingType.BOOLEAN:
                return (this.settingValue === 'true');
            case SettingType.JSON:
                return JSON.parse(this.settingValue);
            default:
                return this.settingValue;
        }
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, settingKey: { required: true, type: () => String }, settingValue: { required: true, type: () => String, nullable: true }, settingType: { required: true, enum: require("./global-setting.entity").SettingType }, description: { required: true, type: () => String, nullable: true }, isPublic: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.GlobalSetting = GlobalSetting;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], GlobalSetting.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'setting_key', length: 100, unique: true }),
    __metadata("design:type", String)
], GlobalSetting.prototype, "settingKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'setting_value', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], GlobalSetting.prototype, "settingValue", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'setting_type',
        type: 'enum',
        enum: SettingType,
        default: SettingType.STRING,
    }),
    __metadata("design:type", String)
], GlobalSetting.prototype, "settingType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], GlobalSetting.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_public', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], GlobalSetting.prototype, "isPublic", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], GlobalSetting.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], GlobalSetting.prototype, "updatedAt", void 0);
exports.GlobalSetting = GlobalSetting = __decorate([
    (0, typeorm_1.Entity)('global_settings')
], GlobalSetting);
//# sourceMappingURL=global-setting.entity.js.map