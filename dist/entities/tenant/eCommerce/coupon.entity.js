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
exports.Coupon = exports.CouponStatus = exports.CouponType = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
var CouponType;
(function (CouponType) {
    CouponType["PERCENTAGE"] = "PERCENTAGE";
    CouponType["FIXED_AMOUNT"] = "FIXED_AMOUNT";
    CouponType["FREE_SHIPPING"] = "FREE_SHIPPING";
    CouponType["BUY_X_GET_Y"] = "BUY_X_GET_Y";
})(CouponType || (exports.CouponType = CouponType = {}));
var CouponStatus;
(function (CouponStatus) {
    CouponStatus["ACTIVE"] = "ACTIVE";
    CouponStatus["INACTIVE"] = "INACTIVE";
    CouponStatus["EXPIRED"] = "EXPIRED";
    CouponStatus["EXHAUSTED"] = "EXHAUSTED";
})(CouponStatus || (exports.CouponStatus = CouponStatus = {}));
let Coupon = class Coupon {
    id;
    couponCode;
    couponName;
    description;
    couponType;
    discountValue;
    maxDiscountAmount;
    minOrderAmount;
    minQuantity;
    startDate;
    endDate;
    usageLimit;
    usageLimitPerCustomer;
    timesUsed;
    status;
    appliesToAllProducts;
    appliesToAllCustomers;
    isFirstOrderOnly;
    isCombinable;
    createdBy;
    createdAt;
    updatedAt;
    get isValid() {
        const now = new Date();
        return (this.status === CouponStatus.ACTIVE &&
            this.startDate <= now &&
            (!this.endDate || this.endDate >= now) &&
            (!this.usageLimit || this.timesUsed < this.usageLimit));
    }
    get remainingUses() {
        if (!this.usageLimit)
            return null;
        return Math.max(0, this.usageLimit - this.timesUsed);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, couponCode: { required: true, type: () => String }, couponName: { required: true, type: () => String }, description: { required: true, type: () => String }, couponType: { required: true, enum: require("./coupon.entity").CouponType }, discountValue: { required: true, type: () => Number }, maxDiscountAmount: { required: true, type: () => Number }, minOrderAmount: { required: true, type: () => Number }, minQuantity: { required: true, type: () => Number }, startDate: { required: true, type: () => Date }, endDate: { required: true, type: () => Date }, usageLimit: { required: true, type: () => Number }, usageLimitPerCustomer: { required: true, type: () => Number }, timesUsed: { required: true, type: () => Number }, status: { required: true, enum: require("./coupon.entity").CouponStatus }, appliesToAllProducts: { required: true, type: () => Boolean }, appliesToAllCustomers: { required: true, type: () => Boolean }, isFirstOrderOnly: { required: true, type: () => Boolean }, isCombinable: { required: true, type: () => Boolean }, createdBy: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.Coupon = Coupon;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Coupon.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'coupon_code', length: 50, unique: true }),
    __metadata("design:type", String)
], Coupon.prototype, "couponCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'coupon_name', length: 200 }),
    __metadata("design:type", String)
], Coupon.prototype, "couponName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Coupon.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'coupon_type',
        type: 'enum',
        enum: CouponType,
        default: CouponType.PERCENTAGE,
    }),
    __metadata("design:type", String)
], Coupon.prototype, "couponType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'discount_value',
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], Coupon.prototype, "discountValue", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'max_discount_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], Coupon.prototype, "maxDiscountAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'min_order_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], Coupon.prototype, "minOrderAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'min_quantity', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Coupon.prototype, "minQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'start_date', type: 'timestamp' }),
    __metadata("design:type", Date)
], Coupon.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'end_date', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Coupon.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'usage_limit', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Coupon.prototype, "usageLimit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'usage_limit_per_customer', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Coupon.prototype, "usageLimitPerCustomer", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'times_used', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Coupon.prototype, "timesUsed", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CouponStatus,
        default: CouponStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], Coupon.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'applies_to_all_products', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], Coupon.prototype, "appliesToAllProducts", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'applies_to_all_customers', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], Coupon.prototype, "appliesToAllCustomers", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_first_order_only', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], Coupon.prototype, "isFirstOrderOnly", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_combinable', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], Coupon.prototype, "isCombinable", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", String)
], Coupon.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Coupon.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Coupon.prototype, "updatedAt", void 0);
exports.Coupon = Coupon = __decorate([
    (0, typeorm_1.Entity)('coupons')
], Coupon);
//# sourceMappingURL=coupon.entity.js.map