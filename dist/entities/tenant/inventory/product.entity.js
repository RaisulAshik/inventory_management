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
exports.Product = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const enums_1 = require("../../../common/enums");
const product_category_entity_1 = require("./product-category.entity");
const brand_entity_1 = require("./brand.entity");
const unit_of_measure_entity_1 = require("./unit-of-measure.entity");
const tax_category_entity_1 = require("./tax-category.entity");
const product_variant_entity_1 = require("./product-variant.entity");
const product_image_entity_1 = require("./product-image.entity");
const inventory_stock_entity_1 = require("../warehouse/inventory-stock.entity");
let Product = class Product {
    id;
    sku;
    barcode;
    productName;
    shortName;
    description;
    categoryId;
    brandId;
    baseUomId;
    secondaryUomId;
    uomConversionFactor;
    productType;
    isStockable;
    isPurchasable;
    isSellable;
    isActive;
    trackSerial;
    trackBatch;
    trackExpiry;
    shelfLifeDays;
    hsnCode;
    taxCategoryId;
    costPrice;
    sellingPrice;
    mrp;
    minimumPrice;
    wholesalePrice;
    weight;
    weightUnit;
    length;
    width;
    height;
    dimensionUnit;
    reorderLevel;
    reorderQuantity;
    minimumOrderQuantity;
    maximumOrderQuantity;
    leadTimeDays;
    warrantyMonths;
    notes;
    createdBy;
    createdAt;
    updatedAt;
    deletedAt;
    category;
    brand;
    baseUom;
    secondaryUom;
    taxCategory;
    variants;
    images;
    inventoryStocks;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, sku: { required: true, type: () => String }, barcode: { required: true, type: () => String }, productName: { required: true, type: () => String }, shortName: { required: true, type: () => String }, description: { required: true, type: () => String }, categoryId: { required: true, type: () => String }, brandId: { required: true, type: () => String }, baseUomId: { required: true, type: () => String }, secondaryUomId: { required: true, type: () => String }, uomConversionFactor: { required: true, type: () => Number }, productType: { required: true, enum: require("../../../common/enums/index").ProductType }, isStockable: { required: true, type: () => Boolean }, isPurchasable: { required: true, type: () => Boolean }, isSellable: { required: true, type: () => Boolean }, isActive: { required: true, type: () => Boolean }, trackSerial: { required: true, type: () => Boolean }, trackBatch: { required: true, type: () => Boolean }, trackExpiry: { required: true, type: () => Boolean }, shelfLifeDays: { required: true, type: () => Number }, hsnCode: { required: true, type: () => String }, taxCategoryId: { required: true, type: () => String }, costPrice: { required: true, type: () => Number }, sellingPrice: { required: true, type: () => Number }, mrp: { required: true, type: () => Number }, minimumPrice: { required: true, type: () => Number }, wholesalePrice: { required: true, type: () => Number }, weight: { required: true, type: () => Number }, weightUnit: { required: true, type: () => String }, length: { required: true, type: () => Number }, width: { required: true, type: () => Number }, height: { required: true, type: () => Number }, dimensionUnit: { required: true, type: () => String }, reorderLevel: { required: true, type: () => Number }, reorderQuantity: { required: true, type: () => Number }, minimumOrderQuantity: { required: true, type: () => Number }, maximumOrderQuantity: { required: true, type: () => Number }, leadTimeDays: { required: true, type: () => Number }, warrantyMonths: { required: true, type: () => Number }, notes: { required: true, type: () => String }, createdBy: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, deletedAt: { required: true, type: () => Date }, category: { required: true, type: () => require("./product-category.entity").ProductCategory }, brand: { required: true, type: () => require("./brand.entity").Brand }, baseUom: { required: true, type: () => require("./unit-of-measure.entity").UnitOfMeasure }, secondaryUom: { required: true, type: () => require("./unit-of-measure.entity").UnitOfMeasure }, taxCategory: { required: true, type: () => require("./tax-category.entity").TaxCategory }, variants: { required: true, type: () => [require("./product-variant.entity").ProductVariant] }, images: { required: true, type: () => [require("./product-image.entity").ProductImage] }, inventoryStocks: { required: true, type: () => [require("../warehouse/inventory-stock.entity").InventoryStock] } };
    }
};
exports.Product = Product;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Product.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, unique: true }),
    __metadata("design:type", String)
], Product.prototype, "sku", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, unique: true, nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "barcode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_name', length: 300 }),
    __metadata("design:type", String)
], Product.prototype, "productName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'short_name', length: 100, nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "shortName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'category_id', nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'brand_id', nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "brandId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'base_uom_id' }),
    __metadata("design:type", String)
], Product.prototype, "baseUomId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'secondary_uom_id', nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "secondaryUomId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'uom_conversion_factor',
        type: 'decimal',
        precision: 18,
        scale: 8,
        nullable: true,
    }),
    __metadata("design:type", Number)
], Product.prototype, "uomConversionFactor", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'product_type',
        type: 'enum',
        enum: enums_1.ProductType,
        default: enums_1.ProductType.GOODS,
    }),
    __metadata("design:type", String)
], Product.prototype, "productType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_stockable', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], Product.prototype, "isStockable", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_purchasable', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], Product.prototype, "isPurchasable", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_sellable', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], Product.prototype, "isSellable", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], Product.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'track_serial', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], Product.prototype, "trackSerial", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'track_batch', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], Product.prototype, "trackBatch", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'track_expiry', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], Product.prototype, "trackExpiry", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shelf_life_days', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Product.prototype, "shelfLifeDays", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'hsn_code', length: 20, nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "hsnCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tax_category_id' }),
    __metadata("design:type", String)
], Product.prototype, "taxCategoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'cost_price',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], Product.prototype, "costPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'selling_price',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], Product.prototype, "sellingPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], Product.prototype, "mrp", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'minimum_price',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], Product.prototype, "minimumPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'wholesale_price',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], Product.prototype, "wholesalePrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], Product.prototype, "weight", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'weight_unit', length: 20, nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "weightUnit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], Product.prototype, "length", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], Product.prototype, "width", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], Product.prototype, "height", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'dimension_unit', length: 20, nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "dimensionUnit", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'reorder_level',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], Product.prototype, "reorderLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'reorder_quantity',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], Product.prototype, "reorderQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'minimum_order_quantity',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 1,
    }),
    __metadata("design:type", Number)
], Product.prototype, "minimumOrderQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'maximum_order_quantity',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], Product.prototype, "maximumOrderQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lead_time_days', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Product.prototype, "leadTimeDays", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warranty_months', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Product.prototype, "warrantyMonths", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Product.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Product.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], Product.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_category_entity_1.ProductCategory, (category) => category.products, {
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'category_id' }),
    __metadata("design:type", product_category_entity_1.ProductCategory)
], Product.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => brand_entity_1.Brand, (brand) => brand.products, {
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'brand_id' }),
    __metadata("design:type", brand_entity_1.Brand)
], Product.prototype, "brand", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => unit_of_measure_entity_1.UnitOfMeasure, (uom) => uom.products),
    (0, typeorm_1.JoinColumn)({ name: 'base_uom_id' }),
    __metadata("design:type", unit_of_measure_entity_1.UnitOfMeasure)
], Product.prototype, "baseUom", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => unit_of_measure_entity_1.UnitOfMeasure),
    (0, typeorm_1.JoinColumn)({ name: 'secondary_uom_id' }),
    __metadata("design:type", unit_of_measure_entity_1.UnitOfMeasure)
], Product.prototype, "secondaryUom", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tax_category_entity_1.TaxCategory, (taxCategory) => taxCategory.products),
    (0, typeorm_1.JoinColumn)({ name: 'tax_category_id' }),
    __metadata("design:type", tax_category_entity_1.TaxCategory)
], Product.prototype, "taxCategory", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_variant_entity_1.ProductVariant, (variant) => variant.product),
    __metadata("design:type", Array)
], Product.prototype, "variants", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_image_entity_1.ProductImage, (image) => image.product),
    __metadata("design:type", Array)
], Product.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => inventory_stock_entity_1.InventoryStock, (stock) => stock.product),
    __metadata("design:type", Array)
], Product.prototype, "inventoryStocks", void 0);
exports.Product = Product = __decorate([
    (0, typeorm_1.Entity)('products')
], Product);
//# sourceMappingURL=product.entity.js.map