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
exports.InventoryBatch = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const product_entity_1 = require("../inventory/product.entity");
const product_variant_entity_1 = require("../inventory/product-variant.entity");
const supplier_entity_1 = require("../inventory/supplier.entity");
let InventoryBatch = class InventoryBatch {
    id;
    productId;
    variantId;
    batchNumber;
    manufacturingDate;
    expiryDate;
    supplierId;
    warehouseId;
    purchaseOrderId;
    costPrice;
    currentQuantity;
    notes;
    createdAt;
    updatedAt;
    product;
    variant;
    supplier;
    get isExpired() {
        return this.expiryDate && this.expiryDate < new Date();
    }
    get daysUntilExpiry() {
        if (!this.expiryDate)
            return null;
        const diff = this.expiryDate.getTime() - new Date().getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, productId: { required: true, type: () => String }, variantId: { required: true, type: () => String }, batchNumber: { required: true, type: () => String }, manufacturingDate: { required: true, type: () => Date }, expiryDate: { required: true, type: () => Date }, supplierId: { required: true, type: () => String }, warehouseId: { required: true, type: () => String }, purchaseOrderId: { required: true, type: () => String }, costPrice: { required: true, type: () => Number }, currentQuantity: { required: true, type: () => Number }, notes: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, product: { required: true, type: () => require("../inventory/product.entity").Product }, variant: { required: true, type: () => require("../inventory/product-variant.entity").ProductVariant }, supplier: { required: true, type: () => require("../inventory/supplier.entity").Supplier } };
    }
};
exports.InventoryBatch = InventoryBatch;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], InventoryBatch.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", String)
], InventoryBatch.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'variant_id', nullable: true }),
    __metadata("design:type", String)
], InventoryBatch.prototype, "variantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'batch_number', length: 100 }),
    __metadata("design:type", String)
], InventoryBatch.prototype, "batchNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'manufacturing_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], InventoryBatch.prototype, "manufacturingDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expiry_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], InventoryBatch.prototype, "expiryDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supplier_id', nullable: true }),
    __metadata("design:type", String)
], InventoryBatch.prototype, "supplierId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warehouse_id', nullable: true }),
    __metadata("design:type", String)
], InventoryBatch.prototype, "warehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'purchase_order_id', nullable: true }),
    __metadata("design:type", String)
], InventoryBatch.prototype, "purchaseOrderId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'cost_price',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], InventoryBatch.prototype, "costPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'current_quantity',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], InventoryBatch.prototype, "currentQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], InventoryBatch.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], InventoryBatch.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], InventoryBatch.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], InventoryBatch.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_variant_entity_1.ProductVariant, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'variant_id' }),
    __metadata("design:type", product_variant_entity_1.ProductVariant)
], InventoryBatch.prototype, "variant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => supplier_entity_1.Supplier, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'supplier_id' }),
    __metadata("design:type", supplier_entity_1.Supplier)
], InventoryBatch.prototype, "supplier", void 0);
exports.InventoryBatch = InventoryBatch = __decorate([
    (0, typeorm_1.Entity)('inventory_batches')
], InventoryBatch);
//# sourceMappingURL=inventory-batch.entity.js.map