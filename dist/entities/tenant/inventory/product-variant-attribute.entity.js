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
exports.ProductVariantAttribute = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const product_variant_entity_1 = require("./product-variant.entity");
const product_attribute_entity_1 = require("./product-attribute.entity");
const product_attribute_value_entity_1 = require("./product-attribute-value.entity");
let ProductVariantAttribute = class ProductVariantAttribute {
    id;
    variantId;
    attributeId;
    attributeValueId;
    customValue;
    createdAt;
    variant;
    attribute;
    attributeValue;
    get displayValue() {
        return this.attributeValue?.valueLabel || this.customValue || '';
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, variantId: { required: true, type: () => String }, attributeId: { required: true, type: () => String }, attributeValueId: { required: true, type: () => String }, customValue: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, variant: { required: true, type: () => require("./product-variant.entity").ProductVariant }, attribute: { required: true, type: () => require("./product-attribute.entity").ProductAttribute }, attributeValue: { required: true, type: () => require("./product-attribute-value.entity").ProductAttributeValue } };
    }
};
exports.ProductVariantAttribute = ProductVariantAttribute;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ProductVariantAttribute.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'variant_id' }),
    __metadata("design:type", String)
], ProductVariantAttribute.prototype, "variantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'attribute_id' }),
    __metadata("design:type", String)
], ProductVariantAttribute.prototype, "attributeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'attribute_value_id', nullable: true }),
    __metadata("design:type", String)
], ProductVariantAttribute.prototype, "attributeValueId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'custom_value', length: 500, nullable: true }),
    __metadata("design:type", String)
], ProductVariantAttribute.prototype, "customValue", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ProductVariantAttribute.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_variant_entity_1.ProductVariant, (variant) => variant.attributes, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'variant_id' }),
    __metadata("design:type", product_variant_entity_1.ProductVariant)
], ProductVariantAttribute.prototype, "variant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_attribute_entity_1.ProductAttribute),
    (0, typeorm_1.JoinColumn)({ name: 'attribute_id' }),
    __metadata("design:type", product_attribute_entity_1.ProductAttribute)
], ProductVariantAttribute.prototype, "attribute", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_attribute_value_entity_1.ProductAttributeValue),
    (0, typeorm_1.JoinColumn)({ name: 'attribute_value_id' }),
    __metadata("design:type", product_attribute_value_entity_1.ProductAttributeValue)
], ProductVariantAttribute.prototype, "attributeValue", void 0);
exports.ProductVariantAttribute = ProductVariantAttribute = __decorate([
    (0, typeorm_1.Entity)('product_variant_attributes')
], ProductVariantAttribute);
//# sourceMappingURL=product-variant-attribute.entity.js.map