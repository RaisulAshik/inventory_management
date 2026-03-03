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
exports.PurchaseOrderItem = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const purchase_order_entity_1 = require("./purchase-order.entity");
const product_entity_1 = require("../inventory/product.entity");
const product_variant_entity_1 = require("../inventory/product-variant.entity");
const unit_of_measure_entity_1 = require("../inventory/unit-of-measure.entity");
const tax_category_entity_1 = require("../inventory/tax-category.entity");
let PurchaseOrderItem = class PurchaseOrderItem {
    id;
    purchaseOrderId;
    productId;
    variantId;
    description;
    quantityOrdered;
    quantityReceived;
    quantityRejected;
    uomId;
    unitPrice;
    discountPercentage;
    discountAmount;
    taxCategoryId;
    taxAmount;
    lineTotal;
    expectedDate;
    notes;
    createdAt;
    updatedAt;
    purchaseOrder;
    product;
    variant;
    uom;
    taxCategory;
    get quantityPending() {
        return this.quantityOrdered - this.quantityReceived - this.quantityRejected;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, purchaseOrderId: { required: true, type: () => String }, productId: { required: true, type: () => String }, variantId: { required: true, type: () => String }, description: { required: true, type: () => String }, quantityOrdered: { required: true, type: () => Number }, quantityReceived: { required: true, type: () => Number }, quantityRejected: { required: true, type: () => Number }, uomId: { required: true, type: () => String }, unitPrice: { required: true, type: () => Number }, discountPercentage: { required: true, type: () => Number }, discountAmount: { required: true, type: () => Number }, taxCategoryId: { required: true, type: () => String }, taxAmount: { required: true, type: () => Number }, lineTotal: { required: true, type: () => Number }, expectedDate: { required: true, type: () => Date }, notes: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, purchaseOrder: { required: true, type: () => require("./purchase-order.entity").PurchaseOrder }, product: { required: true, type: () => require("../inventory/product.entity").Product }, variant: { required: true, type: () => require("../inventory/product-variant.entity").ProductVariant }, uom: { required: true, type: () => require("../inventory/unit-of-measure.entity").UnitOfMeasure }, taxCategory: { required: true, type: () => require("../inventory/tax-category.entity").TaxCategory } };
    }
};
exports.PurchaseOrderItem = PurchaseOrderItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PurchaseOrderItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'purchase_order_id' }),
    __metadata("design:type", String)
], PurchaseOrderItem.prototype, "purchaseOrderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", String)
], PurchaseOrderItem.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'variant_id', nullable: true }),
    __metadata("design:type", String)
], PurchaseOrderItem.prototype, "variantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PurchaseOrderItem.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'quantity_ordered',
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], PurchaseOrderItem.prototype, "quantityOrdered", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'quantity_received',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], PurchaseOrderItem.prototype, "quantityReceived", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'quantity_rejected',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], PurchaseOrderItem.prototype, "quantityRejected", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'uom_id' }),
    __metadata("design:type", String)
], PurchaseOrderItem.prototype, "uomId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'unit_price',
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], PurchaseOrderItem.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'discount_percentage',
        type: 'decimal',
        precision: 5,
        scale: 2,
        default: 0,
    }),
    __metadata("design:type", Number)
], PurchaseOrderItem.prototype, "discountPercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'discount_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], PurchaseOrderItem.prototype, "discountAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tax_category_id', nullable: true }),
    __metadata("design:type", String)
], PurchaseOrderItem.prototype, "taxCategoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'tax_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], PurchaseOrderItem.prototype, "taxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'line_total',
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], PurchaseOrderItem.prototype, "lineTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expected_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], PurchaseOrderItem.prototype, "expectedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PurchaseOrderItem.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PurchaseOrderItem.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], PurchaseOrderItem.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => purchase_order_entity_1.PurchaseOrder, (po) => po.items, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'purchase_order_id' }),
    __metadata("design:type", purchase_order_entity_1.PurchaseOrder)
], PurchaseOrderItem.prototype, "purchaseOrder", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], PurchaseOrderItem.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_variant_entity_1.ProductVariant),
    (0, typeorm_1.JoinColumn)({ name: 'variant_id' }),
    __metadata("design:type", product_variant_entity_1.ProductVariant)
], PurchaseOrderItem.prototype, "variant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => unit_of_measure_entity_1.UnitOfMeasure),
    (0, typeorm_1.JoinColumn)({ name: 'uom_id' }),
    __metadata("design:type", unit_of_measure_entity_1.UnitOfMeasure)
], PurchaseOrderItem.prototype, "uom", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tax_category_entity_1.TaxCategory),
    (0, typeorm_1.JoinColumn)({ name: 'tax_category_id' }),
    __metadata("design:type", tax_category_entity_1.TaxCategory)
], PurchaseOrderItem.prototype, "taxCategory", void 0);
exports.PurchaseOrderItem = PurchaseOrderItem = __decorate([
    (0, typeorm_1.Entity)('purchase_order_items')
], PurchaseOrderItem);
//# sourceMappingURL=purchase-order-item.entity.js.map