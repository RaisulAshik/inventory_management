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
exports.WarehouseLocation = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const enums_1 = require("../../../common/enums");
const warehouse_entity_1 = require("./warehouse.entity");
const warehouse_zone_entity_1 = require("./warehouse-zone.entity");
const location_inventory_entity_1 = require("./location-inventory.entity");
let WarehouseLocation = class WarehouseLocation {
    id;
    warehouseId;
    zoneId;
    locationCode;
    locationName;
    aisle;
    rack;
    shelf;
    bin;
    locationType;
    barcode;
    maxWeightKg;
    maxVolumeCbm;
    maxUnits;
    currentWeightKg;
    currentVolumeCbm;
    currentUnits;
    status;
    isActive;
    createdAt;
    updatedAt;
    warehouse;
    zone;
    inventory;
    get fullPath() {
        return [this.aisle, this.rack, this.shelf, this.bin]
            .filter(Boolean)
            .join('-');
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, warehouseId: { required: true, type: () => String }, zoneId: { required: true, type: () => String }, locationCode: { required: true, type: () => String }, locationName: { required: true, type: () => String }, aisle: { required: true, type: () => String }, rack: { required: true, type: () => String }, shelf: { required: true, type: () => String }, bin: { required: true, type: () => String }, locationType: { required: true, enum: require("../../../common/enums/index").LocationType }, barcode: { required: true, type: () => String }, maxWeightKg: { required: true, type: () => Number }, maxVolumeCbm: { required: true, type: () => Number }, maxUnits: { required: true, type: () => Number }, currentWeightKg: { required: true, type: () => Number }, currentVolumeCbm: { required: true, type: () => Number }, currentUnits: { required: true, type: () => Number }, status: { required: true, enum: require("../../../common/enums/index").LocationStatus }, isActive: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, warehouse: { required: true, type: () => require("./warehouse.entity").Warehouse }, zone: { required: true, type: () => require("./warehouse-zone.entity").WarehouseZone }, inventory: { required: true, type: () => [require("./location-inventory.entity").LocationInventory] } };
    }
};
exports.WarehouseLocation = WarehouseLocation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], WarehouseLocation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warehouse_id' }),
    __metadata("design:type", String)
], WarehouseLocation.prototype, "warehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'zone_id', nullable: true }),
    __metadata("design:type", String)
], WarehouseLocation.prototype, "zoneId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'location_code', length: 50 }),
    __metadata("design:type", String)
], WarehouseLocation.prototype, "locationCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'location_name', length: 200, nullable: true }),
    __metadata("design:type", String)
], WarehouseLocation.prototype, "locationName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, nullable: true }),
    __metadata("design:type", String)
], WarehouseLocation.prototype, "aisle", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, nullable: true }),
    __metadata("design:type", String)
], WarehouseLocation.prototype, "rack", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, nullable: true }),
    __metadata("design:type", String)
], WarehouseLocation.prototype, "shelf", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, nullable: true }),
    __metadata("design:type", String)
], WarehouseLocation.prototype, "bin", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'location_type',
        type: 'enum',
        enum: enums_1.LocationType,
        default: enums_1.LocationType.BULk,
    }),
    __metadata("design:type", String)
], WarehouseLocation.prototype, "locationType", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], WarehouseLocation.prototype, "barcode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'max_weight_kg',
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: true,
    }),
    __metadata("design:type", Number)
], WarehouseLocation.prototype, "maxWeightKg", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'max_volume_cbm',
        type: 'decimal',
        precision: 10,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], WarehouseLocation.prototype, "maxVolumeCbm", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_units', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], WarehouseLocation.prototype, "maxUnits", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'current_weight_kg',
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0,
    }),
    __metadata("design:type", Number)
], WarehouseLocation.prototype, "currentWeightKg", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'current_volume_cbm',
        type: 'decimal',
        precision: 10,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], WarehouseLocation.prototype, "currentVolumeCbm", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'current_units', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], WarehouseLocation.prototype, "currentUnits", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.LocationStatus,
        default: enums_1.LocationStatus.AVAILABLE,
    }),
    __metadata("design:type", String)
], WarehouseLocation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], WarehouseLocation.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], WarehouseLocation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], WarehouseLocation.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_entity_1.Warehouse, (warehouse) => warehouse.locations, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'warehouse_id' }),
    __metadata("design:type", warehouse_entity_1.Warehouse)
], WarehouseLocation.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_zone_entity_1.WarehouseZone, (zone) => zone.locations, {
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'zone_id' }),
    __metadata("design:type", warehouse_zone_entity_1.WarehouseZone)
], WarehouseLocation.prototype, "zone", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => location_inventory_entity_1.LocationInventory, (inv) => inv.location),
    __metadata("design:type", Array)
], WarehouseLocation.prototype, "inventory", void 0);
exports.WarehouseLocation = WarehouseLocation = __decorate([
    (0, typeorm_1.Entity)('warehouse_locations')
], WarehouseLocation);
//# sourceMappingURL=warehouse-location.entity.js.map