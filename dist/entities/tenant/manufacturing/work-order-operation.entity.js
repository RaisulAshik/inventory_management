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
exports.WorkOrderOperation = exports.WorkOrderOperationStatus = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const work_order_entity_1 = require("./work-order.entity");
const bom_operation_entity_1 = require("./bom-operation.entity");
const workstation_entity_1 = require("./workstation.entity");
const user_entity_1 = require("../user/user.entity");
var WorkOrderOperationStatus;
(function (WorkOrderOperationStatus) {
    WorkOrderOperationStatus["PENDING"] = "PENDING";
    WorkOrderOperationStatus["READY"] = "READY";
    WorkOrderOperationStatus["IN_PROGRESS"] = "IN_PROGRESS";
    WorkOrderOperationStatus["PAUSED"] = "PAUSED";
    WorkOrderOperationStatus["COMPLETED"] = "COMPLETED";
    WorkOrderOperationStatus["CANCELLED"] = "CANCELLED";
})(WorkOrderOperationStatus || (exports.WorkOrderOperationStatus = WorkOrderOperationStatus = {}));
let WorkOrderOperation = class WorkOrderOperation {
    id;
    workOrderId;
    bomOperationId;
    operationNumber;
    operationName;
    workstationId;
    status;
    plannedQuantity;
    completedQuantity;
    rejectedQuantity;
    plannedStartTime;
    plannedEndTime;
    actualStartTime;
    actualEndTime;
    plannedDurationMinutes;
    actualDurationMinutes;
    estimatedLaborCost;
    actualLaborCost;
    estimatedOverheadCost;
    actualOverheadCost;
    operatorId;
    instructions;
    notes;
    createdAt;
    updatedAt;
    workOrder;
    bomOperation;
    workstation;
    operator;
    get completionPercentage() {
        return this.plannedQuantity > 0
            ? (this.completedQuantity / this.plannedQuantity) * 100
            : 0;
    }
    get timeVariance() {
        return this.actualDurationMinutes - this.plannedDurationMinutes;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, workOrderId: { required: true, type: () => String }, bomOperationId: { required: true, type: () => String }, operationNumber: { required: true, type: () => Number }, operationName: { required: true, type: () => String }, workstationId: { required: true, type: () => String }, status: { required: true, enum: require("./work-order-operation.entity").WorkOrderOperationStatus }, plannedQuantity: { required: true, type: () => Number }, completedQuantity: { required: true, type: () => Number }, rejectedQuantity: { required: true, type: () => Number }, plannedStartTime: { required: true, type: () => Date }, plannedEndTime: { required: true, type: () => Date }, actualStartTime: { required: true, type: () => Date }, actualEndTime: { required: true, type: () => Date }, plannedDurationMinutes: { required: true, type: () => Number }, actualDurationMinutes: { required: true, type: () => Number }, estimatedLaborCost: { required: true, type: () => Number }, actualLaborCost: { required: true, type: () => Number }, estimatedOverheadCost: { required: true, type: () => Number }, actualOverheadCost: { required: true, type: () => Number }, operatorId: { required: true, type: () => String }, instructions: { required: true, type: () => String }, notes: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, workOrder: { required: true, type: () => require("./work-order.entity").WorkOrder }, bomOperation: { required: true, type: () => require("./bom-operation.entity").BomOperation }, workstation: { required: true, type: () => require("./workstation.entity").Workstation }, operator: { required: true, type: () => require("../user/user.entity").User } };
    }
};
exports.WorkOrderOperation = WorkOrderOperation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], WorkOrderOperation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'work_order_id' }),
    __metadata("design:type", String)
], WorkOrderOperation.prototype, "workOrderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bom_operation_id', nullable: true }),
    __metadata("design:type", String)
], WorkOrderOperation.prototype, "bomOperationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'operation_number', type: 'int' }),
    __metadata("design:type", Number)
], WorkOrderOperation.prototype, "operationNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'operation_name', length: 200 }),
    __metadata("design:type", String)
], WorkOrderOperation.prototype, "operationName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'workstation_id', nullable: true }),
    __metadata("design:type", String)
], WorkOrderOperation.prototype, "workstationId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: WorkOrderOperationStatus,
        default: WorkOrderOperationStatus.PENDING,
    }),
    __metadata("design:type", String)
], WorkOrderOperation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'planned_quantity',
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], WorkOrderOperation.prototype, "plannedQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'completed_quantity',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], WorkOrderOperation.prototype, "completedQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'rejected_quantity',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], WorkOrderOperation.prototype, "rejectedQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'planned_start_time',
        type: 'timestamp',
        nullable: true,
    }),
    __metadata("design:type", Date)
], WorkOrderOperation.prototype, "plannedStartTime", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'planned_end_time',
        type: 'timestamp',
        nullable: true,
    }),
    __metadata("design:type", Date)
], WorkOrderOperation.prototype, "plannedEndTime", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'actual_start_time',
        type: 'timestamp',
        nullable: true,
    }),
    __metadata("design:type", Date)
], WorkOrderOperation.prototype, "actualStartTime", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'actual_end_time',
        type: 'timestamp',
        nullable: true,
    }),
    __metadata("design:type", Date)
], WorkOrderOperation.prototype, "actualEndTime", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'planned_duration_minutes',
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0,
    }),
    __metadata("design:type", Number)
], WorkOrderOperation.prototype, "plannedDurationMinutes", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'actual_duration_minutes',
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0,
    }),
    __metadata("design:type", Number)
], WorkOrderOperation.prototype, "actualDurationMinutes", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'estimated_labor_cost',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], WorkOrderOperation.prototype, "estimatedLaborCost", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'actual_labor_cost',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], WorkOrderOperation.prototype, "actualLaborCost", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'estimated_overhead_cost',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], WorkOrderOperation.prototype, "estimatedOverheadCost", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'actual_overhead_cost',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], WorkOrderOperation.prototype, "actualOverheadCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'operator_id', nullable: true }),
    __metadata("design:type", String)
], WorkOrderOperation.prototype, "operatorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], WorkOrderOperation.prototype, "instructions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], WorkOrderOperation.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], WorkOrderOperation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], WorkOrderOperation.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => work_order_entity_1.WorkOrder, (wo) => wo.operations, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'work_order_id' }),
    __metadata("design:type", work_order_entity_1.WorkOrder)
], WorkOrderOperation.prototype, "workOrder", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => bom_operation_entity_1.BomOperation),
    (0, typeorm_1.JoinColumn)({ name: 'bom_operation_id' }),
    __metadata("design:type", bom_operation_entity_1.BomOperation)
], WorkOrderOperation.prototype, "bomOperation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => workstation_entity_1.Workstation),
    (0, typeorm_1.JoinColumn)({ name: 'workstation_id' }),
    __metadata("design:type", workstation_entity_1.Workstation)
], WorkOrderOperation.prototype, "workstation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'operator_id' }),
    __metadata("design:type", user_entity_1.User)
], WorkOrderOperation.prototype, "operator", void 0);
exports.WorkOrderOperation = WorkOrderOperation = __decorate([
    (0, typeorm_1.Entity)('work_order_operations')
], WorkOrderOperation);
//# sourceMappingURL=work-order-operation.entity.js.map