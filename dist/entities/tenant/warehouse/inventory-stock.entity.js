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
exports.InventoryStock = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const warehouse_entity_1 = require("./warehouse.entity");
const product_entity_1 = require("../inventory/product.entity");
const product_variant_entity_1 = require("../inventory/product-variant.entity");
let InventoryStock = class InventoryStock {
    id;
    productId;
    variantId;
    warehouseId;
    quantityOnHand;
    quantityReserved;
    quantityIncoming;
    quantityOutgoing;
    lastStockDate;
    lastCountDate;
    createdAt;
    updatedAt;
    product;
    variant;
    warehouse;
    get quantityAvailable() {
        return this.quantityOnHand - this.quantityReserved;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, productId: { required: true, type: () => String }, variantId: { required: true, type: () => String }, warehouseId: { required: true, type: () => String }, quantityOnHand: { required: true, type: () => Number }, quantityReserved: { required: true, type: () => Number }, quantityIncoming: { required: true, type: () => Number }, quantityOutgoing: { required: true, type: () => Number }, lastStockDate: { required: true, type: () => Date }, lastCountDate: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, product: { required: true, type: () => require("../inventory/product.entity").Product }, variant: { required: true, type: () => require("../inventory/product-variant.entity").ProductVariant }, warehouse: { required: true, type: () => require("./warehouse.entity").Warehouse } };
    }
};
exports.InventoryStock = InventoryStock;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], InventoryStock.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", String)
], InventoryStock.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'variant_id', nullable: true }),
    __metadata("design:type", String)
], InventoryStock.prototype, "variantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warehouse_id' }),
    __metadata("design:type", String)
], InventoryStock.prototype, "warehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'quantity_on_hand',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], InventoryStock.prototype, "quantityOnHand", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'quantity_reserved',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], InventoryStock.prototype, "quantityReserved", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'quantity_incoming',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], InventoryStock.prototype, "quantityIncoming", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'quantity_outgoing',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], InventoryStock.prototype, "quantityOutgoing", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_stock_date', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], InventoryStock.prototype, "lastStockDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_count_date', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], InventoryStock.prototype, "lastCountDate", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], InventoryStock.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], InventoryStock.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, (product) => product.inventoryStocks, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], InventoryStock.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_variant_entity_1.ProductVariant, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'variant_id' }),
    __metadata("design:type", product_variant_entity_1.ProductVariant)
], InventoryStock.prototype, "variant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_entity_1.Warehouse, (warehouse) => warehouse.inventoryStocks, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'warehouse_id' }),
    __metadata("design:type", warehouse_entity_1.Warehouse)
], InventoryStock.prototype, "warehouse", void 0);
exports.InventoryStock = InventoryStock = __decorate([
    (0, typeorm_1.Entity)('inventory_stock')
], InventoryStock);
//# sourceMappingURL=inventory-stock.entity.js.map