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
exports.MaterialIssueItem = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const material_issue_entity_1 = require("./material-issue.entity");
const work_order_item_entity_1 = require("./work-order-item.entity");
const product_entity_1 = require("../inventory/product.entity");
const product_variant_entity_1 = require("../inventory/product-variant.entity");
const warehouse_location_entity_1 = require("../warehouse/warehouse-location.entity");
const inventory_batch_entity_1 = require("../warehouse/inventory-batch.entity");
const __1 = require("..");
let MaterialIssueItem = class MaterialIssueItem {
    id;
    materialIssueId;
    workOrderItemId;
    productId;
    variantId;
    locationId;
    batchId;
    issuedQuantity;
    returnedQuantity;
    uomId;
    unitCost;
    totalCost;
    serialNumbers;
    notes;
    createdAt;
    materialIssue;
    workOrderItem;
    product;
    variant;
    location;
    batch;
    uom;
    get netIssuedQuantity() {
        return this.issuedQuantity - this.returnedQuantity;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, materialIssueId: { required: true, type: () => String }, workOrderItemId: { required: true, type: () => String }, productId: { required: true, type: () => String }, variantId: { required: true, type: () => String }, locationId: { required: true, type: () => String }, batchId: { required: true, type: () => String }, issuedQuantity: { required: true, type: () => Number }, returnedQuantity: { required: true, type: () => Number }, uomId: { required: true, type: () => String }, unitCost: { required: true, type: () => Number }, totalCost: { required: true, type: () => Number }, serialNumbers: { required: true, type: () => [String] }, notes: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, materialIssue: { required: true, type: () => require("./material-issue.entity").MaterialIssue }, workOrderItem: { required: true, type: () => require("./work-order-item.entity").WorkOrderItem }, product: { required: true, type: () => require("../inventory/product.entity").Product }, variant: { required: true, type: () => require("../inventory/product-variant.entity").ProductVariant }, location: { required: true, type: () => require("../warehouse/warehouse-location.entity").WarehouseLocation }, batch: { required: true, type: () => require("../warehouse/inventory-batch.entity").InventoryBatch }, uom: { required: true, type: () => require("../inventory/unit-of-measure.entity").UnitOfMeasure } };
    }
};
exports.MaterialIssueItem = MaterialIssueItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MaterialIssueItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'material_issue_id' }),
    __metadata("design:type", String)
], MaterialIssueItem.prototype, "materialIssueId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'work_order_item_id', nullable: true }),
    __metadata("design:type", String)
], MaterialIssueItem.prototype, "workOrderItemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", String)
], MaterialIssueItem.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'variant_id', nullable: true }),
    __metadata("design:type", String)
], MaterialIssueItem.prototype, "variantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'location_id', nullable: true }),
    __metadata("design:type", String)
], MaterialIssueItem.prototype, "locationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'batch_id', nullable: true }),
    __metadata("design:type", String)
], MaterialIssueItem.prototype, "batchId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'issued_quantity',
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], MaterialIssueItem.prototype, "issuedQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'returned_quantity',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], MaterialIssueItem.prototype, "returnedQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'uom_id' }),
    __metadata("design:type", String)
], MaterialIssueItem.prototype, "uomId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'unit_cost',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], MaterialIssueItem.prototype, "unitCost", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_cost',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], MaterialIssueItem.prototype, "totalCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'serial_numbers', type: 'json', nullable: true }),
    __metadata("design:type", Array)
], MaterialIssueItem.prototype, "serialNumbers", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MaterialIssueItem.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], MaterialIssueItem.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => material_issue_entity_1.MaterialIssue, (mi) => mi.items, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'material_issue_id' }),
    __metadata("design:type", material_issue_entity_1.MaterialIssue)
], MaterialIssueItem.prototype, "materialIssue", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => work_order_item_entity_1.WorkOrderItem),
    (0, typeorm_1.JoinColumn)({ name: 'work_order_item_id' }),
    __metadata("design:type", work_order_item_entity_1.WorkOrderItem)
], MaterialIssueItem.prototype, "workOrderItem", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], MaterialIssueItem.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_variant_entity_1.ProductVariant),
    (0, typeorm_1.JoinColumn)({ name: 'variant_id' }),
    __metadata("design:type", product_variant_entity_1.ProductVariant)
], MaterialIssueItem.prototype, "variant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_location_entity_1.WarehouseLocation),
    (0, typeorm_1.JoinColumn)({ name: 'location_id' }),
    __metadata("design:type", warehouse_location_entity_1.WarehouseLocation)
], MaterialIssueItem.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => inventory_batch_entity_1.InventoryBatch),
    (0, typeorm_1.JoinColumn)({ name: 'batch_id' }),
    __metadata("design:type", inventory_batch_entity_1.InventoryBatch)
], MaterialIssueItem.prototype, "batch", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => __1.UnitOfMeasure),
    (0, typeorm_1.JoinColumn)({ name: 'uom_id' }),
    __metadata("design:type", __1.UnitOfMeasure)
], MaterialIssueItem.prototype, "uom", void 0);
exports.MaterialIssueItem = MaterialIssueItem = __decorate([
    (0, typeorm_1.Entity)('material_issue_items')
], MaterialIssueItem);
//# sourceMappingURL=material-issue-item.entity.js.map