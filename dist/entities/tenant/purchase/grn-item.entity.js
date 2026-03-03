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
exports.GrnItem = exports.GrnItemStatus = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const goods_received_note_entity_1 = require("./goods-received-note.entity");
const purchase_order_item_entity_1 = require("./purchase-order-item.entity");
const product_entity_1 = require("../inventory/product.entity");
const product_variant_entity_1 = require("../inventory/product-variant.entity");
const warehouse_location_entity_1 = require("../warehouse/warehouse-location.entity");
const inventory_batch_entity_1 = require("../warehouse/inventory-batch.entity");
const unit_of_measure_entity_1 = require("../inventory/unit-of-measure.entity");
var GrnItemStatus;
(function (GrnItemStatus) {
    GrnItemStatus["PENDING_QC"] = "PENDING_QC";
    GrnItemStatus["QC_PASSED"] = "QC_PASSED";
    GrnItemStatus["QC_FAILED"] = "QC_FAILED";
    GrnItemStatus["PARTIALLY_ACCEPTED"] = "PARTIALLY_ACCEPTED";
    GrnItemStatus["ACCEPTED"] = "ACCEPTED";
})(GrnItemStatus || (exports.GrnItemStatus = GrnItemStatus = {}));
let GrnItem = class GrnItem {
    id;
    grnId;
    poItemId;
    productId;
    variantId;
    locationId;
    batchId;
    quantityReceived;
    quantityAccepted;
    quantityRejected;
    uomId;
    unitPrice;
    lineValue;
    status;
    batchNumber;
    manufacturingDate;
    expiryDate;
    rejectionReason;
    notes;
    createdAt;
    updatedAt;
    grn;
    poItem;
    product;
    variant;
    location;
    batch;
    uom;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, grnId: { required: true, type: () => String }, poItemId: { required: true, type: () => String }, productId: { required: true, type: () => String }, variantId: { required: true, type: () => String }, locationId: { required: true, type: () => String }, batchId: { required: true, type: () => String }, quantityReceived: { required: true, type: () => Number }, quantityAccepted: { required: true, type: () => Number }, quantityRejected: { required: true, type: () => Number }, uomId: { required: true, type: () => String }, unitPrice: { required: true, type: () => Number }, lineValue: { required: true, type: () => Number }, status: { required: true, enum: require("./grn-item.entity").GrnItemStatus }, batchNumber: { required: true, type: () => String }, manufacturingDate: { required: true, type: () => Date }, expiryDate: { required: true, type: () => Date }, rejectionReason: { required: true, type: () => String }, notes: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, grn: { required: true, type: () => require("./goods-received-note.entity").GoodsReceivedNote }, poItem: { required: true, type: () => require("./purchase-order-item.entity").PurchaseOrderItem }, product: { required: true, type: () => require("../inventory/product.entity").Product }, variant: { required: true, type: () => require("../inventory/product-variant.entity").ProductVariant }, location: { required: true, type: () => require("../warehouse/warehouse-location.entity").WarehouseLocation }, batch: { required: true, type: () => require("../warehouse/inventory-batch.entity").InventoryBatch }, uom: { required: true, type: () => require("../inventory/unit-of-measure.entity").UnitOfMeasure } };
    }
};
exports.GrnItem = GrnItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], GrnItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'grn_id' }),
    __metadata("design:type", String)
], GrnItem.prototype, "grnId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'po_item_id', nullable: true }),
    __metadata("design:type", String)
], GrnItem.prototype, "poItemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", String)
], GrnItem.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'variant_id', nullable: true }),
    __metadata("design:type", String)
], GrnItem.prototype, "variantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'location_id', nullable: true }),
    __metadata("design:type", String)
], GrnItem.prototype, "locationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'batch_id', nullable: true }),
    __metadata("design:type", String)
], GrnItem.prototype, "batchId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'quantity_received',
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], GrnItem.prototype, "quantityReceived", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'quantity_accepted',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], GrnItem.prototype, "quantityAccepted", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'quantity_rejected',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], GrnItem.prototype, "quantityRejected", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'uom_id' }),
    __metadata("design:type", String)
], GrnItem.prototype, "uomId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'unit_price',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], GrnItem.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'line_value',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], GrnItem.prototype, "lineValue", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: GrnItemStatus,
        default: GrnItemStatus.PENDING_QC,
    }),
    __metadata("design:type", String)
], GrnItem.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'batch_number', length: 100, nullable: true }),
    __metadata("design:type", String)
], GrnItem.prototype, "batchNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'manufacturing_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], GrnItem.prototype, "manufacturingDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expiry_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], GrnItem.prototype, "expiryDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rejection_reason', type: 'text', nullable: true }),
    __metadata("design:type", String)
], GrnItem.prototype, "rejectionReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], GrnItem.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], GrnItem.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], GrnItem.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => goods_received_note_entity_1.GoodsReceivedNote, (grn) => grn.items, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'grn_id' }),
    __metadata("design:type", goods_received_note_entity_1.GoodsReceivedNote)
], GrnItem.prototype, "grn", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => purchase_order_item_entity_1.PurchaseOrderItem),
    (0, typeorm_1.JoinColumn)({ name: 'po_item_id' }),
    __metadata("design:type", purchase_order_item_entity_1.PurchaseOrderItem)
], GrnItem.prototype, "poItem", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], GrnItem.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_variant_entity_1.ProductVariant),
    (0, typeorm_1.JoinColumn)({ name: 'variant_id' }),
    __metadata("design:type", product_variant_entity_1.ProductVariant)
], GrnItem.prototype, "variant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_location_entity_1.WarehouseLocation),
    (0, typeorm_1.JoinColumn)({ name: 'location_id' }),
    __metadata("design:type", warehouse_location_entity_1.WarehouseLocation)
], GrnItem.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => inventory_batch_entity_1.InventoryBatch),
    (0, typeorm_1.JoinColumn)({ name: 'batch_id' }),
    __metadata("design:type", inventory_batch_entity_1.InventoryBatch)
], GrnItem.prototype, "batch", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => unit_of_measure_entity_1.UnitOfMeasure),
    (0, typeorm_1.JoinColumn)({ name: 'uom_id' }),
    __metadata("design:type", unit_of_measure_entity_1.UnitOfMeasure)
], GrnItem.prototype, "uom", void 0);
exports.GrnItem = GrnItem = __decorate([
    (0, typeorm_1.Entity)('grn_items')
], GrnItem);
//# sourceMappingURL=grn-item.entity.js.map