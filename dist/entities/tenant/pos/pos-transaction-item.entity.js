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
exports.PosTransactionItem = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const pos_transaction_entity_1 = require("./pos-transaction.entity");
const product_entity_1 = require("../inventory/product.entity");
const product_variant_entity_1 = require("../inventory/product-variant.entity");
const unit_of_measure_entity_1 = require("../inventory/unit-of-measure.entity");
let PosTransactionItem = class PosTransactionItem {
    id;
    transactionId;
    productId;
    variantId;
    sku;
    productName;
    quantity;
    uomId;
    unitPrice;
    originalPrice;
    discountPercentage;
    discountAmount;
    taxPercentage;
    taxAmount;
    lineTotal;
    costPrice;
    serialNumber;
    batchNumber;
    isReturnItem;
    returnReason;
    originalTransactionItemId;
    notes;
    createdAt;
    transaction;
    product;
    variant;
    uom;
    get profitMargin() {
        if (!this.costPrice || this.costPrice === 0)
            return null;
        return ((this.unitPrice - this.costPrice) / this.costPrice) * 100;
    }
    get grossProfit() {
        if (!this.costPrice)
            return null;
        return (this.unitPrice - this.costPrice) * this.quantity;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, transactionId: { required: true, type: () => String }, productId: { required: true, type: () => String }, variantId: { required: true, type: () => String }, sku: { required: true, type: () => String }, productName: { required: true, type: () => String }, quantity: { required: true, type: () => Number }, uomId: { required: true, type: () => String }, unitPrice: { required: true, type: () => Number }, originalPrice: { required: true, type: () => Number }, discountPercentage: { required: true, type: () => Number }, discountAmount: { required: true, type: () => Number }, taxPercentage: { required: true, type: () => Number }, taxAmount: { required: true, type: () => Number }, lineTotal: { required: true, type: () => Number }, costPrice: { required: true, type: () => Number }, serialNumber: { required: true, type: () => String }, batchNumber: { required: true, type: () => String }, isReturnItem: { required: true, type: () => Boolean }, returnReason: { required: true, type: () => String }, originalTransactionItemId: { required: true, type: () => String }, notes: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, transaction: { required: true, type: () => require("./pos-transaction.entity").PosTransaction }, product: { required: true, type: () => require("../inventory/product.entity").Product }, variant: { required: true, type: () => require("../inventory/product-variant.entity").ProductVariant }, uom: { required: true, type: () => require("../inventory/unit-of-measure.entity").UnitOfMeasure } };
    }
};
exports.PosTransactionItem = PosTransactionItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PosTransactionItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transaction_id' }),
    __metadata("design:type", String)
], PosTransactionItem.prototype, "transactionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", String)
], PosTransactionItem.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'variant_id', nullable: true }),
    __metadata("design:type", String)
], PosTransactionItem.prototype, "variantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], PosTransactionItem.prototype, "sku", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_name', length: 300 }),
    __metadata("design:type", String)
], PosTransactionItem.prototype, "productName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], PosTransactionItem.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'uom_id' }),
    __metadata("design:type", String)
], PosTransactionItem.prototype, "uomId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'unit_price',
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], PosTransactionItem.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'original_price',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], PosTransactionItem.prototype, "originalPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'discount_percentage',
        type: 'decimal',
        precision: 5,
        scale: 2,
        default: 0,
    }),
    __metadata("design:type", Number)
], PosTransactionItem.prototype, "discountPercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'discount_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], PosTransactionItem.prototype, "discountAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'tax_percentage',
        type: 'decimal',
        precision: 5,
        scale: 2,
        default: 0,
    }),
    __metadata("design:type", Number)
], PosTransactionItem.prototype, "taxPercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'tax_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], PosTransactionItem.prototype, "taxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'line_total',
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], PosTransactionItem.prototype, "lineTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'cost_price',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], PosTransactionItem.prototype, "costPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'serial_number', length: 100, nullable: true }),
    __metadata("design:type", String)
], PosTransactionItem.prototype, "serialNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'batch_number', length: 100, nullable: true }),
    __metadata("design:type", String)
], PosTransactionItem.prototype, "batchNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_return_item', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], PosTransactionItem.prototype, "isReturnItem", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'return_reason', type: 'text', nullable: true }),
    __metadata("design:type", String)
], PosTransactionItem.prototype, "returnReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'original_transaction_item_id', nullable: true }),
    __metadata("design:type", String)
], PosTransactionItem.prototype, "originalTransactionItemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PosTransactionItem.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PosTransactionItem.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pos_transaction_entity_1.PosTransaction, (transaction) => transaction.items, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'transaction_id' }),
    __metadata("design:type", pos_transaction_entity_1.PosTransaction)
], PosTransactionItem.prototype, "transaction", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], PosTransactionItem.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_variant_entity_1.ProductVariant),
    (0, typeorm_1.JoinColumn)({ name: 'variant_id' }),
    __metadata("design:type", product_variant_entity_1.ProductVariant)
], PosTransactionItem.prototype, "variant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => unit_of_measure_entity_1.UnitOfMeasure),
    (0, typeorm_1.JoinColumn)({ name: 'uom_id' }),
    __metadata("design:type", unit_of_measure_entity_1.UnitOfMeasure)
], PosTransactionItem.prototype, "uom", void 0);
exports.PosTransactionItem = PosTransactionItem = __decorate([
    (0, typeorm_1.Entity)('pos_transaction_items')
], PosTransactionItem);
//# sourceMappingURL=pos-transaction-item.entity.js.map