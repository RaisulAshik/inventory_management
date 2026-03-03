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
exports.WarehouseZone = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const enums_1 = require("../../../common/enums");
const warehouse_entity_1 = require("./warehouse.entity");
const warehouse_location_entity_1 = require("./warehouse-location.entity");
let WarehouseZone = class WarehouseZone {
    id;
    warehouseId;
    zoneCode;
    zoneName;
    zoneType;
    description;
    temperatureMin;
    temperatureMax;
    isActive;
    createdAt;
    updatedAt;
    warehouse;
    locations;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, warehouseId: { required: true, type: () => String }, zoneCode: { required: true, type: () => String }, zoneName: { required: true, type: () => String }, zoneType: { required: true, enum: require("../../../common/enums/index").ZoneType }, description: { required: true, type: () => String }, temperatureMin: { required: true, type: () => Number }, temperatureMax: { required: true, type: () => Number }, isActive: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, warehouse: { required: true, type: () => require("./warehouse.entity").Warehouse }, locations: { required: true, type: () => [require("./warehouse-location.entity").WarehouseLocation] } };
    }
};
exports.WarehouseZone = WarehouseZone;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], WarehouseZone.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warehouse_id' }),
    __metadata("design:type", String)
], WarehouseZone.prototype, "warehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'zone_code', length: 50 }),
    __metadata("design:type", String)
], WarehouseZone.prototype, "zoneCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'zone_name', length: 200 }),
    __metadata("design:type", String)
], WarehouseZone.prototype, "zoneName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'zone_type',
        type: 'enum',
        enum: enums_1.ZoneType,
        default: enums_1.ZoneType.STORAGE,
    }),
    __metadata("design:type", String)
], WarehouseZone.prototype, "zoneType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], WarehouseZone.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'temperature_min',
        type: 'decimal',
        precision: 5,
        scale: 2,
        nullable: true,
    }),
    __metadata("design:type", Number)
], WarehouseZone.prototype, "temperatureMin", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'temperature_max',
        type: 'decimal',
        precision: 5,
        scale: 2,
        nullable: true,
    }),
    __metadata("design:type", Number)
], WarehouseZone.prototype, "temperatureMax", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], WarehouseZone.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], WarehouseZone.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], WarehouseZone.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_entity_1.Warehouse, (warehouse) => warehouse.zones, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'warehouse_id' }),
    __metadata("design:type", warehouse_entity_1.Warehouse)
], WarehouseZone.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => warehouse_location_entity_1.WarehouseLocation, (location) => location.zone),
    __metadata("design:type", Array)
], WarehouseZone.prototype, "locations", void 0);
exports.WarehouseZone = WarehouseZone = __decorate([
    (0, typeorm_1.Entity)('warehouse_zones')
], WarehouseZone);
//# sourceMappingURL=warehouse-zone.entity.js.map