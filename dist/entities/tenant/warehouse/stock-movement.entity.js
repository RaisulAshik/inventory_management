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
exports.StockMovement = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const enums_1 = require("../../../common/enums");
const inventory_batch_entity_1 = require("./inventory-batch.entity");
const warehouse_entity_1 = require("./warehouse.entity");
const product_entity_1 = require("../inventory/product.entity");
const product_variant_entity_1 = require("../inventory/product-variant.entity");
const unit_of_measure_entity_1 = require("../inventory/unit-of-measure.entity");
let StockMovement = class StockMovement {
    id;
    movementNumber;
    movementType;
    movementDate;
    productId;
    variantId;
    batchId;
    fromWarehouseId;
    toWarehouseId;
    fromLocationId;
    toLocationId;
    quantity;
    uomId;
    unitCost;
    totalCost;
    referenceType;
    referenceId;
    referenceNumber;
    reason;
    createdBy;
    createdAt;
    product;
    variant;
    batch;
    fromWarehouse;
    toWarehouse;
    uom;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, movementNumber: { required: true, type: () => String }, movementType: { required: true, enum: require("../../../common/enums/index").StockMovementType }, movementDate: { required: true, type: () => Date }, productId: { required: true, type: () => String }, variantId: { required: true, type: () => String }, batchId: { required: true, type: () => String }, fromWarehouseId: { required: true, type: () => String }, toWarehouseId: { required: true, type: () => String }, fromLocationId: { required: true, type: () => String }, toLocationId: { required: true, type: () => String }, quantity: { required: true, type: () => Number }, uomId: { required: true, type: () => String }, unitCost: { required: true, type: () => Number }, totalCost: { required: true, type: () => Number }, referenceType: { required: true, type: () => String }, referenceId: { required: true, type: () => String }, referenceNumber: { required: true, type: () => String }, reason: { required: true, type: () => String }, createdBy: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, product: { required: true, type: () => require("../inventory/product.entity").Product }, variant: { required: true, type: () => require("../inventory/product-variant.entity").ProductVariant }, batch: { required: true, type: () => require("./inventory-batch.entity").InventoryBatch }, fromWarehouse: { required: true, type: () => require("./warehouse.entity").Warehouse }, toWarehouse: { required: true, type: () => require("./warehouse.entity").Warehouse }, uom: { required: true, type: () => require("../inventory/unit-of-measure.entity").UnitOfMeasure } };
    }
};
exports.StockMovement = StockMovement;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], StockMovement.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'movement_number', length: 50, unique: true }),
    __metadata("design:type", String)
], StockMovement.prototype, "movementNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'movement_type',
        type: 'enum',
        enum: enums_1.StockMovementType,
    }),
    __metadata("design:type", String)
], StockMovement.prototype, "movementType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'movement_date', type: 'timestamp' }),
    __metadata("design:type", Date)
], StockMovement.prototype, "movementDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", String)
], StockMovement.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'variant_id', nullable: true }),
    __metadata("design:type", String)
], StockMovement.prototype, "variantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'batch_id', nullable: true }),
    __metadata("design:type", String)
], StockMovement.prototype, "batchId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'from_warehouse_id', nullable: true }),
    __metadata("design:type", String)
], StockMovement.prototype, "fromWarehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'to_warehouse_id', nullable: true }),
    __metadata("design:type", String)
], StockMovement.prototype, "toWarehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'from_location_id', nullable: true }),
    __metadata("design:type", String)
], StockMovement.prototype, "fromLocationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'to_location_id', nullable: true }),
    __metadata("design:type", String)
], StockMovement.prototype, "toLocationId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], StockMovement.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'uom_id' }),
    __metadata("design:type", String)
], StockMovement.prototype, "uomId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'unit_cost',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], StockMovement.prototype, "unitCost", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_cost',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], StockMovement.prototype, "totalCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_type', length: 50, nullable: true }),
    __metadata("design:type", String)
], StockMovement.prototype, "referenceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_id', nullable: true }),
    __metadata("design:type", String)
], StockMovement.prototype, "referenceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_number', length: 50, nullable: true }),
    __metadata("design:type", String)
], StockMovement.prototype, "referenceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], StockMovement.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", String)
], StockMovement.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], StockMovement.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], StockMovement.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_variant_entity_1.ProductVariant),
    (0, typeorm_1.JoinColumn)({ name: 'variant_id' }),
    __metadata("design:type", product_variant_entity_1.ProductVariant)
], StockMovement.prototype, "variant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => inventory_batch_entity_1.InventoryBatch),
    (0, typeorm_1.JoinColumn)({ name: 'batch_id' }),
    __metadata("design:type", inventory_batch_entity_1.InventoryBatch)
], StockMovement.prototype, "batch", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_entity_1.Warehouse),
    (0, typeorm_1.JoinColumn)({ name: 'from_warehouse_id' }),
    __metadata("design:type", warehouse_entity_1.Warehouse)
], StockMovement.prototype, "fromWarehouse", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_entity_1.Warehouse),
    (0, typeorm_1.JoinColumn)({ name: 'to_warehouse_id' }),
    __metadata("design:type", warehouse_entity_1.Warehouse)
], StockMovement.prototype, "toWarehouse", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => unit_of_measure_entity_1.UnitOfMeasure),
    (0, typeorm_1.JoinColumn)({ name: 'uom_id' }),
    __metadata("design:type", unit_of_measure_entity_1.UnitOfMeasure)
], StockMovement.prototype, "uom", void 0);
exports.StockMovement = StockMovement = __decorate([
    (0, typeorm_1.Entity)('stock_movements')
], StockMovement);
//# sourceMappingURL=stock-movement.entity.js.map