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
exports.StockAdjustmentItem = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const stock_adjustment_entity_1 = require("./stock-adjustment.entity");
const warehouse_location_entity_1 = require("./warehouse-location.entity");
const inventory_batch_entity_1 = require("./inventory-batch.entity");
const product_entity_1 = require("../inventory/product.entity");
const product_variant_entity_1 = require("../inventory/product-variant.entity");
const unit_of_measure_entity_1 = require("../inventory/unit-of-measure.entity");
let StockAdjustmentItem = class StockAdjustmentItem {
    id;
    stockAdjustmentId;
    productId;
    variantId;
    locationId;
    batchId;
    systemQuantity;
    physicalQuantity;
    adjustmentQuantity;
    uomId;
    unitCost;
    valueImpact;
    reason;
    createdAt;
    stockAdjustment;
    product;
    variant;
    location;
    batch;
    uom;
    get variancePercentage() {
        if (this.systemQuantity === 0)
            return this.physicalQuantity > 0 ? 100 : 0;
        return (((this.physicalQuantity - this.systemQuantity) / this.systemQuantity) *
            100);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, stockAdjustmentId: { required: true, type: () => String }, productId: { required: true, type: () => String }, variantId: { required: true, type: () => String }, locationId: { required: true, type: () => String }, batchId: { required: true, type: () => String }, systemQuantity: { required: true, type: () => Number }, physicalQuantity: { required: true, type: () => Number }, adjustmentQuantity: { required: true, type: () => Number }, uomId: { required: true, type: () => String }, unitCost: { required: true, type: () => Number }, valueImpact: { required: true, type: () => Number }, reason: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, stockAdjustment: { required: true, type: () => require("./stock-adjustment.entity").StockAdjustment }, product: { required: true, type: () => require("../inventory/product.entity").Product }, variant: { required: true, type: () => require("../inventory/product-variant.entity").ProductVariant }, location: { required: true, type: () => require("./warehouse-location.entity").WarehouseLocation }, batch: { required: true, type: () => require("./inventory-batch.entity").InventoryBatch }, uom: { required: true, type: () => require("../inventory/unit-of-measure.entity").UnitOfMeasure } };
    }
};
exports.StockAdjustmentItem = StockAdjustmentItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], StockAdjustmentItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stock_adjustment_id' }),
    __metadata("design:type", String)
], StockAdjustmentItem.prototype, "stockAdjustmentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", String)
], StockAdjustmentItem.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'variant_id', nullable: true }),
    __metadata("design:type", String)
], StockAdjustmentItem.prototype, "variantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'location_id', nullable: true }),
    __metadata("design:type", String)
], StockAdjustmentItem.prototype, "locationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'batch_id', nullable: true }),
    __metadata("design:type", String)
], StockAdjustmentItem.prototype, "batchId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'system_quantity',
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], StockAdjustmentItem.prototype, "systemQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'physical_quantity',
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], StockAdjustmentItem.prototype, "physicalQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'adjustment_quantity',
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], StockAdjustmentItem.prototype, "adjustmentQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'uom_id' }),
    __metadata("design:type", String)
], StockAdjustmentItem.prototype, "uomId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'unit_cost',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], StockAdjustmentItem.prototype, "unitCost", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'value_impact',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], StockAdjustmentItem.prototype, "valueImpact", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], StockAdjustmentItem.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], StockAdjustmentItem.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stock_adjustment_entity_1.StockAdjustment, (adj) => adj.items, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'stock_adjustment_id' }),
    __metadata("design:type", stock_adjustment_entity_1.StockAdjustment)
], StockAdjustmentItem.prototype, "stockAdjustment", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], StockAdjustmentItem.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_variant_entity_1.ProductVariant),
    (0, typeorm_1.JoinColumn)({ name: 'variant_id' }),
    __metadata("design:type", product_variant_entity_1.ProductVariant)
], StockAdjustmentItem.prototype, "variant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_location_entity_1.WarehouseLocation),
    (0, typeorm_1.JoinColumn)({ name: 'location_id' }),
    __metadata("design:type", warehouse_location_entity_1.WarehouseLocation)
], StockAdjustmentItem.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => inventory_batch_entity_1.InventoryBatch),
    (0, typeorm_1.JoinColumn)({ name: 'batch_id' }),
    __metadata("design:type", inventory_batch_entity_1.InventoryBatch)
], StockAdjustmentItem.prototype, "batch", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => unit_of_measure_entity_1.UnitOfMeasure),
    (0, typeorm_1.JoinColumn)({ name: 'uom_id' }),
    __metadata("design:type", unit_of_measure_entity_1.UnitOfMeasure)
], StockAdjustmentItem.prototype, "uom", void 0);
exports.StockAdjustmentItem = StockAdjustmentItem = __decorate([
    (0, typeorm_1.Entity)('stock_adjustment_items')
], StockAdjustmentItem);
//# sourceMappingURL=stock-adjustment-item.entity.js.map