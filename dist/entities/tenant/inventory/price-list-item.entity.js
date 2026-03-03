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
exports.PriceListItem = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const price_list_entity_1 = require("./price-list.entity");
const product_entity_1 = require("./product.entity");
const product_variant_entity_1 = require("./product-variant.entity");
const unit_of_measure_entity_1 = require("./unit-of-measure.entity");
let PriceListItem = class PriceListItem {
    id;
    priceListId;
    productId;
    variantId;
    uomId;
    price;
    minQuantity;
    maxQuantity;
    discountPercentage;
    discountAmount;
    effectiveFrom;
    effectiveTo;
    createdAt;
    updatedAt;
    priceList;
    product;
    variant;
    uom;
    get netPrice() {
        let netPrice = this.price;
        if (this.discountPercentage > 0) {
            netPrice = netPrice * (1 - this.discountPercentage / 100);
        }
        if (this.discountAmount > 0) {
            netPrice = netPrice - this.discountAmount;
        }
        return Math.max(0, netPrice);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, priceListId: { required: true, type: () => String }, productId: { required: true, type: () => String }, variantId: { required: true, type: () => String }, uomId: { required: true, type: () => String }, price: { required: true, type: () => Number }, minQuantity: { required: true, type: () => Number }, maxQuantity: { required: true, type: () => Number }, discountPercentage: { required: true, type: () => Number }, discountAmount: { required: true, type: () => Number }, effectiveFrom: { required: true, type: () => Date }, effectiveTo: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, priceList: { required: true, type: () => require("./price-list.entity").PriceList }, product: { required: true, type: () => require("./product.entity").Product }, variant: { required: true, type: () => require("./product-variant.entity").ProductVariant }, uom: { required: true, type: () => require("./unit-of-measure.entity").UnitOfMeasure } };
    }
};
exports.PriceListItem = PriceListItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PriceListItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'price_list_id' }),
    __metadata("design:type", String)
], PriceListItem.prototype, "priceListId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", String)
], PriceListItem.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'variant_id', nullable: true }),
    __metadata("design:type", String)
], PriceListItem.prototype, "variantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'uom_id', nullable: true }),
    __metadata("design:type", String)
], PriceListItem.prototype, "uomId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], PriceListItem.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'min_quantity',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 1,
    }),
    __metadata("design:type", Number)
], PriceListItem.prototype, "minQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'max_quantity',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], PriceListItem.prototype, "maxQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'discount_percentage',
        type: 'decimal',
        precision: 5,
        scale: 2,
        default: 0,
    }),
    __metadata("design:type", Number)
], PriceListItem.prototype, "discountPercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'discount_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], PriceListItem.prototype, "discountAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'effective_from', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], PriceListItem.prototype, "effectiveFrom", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'effective_to', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], PriceListItem.prototype, "effectiveTo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PriceListItem.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], PriceListItem.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => price_list_entity_1.PriceList, (priceList) => priceList.items, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'price_list_id' }),
    __metadata("design:type", price_list_entity_1.PriceList)
], PriceListItem.prototype, "priceList", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], PriceListItem.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_variant_entity_1.ProductVariant),
    (0, typeorm_1.JoinColumn)({ name: 'variant_id' }),
    __metadata("design:type", product_variant_entity_1.ProductVariant)
], PriceListItem.prototype, "variant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => unit_of_measure_entity_1.UnitOfMeasure),
    (0, typeorm_1.JoinColumn)({ name: 'uom_id' }),
    __metadata("design:type", unit_of_measure_entity_1.UnitOfMeasure)
], PriceListItem.prototype, "uom", void 0);
exports.PriceListItem = PriceListItem = __decorate([
    (0, typeorm_1.Entity)('price_list_items')
], PriceListItem);
//# sourceMappingURL=price-list-item.entity.js.map