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
exports.WorkOrderItem = exports.WorkOrderItemStatus = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const work_order_entity_1 = require("./work-order.entity");
const bom_item_entity_1 = require("./bom-item.entity");
const product_variant_entity_1 = require("../inventory/product-variant.entity");
const product_entity_1 = require("../inventory/product.entity");
const unit_of_measure_entity_1 = require("../inventory/unit-of-measure.entity");
var WorkOrderItemStatus;
(function (WorkOrderItemStatus) {
    WorkOrderItemStatus["PENDING"] = "PENDING";
    WorkOrderItemStatus["PARTIALLY_ISSUED"] = "PARTIALLY_ISSUED";
    WorkOrderItemStatus["ISSUED"] = "ISSUED";
    WorkOrderItemStatus["RETURNED"] = "RETURNED";
})(WorkOrderItemStatus || (exports.WorkOrderItemStatus = WorkOrderItemStatus = {}));
let WorkOrderItem = class WorkOrderItem {
    id;
    workOrderId;
    bomItemId;
    itemType;
    productId;
    variantId;
    requiredQuantity;
    issuedQuantity;
    consumedQuantity;
    returnedQuantity;
    scrapQuantity;
    uomId;
    unitCost;
    totalCost;
    status;
    notes;
    createdAt;
    updatedAt;
    workOrder;
    bomItem;
    product;
    variant;
    uom;
    get pendingQuantity() {
        return this.requiredQuantity - this.issuedQuantity;
    }
    get variance() {
        return this.consumedQuantity - this.requiredQuantity;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, workOrderId: { required: true, type: () => String }, bomItemId: { required: true, type: () => String }, itemType: { required: true, enum: require("./bom-item.entity").BomItemType }, productId: { required: true, type: () => String }, variantId: { required: true, type: () => String }, requiredQuantity: { required: true, type: () => Number }, issuedQuantity: { required: true, type: () => Number }, consumedQuantity: { required: true, type: () => Number }, returnedQuantity: { required: true, type: () => Number }, scrapQuantity: { required: true, type: () => Number }, uomId: { required: true, type: () => String }, unitCost: { required: true, type: () => Number }, totalCost: { required: true, type: () => Number }, status: { required: true, enum: require("./work-order-item.entity").WorkOrderItemStatus }, notes: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, workOrder: { required: true, type: () => require("./work-order.entity").WorkOrder }, bomItem: { required: true, type: () => require("./bom-item.entity").BomItem }, product: { required: true, type: () => require("../inventory/product.entity").Product }, variant: { required: true, type: () => require("../inventory/product-variant.entity").ProductVariant }, uom: { required: true, type: () => require("../inventory/unit-of-measure.entity").UnitOfMeasure } };
    }
};
exports.WorkOrderItem = WorkOrderItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], WorkOrderItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'work_order_id' }),
    __metadata("design:type", String)
], WorkOrderItem.prototype, "workOrderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bom_item_id', nullable: true }),
    __metadata("design:type", String)
], WorkOrderItem.prototype, "bomItemId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'item_type',
        type: 'enum',
        enum: bom_item_entity_1.BomItemType,
        default: bom_item_entity_1.BomItemType.RAW_MATERIAL,
    }),
    __metadata("design:type", String)
], WorkOrderItem.prototype, "itemType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", String)
], WorkOrderItem.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'variant_id', nullable: true }),
    __metadata("design:type", String)
], WorkOrderItem.prototype, "variantId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'required_quantity',
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], WorkOrderItem.prototype, "requiredQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'issued_quantity',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], WorkOrderItem.prototype, "issuedQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'consumed_quantity',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], WorkOrderItem.prototype, "consumedQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'returned_quantity',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], WorkOrderItem.prototype, "returnedQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'scrap_quantity',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], WorkOrderItem.prototype, "scrapQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'uom_id' }),
    __metadata("design:type", String)
], WorkOrderItem.prototype, "uomId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'unit_cost',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], WorkOrderItem.prototype, "unitCost", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_cost',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], WorkOrderItem.prototype, "totalCost", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: WorkOrderItemStatus,
        default: WorkOrderItemStatus.PENDING,
    }),
    __metadata("design:type", String)
], WorkOrderItem.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], WorkOrderItem.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], WorkOrderItem.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], WorkOrderItem.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => work_order_entity_1.WorkOrder, (wo) => wo.items, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'work_order_id' }),
    __metadata("design:type", work_order_entity_1.WorkOrder)
], WorkOrderItem.prototype, "workOrder", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => bom_item_entity_1.BomItem),
    (0, typeorm_1.JoinColumn)({ name: 'bom_item_id' }),
    __metadata("design:type", bom_item_entity_1.BomItem)
], WorkOrderItem.prototype, "bomItem", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], WorkOrderItem.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_variant_entity_1.ProductVariant),
    (0, typeorm_1.JoinColumn)({ name: 'variant_id' }),
    __metadata("design:type", product_variant_entity_1.ProductVariant)
], WorkOrderItem.prototype, "variant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => unit_of_measure_entity_1.UnitOfMeasure),
    (0, typeorm_1.JoinColumn)({ name: 'uom_id' }),
    __metadata("design:type", unit_of_measure_entity_1.UnitOfMeasure)
], WorkOrderItem.prototype, "uom", void 0);
exports.WorkOrderItem = WorkOrderItem = __decorate([
    (0, typeorm_1.Entity)('work_order_items')
], WorkOrderItem);
//# sourceMappingURL=work-order-item.entity.js.map