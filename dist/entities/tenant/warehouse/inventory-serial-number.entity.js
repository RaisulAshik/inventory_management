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
exports.InventorySerialNumber = exports.SerialNumberStatus = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const warehouse_entity_1 = require("./warehouse.entity");
const warehouse_location_entity_1 = require("./warehouse-location.entity");
const inventory_batch_entity_1 = require("./inventory-batch.entity");
const product_entity_1 = require("../inventory/product.entity");
const product_variant_entity_1 = require("../inventory/product-variant.entity");
var SerialNumberStatus;
(function (SerialNumberStatus) {
    SerialNumberStatus["AVAILABLE"] = "AVAILABLE";
    SerialNumberStatus["RESERVED"] = "RESERVED";
    SerialNumberStatus["SOLD"] = "SOLD";
    SerialNumberStatus["IN_TRANSIT"] = "IN_TRANSIT";
    SerialNumberStatus["RETURNED"] = "RETURNED";
    SerialNumberStatus["DAMAGED"] = "DAMAGED";
    SerialNumberStatus["SCRAPPED"] = "SCRAPPED";
})(SerialNumberStatus || (exports.SerialNumberStatus = SerialNumberStatus = {}));
let InventorySerialNumber = class InventorySerialNumber {
    id;
    serialNumber;
    productId;
    variantId;
    batchId;
    warehouseId;
    locationId;
    status;
    costPrice;
    purchaseOrderId;
    grnId;
    receivedDate;
    salesOrderId;
    soldDate;
    warrantyStartDate;
    warrantyEndDate;
    notes;
    createdAt;
    updatedAt;
    product;
    variant;
    batch;
    warehouse;
    location;
    get isUnderWarranty() {
        if (!this.warrantyEndDate)
            return false;
        return new Date(this.warrantyEndDate) >= new Date();
    }
    get warrantyDaysRemaining() {
        if (!this.warrantyEndDate)
            return null;
        const diff = new Date(this.warrantyEndDate).getTime() - new Date().getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, serialNumber: { required: true, type: () => String }, productId: { required: true, type: () => String }, variantId: { required: true, type: () => String }, batchId: { required: true, type: () => String }, warehouseId: { required: true, type: () => String }, locationId: { required: true, type: () => String }, status: { required: true, enum: require("./inventory-serial-number.entity").SerialNumberStatus }, costPrice: { required: true, type: () => Number }, purchaseOrderId: { required: true, type: () => String }, grnId: { required: true, type: () => String }, receivedDate: { required: true, type: () => Date }, salesOrderId: { required: true, type: () => String }, soldDate: { required: true, type: () => Date }, warrantyStartDate: { required: true, type: () => Date }, warrantyEndDate: { required: true, type: () => Date }, notes: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, product: { required: true, type: () => require("../inventory/product.entity").Product }, variant: { required: true, type: () => require("../inventory/product-variant.entity").ProductVariant }, batch: { required: true, type: () => require("./inventory-batch.entity").InventoryBatch }, warehouse: { required: true, type: () => require("./warehouse.entity").Warehouse }, location: { required: true, type: () => require("./warehouse-location.entity").WarehouseLocation } };
    }
};
exports.InventorySerialNumber = InventorySerialNumber;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], InventorySerialNumber.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'serial_number', length: 100 }),
    __metadata("design:type", String)
], InventorySerialNumber.prototype, "serialNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", String)
], InventorySerialNumber.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'variant_id', nullable: true }),
    __metadata("design:type", String)
], InventorySerialNumber.prototype, "variantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'batch_id', nullable: true }),
    __metadata("design:type", String)
], InventorySerialNumber.prototype, "batchId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warehouse_id', nullable: true }),
    __metadata("design:type", String)
], InventorySerialNumber.prototype, "warehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'location_id', nullable: true }),
    __metadata("design:type", String)
], InventorySerialNumber.prototype, "locationId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SerialNumberStatus,
        default: SerialNumberStatus.AVAILABLE,
    }),
    __metadata("design:type", String)
], InventorySerialNumber.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'cost_price',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], InventorySerialNumber.prototype, "costPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'purchase_order_id', nullable: true }),
    __metadata("design:type", String)
], InventorySerialNumber.prototype, "purchaseOrderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'grn_id', nullable: true }),
    __metadata("design:type", String)
], InventorySerialNumber.prototype, "grnId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'received_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], InventorySerialNumber.prototype, "receivedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sales_order_id', nullable: true }),
    __metadata("design:type", String)
], InventorySerialNumber.prototype, "salesOrderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sold_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], InventorySerialNumber.prototype, "soldDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warranty_start_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], InventorySerialNumber.prototype, "warrantyStartDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warranty_end_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], InventorySerialNumber.prototype, "warrantyEndDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], InventorySerialNumber.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], InventorySerialNumber.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], InventorySerialNumber.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], InventorySerialNumber.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_variant_entity_1.ProductVariant),
    (0, typeorm_1.JoinColumn)({ name: 'variant_id' }),
    __metadata("design:type", product_variant_entity_1.ProductVariant)
], InventorySerialNumber.prototype, "variant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => inventory_batch_entity_1.InventoryBatch),
    (0, typeorm_1.JoinColumn)({ name: 'batch_id' }),
    __metadata("design:type", inventory_batch_entity_1.InventoryBatch)
], InventorySerialNumber.prototype, "batch", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_entity_1.Warehouse),
    (0, typeorm_1.JoinColumn)({ name: 'warehouse_id' }),
    __metadata("design:type", warehouse_entity_1.Warehouse)
], InventorySerialNumber.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_location_entity_1.WarehouseLocation),
    (0, typeorm_1.JoinColumn)({ name: 'location_id' }),
    __metadata("design:type", warehouse_location_entity_1.WarehouseLocation)
], InventorySerialNumber.prototype, "location", void 0);
exports.InventorySerialNumber = InventorySerialNumber = __decorate([
    (0, typeorm_1.Entity)('inventory_serial_numbers')
], InventorySerialNumber);
//# sourceMappingURL=inventory-serial-number.entity.js.map