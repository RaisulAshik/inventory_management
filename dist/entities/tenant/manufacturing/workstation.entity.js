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
exports.Workstation = exports.WorkstationStatus = exports.WorkstationType = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const warehouse_entity_1 = require("../warehouse/warehouse.entity");
var WorkstationType;
(function (WorkstationType) {
    WorkstationType["ASSEMBLY"] = "ASSEMBLY";
    WorkstationType["MACHINING"] = "MACHINING";
    WorkstationType["PACKAGING"] = "PACKAGING";
    WorkstationType["QUALITY_CHECK"] = "QUALITY_CHECK";
    WorkstationType["PAINTING"] = "PAINTING";
    WorkstationType["WELDING"] = "WELDING";
    WorkstationType["CUTTING"] = "CUTTING";
    WorkstationType["MOLDING"] = "MOLDING";
    WorkstationType["FINISHING"] = "FINISHING";
    WorkstationType["OTHER"] = "OTHER";
})(WorkstationType || (exports.WorkstationType = WorkstationType = {}));
var WorkstationStatus;
(function (WorkstationStatus) {
    WorkstationStatus["AVAILABLE"] = "AVAILABLE";
    WorkstationStatus["IN_USE"] = "IN_USE";
    WorkstationStatus["MAINTENANCE"] = "MAINTENANCE";
    WorkstationStatus["BREAKDOWN"] = "BREAKDOWN";
    WorkstationStatus["INACTIVE"] = "INACTIVE";
})(WorkstationStatus || (exports.WorkstationStatus = WorkstationStatus = {}));
let Workstation = class Workstation {
    id;
    workstationCode;
    workstationName;
    workstationType;
    warehouseId;
    description;
    status;
    hourlyRate;
    operatingCostPerHour;
    capacityPerHour;
    workingHoursPerDay;
    efficiencyPercentage;
    setupTimeMinutes;
    cleanupTimeMinutes;
    lastMaintenanceDate;
    nextMaintenanceDate;
    isActive;
    notes;
    createdAt;
    updatedAt;
    warehouse;
    get effectiveCapacityPerDay() {
        if (!this.capacityPerHour)
            return 0;
        return (this.capacityPerHour *
            this.workingHoursPerDay *
            (this.efficiencyPercentage / 100));
    }
    get needsMaintenance() {
        if (!this.nextMaintenanceDate)
            return false;
        return new Date(this.nextMaintenanceDate) <= new Date();
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, workstationCode: { required: true, type: () => String }, workstationName: { required: true, type: () => String }, workstationType: { required: true, enum: require("./workstation.entity").WorkstationType }, warehouseId: { required: true, type: () => String }, description: { required: true, type: () => String }, status: { required: true, enum: require("./workstation.entity").WorkstationStatus }, hourlyRate: { required: true, type: () => Number }, operatingCostPerHour: { required: true, type: () => Number }, capacityPerHour: { required: true, type: () => Number }, workingHoursPerDay: { required: true, type: () => Number }, efficiencyPercentage: { required: true, type: () => Number }, setupTimeMinutes: { required: true, type: () => Number }, cleanupTimeMinutes: { required: true, type: () => Number }, lastMaintenanceDate: { required: true, type: () => Date }, nextMaintenanceDate: { required: true, type: () => Date }, isActive: { required: true, type: () => Boolean }, notes: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, warehouse: { required: true, type: () => require("../warehouse/warehouse.entity").Warehouse } };
    }
};
exports.Workstation = Workstation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Workstation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'workstation_code', length: 50, unique: true }),
    __metadata("design:type", String)
], Workstation.prototype, "workstationCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'workstation_name', length: 200 }),
    __metadata("design:type", String)
], Workstation.prototype, "workstationName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'workstation_type',
        type: 'enum',
        enum: WorkstationType,
        default: WorkstationType.ASSEMBLY,
    }),
    __metadata("design:type", String)
], Workstation.prototype, "workstationType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warehouse_id', nullable: true }),
    __metadata("design:type", String)
], Workstation.prototype, "warehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Workstation.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: WorkstationStatus,
        default: WorkstationStatus.AVAILABLE,
    }),
    __metadata("design:type", String)
], Workstation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'hourly_rate',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], Workstation.prototype, "hourlyRate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'operating_cost_per_hour',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], Workstation.prototype, "operatingCostPerHour", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'capacity_per_hour',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], Workstation.prototype, "capacityPerHour", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'working_hours_per_day',
        type: 'decimal',
        precision: 4,
        scale: 2,
        default: 8,
    }),
    __metadata("design:type", Number)
], Workstation.prototype, "workingHoursPerDay", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'efficiency_percentage',
        type: 'decimal',
        precision: 5,
        scale: 2,
        default: 100,
    }),
    __metadata("design:type", Number)
], Workstation.prototype, "efficiencyPercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'setup_time_minutes', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Workstation.prototype, "setupTimeMinutes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cleanup_time_minutes', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Workstation.prototype, "cleanupTimeMinutes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_maintenance_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Workstation.prototype, "lastMaintenanceDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'next_maintenance_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Workstation.prototype, "nextMaintenanceDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], Workstation.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Workstation.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Workstation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Workstation.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_entity_1.Warehouse),
    (0, typeorm_1.JoinColumn)({ name: 'warehouse_id' }),
    __metadata("design:type", warehouse_entity_1.Warehouse)
], Workstation.prototype, "warehouse", void 0);
exports.Workstation = Workstation = __decorate([
    (0, typeorm_1.Entity)('workstations')
], Workstation);
//# sourceMappingURL=workstation.entity.js.map