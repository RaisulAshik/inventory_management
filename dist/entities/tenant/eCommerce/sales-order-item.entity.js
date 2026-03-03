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
exports.SalesOrderItem = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const sales_order_entity_1 = require("./sales-order.entity");
const product_entity_1 = require("../inventory/product.entity");
const product_variant_entity_1 = require("../inventory/product-variant.entity");
const unit_of_measure_entity_1 = require("../inventory/unit-of-measure.entity");
const tax_category_entity_1 = require("../inventory/tax-category.entity");
let SalesOrderItem = class SalesOrderItem {
    id;
    salesOrderId;
    productId;
    variantId;
    sku;
    productName;
    variantName;
    quantityOrdered;
    quantityAllocated;
    quantityShipped;
    quantityDelivered;
    quantityReturned;
    quantityCancelled;
    uomId;
    unitPrice;
    originalPrice;
    discountPercentage;
    discountAmount;
    taxCategoryId;
    taxPercentage;
    taxAmount;
    lineTotal;
    costPrice;
    notes;
    createdAt;
    updatedAt;
    salesOrder;
    product;
    variant;
    uom;
    taxCategory;
    get quantityPending() {
        return this.quantityOrdered - this.quantityShipped - this.quantityCancelled;
    }
    get profitMargin() {
        if (!this.costPrice || this.costPrice === 0)
            return null;
        return ((this.unitPrice - this.costPrice) / this.costPrice) * 100;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, salesOrderId: { required: true, type: () => String }, productId: { required: true, type: () => String }, variantId: { required: true, type: () => String }, sku: { required: true, type: () => String }, productName: { required: true, type: () => String }, variantName: { required: true, type: () => String }, quantityOrdered: { required: true, type: () => Number }, quantityAllocated: { required: true, type: () => Number }, quantityShipped: { required: true, type: () => Number }, quantityDelivered: { required: true, type: () => Number }, quantityReturned: { required: true, type: () => Number }, quantityCancelled: { required: true, type: () => Number }, uomId: { required: true, type: () => String }, unitPrice: { required: true, type: () => Number }, originalPrice: { required: true, type: () => Number }, discountPercentage: { required: true, type: () => Number }, discountAmount: { required: true, type: () => Number }, taxCategoryId: { required: true, type: () => String }, taxPercentage: { required: true, type: () => Number }, taxAmount: { required: true, type: () => Number }, lineTotal: { required: true, type: () => Number }, costPrice: { required: true, type: () => Number }, notes: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, salesOrder: { required: true, type: () => require("./sales-order.entity").SalesOrder }, product: { required: true, type: () => require("../inventory/product.entity").Product }, variant: { required: true, type: () => require("../inventory/product-variant.entity").ProductVariant }, uom: { required: true, type: () => require("../inventory/unit-of-measure.entity").UnitOfMeasure }, taxCategory: { required: true, type: () => require("../inventory/tax-category.entity").TaxCategory } };
    }
};
exports.SalesOrderItem = SalesOrderItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SalesOrderItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sales_order_id' }),
    __metadata("design:type", String)
], SalesOrderItem.prototype, "salesOrderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", String)
], SalesOrderItem.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'variant_id', nullable: true }),
    __metadata("design:type", String)
], SalesOrderItem.prototype, "variantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], SalesOrderItem.prototype, "sku", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_name', length: 300 }),
    __metadata("design:type", String)
], SalesOrderItem.prototype, "productName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'variant_name', length: 300, nullable: true }),
    __metadata("design:type", String)
], SalesOrderItem.prototype, "variantName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'quantity_ordered',
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], SalesOrderItem.prototype, "quantityOrdered", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'quantity_allocated',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], SalesOrderItem.prototype, "quantityAllocated", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'quantity_shipped',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], SalesOrderItem.prototype, "quantityShipped", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'quantity_delivered',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], SalesOrderItem.prototype, "quantityDelivered", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'quantity_returned',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], SalesOrderItem.prototype, "quantityReturned", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'quantity_cancelled',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], SalesOrderItem.prototype, "quantityCancelled", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'uom_id', nullable: true }),
    __metadata("design:type", String)
], SalesOrderItem.prototype, "uomId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'unit_price',
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], SalesOrderItem.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'original_price',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], SalesOrderItem.prototype, "originalPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'discount_percentage',
        type: 'decimal',
        precision: 5,
        scale: 2,
        default: 0,
    }),
    __metadata("design:type", Number)
], SalesOrderItem.prototype, "discountPercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'discount_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], SalesOrderItem.prototype, "discountAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tax_category_id', nullable: true }),
    __metadata("design:type", String)
], SalesOrderItem.prototype, "taxCategoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'tax_percentage',
        type: 'decimal',
        precision: 5,
        scale: 2,
        default: 0,
    }),
    __metadata("design:type", Number)
], SalesOrderItem.prototype, "taxPercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'tax_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], SalesOrderItem.prototype, "taxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'line_total',
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], SalesOrderItem.prototype, "lineTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'cost_price',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], SalesOrderItem.prototype, "costPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SalesOrderItem.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SalesOrderItem.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], SalesOrderItem.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sales_order_entity_1.SalesOrder, (order) => order.items, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'sales_order_id' }),
    __metadata("design:type", sales_order_entity_1.SalesOrder)
], SalesOrderItem.prototype, "salesOrder", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], SalesOrderItem.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_variant_entity_1.ProductVariant),
    (0, typeorm_1.JoinColumn)({ name: 'variant_id' }),
    __metadata("design:type", product_variant_entity_1.ProductVariant)
], SalesOrderItem.prototype, "variant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => unit_of_measure_entity_1.UnitOfMeasure),
    (0, typeorm_1.JoinColumn)({ name: 'uom_id' }),
    __metadata("design:type", unit_of_measure_entity_1.UnitOfMeasure)
], SalesOrderItem.prototype, "uom", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tax_category_entity_1.TaxCategory),
    (0, typeorm_1.JoinColumn)({ name: 'tax_category_id' }),
    __metadata("design:type", tax_category_entity_1.TaxCategory)
], SalesOrderItem.prototype, "taxCategory", void 0);
exports.SalesOrderItem = SalesOrderItem = __decorate([
    (0, typeorm_1.Entity)('sales_order_items')
], SalesOrderItem);
//# sourceMappingURL=sales-order-item.entity.js.map