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
exports.Warehouse = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const enums_1 = require("../../../common/enums");
const warehouse_zone_entity_1 = require("./warehouse-zone.entity");
const warehouse_location_entity_1 = require("./warehouse-location.entity");
const inventory_stock_entity_1 = require("./inventory-stock.entity");
let Warehouse = class Warehouse {
    id;
    warehouseCode;
    warehouseName;
    warehouseType;
    addressLine1;
    addressLine2;
    city;
    state;
    country;
    postalCode;
    contactPerson;
    phone;
    email;
    totalAreaSqft;
    usableAreaSqft;
    isActive;
    isDefault;
    allowNegativeStock;
    createdAt;
    updatedAt;
    zones;
    locations;
    inventoryStocks;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, warehouseCode: { required: true, type: () => String }, warehouseName: { required: true, type: () => String }, warehouseType: { required: true, enum: require("../../../common/enums/index").WarehouseType }, addressLine1: { required: true, type: () => String }, addressLine2: { required: true, type: () => String }, city: { required: true, type: () => String }, state: { required: true, type: () => String }, country: { required: true, type: () => String }, postalCode: { required: true, type: () => String }, contactPerson: { required: true, type: () => String }, phone: { required: true, type: () => String }, email: { required: true, type: () => String }, totalAreaSqft: { required: true, type: () => Number }, usableAreaSqft: { required: true, type: () => Number }, isActive: { required: true, type: () => Boolean }, isDefault: { required: true, type: () => Boolean }, allowNegativeStock: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, zones: { required: true, type: () => [require("./warehouse-zone.entity").WarehouseZone] }, locations: { required: true, type: () => [require("./warehouse-location.entity").WarehouseLocation] }, inventoryStocks: { required: true, type: () => [require("./inventory-stock.entity").InventoryStock] } };
    }
};
exports.Warehouse = Warehouse;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Warehouse.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warehouse_code', length: 50, unique: true }),
    __metadata("design:type", String)
], Warehouse.prototype, "warehouseCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warehouse_name', length: 200 }),
    __metadata("design:type", String)
], Warehouse.prototype, "warehouseName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'warehouse_type',
        type: 'enum',
        enum: enums_1.WarehouseType,
        default: enums_1.WarehouseType.MAIN,
    }),
    __metadata("design:type", String)
], Warehouse.prototype, "warehouseType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'address_line1', length: 255, nullable: true }),
    __metadata("design:type", String)
], Warehouse.prototype, "addressLine1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'address_line2', length: 255, nullable: true }),
    __metadata("design:type", String)
], Warehouse.prototype, "addressLine2", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Warehouse.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Warehouse.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Warehouse.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'postal_code', length: 20, nullable: true }),
    __metadata("design:type", String)
], Warehouse.prototype, "postalCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contact_person', length: 100, nullable: true }),
    __metadata("design:type", String)
], Warehouse.prototype, "contactPerson", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Warehouse.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Warehouse.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_area_sqft',
        type: 'decimal',
        precision: 12,
        scale: 2,
        nullable: true,
    }),
    __metadata("design:type", Number)
], Warehouse.prototype, "totalAreaSqft", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'usable_area_sqft',
        type: 'decimal',
        precision: 12,
        scale: 2,
        nullable: true,
    }),
    __metadata("design:type", Number)
], Warehouse.prototype, "usableAreaSqft", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], Warehouse.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_default', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], Warehouse.prototype, "isDefault", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'allow_negative_stock', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], Warehouse.prototype, "allowNegativeStock", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Warehouse.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Warehouse.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => warehouse_zone_entity_1.WarehouseZone, (zone) => zone.warehouse),
    __metadata("design:type", Array)
], Warehouse.prototype, "zones", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => warehouse_location_entity_1.WarehouseLocation, (location) => location.warehouse),
    __metadata("design:type", Array)
], Warehouse.prototype, "locations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => inventory_stock_entity_1.InventoryStock, (stock) => stock.warehouse),
    __metadata("design:type", Array)
], Warehouse.prototype, "inventoryStocks", void 0);
exports.Warehouse = Warehouse = __decorate([
    (0, typeorm_1.Entity)('warehouses')
], Warehouse);
//# sourceMappingURL=warehouse.entity.js.map