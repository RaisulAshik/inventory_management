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
exports.SupplierProduct = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const supplier_entity_1 = require("./supplier.entity");
const product_entity_1 = require("./product.entity");
const product_variant_entity_1 = require("./product-variant.entity");
const unit_of_measure_entity_1 = require("./unit-of-measure.entity");
let SupplierProduct = class SupplierProduct {
    id;
    supplierId;
    productId;
    variantId;
    supplierSku;
    supplierProductName;
    purchaseUomId;
    conversionFactor;
    unitPrice;
    currency;
    minOrderQuantity;
    packSize;
    leadTimeDays;
    isPreferred;
    isActive;
    lastPurchaseDate;
    lastPurchasePrice;
    notes;
    createdAt;
    updatedAt;
    supplier;
    product;
    variant;
    purchaseUom;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, supplierId: { required: true, type: () => String }, productId: { required: true, type: () => String }, variantId: { required: true, type: () => String }, supplierSku: { required: true, type: () => String }, supplierProductName: { required: true, type: () => String }, purchaseUomId: { required: true, type: () => String }, conversionFactor: { required: true, type: () => Number }, unitPrice: { required: true, type: () => Number }, currency: { required: true, type: () => String }, minOrderQuantity: { required: true, type: () => Number }, packSize: { required: true, type: () => Number }, leadTimeDays: { required: true, type: () => Number }, isPreferred: { required: true, type: () => Boolean }, isActive: { required: true, type: () => Boolean }, lastPurchaseDate: { required: true, type: () => Date }, lastPurchasePrice: { required: true, type: () => Number }, notes: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, supplier: { required: true, type: () => require("./supplier.entity").Supplier }, product: { required: true, type: () => require("./product.entity").Product }, variant: { required: true, type: () => require("./product-variant.entity").ProductVariant }, purchaseUom: { required: true, type: () => require("./unit-of-measure.entity").UnitOfMeasure } };
    }
};
exports.SupplierProduct = SupplierProduct;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SupplierProduct.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supplier_id' }),
    __metadata("design:type", String)
], SupplierProduct.prototype, "supplierId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", String)
], SupplierProduct.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'variant_id', nullable: true }),
    __metadata("design:type", String)
], SupplierProduct.prototype, "variantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supplier_sku', length: 100, nullable: true }),
    __metadata("design:type", String)
], SupplierProduct.prototype, "supplierSku", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supplier_product_name', length: 300, nullable: true }),
    __metadata("design:type", String)
], SupplierProduct.prototype, "supplierProductName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'purchase_uom_id', nullable: true }),
    __metadata("design:type", String)
], SupplierProduct.prototype, "purchaseUomId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'conversion_factor',
        type: 'decimal',
        precision: 18,
        scale: 8,
        default: 1,
    }),
    __metadata("design:type", Number)
], SupplierProduct.prototype, "conversionFactor", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'unit_price',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], SupplierProduct.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 3, default: 'INR' }),
    __metadata("design:type", String)
], SupplierProduct.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'min_order_quantity',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], SupplierProduct.prototype, "minOrderQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'pack_size',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], SupplierProduct.prototype, "packSize", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lead_time_days', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], SupplierProduct.prototype, "leadTimeDays", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_preferred', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], SupplierProduct.prototype, "isPreferred", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], SupplierProduct.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_purchase_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], SupplierProduct.prototype, "lastPurchaseDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'last_purchase_price',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], SupplierProduct.prototype, "lastPurchasePrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SupplierProduct.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SupplierProduct.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], SupplierProduct.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => supplier_entity_1.Supplier, (supplier) => supplier.supplierProducts, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'supplier_id' }),
    __metadata("design:type", supplier_entity_1.Supplier)
], SupplierProduct.prototype, "supplier", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], SupplierProduct.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_variant_entity_1.ProductVariant),
    (0, typeorm_1.JoinColumn)({ name: 'variant_id' }),
    __metadata("design:type", product_variant_entity_1.ProductVariant)
], SupplierProduct.prototype, "variant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => unit_of_measure_entity_1.UnitOfMeasure),
    (0, typeorm_1.JoinColumn)({ name: 'purchase_uom_id' }),
    __metadata("design:type", unit_of_measure_entity_1.UnitOfMeasure)
], SupplierProduct.prototype, "purchaseUom", void 0);
exports.SupplierProduct = SupplierProduct = __decorate([
    (0, typeorm_1.Entity)('supplier_products')
], SupplierProduct);
//# sourceMappingURL=supplier-product.entity.js.map