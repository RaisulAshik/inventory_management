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
exports.ProductAttribute = exports.AttributeType = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const product_attribute_value_entity_1 = require("./product-attribute-value.entity");
var AttributeType;
(function (AttributeType) {
    AttributeType["TEXT"] = "TEXT";
    AttributeType["NUMBER"] = "NUMBER";
    AttributeType["SELECT"] = "SELECT";
    AttributeType["MULTI_SELECT"] = "MULTI_SELECT";
    AttributeType["BOOLEAN"] = "BOOLEAN";
    AttributeType["DATE"] = "DATE";
    AttributeType["COLOR"] = "COLOR";
})(AttributeType || (exports.AttributeType = AttributeType = {}));
let ProductAttribute = class ProductAttribute {
    id;
    attributeCode;
    attributeName;
    attributeType;
    description;
    isRequired;
    isFilterable;
    isSearchable;
    isVisibleOnFront;
    isUsedForVariants;
    sortOrder;
    validationRules;
    isActive;
    createdAt;
    updatedAt;
    values;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, attributeCode: { required: true, type: () => String }, attributeName: { required: true, type: () => String }, attributeType: { required: true, enum: require("./product-attribute.entity").AttributeType }, description: { required: true, type: () => String }, isRequired: { required: true, type: () => Boolean }, isFilterable: { required: true, type: () => Boolean }, isSearchable: { required: true, type: () => Boolean }, isVisibleOnFront: { required: true, type: () => Boolean }, isUsedForVariants: { required: true, type: () => Boolean }, sortOrder: { required: true, type: () => Number }, validationRules: { required: true, type: () => Object }, isActive: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, values: { required: true, type: () => [require("./product-attribute-value.entity").ProductAttributeValue] } };
    }
};
exports.ProductAttribute = ProductAttribute;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ProductAttribute.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'attribute_code', length: 50, unique: true }),
    __metadata("design:type", String)
], ProductAttribute.prototype, "attributeCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'attribute_name', length: 100 }),
    __metadata("design:type", String)
], ProductAttribute.prototype, "attributeName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'attribute_type',
        type: 'enum',
        enum: AttributeType,
        default: AttributeType.TEXT,
    }),
    __metadata("design:type", String)
], ProductAttribute.prototype, "attributeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ProductAttribute.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_required', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], ProductAttribute.prototype, "isRequired", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_filterable', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], ProductAttribute.prototype, "isFilterable", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_searchable', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], ProductAttribute.prototype, "isSearchable", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_visible_on_front', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], ProductAttribute.prototype, "isVisibleOnFront", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_used_for_variants', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], ProductAttribute.prototype, "isUsedForVariants", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sort_order', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ProductAttribute.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'validation_rules', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], ProductAttribute.prototype, "validationRules", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], ProductAttribute.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ProductAttribute.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ProductAttribute.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_attribute_value_entity_1.ProductAttributeValue, (value) => value.attribute),
    __metadata("design:type", Array)
], ProductAttribute.prototype, "values", void 0);
exports.ProductAttribute = ProductAttribute = __decorate([
    (0, typeorm_1.Entity)('product_attributes')
], ProductAttribute);
//# sourceMappingURL=product-attribute.entity.js.map