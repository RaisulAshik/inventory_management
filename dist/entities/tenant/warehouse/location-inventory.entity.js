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
exports.LocationInventory = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const enums_1 = require("../../../common/enums");
const warehouse_entity_1 = require("./warehouse.entity");
const warehouse_location_entity_1 = require("./warehouse-location.entity");
const inventory_batch_entity_1 = require("./inventory-batch.entity");
const product_entity_1 = require("../inventory/product.entity");
const product_variant_entity_1 = require("../inventory/product-variant.entity");
let LocationInventory = class LocationInventory {
    id;
    productId;
    variantId;
    warehouseId;
    locationId;
    batchId;
    quantity;
    quantityReserved;
    status;
    createdAt;
    updatedAt;
    product;
    variant;
    warehouse;
    location;
    batch;
    get quantityAvailable() {
        return this.quantity - this.quantityReserved;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, productId: { required: true, type: () => String }, variantId: { required: true, type: () => String }, warehouseId: { required: true, type: () => String }, locationId: { required: true, type: () => String }, batchId: { required: true, type: () => String }, quantity: { required: true, type: () => Number }, quantityReserved: { required: true, type: () => Number }, status: { required: true, enum: require("../../../common/enums/index").InventoryStatus }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, product: { required: true, type: () => require("../inventory/product.entity").Product }, variant: { required: true, type: () => require("../inventory/product-variant.entity").ProductVariant }, warehouse: { required: true, type: () => require("./warehouse.entity").Warehouse }, location: { required: true, type: () => require("./warehouse-location.entity").WarehouseLocation }, batch: { required: true, type: () => require("./inventory-batch.entity").InventoryBatch } };
    }
};
exports.LocationInventory = LocationInventory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], LocationInventory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", String)
], LocationInventory.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'variant_id', nullable: true }),
    __metadata("design:type", String)
], LocationInventory.prototype, "variantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warehouse_id' }),
    __metadata("design:type", String)
], LocationInventory.prototype, "warehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'location_id' }),
    __metadata("design:type", String)
], LocationInventory.prototype, "locationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'batch_id', nullable: true }),
    __metadata("design:type", String)
], LocationInventory.prototype, "batchId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], LocationInventory.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'quantity_reserved',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], LocationInventory.prototype, "quantityReserved", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.InventoryStatus,
        default: enums_1.InventoryStatus.AVAILABLE,
    }),
    __metadata("design:type", String)
], LocationInventory.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], LocationInventory.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], LocationInventory.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], LocationInventory.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_variant_entity_1.ProductVariant, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'variant_id' }),
    __metadata("design:type", product_variant_entity_1.ProductVariant)
], LocationInventory.prototype, "variant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_entity_1.Warehouse, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'warehouse_id' }),
    __metadata("design:type", warehouse_entity_1.Warehouse)
], LocationInventory.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_location_entity_1.WarehouseLocation, (location) => location.inventory, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'location_id' }),
    __metadata("design:type", warehouse_location_entity_1.WarehouseLocation)
], LocationInventory.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => inventory_batch_entity_1.InventoryBatch),
    (0, typeorm_1.JoinColumn)({ name: 'batch_id' }),
    __metadata("design:type", inventory_batch_entity_1.InventoryBatch)
], LocationInventory.prototype, "batch", void 0);
exports.LocationInventory = LocationInventory = __decorate([
    (0, typeorm_1.Entity)('location_inventory')
], LocationInventory);
//# sourceMappingURL=location-inventory.entity.js.map