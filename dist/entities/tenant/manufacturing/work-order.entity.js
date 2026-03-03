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
exports.WorkOrder = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const enums_1 = require("../../../common/enums");
const bill_of_materials_entity_1 = require("../manufacturing/bill-of-materials.entity");
const product_entity_1 = require("../inventory/product.entity");
const product_variant_entity_1 = require("../inventory/product-variant.entity");
const unit_of_measure_entity_1 = require("../inventory/unit-of-measure.entity");
const sales_order_entity_1 = require("../eCommerce/sales-order.entity");
const warehouse_entity_1 = require("../warehouse/warehouse.entity");
const work_order_item_entity_1 = require("./work-order-item.entity");
const work_order_operation_entity_1 = require("./work-order-operation.entity");
let WorkOrder = class WorkOrder {
    id;
    workOrderNumber;
    bomId;
    productId;
    variantId;
    warehouseId;
    status;
    priority;
    plannedQuantity;
    completedQuantity;
    rejectedQuantity;
    uomId;
    plannedStartDate;
    plannedEndDate;
    actualStartDate;
    actualEndDate;
    salesOrderId;
    parentWorkOrderId;
    estimatedMaterialCost;
    estimatedLaborCost;
    estimatedOverheadCost;
    estimatedTotalCost;
    actualMaterialCost;
    actualLaborCost;
    actualOverheadCost;
    actualTotalCost;
    notes;
    createdBy;
    releasedBy;
    releasedAt;
    completedBy;
    completedAt;
    createdAt;
    updatedAt;
    bom;
    product;
    variant;
    warehouse;
    uom;
    salesOrder;
    parentWorkOrder;
    items;
    operations;
    get completionPercentage() {
        return this.plannedQuantity > 0
            ? (this.completedQuantity / this.plannedQuantity) * 100
            : 0;
    }
    get costVariance() {
        return this.estimatedTotalCost - this.actualTotalCost;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, workOrderNumber: { required: true, type: () => String }, bomId: { required: true, type: () => String }, productId: { required: true, type: () => String }, variantId: { required: true, type: () => String }, warehouseId: { required: true, type: () => String }, status: { required: true, enum: require("../../../common/enums/index").WorkOrderStatus }, priority: { required: true, enum: require("../../../common/enums/index").Priority }, plannedQuantity: { required: true, type: () => Number }, completedQuantity: { required: true, type: () => Number }, rejectedQuantity: { required: true, type: () => Number }, uomId: { required: true, type: () => String }, plannedStartDate: { required: true, type: () => Date }, plannedEndDate: { required: true, type: () => Date }, actualStartDate: { required: true, type: () => Date }, actualEndDate: { required: true, type: () => Date }, salesOrderId: { required: true, type: () => String }, parentWorkOrderId: { required: true, type: () => String }, estimatedMaterialCost: { required: true, type: () => Number }, estimatedLaborCost: { required: true, type: () => Number }, estimatedOverheadCost: { required: true, type: () => Number }, estimatedTotalCost: { required: true, type: () => Number }, actualMaterialCost: { required: true, type: () => Number }, actualLaborCost: { required: true, type: () => Number }, actualOverheadCost: { required: true, type: () => Number }, actualTotalCost: { required: true, type: () => Number }, notes: { required: true, type: () => String }, createdBy: { required: true, type: () => String }, releasedBy: { required: true, type: () => String }, releasedAt: { required: true, type: () => Date }, completedBy: { required: true, type: () => String }, completedAt: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, bom: { required: true, type: () => require("./bill-of-materials.entity").BillOfMaterials }, product: { required: true, type: () => require("../inventory/product.entity").Product }, variant: { required: true, type: () => require("../inventory/product-variant.entity").ProductVariant }, warehouse: { required: true, type: () => require("../warehouse/warehouse.entity").Warehouse }, uom: { required: true, type: () => require("../inventory/unit-of-measure.entity").UnitOfMeasure }, salesOrder: { required: true, type: () => require("../eCommerce/sales-order.entity").SalesOrder }, parentWorkOrder: { required: true, type: () => require("./work-order.entity").WorkOrder }, items: { required: true, type: () => [require("./work-order-item.entity").WorkOrderItem] }, operations: { required: true, type: () => [require("./work-order-operation.entity").WorkOrderOperation] } };
    }
};
exports.WorkOrder = WorkOrder;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], WorkOrder.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'work_order_number', length: 50, unique: true }),
    __metadata("design:type", String)
], WorkOrder.prototype, "workOrderNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bom_id' }),
    __metadata("design:type", String)
], WorkOrder.prototype, "bomId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", String)
], WorkOrder.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'variant_id', nullable: true }),
    __metadata("design:type", String)
], WorkOrder.prototype, "variantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warehouse_id' }),
    __metadata("design:type", String)
], WorkOrder.prototype, "warehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.WorkOrderStatus,
        default: enums_1.WorkOrderStatus.DRAFT,
    }),
    __metadata("design:type", String)
], WorkOrder.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.Priority,
        default: enums_1.Priority.NORMAL,
    }),
    __metadata("design:type", String)
], WorkOrder.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'planned_quantity',
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], WorkOrder.prototype, "plannedQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'completed_quantity',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], WorkOrder.prototype, "completedQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'rejected_quantity',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], WorkOrder.prototype, "rejectedQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'uom_id' }),
    __metadata("design:type", String)
], WorkOrder.prototype, "uomId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'planned_start_date', type: 'date' }),
    __metadata("design:type", Date)
], WorkOrder.prototype, "plannedStartDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'planned_end_date', type: 'date' }),
    __metadata("design:type", Date)
], WorkOrder.prototype, "plannedEndDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'actual_start_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], WorkOrder.prototype, "actualStartDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'actual_end_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], WorkOrder.prototype, "actualEndDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sales_order_id', nullable: true }),
    __metadata("design:type", String)
], WorkOrder.prototype, "salesOrderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'parent_work_order_id', nullable: true }),
    __metadata("design:type", String)
], WorkOrder.prototype, "parentWorkOrderId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'estimated_material_cost',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], WorkOrder.prototype, "estimatedMaterialCost", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'estimated_labor_cost',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], WorkOrder.prototype, "estimatedLaborCost", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'estimated_overhead_cost',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], WorkOrder.prototype, "estimatedOverheadCost", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'estimated_total_cost',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], WorkOrder.prototype, "estimatedTotalCost", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'actual_material_cost',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], WorkOrder.prototype, "actualMaterialCost", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'actual_labor_cost',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], WorkOrder.prototype, "actualLaborCost", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'actual_overhead_cost',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], WorkOrder.prototype, "actualOverheadCost", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'actual_total_cost',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], WorkOrder.prototype, "actualTotalCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], WorkOrder.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", String)
], WorkOrder.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'released_by', nullable: true }),
    __metadata("design:type", String)
], WorkOrder.prototype, "releasedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'released_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], WorkOrder.prototype, "releasedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'completed_by', nullable: true }),
    __metadata("design:type", String)
], WorkOrder.prototype, "completedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'completed_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], WorkOrder.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], WorkOrder.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], WorkOrder.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => bill_of_materials_entity_1.BillOfMaterials),
    (0, typeorm_1.JoinColumn)({ name: 'bom_id' }),
    __metadata("design:type", bill_of_materials_entity_1.BillOfMaterials)
], WorkOrder.prototype, "bom", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], WorkOrder.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_variant_entity_1.ProductVariant),
    (0, typeorm_1.JoinColumn)({ name: 'variant_id' }),
    __metadata("design:type", product_variant_entity_1.ProductVariant)
], WorkOrder.prototype, "variant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_entity_1.Warehouse),
    (0, typeorm_1.JoinColumn)({ name: 'warehouse_id' }),
    __metadata("design:type", warehouse_entity_1.Warehouse)
], WorkOrder.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => unit_of_measure_entity_1.UnitOfMeasure),
    (0, typeorm_1.JoinColumn)({ name: 'uom_id' }),
    __metadata("design:type", unit_of_measure_entity_1.UnitOfMeasure)
], WorkOrder.prototype, "uom", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sales_order_entity_1.SalesOrder),
    (0, typeorm_1.JoinColumn)({ name: 'sales_order_id' }),
    __metadata("design:type", sales_order_entity_1.SalesOrder)
], WorkOrder.prototype, "salesOrder", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => WorkOrder),
    (0, typeorm_1.JoinColumn)({ name: 'parent_work_order_id' }),
    __metadata("design:type", WorkOrder)
], WorkOrder.prototype, "parentWorkOrder", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => work_order_item_entity_1.WorkOrderItem, (item) => item.workOrder),
    __metadata("design:type", Array)
], WorkOrder.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => work_order_operation_entity_1.WorkOrderOperation, (op) => op.workOrder),
    __metadata("design:type", Array)
], WorkOrder.prototype, "operations", void 0);
exports.WorkOrder = WorkOrder = __decorate([
    (0, typeorm_1.Entity)('work_orders')
], WorkOrder);
//# sourceMappingURL=work-order.entity.js.map