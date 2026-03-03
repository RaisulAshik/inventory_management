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
exports.ProductVariant = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const product_entity_1 = require("./product.entity");
const product_variant_attribute_entity_1 = require("./product-variant-attribute.entity");
let ProductVariant = class ProductVariant {
    id;
    productId;
    variantSku;
    variantBarcode;
    variantName;
    costPrice;
    sellingPrice;
    mrp;
    weight;
    imageUrl;
    isActive;
    createdAt;
    updatedAt;
    product;
    attributes;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, productId: { required: true, type: () => String }, variantSku: { required: true, type: () => String }, variantBarcode: { required: true, type: () => String }, variantName: { required: true, type: () => String }, costPrice: { required: true, type: () => Number }, sellingPrice: { required: true, type: () => Number }, mrp: { required: true, type: () => Number }, weight: { required: true, type: () => Number }, imageUrl: { required: true, type: () => String }, isActive: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, product: { required: true, type: () => require("./product.entity").Product }, attributes: { required: true, type: () => [require("./product-variant-attribute.entity").ProductVariantAttribute] } };
    }
};
exports.ProductVariant = ProductVariant;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ProductVariant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", String)
], ProductVariant.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'variant_sku', length: 100, unique: true }),
    __metadata("design:type", String)
], ProductVariant.prototype, "variantSku", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'variant_barcode',
        length: 100,
        unique: true,
        nullable: true,
    }),
    __metadata("design:type", String)
], ProductVariant.prototype, "variantBarcode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'variant_name', length: 300 }),
    __metadata("design:type", String)
], ProductVariant.prototype, "variantName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'cost_price',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], ProductVariant.prototype, "costPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'selling_price',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], ProductVariant.prototype, "sellingPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], ProductVariant.prototype, "mrp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], ProductVariant.prototype, "weight", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'image_url', length: 500, nullable: true }),
    __metadata("design:type", String)
], ProductVariant.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], ProductVariant.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ProductVariant.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ProductVariant.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, (product) => product.variants, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], ProductVariant.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_variant_attribute_entity_1.ProductVariantAttribute, (attr) => attr.variant),
    __metadata("design:type", Array)
], ProductVariant.prototype, "attributes", void 0);
exports.ProductVariant = ProductVariant = __decorate([
    (0, typeorm_1.Entity)('product_variants')
], ProductVariant);
//# sourceMappingURL=product-variant.entity.js.map