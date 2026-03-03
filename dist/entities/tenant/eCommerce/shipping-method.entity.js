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
exports.ShippingMethod = exports.ShippingCalculationType = exports.ShippingCarrierType = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
var ShippingCarrierType;
(function (ShippingCarrierType) {
    ShippingCarrierType["INTERNAL"] = "INTERNAL";
    ShippingCarrierType["EXTERNAL"] = "EXTERNAL";
    ShippingCarrierType["PICKUP"] = "PICKUP";
})(ShippingCarrierType || (exports.ShippingCarrierType = ShippingCarrierType = {}));
var ShippingCalculationType;
(function (ShippingCalculationType) {
    ShippingCalculationType["FLAT_RATE"] = "FLAT_RATE";
    ShippingCalculationType["WEIGHT_BASED"] = "WEIGHT_BASED";
    ShippingCalculationType["PRICE_BASED"] = "PRICE_BASED";
    ShippingCalculationType["ITEM_BASED"] = "ITEM_BASED";
    ShippingCalculationType["REAL_TIME"] = "REAL_TIME";
    ShippingCalculationType["FREE"] = "FREE";
})(ShippingCalculationType || (exports.ShippingCalculationType = ShippingCalculationType = {}));
let ShippingMethod = class ShippingMethod {
    id;
    methodCode;
    methodName;
    description;
    carrierType;
    carrierCode;
    calculationType;
    baseRate;
    ratePerKg;
    ratePerItem;
    freeShippingThreshold;
    minOrderAmount;
    maxOrderAmount;
    maxWeightKg;
    estimatedDeliveryDaysMin;
    estimatedDeliveryDaysMax;
    trackingAvailable;
    insuranceAvailable;
    isActive;
    sortOrder;
    createdAt;
    updatedAt;
    get estimatedDeliveryText() {
        if (this.estimatedDeliveryDaysMin && this.estimatedDeliveryDaysMax) {
            if (this.estimatedDeliveryDaysMin === this.estimatedDeliveryDaysMax) {
                return `${this.estimatedDeliveryDaysMin} days`;
            }
            return `${this.estimatedDeliveryDaysMin}-${this.estimatedDeliveryDaysMax} days`;
        }
        return 'Varies';
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, methodCode: { required: true, type: () => String }, methodName: { required: true, type: () => String }, description: { required: true, type: () => String }, carrierType: { required: true, enum: require("./shipping-method.entity").ShippingCarrierType }, carrierCode: { required: true, type: () => String }, calculationType: { required: true, enum: require("./shipping-method.entity").ShippingCalculationType }, baseRate: { required: true, type: () => Number }, ratePerKg: { required: true, type: () => Number }, ratePerItem: { required: true, type: () => Number }, freeShippingThreshold: { required: true, type: () => Number }, minOrderAmount: { required: true, type: () => Number }, maxOrderAmount: { required: true, type: () => Number }, maxWeightKg: { required: true, type: () => Number }, estimatedDeliveryDaysMin: { required: true, type: () => Number }, estimatedDeliveryDaysMax: { required: true, type: () => Number }, trackingAvailable: { required: true, type: () => Boolean }, insuranceAvailable: { required: true, type: () => Boolean }, isActive: { required: true, type: () => Boolean }, sortOrder: { required: true, type: () => Number }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.ShippingMethod = ShippingMethod;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ShippingMethod.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'method_code', length: 50, unique: true }),
    __metadata("design:type", String)
], ShippingMethod.prototype, "methodCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'method_name', length: 200 }),
    __metadata("design:type", String)
], ShippingMethod.prototype, "methodName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ShippingMethod.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'carrier_type',
        type: 'enum',
        enum: ShippingCarrierType,
        default: ShippingCarrierType.INTERNAL,
    }),
    __metadata("design:type", String)
], ShippingMethod.prototype, "carrierType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'carrier_code', length: 50, nullable: true }),
    __metadata("design:type", String)
], ShippingMethod.prototype, "carrierCode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'calculation_type',
        type: 'enum',
        enum: ShippingCalculationType,
        default: ShippingCalculationType.FLAT_RATE,
    }),
    __metadata("design:type", String)
], ShippingMethod.prototype, "calculationType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'base_rate',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], ShippingMethod.prototype, "baseRate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'rate_per_kg',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], ShippingMethod.prototype, "ratePerKg", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'rate_per_item',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], ShippingMethod.prototype, "ratePerItem", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'free_shipping_threshold',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], ShippingMethod.prototype, "freeShippingThreshold", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'min_order_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], ShippingMethod.prototype, "minOrderAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'max_order_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], ShippingMethod.prototype, "maxOrderAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'max_weight_kg',
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: true,
    }),
    __metadata("design:type", Number)
], ShippingMethod.prototype, "maxWeightKg", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'estimated_delivery_days_min', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], ShippingMethod.prototype, "estimatedDeliveryDaysMin", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'estimated_delivery_days_max', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], ShippingMethod.prototype, "estimatedDeliveryDaysMax", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tracking_available', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], ShippingMethod.prototype, "trackingAvailable", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'insurance_available', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], ShippingMethod.prototype, "insuranceAvailable", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], ShippingMethod.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sort_order', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ShippingMethod.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ShippingMethod.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ShippingMethod.prototype, "updatedAt", void 0);
exports.ShippingMethod = ShippingMethod = __decorate([
    (0, typeorm_1.Entity)('shipping_methods')
], ShippingMethod);
//# sourceMappingURL=shipping-method.entity.js.map