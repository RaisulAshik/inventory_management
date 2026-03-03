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
exports.BomOperation = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const bill_of_materials_entity_1 = require("./bill-of-materials.entity");
const workstation_entity_1 = require("./workstation.entity");
let BomOperation = class BomOperation {
    id;
    bomId;
    operationNumber;
    operationName;
    workstationId;
    description;
    instructions;
    setupTimeMinutes;
    operationTimeMinutes;
    teardownTimeMinutes;
    laborCostPerUnit;
    overheadCostPerUnit;
    totalCostPerUnit;
    isOutsourced;
    outsourcedVendor;
    outsourcedCost;
    isQualityCheckRequired;
    qualityParameters;
    notes;
    createdAt;
    updatedAt;
    bom;
    workstation;
    get totalTimeMinutes() {
        return (this.setupTimeMinutes +
            this.operationTimeMinutes +
            this.teardownTimeMinutes);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, bomId: { required: true, type: () => String }, operationNumber: { required: true, type: () => Number }, operationName: { required: true, type: () => String }, workstationId: { required: true, type: () => String }, description: { required: true, type: () => String }, instructions: { required: true, type: () => String }, setupTimeMinutes: { required: true, type: () => Number }, operationTimeMinutes: { required: true, type: () => Number }, teardownTimeMinutes: { required: true, type: () => Number }, laborCostPerUnit: { required: true, type: () => Number }, overheadCostPerUnit: { required: true, type: () => Number }, totalCostPerUnit: { required: true, type: () => Number }, isOutsourced: { required: true, type: () => Boolean }, outsourcedVendor: { required: true, type: () => String }, outsourcedCost: { required: true, type: () => Number }, isQualityCheckRequired: { required: true, type: () => Boolean }, qualityParameters: { required: true, type: () => Object }, notes: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, bom: { required: true, type: () => require("./bill-of-materials.entity").BillOfMaterials }, workstation: { required: true, type: () => require("./workstation.entity").Workstation } };
    }
};
exports.BomOperation = BomOperation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], BomOperation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bom_id' }),
    __metadata("design:type", String)
], BomOperation.prototype, "bomId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'operation_number', type: 'int' }),
    __metadata("design:type", Number)
], BomOperation.prototype, "operationNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'operation_name', length: 200 }),
    __metadata("design:type", String)
], BomOperation.prototype, "operationName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'workstation_id', nullable: true }),
    __metadata("design:type", String)
], BomOperation.prototype, "workstationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], BomOperation.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], BomOperation.prototype, "instructions", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'setup_time_minutes',
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0,
    }),
    __metadata("design:type", Number)
], BomOperation.prototype, "setupTimeMinutes", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'operation_time_minutes',
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0,
    }),
    __metadata("design:type", Number)
], BomOperation.prototype, "operationTimeMinutes", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'teardown_time_minutes',
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0,
    }),
    __metadata("design:type", Number)
], BomOperation.prototype, "teardownTimeMinutes", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'labor_cost_per_unit',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], BomOperation.prototype, "laborCostPerUnit", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'overhead_cost_per_unit',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], BomOperation.prototype, "overheadCostPerUnit", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_cost_per_unit',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], BomOperation.prototype, "totalCostPerUnit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_outsourced', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], BomOperation.prototype, "isOutsourced", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'outsourced_vendor', length: 200, nullable: true }),
    __metadata("design:type", String)
], BomOperation.prototype, "outsourcedVendor", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'outsourced_cost',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], BomOperation.prototype, "outsourcedCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_quality_check_required', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], BomOperation.prototype, "isQualityCheckRequired", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quality_parameters', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], BomOperation.prototype, "qualityParameters", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], BomOperation.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], BomOperation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], BomOperation.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => bill_of_materials_entity_1.BillOfMaterials, (bom) => bom.operations, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'bom_id' }),
    __metadata("design:type", bill_of_materials_entity_1.BillOfMaterials)
], BomOperation.prototype, "bom", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => workstation_entity_1.Workstation),
    (0, typeorm_1.JoinColumn)({ name: 'workstation_id' }),
    __metadata("design:type", workstation_entity_1.Workstation)
], BomOperation.prototype, "workstation", void 0);
exports.BomOperation = BomOperation = __decorate([
    (0, typeorm_1.Entity)('bom_operations')
], BomOperation);
//# sourceMappingURL=bom-operation.entity.js.map