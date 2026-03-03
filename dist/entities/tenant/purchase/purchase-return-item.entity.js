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
exports.PurchaseReturnItem = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const purchase_return_entity_1 = require("./purchase-return.entity");
const product_entity_1 = require("../inventory/product.entity");
const product_variant_entity_1 = require("../inventory/product-variant.entity");
const inventory_batch_entity_1 = require("../warehouse/inventory-batch.entity");
const unit_of_measure_entity_1 = require("../inventory/unit-of-measure.entity");
let PurchaseReturnItem = class PurchaseReturnItem {
    id;
    purchaseReturnId;
    productId;
    variantId;
    batchId;
    quantity;
    uomId;
    unitPrice;
    taxAmount;
    lineTotal;
    reason;
    notes;
    createdAt;
    purchaseReturn;
    product;
    variant;
    batch;
    uom;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, purchaseReturnId: { required: true, type: () => String }, productId: { required: true, type: () => String }, variantId: { required: true, type: () => String }, batchId: { required: true, type: () => String }, quantity: { required: true, type: () => Number }, uomId: { required: true, type: () => String }, unitPrice: { required: true, type: () => Number }, taxAmount: { required: true, type: () => Number }, lineTotal: { required: true, type: () => Number }, reason: { required: true, type: () => String }, notes: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, purchaseReturn: { required: true, type: () => require("./purchase-return.entity").PurchaseReturn }, product: { required: true, type: () => require("../inventory/product.entity").Product }, variant: { required: true, type: () => require("../inventory/product-variant.entity").ProductVariant }, batch: { required: true, type: () => require("../warehouse/inventory-batch.entity").InventoryBatch }, uom: { required: true, type: () => require("../inventory/unit-of-measure.entity").UnitOfMeasure } };
    }
};
exports.PurchaseReturnItem = PurchaseReturnItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PurchaseReturnItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'purchase_return_id' }),
    __metadata("design:type", String)
], PurchaseReturnItem.prototype, "purchaseReturnId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", String)
], PurchaseReturnItem.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'variant_id', nullable: true }),
    __metadata("design:type", String)
], PurchaseReturnItem.prototype, "variantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'batch_id', nullable: true }),
    __metadata("design:type", String)
], PurchaseReturnItem.prototype, "batchId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], PurchaseReturnItem.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'uom_id' }),
    __metadata("design:type", String)
], PurchaseReturnItem.prototype, "uomId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'unit_price',
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], PurchaseReturnItem.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'tax_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], PurchaseReturnItem.prototype, "taxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'line_total',
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], PurchaseReturnItem.prototype, "lineTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PurchaseReturnItem.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PurchaseReturnItem.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PurchaseReturnItem.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => purchase_return_entity_1.PurchaseReturn, (pr) => pr.items, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'purchase_return_id' }),
    __metadata("design:type", purchase_return_entity_1.PurchaseReturn)
], PurchaseReturnItem.prototype, "purchaseReturn", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], PurchaseReturnItem.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_variant_entity_1.ProductVariant),
    (0, typeorm_1.JoinColumn)({ name: 'variant_id' }),
    __metadata("design:type", product_variant_entity_1.ProductVariant)
], PurchaseReturnItem.prototype, "variant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => inventory_batch_entity_1.InventoryBatch),
    (0, typeorm_1.JoinColumn)({ name: 'batch_id' }),
    __metadata("design:type", inventory_batch_entity_1.InventoryBatch)
], PurchaseReturnItem.prototype, "batch", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => unit_of_measure_entity_1.UnitOfMeasure),
    (0, typeorm_1.JoinColumn)({ name: 'uom_id' }),
    __metadata("design:type", unit_of_measure_entity_1.UnitOfMeasure)
], PurchaseReturnItem.prototype, "uom", void 0);
exports.PurchaseReturnItem = PurchaseReturnItem = __decorate([
    (0, typeorm_1.Entity)('purchase_return_items')
], PurchaseReturnItem);
//# sourceMappingURL=purchase-return-item.entity.js.map