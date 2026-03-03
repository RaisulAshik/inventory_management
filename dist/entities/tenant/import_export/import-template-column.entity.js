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
exports.ImportTemplateColumn = exports.ColumnMappingType = exports.ColumnDataType = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const import_template_entity_1 = require("./import-template.entity");
var ColumnDataType;
(function (ColumnDataType) {
    ColumnDataType["STRING"] = "STRING";
    ColumnDataType["NUMBER"] = "NUMBER";
    ColumnDataType["DECIMAL"] = "DECIMAL";
    ColumnDataType["DATE"] = "DATE";
    ColumnDataType["DATETIME"] = "DATETIME";
    ColumnDataType["BOOLEAN"] = "BOOLEAN";
    ColumnDataType["EMAIL"] = "EMAIL";
    ColumnDataType["PHONE"] = "PHONE";
    ColumnDataType["URL"] = "URL";
})(ColumnDataType || (exports.ColumnDataType = ColumnDataType = {}));
var ColumnMappingType;
(function (ColumnMappingType) {
    ColumnMappingType["DIRECT"] = "DIRECT";
    ColumnMappingType["LOOKUP"] = "LOOKUP";
    ColumnMappingType["TRANSFORM"] = "TRANSFORM";
    ColumnMappingType["CONSTANT"] = "CONSTANT";
    ColumnMappingType["FORMULA"] = "FORMULA";
})(ColumnMappingType || (exports.ColumnMappingType = ColumnMappingType = {}));
let ImportTemplateColumn = class ImportTemplateColumn {
    id;
    templateId;
    columnOrder;
    sourceColumnName;
    sourceColumnIndex;
    targetFieldName;
    displayName;
    dataType;
    mappingType;
    isRequired;
    isUnique;
    defaultValue;
    lookupEntity;
    lookupField;
    lookupReturnField;
    transformExpression;
    validationRules;
    allowedValues;
    minLength;
    maxLength;
    minValue;
    maxValue;
    regexPattern;
    description;
    sampleValue;
    createdAt;
    updatedAt;
    template;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, templateId: { required: true, type: () => String }, columnOrder: { required: true, type: () => Number }, sourceColumnName: { required: true, type: () => String }, sourceColumnIndex: { required: true, type: () => Number }, targetFieldName: { required: true, type: () => String }, displayName: { required: true, type: () => String }, dataType: { required: true, enum: require("./import-template-column.entity").ColumnDataType }, mappingType: { required: true, enum: require("./import-template-column.entity").ColumnMappingType }, isRequired: { required: true, type: () => Boolean }, isUnique: { required: true, type: () => Boolean }, defaultValue: { required: true, type: () => String }, lookupEntity: { required: true, type: () => String }, lookupField: { required: true, type: () => String }, lookupReturnField: { required: true, type: () => String }, transformExpression: { required: true, type: () => String }, validationRules: { required: true, type: () => Object }, allowedValues: { required: true, type: () => [String] }, minLength: { required: true, type: () => Number }, maxLength: { required: true, type: () => Number }, minValue: { required: true, type: () => Number }, maxValue: { required: true, type: () => Number }, regexPattern: { required: true, type: () => String }, description: { required: true, type: () => String }, sampleValue: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, template: { required: true, type: () => require("./import-template.entity").ImportTemplate } };
    }
};
exports.ImportTemplateColumn = ImportTemplateColumn;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ImportTemplateColumn.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'template_id' }),
    __metadata("design:type", String)
], ImportTemplateColumn.prototype, "templateId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'column_order', type: 'int' }),
    __metadata("design:type", Number)
], ImportTemplateColumn.prototype, "columnOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'source_column_name', length: 200 }),
    __metadata("design:type", String)
], ImportTemplateColumn.prototype, "sourceColumnName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'source_column_index', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], ImportTemplateColumn.prototype, "sourceColumnIndex", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'target_field_name', length: 200 }),
    __metadata("design:type", String)
], ImportTemplateColumn.prototype, "targetFieldName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'display_name', length: 200 }),
    __metadata("design:type", String)
], ImportTemplateColumn.prototype, "displayName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'data_type',
        type: 'enum',
        enum: ColumnDataType,
        default: ColumnDataType.STRING,
    }),
    __metadata("design:type", String)
], ImportTemplateColumn.prototype, "dataType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'mapping_type',
        type: 'enum',
        enum: ColumnMappingType,
        default: ColumnMappingType.DIRECT,
    }),
    __metadata("design:type", String)
], ImportTemplateColumn.prototype, "mappingType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_required', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], ImportTemplateColumn.prototype, "isRequired", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_unique', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], ImportTemplateColumn.prototype, "isUnique", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'default_value', length: 500, nullable: true }),
    __metadata("design:type", String)
], ImportTemplateColumn.prototype, "defaultValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lookup_entity', length: 100, nullable: true }),
    __metadata("design:type", String)
], ImportTemplateColumn.prototype, "lookupEntity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lookup_field', length: 100, nullable: true }),
    __metadata("design:type", String)
], ImportTemplateColumn.prototype, "lookupField", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lookup_return_field', length: 100, nullable: true }),
    __metadata("design:type", String)
], ImportTemplateColumn.prototype, "lookupReturnField", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transform_expression', type: 'text', nullable: true }),
    __metadata("design:type", String)
], ImportTemplateColumn.prototype, "transformExpression", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'validation_rules', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], ImportTemplateColumn.prototype, "validationRules", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'allowed_values', type: 'json', nullable: true }),
    __metadata("design:type", Array)
], ImportTemplateColumn.prototype, "allowedValues", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'min_length', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], ImportTemplateColumn.prototype, "minLength", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_length', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], ImportTemplateColumn.prototype, "maxLength", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'min_value',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], ImportTemplateColumn.prototype, "minValue", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'max_value',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], ImportTemplateColumn.prototype, "maxValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'regex_pattern', length: 500, nullable: true }),
    __metadata("design:type", String)
], ImportTemplateColumn.prototype, "regexPattern", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ImportTemplateColumn.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sample_value', length: 500, nullable: true }),
    __metadata("design:type", String)
], ImportTemplateColumn.prototype, "sampleValue", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ImportTemplateColumn.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ImportTemplateColumn.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => import_template_entity_1.ImportTemplate, (template) => template.columns, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'template_id' }),
    __metadata("design:type", import_template_entity_1.ImportTemplate)
], ImportTemplateColumn.prototype, "template", void 0);
exports.ImportTemplateColumn = ImportTemplateColumn = __decorate([
    (0, typeorm_1.Entity)('import_template_columns')
], ImportTemplateColumn);
//# sourceMappingURL=import-template-column.entity.js.map