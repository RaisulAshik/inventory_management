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
exports.PriceList = exports.PriceListType = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const price_list_item_entity_1 = require("./price-list-item.entity");
var PriceListType;
(function (PriceListType) {
    PriceListType["SALES"] = "SALES";
    PriceListType["PURCHASE"] = "PURCHASE";
})(PriceListType || (exports.PriceListType = PriceListType = {}));
let PriceList = class PriceList {
    id;
    priceListCode;
    priceListName;
    priceListType;
    description;
    currency;
    isTaxInclusive;
    effectiveFrom;
    effectiveTo;
    minOrderAmount;
    discountPercentage;
    priority;
    isDefault;
    isActive;
    createdBy;
    createdAt;
    updatedAt;
    items;
    get isEffective() {
        const now = new Date();
        const fromValid = !this.effectiveFrom || new Date(this.effectiveFrom) <= now;
        const toValid = !this.effectiveTo || new Date(this.effectiveTo) >= now;
        return fromValid && toValid && this.isActive;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, priceListCode: { required: true, type: () => String }, priceListName: { required: true, type: () => String }, priceListType: { required: true, enum: require("./price-list.entity").PriceListType }, description: { required: true, type: () => String }, currency: { required: true, type: () => String }, isTaxInclusive: { required: true, type: () => Boolean }, effectiveFrom: { required: true, type: () => Date }, effectiveTo: { required: true, type: () => Date }, minOrderAmount: { required: true, type: () => Number }, discountPercentage: { required: true, type: () => Number }, priority: { required: true, type: () => Number }, isDefault: { required: true, type: () => Boolean }, isActive: { required: true, type: () => Boolean }, createdBy: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, items: { required: true, type: () => [require("./price-list-item.entity").PriceListItem] } };
    }
};
exports.PriceList = PriceList;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PriceList.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'price_list_code', length: 50, unique: true }),
    __metadata("design:type", String)
], PriceList.prototype, "priceListCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'price_list_name', length: 200 }),
    __metadata("design:type", String)
], PriceList.prototype, "priceListName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'price_list_type',
        type: 'enum',
        enum: PriceListType,
        default: PriceListType.SALES,
    }),
    __metadata("design:type", String)
], PriceList.prototype, "priceListType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PriceList.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 3, default: 'INR' }),
    __metadata("design:type", String)
], PriceList.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_tax_inclusive', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], PriceList.prototype, "isTaxInclusive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'effective_from', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], PriceList.prototype, "effectiveFrom", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'effective_to', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], PriceList.prototype, "effectiveTo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'min_order_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], PriceList.prototype, "minOrderAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'discount_percentage',
        type: 'decimal',
        precision: 5,
        scale: 2,
        default: 0,
    }),
    __metadata("design:type", Number)
], PriceList.prototype, "discountPercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], PriceList.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_default', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], PriceList.prototype, "isDefault", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], PriceList.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", String)
], PriceList.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PriceList.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], PriceList.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => price_list_item_entity_1.PriceListItem, (item) => item.priceList),
    __metadata("design:type", Array)
], PriceList.prototype, "items", void 0);
exports.PriceList = PriceList = __decorate([
    (0, typeorm_1.Entity)('price_lists')
], PriceList);
//# sourceMappingURL=price-list.entity.js.map