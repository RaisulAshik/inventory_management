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
exports.ShoppingCartItem = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const shopping_cart_entity_1 = require("./shopping-cart.entity");
const product_entity_1 = require("../inventory/product.entity");
const product_variant_entity_1 = require("../inventory/product-variant.entity");
let ShoppingCartItem = class ShoppingCartItem {
    id;
    cartId;
    productId;
    variantId;
    quantity;
    unitPrice;
    originalPrice;
    discountAmount;
    taxAmount;
    lineTotal;
    customOptions;
    notes;
    addedAt;
    createdAt;
    updatedAt;
    cart;
    product;
    variant;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, cartId: { required: true, type: () => String }, productId: { required: true, type: () => String }, variantId: { required: true, type: () => String }, quantity: { required: true, type: () => Number }, unitPrice: { required: true, type: () => Number }, originalPrice: { required: true, type: () => Number }, discountAmount: { required: true, type: () => Number }, taxAmount: { required: true, type: () => Number }, lineTotal: { required: true, type: () => Number }, customOptions: { required: true, type: () => Object }, notes: { required: true, type: () => String }, addedAt: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, cart: { required: true, type: () => require("./shopping-cart.entity").ShoppingCart }, product: { required: true, type: () => require("../inventory/product.entity").Product }, variant: { required: true, type: () => require("../inventory/product-variant.entity").ProductVariant } };
    }
};
exports.ShoppingCartItem = ShoppingCartItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ShoppingCartItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cart_id' }),
    __metadata("design:type", String)
], ShoppingCartItem.prototype, "cartId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", String)
], ShoppingCartItem.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'variant_id', nullable: true }),
    __metadata("design:type", String)
], ShoppingCartItem.prototype, "variantId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 1,
    }),
    __metadata("design:type", Number)
], ShoppingCartItem.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'unit_price',
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], ShoppingCartItem.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'original_price',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], ShoppingCartItem.prototype, "originalPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'discount_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], ShoppingCartItem.prototype, "discountAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'tax_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], ShoppingCartItem.prototype, "taxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'line_total',
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], ShoppingCartItem.prototype, "lineTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'custom_options', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], ShoppingCartItem.prototype, "customOptions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ShoppingCartItem.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'added_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], ShoppingCartItem.prototype, "addedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ShoppingCartItem.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ShoppingCartItem.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => shopping_cart_entity_1.ShoppingCart, (cart) => cart.items, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'cart_id' }),
    __metadata("design:type", shopping_cart_entity_1.ShoppingCart)
], ShoppingCartItem.prototype, "cart", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], ShoppingCartItem.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_variant_entity_1.ProductVariant),
    (0, typeorm_1.JoinColumn)({ name: 'variant_id' }),
    __metadata("design:type", product_variant_entity_1.ProductVariant)
], ShoppingCartItem.prototype, "variant", void 0);
exports.ShoppingCartItem = ShoppingCartItem = __decorate([
    (0, typeorm_1.Entity)('shopping_cart_items')
], ShoppingCartItem);
//# sourceMappingURL=shopping-cart-item.entity.js.map