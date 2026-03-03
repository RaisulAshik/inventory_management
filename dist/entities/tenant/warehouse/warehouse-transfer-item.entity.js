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
exports.WarehouseTransferItem = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const warehouse_transfer_entity_1 = require("./warehouse-transfer.entity");
const warehouse_location_entity_1 = require("./warehouse-location.entity");
const inventory_batch_entity_1 = require("./inventory-batch.entity");
const product_entity_1 = require("../inventory/product.entity");
const product_variant_entity_1 = require("../inventory/product-variant.entity");
const unit_of_measure_entity_1 = require("../inventory/unit-of-measure.entity");
let WarehouseTransferItem = class WarehouseTransferItem {
    id;
    warehouseTransferId;
    productId;
    variantId;
    fromLocationId;
    toLocationId;
    batchId;
    quantityRequested;
    quantityShipped;
    quantityReceived;
    quantityDamaged;
    uomId;
    unitCost;
    lineValue;
    notes;
    createdAt;
    updatedAt;
    warehouseTransfer;
    product;
    variant;
    fromLocation;
    toLocation;
    batch;
    uom;
    get quantityPending() {
        return this.quantityRequested - this.quantityShipped;
    }
    get quantityShortage() {
        return this.quantityShipped - this.quantityReceived - this.quantityDamaged;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, warehouseTransferId: { required: true, type: () => String }, productId: { required: true, type: () => String }, variantId: { required: true, type: () => String }, fromLocationId: { required: true, type: () => String }, toLocationId: { required: true, type: () => String }, batchId: { required: true, type: () => String }, quantityRequested: { required: true, type: () => Number }, quantityShipped: { required: true, type: () => Number }, quantityReceived: { required: true, type: () => Number }, quantityDamaged: { required: true, type: () => Number }, uomId: { required: true, type: () => String }, unitCost: { required: true, type: () => Number }, lineValue: { required: true, type: () => Number }, notes: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, warehouseTransfer: { required: true, type: () => require("./warehouse-transfer.entity").WarehouseTransfer }, product: { required: true, type: () => require("../inventory/product.entity").Product }, variant: { required: true, type: () => require("../inventory/product-variant.entity").ProductVariant }, fromLocation: { required: true, type: () => require("./warehouse-location.entity").WarehouseLocation }, toLocation: { required: true, type: () => require("./warehouse-location.entity").WarehouseLocation }, batch: { required: true, type: () => require("./inventory-batch.entity").InventoryBatch }, uom: { required: true, type: () => require("../inventory/unit-of-measure.entity").UnitOfMeasure } };
    }
};
exports.WarehouseTransferItem = WarehouseTransferItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], WarehouseTransferItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warehouse_transfer_id' }),
    __metadata("design:type", String)
], WarehouseTransferItem.prototype, "warehouseTransferId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", String)
], WarehouseTransferItem.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'variant_id', nullable: true }),
    __metadata("design:type", String)
], WarehouseTransferItem.prototype, "variantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'from_location_id', nullable: true }),
    __metadata("design:type", String)
], WarehouseTransferItem.prototype, "fromLocationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'to_location_id', nullable: true }),
    __metadata("design:type", String)
], WarehouseTransferItem.prototype, "toLocationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'batch_id', nullable: true }),
    __metadata("design:type", String)
], WarehouseTransferItem.prototype, "batchId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'quantity_requested',
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], WarehouseTransferItem.prototype, "quantityRequested", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'quantity_shipped',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], WarehouseTransferItem.prototype, "quantityShipped", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'quantity_received',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], WarehouseTransferItem.prototype, "quantityReceived", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'quantity_damaged',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], WarehouseTransferItem.prototype, "quantityDamaged", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'uom_id' }),
    __metadata("design:type", String)
], WarehouseTransferItem.prototype, "uomId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'unit_cost',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], WarehouseTransferItem.prototype, "unitCost", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'line_value',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], WarehouseTransferItem.prototype, "lineValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], WarehouseTransferItem.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], WarehouseTransferItem.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], WarehouseTransferItem.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_transfer_entity_1.WarehouseTransfer, (transfer) => transfer.items, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'warehouse_transfer_id' }),
    __metadata("design:type", warehouse_transfer_entity_1.WarehouseTransfer)
], WarehouseTransferItem.prototype, "warehouseTransfer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], WarehouseTransferItem.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_variant_entity_1.ProductVariant),
    (0, typeorm_1.JoinColumn)({ name: 'variant_id' }),
    __metadata("design:type", product_variant_entity_1.ProductVariant)
], WarehouseTransferItem.prototype, "variant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_location_entity_1.WarehouseLocation),
    (0, typeorm_1.JoinColumn)({ name: 'from_location_id' }),
    __metadata("design:type", warehouse_location_entity_1.WarehouseLocation)
], WarehouseTransferItem.prototype, "fromLocation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_location_entity_1.WarehouseLocation),
    (0, typeorm_1.JoinColumn)({ name: 'to_location_id' }),
    __metadata("design:type", warehouse_location_entity_1.WarehouseLocation)
], WarehouseTransferItem.prototype, "toLocation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => inventory_batch_entity_1.InventoryBatch),
    (0, typeorm_1.JoinColumn)({ name: 'batch_id' }),
    __metadata("design:type", inventory_batch_entity_1.InventoryBatch)
], WarehouseTransferItem.prototype, "batch", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => unit_of_measure_entity_1.UnitOfMeasure),
    (0, typeorm_1.JoinColumn)({ name: 'uom_id' }),
    __metadata("design:type", unit_of_measure_entity_1.UnitOfMeasure)
], WarehouseTransferItem.prototype, "uom", void 0);
exports.WarehouseTransferItem = WarehouseTransferItem = __decorate([
    (0, typeorm_1.Entity)('warehouse_transfer_items')
], WarehouseTransferItem);
//# sourceMappingURL=warehouse-transfer-item.entity.js.map