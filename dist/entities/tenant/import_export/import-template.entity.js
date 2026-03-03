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
exports.ImportTemplate = exports.ImportEntityType = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const import_template_column_entity_1 = require("./import-template-column.entity");
var ImportEntityType;
(function (ImportEntityType) {
    ImportEntityType["PRODUCTS"] = "PRODUCTS";
    ImportEntityType["CUSTOMERS"] = "CUSTOMERS";
    ImportEntityType["SUPPLIERS"] = "SUPPLIERS";
    ImportEntityType["INVENTORY_STOCK"] = "INVENTORY_STOCK";
    ImportEntityType["PRICE_LIST"] = "PRICE_LIST";
    ImportEntityType["SALES_ORDERS"] = "SALES_ORDERS";
    ImportEntityType["PURCHASE_ORDERS"] = "PURCHASE_ORDERS";
    ImportEntityType["CHART_OF_ACCOUNTS"] = "CHART_OF_ACCOUNTS";
    ImportEntityType["JOURNAL_ENTRIES"] = "JOURNAL_ENTRIES";
    ImportEntityType["OPENING_BALANCES"] = "OPENING_BALANCES";
    ImportEntityType["CATEGORIES"] = "CATEGORIES";
    ImportEntityType["BRANDS"] = "BRANDS";
    ImportEntityType["WAREHOUSES"] = "WAREHOUSES";
    ImportEntityType["LOCATIONS"] = "LOCATIONS";
})(ImportEntityType || (exports.ImportEntityType = ImportEntityType = {}));
let ImportTemplate = class ImportTemplate {
    id;
    templateCode;
    templateName;
    description;
    entityType;
    fileFormat;
    hasHeaderRow;
    headerRowNumber;
    dataStartRow;
    sheetName;
    dateFormat;
    numberFormat;
    delimiter;
    textQualifier;
    encoding;
    sampleFileUrl;
    isSystem;
    isActive;
    createdBy;
    createdAt;
    updatedAt;
    columns;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, templateCode: { required: true, type: () => String }, templateName: { required: true, type: () => String }, description: { required: true, type: () => String }, entityType: { required: true, enum: require("./import-template.entity").ImportEntityType }, fileFormat: { required: true, type: () => Object }, hasHeaderRow: { required: true, type: () => Boolean }, headerRowNumber: { required: true, type: () => Number }, dataStartRow: { required: true, type: () => Number }, sheetName: { required: true, type: () => String }, dateFormat: { required: true, type: () => String }, numberFormat: { required: true, type: () => String }, delimiter: { required: true, type: () => String }, textQualifier: { required: true, type: () => String }, encoding: { required: true, type: () => String }, sampleFileUrl: { required: true, type: () => String }, isSystem: { required: true, type: () => Boolean }, isActive: { required: true, type: () => Boolean }, createdBy: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, columns: { required: true, type: () => [require("./import-template-column.entity").ImportTemplateColumn] } };
    }
};
exports.ImportTemplate = ImportTemplate;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ImportTemplate.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'template_code', length: 50, unique: true }),
    __metadata("design:type", String)
], ImportTemplate.prototype, "templateCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'template_name', length: 200 }),
    __metadata("design:type", String)
], ImportTemplate.prototype, "templateName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ImportTemplate.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'entity_type',
        type: 'enum',
        enum: ImportEntityType,
    }),
    __metadata("design:type", String)
], ImportTemplate.prototype, "entityType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'file_format',
        type: 'enum',
        enum: ['XLSX', 'CSV', 'TSV'],
        default: 'XLSX',
    }),
    __metadata("design:type", String)
], ImportTemplate.prototype, "fileFormat", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'has_header_row', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], ImportTemplate.prototype, "hasHeaderRow", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'header_row_number', type: 'int', default: 1 }),
    __metadata("design:type", Number)
], ImportTemplate.prototype, "headerRowNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'data_start_row', type: 'int', default: 2 }),
    __metadata("design:type", Number)
], ImportTemplate.prototype, "dataStartRow", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sheet_name', length: 100, nullable: true }),
    __metadata("design:type", String)
], ImportTemplate.prototype, "sheetName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date_format', length: 50, default: 'YYYY-MM-DD' }),
    __metadata("design:type", String)
], ImportTemplate.prototype, "dateFormat", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'number_format', length: 50, nullable: true }),
    __metadata("design:type", String)
], ImportTemplate.prototype, "numberFormat", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'delimiter', length: 10, nullable: true }),
    __metadata("design:type", String)
], ImportTemplate.prototype, "delimiter", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'text_qualifier', length: 10, nullable: true }),
    __metadata("design:type", String)
], ImportTemplate.prototype, "textQualifier", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'encoding', length: 50, default: 'UTF-8' }),
    __metadata("design:type", String)
], ImportTemplate.prototype, "encoding", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sample_file_url', length: 500, nullable: true }),
    __metadata("design:type", String)
], ImportTemplate.prototype, "sampleFileUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_system', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], ImportTemplate.prototype, "isSystem", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], ImportTemplate.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", String)
], ImportTemplate.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ImportTemplate.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ImportTemplate.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => import_template_column_entity_1.ImportTemplateColumn, (column) => column.template),
    __metadata("design:type", Array)
], ImportTemplate.prototype, "columns", void 0);
exports.ImportTemplate = ImportTemplate = __decorate([
    (0, typeorm_1.Entity)('import_templates')
], ImportTemplate);
//# sourceMappingURL=import-template.entity.js.map