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
exports.ProductAttributeValue = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const product_attribute_entity_1 = require("./product-attribute.entity");
let ProductAttributeValue = class ProductAttributeValue {
    id;
    attributeId;
    valueCode;
    valueLabel;
    colorHex;
    imageUrl;
    sortOrder;
    isActive;
    createdAt;
    updatedAt;
    attribute;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, attributeId: { required: true, type: () => String }, valueCode: { required: true, type: () => String }, valueLabel: { required: true, type: () => String }, colorHex: { required: true, type: () => String }, imageUrl: { required: true, type: () => String }, sortOrder: { required: true, type: () => Number }, isActive: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, attribute: { required: true, type: () => require("./product-attribute.entity").ProductAttribute } };
    }
};
exports.ProductAttributeValue = ProductAttributeValue;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ProductAttributeValue.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'attribute_id' }),
    __metadata("design:type", String)
], ProductAttributeValue.prototype, "attributeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'value_code', length: 50 }),
    __metadata("design:type", String)
], ProductAttributeValue.prototype, "valueCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'value_label', length: 200 }),
    __metadata("design:type", String)
], ProductAttributeValue.prototype, "valueLabel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'color_hex', length: 7, nullable: true }),
    __metadata("design:type", String)
], ProductAttributeValue.prototype, "colorHex", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'image_url', length: 500, nullable: true }),
    __metadata("design:type", String)
], ProductAttributeValue.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sort_order', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ProductAttributeValue.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], ProductAttributeValue.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ProductAttributeValue.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ProductAttributeValue.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_attribute_entity_1.ProductAttribute, (attribute) => attribute.values, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'attribute_id' }),
    __metadata("design:type", product_attribute_entity_1.ProductAttribute)
], ProductAttributeValue.prototype, "attribute", void 0);
exports.ProductAttributeValue = ProductAttributeValue = __decorate([
    (0, typeorm_1.Entity)('product_attribute_values')
], ProductAttributeValue);
//# sourceMappingURL=product-attribute-value.entity.js.map