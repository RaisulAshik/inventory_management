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
exports.TenantSetting = exports.SettingCategory = exports.SettingDataType = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
var SettingDataType;
(function (SettingDataType) {
    SettingDataType["STRING"] = "STRING";
    SettingDataType["NUMBER"] = "NUMBER";
    SettingDataType["BOOLEAN"] = "BOOLEAN";
    SettingDataType["JSON"] = "JSON";
    SettingDataType["DATE"] = "DATE";
})(SettingDataType || (exports.SettingDataType = SettingDataType = {}));
var SettingCategory;
(function (SettingCategory) {
    SettingCategory["GENERAL"] = "GENERAL";
    SettingCategory["INVENTORY"] = "INVENTORY";
    SettingCategory["SALES"] = "SALES";
    SettingCategory["PURCHASE"] = "PURCHASE";
    SettingCategory["ACCOUNTING"] = "ACCOUNTING";
    SettingCategory["POS"] = "POS";
    SettingCategory["ECOMMERCE"] = "ECOMMERCE";
    SettingCategory["MANUFACTURING"] = "MANUFACTURING";
    SettingCategory["NOTIFICATION"] = "NOTIFICATION";
    SettingCategory["INTEGRATION"] = "INTEGRATION";
})(SettingCategory || (exports.SettingCategory = SettingCategory = {}));
let TenantSetting = class TenantSetting {
    id;
    category;
    settingKey;
    settingValue;
    dataType;
    displayName;
    description;
    defaultValue;
    isSystem;
    isEncrypted;
    validationRules;
    updatedBy;
    createdAt;
    updatedAt;
    getValue() {
        if (!this.settingValue) {
            return this.defaultValue;
        }
        switch (this.dataType) {
            case SettingDataType.NUMBER:
                return parseFloat(this.settingValue);
            case SettingDataType.BOOLEAN:
                return (this.settingValue === 'true' ||
                    this.settingValue === '1');
            case SettingDataType.JSON:
                return JSON.parse(this.settingValue);
            case SettingDataType.DATE:
                return new Date(this.settingValue);
            default:
                return this.settingValue;
        }
    }
    setValue(value) {
        switch (this.dataType) {
            case SettingDataType.JSON:
                this.settingValue = JSON.stringify(value);
                break;
            case SettingDataType.DATE:
                this.settingValue = value instanceof Date ? value.toISOString() : value;
                break;
            default:
                this.settingValue = String(value);
        }
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, category: { required: true, enum: require("./tenant-setting.entity").SettingCategory }, settingKey: { required: true, type: () => String }, settingValue: { required: true, type: () => String }, dataType: { required: true, enum: require("./tenant-setting.entity").SettingDataType }, displayName: { required: true, type: () => String }, description: { required: true, type: () => String }, defaultValue: { required: true, type: () => String }, isSystem: { required: true, type: () => Boolean }, isEncrypted: { required: true, type: () => Boolean }, validationRules: { required: true, type: () => Object }, updatedBy: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.TenantSetting = TenantSetting;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TenantSetting.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SettingCategory,
        default: SettingCategory.GENERAL,
    }),
    __metadata("design:type", String)
], TenantSetting.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'setting_key', length: 100, unique: true }),
    __metadata("design:type", String)
], TenantSetting.prototype, "settingKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'setting_value', type: 'text', nullable: true }),
    __metadata("design:type", String)
], TenantSetting.prototype, "settingValue", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'data_type',
        type: 'enum',
        enum: SettingDataType,
        default: SettingDataType.STRING,
    }),
    __metadata("design:type", String)
], TenantSetting.prototype, "dataType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'display_name', length: 200 }),
    __metadata("design:type", String)
], TenantSetting.prototype, "displayName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], TenantSetting.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'default_value', type: 'text', nullable: true }),
    __metadata("design:type", String)
], TenantSetting.prototype, "defaultValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_system', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], TenantSetting.prototype, "isSystem", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_encrypted', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], TenantSetting.prototype, "isEncrypted", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'validation_rules', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], TenantSetting.prototype, "validationRules", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_by', nullable: true }),
    __metadata("design:type", String)
], TenantSetting.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], TenantSetting.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], TenantSetting.prototype, "updatedAt", void 0);
exports.TenantSetting = TenantSetting = __decorate([
    (0, typeorm_1.Entity)('tenant_settings')
], TenantSetting);
//# sourceMappingURL=tenant-setting.entity.js.map