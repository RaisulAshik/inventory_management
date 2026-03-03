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
exports.ShoppingCart = exports.CartStatus = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const customer_entity_1 = require("./customer.entity");
const coupon_entity_1 = require("./coupon.entity");
const shopping_cart_item_entity_1 = require("./shopping-cart-item.entity");
var CartStatus;
(function (CartStatus) {
    CartStatus["ACTIVE"] = "ACTIVE";
    CartStatus["CONVERTED"] = "CONVERTED";
    CartStatus["ABANDONED"] = "ABANDONED";
    CartStatus["MERGED"] = "MERGED";
})(CartStatus || (exports.CartStatus = CartStatus = {}));
let ShoppingCart = class ShoppingCart {
    id;
    customerId;
    sessionId;
    status;
    subtotal;
    discountAmount;
    taxAmount;
    totalAmount;
    couponId;
    couponCode;
    couponDiscount;
    itemCount;
    currency;
    ipAddress;
    userAgent;
    lastActivityAt;
    convertedOrderId;
    notes;
    createdAt;
    updatedAt;
    customer;
    coupon;
    items;
    get isEmpty() {
        return this.itemCount === 0;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, customerId: { required: true, type: () => String }, sessionId: { required: true, type: () => String }, status: { required: true, enum: require("./shopping-cart.entity").CartStatus }, subtotal: { required: true, type: () => Number }, discountAmount: { required: true, type: () => Number }, taxAmount: { required: true, type: () => Number }, totalAmount: { required: true, type: () => Number }, couponId: { required: true, type: () => String }, couponCode: { required: true, type: () => String }, couponDiscount: { required: true, type: () => Number }, itemCount: { required: true, type: () => Number }, currency: { required: true, type: () => String }, ipAddress: { required: true, type: () => String }, userAgent: { required: true, type: () => String }, lastActivityAt: { required: true, type: () => Date }, convertedOrderId: { required: true, type: () => String }, notes: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, customer: { required: true, type: () => require("./customer.entity").Customer }, coupon: { required: true, type: () => require("./coupon.entity").Coupon }, items: { required: true, type: () => [require("./shopping-cart-item.entity").ShoppingCartItem] } };
    }
};
exports.ShoppingCart = ShoppingCart;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ShoppingCart.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_id', nullable: true }),
    __metadata("design:type", String)
], ShoppingCart.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'session_id', length: 255, nullable: true }),
    __metadata("design:type", String)
], ShoppingCart.prototype, "sessionId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CartStatus,
        default: CartStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], ShoppingCart.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], ShoppingCart.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'discount_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], ShoppingCart.prototype, "discountAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'tax_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], ShoppingCart.prototype, "taxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], ShoppingCart.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'coupon_id', nullable: true }),
    __metadata("design:type", String)
], ShoppingCart.prototype, "couponId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'coupon_code', length: 50, nullable: true }),
    __metadata("design:type", String)
], ShoppingCart.prototype, "couponCode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'coupon_discount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], ShoppingCart.prototype, "couponDiscount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'item_count', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ShoppingCart.prototype, "itemCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 3, default: 'INR' }),
    __metadata("design:type", String)
], ShoppingCart.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ip_address', length: 45, nullable: true }),
    __metadata("design:type", String)
], ShoppingCart.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_agent', type: 'text', nullable: true }),
    __metadata("design:type", String)
], ShoppingCart.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_activity_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], ShoppingCart.prototype, "lastActivityAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'converted_order_id', nullable: true }),
    __metadata("design:type", String)
], ShoppingCart.prototype, "convertedOrderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ShoppingCart.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ShoppingCart.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ShoppingCart.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer),
    (0, typeorm_1.JoinColumn)({ name: 'customer_id' }),
    __metadata("design:type", customer_entity_1.Customer)
], ShoppingCart.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => coupon_entity_1.Coupon),
    (0, typeorm_1.JoinColumn)({ name: 'coupon_id' }),
    __metadata("design:type", coupon_entity_1.Coupon)
], ShoppingCart.prototype, "coupon", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => shopping_cart_item_entity_1.ShoppingCartItem, (item) => item.cart),
    __metadata("design:type", Array)
], ShoppingCart.prototype, "items", void 0);
exports.ShoppingCart = ShoppingCart = __decorate([
    (0, typeorm_1.Entity)('shopping_carts')
], ShoppingCart);
//# sourceMappingURL=shopping-cart.entity.js.map