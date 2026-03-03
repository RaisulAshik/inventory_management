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
exports.ProductionOutput = exports.ProductionOutputStatus = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const work_order_entity_1 = require("./work-order.entity");
const work_order_operation_entity_1 = require("./work-order-operation.entity");
const product_entity_1 = require("../inventory/product.entity");
const product_variant_entity_1 = require("../inventory/product-variant.entity");
const warehouse_entity_1 = require("../warehouse/warehouse.entity");
const user_entity_1 = require("../user/user.entity");
const unit_of_measure_entity_1 = require("../inventory/unit-of-measure.entity");
const warehouse_location_entity_1 = require("../warehouse/warehouse-location.entity");
const inventory_batch_entity_1 = require("../warehouse/inventory-batch.entity");
var ProductionOutputStatus;
(function (ProductionOutputStatus) {
    ProductionOutputStatus["PENDING_QC"] = "PENDING_QC";
    ProductionOutputStatus["QC_PASSED"] = "QC_PASSED";
    ProductionOutputStatus["QC_FAILED"] = "QC_FAILED";
    ProductionOutputStatus["ACCEPTED"] = "ACCEPTED";
    ProductionOutputStatus["REJECTED"] = "REJECTED";
    ProductionOutputStatus["REWORK"] = "REWORK";
})(ProductionOutputStatus || (exports.ProductionOutputStatus = ProductionOutputStatus = {}));
let ProductionOutput = class ProductionOutput {
    id;
    outputNumber;
    outputDate;
    workOrderId;
    workOrderOperationId;
    productId;
    variantId;
    warehouseId;
    locationId;
    batchId;
    producedQuantity;
    acceptedQuantity;
    rejectedQuantity;
    reworkQuantity;
    uomId;
    status;
    materialCost;
    laborCost;
    overheadCost;
    totalCost;
    unitCost;
    batchNumber;
    manufacturingDate;
    expiryDate;
    rejectionReason;
    notes;
    producedBy;
    qcBy;
    qcAt;
    createdBy;
    createdAt;
    updatedAt;
    workOrder;
    workOrderOperation;
    product;
    variant;
    warehouse;
    location;
    batch;
    uom;
    producedByUser;
    get yieldPercentage() {
        return this.producedQuantity > 0
            ? (this.acceptedQuantity / this.producedQuantity) * 100
            : 0;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, outputNumber: { required: true, type: () => String }, outputDate: { required: true, type: () => Date }, workOrderId: { required: true, type: () => String }, workOrderOperationId: { required: true, type: () => String }, productId: { required: true, type: () => String }, variantId: { required: true, type: () => String }, warehouseId: { required: true, type: () => String }, locationId: { required: true, type: () => String }, batchId: { required: true, type: () => String }, producedQuantity: { required: true, type: () => Number }, acceptedQuantity: { required: true, type: () => Number }, rejectedQuantity: { required: true, type: () => Number }, reworkQuantity: { required: true, type: () => Number }, uomId: { required: true, type: () => String }, status: { required: true, enum: require("./production-output.entity").ProductionOutputStatus }, materialCost: { required: true, type: () => Number }, laborCost: { required: true, type: () => Number }, overheadCost: { required: true, type: () => Number }, totalCost: { required: true, type: () => Number }, unitCost: { required: true, type: () => Number }, batchNumber: { required: true, type: () => String }, manufacturingDate: { required: true, type: () => Date }, expiryDate: { required: true, type: () => Date }, rejectionReason: { required: true, type: () => String }, notes: { required: true, type: () => String }, producedBy: { required: true, type: () => String }, qcBy: { required: true, type: () => String }, qcAt: { required: true, type: () => Date }, createdBy: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, workOrder: { required: true, type: () => require("./work-order.entity").WorkOrder }, workOrderOperation: { required: true, type: () => require("./work-order-operation.entity").WorkOrderOperation }, product: { required: true, type: () => require("../inventory/product.entity").Product }, variant: { required: true, type: () => require("../inventory/product-variant.entity").ProductVariant }, warehouse: { required: true, type: () => require("../warehouse/warehouse.entity").Warehouse }, location: { required: true, type: () => require("../warehouse/warehouse-location.entity").WarehouseLocation }, batch: { required: true, type: () => require("../warehouse/inventory-batch.entity").InventoryBatch }, uom: { required: true, type: () => require("../inventory/unit-of-measure.entity").UnitOfMeasure }, producedByUser: { required: true, type: () => require("../user/user.entity").User } };
    }
};
exports.ProductionOutput = ProductionOutput;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ProductionOutput.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'output_number', length: 50, unique: true }),
    __metadata("design:type", String)
], ProductionOutput.prototype, "outputNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'output_date', type: 'timestamp' }),
    __metadata("design:type", Date)
], ProductionOutput.prototype, "outputDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'work_order_id' }),
    __metadata("design:type", String)
], ProductionOutput.prototype, "workOrderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'work_order_operation_id', nullable: true }),
    __metadata("design:type", String)
], ProductionOutput.prototype, "workOrderOperationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", String)
], ProductionOutput.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'variant_id', nullable: true }),
    __metadata("design:type", String)
], ProductionOutput.prototype, "variantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warehouse_id' }),
    __metadata("design:type", String)
], ProductionOutput.prototype, "warehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'location_id', nullable: true }),
    __metadata("design:type", String)
], ProductionOutput.prototype, "locationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'batch_id', nullable: true }),
    __metadata("design:type", String)
], ProductionOutput.prototype, "batchId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'produced_quantity',
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], ProductionOutput.prototype, "producedQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'accepted_quantity',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], ProductionOutput.prototype, "acceptedQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'rejected_quantity',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], ProductionOutput.prototype, "rejectedQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'rework_quantity',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], ProductionOutput.prototype, "reworkQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'uom_id' }),
    __metadata("design:type", String)
], ProductionOutput.prototype, "uomId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ProductionOutputStatus,
        default: ProductionOutputStatus.PENDING_QC,
    }),
    __metadata("design:type", String)
], ProductionOutput.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'material_cost',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], ProductionOutput.prototype, "materialCost", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'labor_cost',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], ProductionOutput.prototype, "laborCost", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'overhead_cost',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], ProductionOutput.prototype, "overheadCost", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_cost',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], ProductionOutput.prototype, "totalCost", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'unit_cost',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], ProductionOutput.prototype, "unitCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'batch_number', length: 100, nullable: true }),
    __metadata("design:type", String)
], ProductionOutput.prototype, "batchNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'manufacturing_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], ProductionOutput.prototype, "manufacturingDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expiry_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], ProductionOutput.prototype, "expiryDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rejection_reason', type: 'text', nullable: true }),
    __metadata("design:type", String)
], ProductionOutput.prototype, "rejectionReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ProductionOutput.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'produced_by', nullable: true }),
    __metadata("design:type", String)
], ProductionOutput.prototype, "producedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qc_by', nullable: true }),
    __metadata("design:type", String)
], ProductionOutput.prototype, "qcBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qc_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], ProductionOutput.prototype, "qcAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", String)
], ProductionOutput.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ProductionOutput.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ProductionOutput.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => work_order_entity_1.WorkOrder),
    (0, typeorm_1.JoinColumn)({ name: 'work_order_id' }),
    __metadata("design:type", work_order_entity_1.WorkOrder)
], ProductionOutput.prototype, "workOrder", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => work_order_operation_entity_1.WorkOrderOperation),
    (0, typeorm_1.JoinColumn)({ name: 'work_order_operation_id' }),
    __metadata("design:type", work_order_operation_entity_1.WorkOrderOperation)
], ProductionOutput.prototype, "workOrderOperation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], ProductionOutput.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_variant_entity_1.ProductVariant),
    (0, typeorm_1.JoinColumn)({ name: 'variant_id' }),
    __metadata("design:type", product_variant_entity_1.ProductVariant)
], ProductionOutput.prototype, "variant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_entity_1.Warehouse),
    (0, typeorm_1.JoinColumn)({ name: 'warehouse_id' }),
    __metadata("design:type", warehouse_entity_1.Warehouse)
], ProductionOutput.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_location_entity_1.WarehouseLocation),
    (0, typeorm_1.JoinColumn)({ name: 'location_id' }),
    __metadata("design:type", warehouse_location_entity_1.WarehouseLocation)
], ProductionOutput.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => inventory_batch_entity_1.InventoryBatch),
    (0, typeorm_1.JoinColumn)({ name: 'batch_id' }),
    __metadata("design:type", inventory_batch_entity_1.InventoryBatch)
], ProductionOutput.prototype, "batch", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => unit_of_measure_entity_1.UnitOfMeasure),
    (0, typeorm_1.JoinColumn)({ name: 'uom_id' }),
    __metadata("design:type", unit_of_measure_entity_1.UnitOfMeasure)
], ProductionOutput.prototype, "uom", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'produced_by' }),
    __metadata("design:type", user_entity_1.User)
], ProductionOutput.prototype, "producedByUser", void 0);
exports.ProductionOutput = ProductionOutput = __decorate([
    (0, typeorm_1.Entity)('production_outputs')
], ProductionOutput);
//# sourceMappingURL=production-output.entity.js.map