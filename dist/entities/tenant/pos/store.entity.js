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
exports.Store = exports.StoreType = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const warehouse_entity_1 = require("../warehouse/warehouse.entity");
const user_entity_1 = require("../user/user.entity");
const pos_terminal_entity_1 = require("./pos-terminal.entity");
const price_list_entity_1 = require("../inventory/price-list.entity");
var StoreType;
(function (StoreType) {
    StoreType["RETAIL"] = "RETAIL";
    StoreType["OUTLET"] = "OUTLET";
    StoreType["FRANCHISE"] = "FRANCHISE";
    StoreType["POPUP"] = "POPUP";
    StoreType["KIOSK"] = "KIOSK";
})(StoreType || (exports.StoreType = StoreType = {}));
let Store = class Store {
    id;
    storeCode;
    storeName;
    storeType;
    warehouseId;
    addressLine1;
    addressLine2;
    city;
    state;
    country;
    postalCode;
    phone;
    email;
    managerId;
    openingTime;
    closingTime;
    timezone;
    taxId;
    defaultPriceListId;
    receiptHeader;
    receiptFooter;
    isActive;
    createdAt;
    updatedAt;
    warehouse;
    manager;
    defaultPriceList;
    terminals;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, storeCode: { required: true, type: () => String }, storeName: { required: true, type: () => String }, storeType: { required: true, enum: require("./store.entity").StoreType }, warehouseId: { required: true, type: () => String }, addressLine1: { required: true, type: () => String }, addressLine2: { required: true, type: () => String }, city: { required: true, type: () => String }, state: { required: true, type: () => String }, country: { required: true, type: () => String }, postalCode: { required: true, type: () => String }, phone: { required: true, type: () => String }, email: { required: true, type: () => String }, managerId: { required: true, type: () => String }, openingTime: { required: true, type: () => String }, closingTime: { required: true, type: () => String }, timezone: { required: true, type: () => String }, taxId: { required: true, type: () => String }, defaultPriceListId: { required: true, type: () => String }, receiptHeader: { required: true, type: () => String }, receiptFooter: { required: true, type: () => String }, isActive: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, warehouse: { required: true, type: () => require("../warehouse/warehouse.entity").Warehouse }, manager: { required: true, type: () => require("../user/user.entity").User }, defaultPriceList: { required: true, type: () => require("../inventory/price-list.entity").PriceList }, terminals: { required: true, type: () => [require("./pos-terminal.entity").PosTerminal] } };
    }
};
exports.Store = Store;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Store.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'store_code', length: 50, unique: true }),
    __metadata("design:type", String)
], Store.prototype, "storeCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'store_name', length: 200 }),
    __metadata("design:type", String)
], Store.prototype, "storeName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'store_type',
        type: 'enum',
        enum: StoreType,
        default: StoreType.RETAIL,
    }),
    __metadata("design:type", String)
], Store.prototype, "storeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warehouse_id' }),
    __metadata("design:type", String)
], Store.prototype, "warehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'address_line1', length: 255, nullable: true }),
    __metadata("design:type", String)
], Store.prototype, "addressLine1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'address_line2', length: 255, nullable: true }),
    __metadata("design:type", String)
], Store.prototype, "addressLine2", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Store.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Store.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Store.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'postal_code', length: 20, nullable: true }),
    __metadata("design:type", String)
], Store.prototype, "postalCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Store.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Store.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'manager_id', nullable: true }),
    __metadata("design:type", String)
], Store.prototype, "managerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'opening_time', type: 'time', nullable: true }),
    __metadata("design:type", String)
], Store.prototype, "openingTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'closing_time', type: 'time', nullable: true }),
    __metadata("design:type", String)
], Store.prototype, "closingTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, default: 'Asia/Kolkata' }),
    __metadata("design:type", String)
], Store.prototype, "timezone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tax_id', length: 100, nullable: true }),
    __metadata("design:type", String)
], Store.prototype, "taxId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'default_price_list_id', nullable: true }),
    __metadata("design:type", String)
], Store.prototype, "defaultPriceListId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'receipt_header', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Store.prototype, "receiptHeader", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'receipt_footer', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Store.prototype, "receiptFooter", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], Store.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Store.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Store.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_entity_1.Warehouse),
    (0, typeorm_1.JoinColumn)({ name: 'warehouse_id' }),
    __metadata("design:type", warehouse_entity_1.Warehouse)
], Store.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'manager_id' }),
    __metadata("design:type", user_entity_1.User)
], Store.prototype, "manager", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => price_list_entity_1.PriceList),
    (0, typeorm_1.JoinColumn)({ name: 'default_price_list_id' }),
    __metadata("design:type", price_list_entity_1.PriceList)
], Store.prototype, "defaultPriceList", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => pos_terminal_entity_1.PosTerminal, (terminal) => terminal.store),
    __metadata("design:type", Array)
], Store.prototype, "terminals", void 0);
exports.Store = Store = __decorate([
    (0, typeorm_1.Entity)('stores')
], Store);
//# sourceMappingURL=store.entity.js.map