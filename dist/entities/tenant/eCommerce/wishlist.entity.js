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
exports.Wishlist = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const customer_entity_1 = require("./customer.entity");
const product_entity_1 = require("../inventory/product.entity");
const product_variant_entity_1 = require("../inventory/product-variant.entity");
let Wishlist = class Wishlist {
    id;
    customerId;
    productId;
    variantId;
    notes;
    priority;
    notifyOnSale;
    notifyOnStock;
    createdAt;
    customer;
    product;
    variant;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, customerId: { required: true, type: () => String }, productId: { required: true, type: () => String }, variantId: { required: true, type: () => String }, notes: { required: true, type: () => String }, priority: { required: true, type: () => Number }, notifyOnSale: { required: true, type: () => Boolean }, notifyOnStock: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, customer: { required: true, type: () => require("./customer.entity").Customer }, product: { required: true, type: () => require("../inventory/product.entity").Product }, variant: { required: true, type: () => require("../inventory/product-variant.entity").ProductVariant } };
    }
};
exports.Wishlist = Wishlist;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Wishlist.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_id' }),
    __metadata("design:type", String)
], Wishlist.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", String)
], Wishlist.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'variant_id', nullable: true }),
    __metadata("design:type", String)
], Wishlist.prototype, "variantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Wishlist.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Wishlist.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notify_on_sale', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], Wishlist.prototype, "notifyOnSale", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notify_on_stock', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], Wishlist.prototype, "notifyOnStock", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Wishlist.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'customer_id' }),
    __metadata("design:type", customer_entity_1.Customer)
], Wishlist.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], Wishlist.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_variant_entity_1.ProductVariant),
    (0, typeorm_1.JoinColumn)({ name: 'variant_id' }),
    __metadata("design:type", product_variant_entity_1.ProductVariant)
], Wishlist.prototype, "variant", void 0);
exports.Wishlist = Wishlist = __decorate([
    (0, typeorm_1.Entity)('wishlists')
], Wishlist);
//# sourceMappingURL=wishlist.entity.js.map