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
exports.PaymentMethod = exports.PaymentMethodType = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
var PaymentMethodType;
(function (PaymentMethodType) {
    PaymentMethodType["CASH"] = "CASH";
    PaymentMethodType["CARD"] = "CARD";
    PaymentMethodType["UPI"] = "UPI";
    PaymentMethodType["NET_BANKING"] = "NET_BANKING";
    PaymentMethodType["WALLET"] = "WALLET";
    PaymentMethodType["BANK_TRANSFER"] = "BANK_TRANSFER";
    PaymentMethodType["CHEQUE"] = "CHEQUE";
    PaymentMethodType["COD"] = "COD";
    PaymentMethodType["CREDIT"] = "CREDIT";
    PaymentMethodType["EMI"] = "EMI";
    PaymentMethodType["GIFT_CARD"] = "GIFT_CARD";
    PaymentMethodType["STORE_CREDIT"] = "STORE_CREDIT";
    PaymentMethodType["OTHER"] = "OTHER";
})(PaymentMethodType || (exports.PaymentMethodType = PaymentMethodType = {}));
let PaymentMethod = class PaymentMethod {
    id;
    methodCode;
    methodName;
    description;
    methodType;
    gatewayCode;
    gatewayConfig;
    processingFeeType;
    processingFeeValue;
    minAmount;
    maxAmount;
    isAvailablePos;
    isAvailableEcommerce;
    requiresReference;
    isActive;
    sortOrder;
    iconUrl;
    createdAt;
    updatedAt;
    calculateProcessingFee(amount) {
        switch (this.processingFeeType) {
            case 'PERCENTAGE':
                return amount * (this.processingFeeValue / 100);
            case 'FIXED':
                return this.processingFeeValue;
            default:
                return 0;
        }
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, methodCode: { required: true, type: () => String }, methodName: { required: true, type: () => String }, description: { required: true, type: () => String }, methodType: { required: true, enum: require("./payment-method.entity").PaymentMethodType }, gatewayCode: { required: true, type: () => String }, gatewayConfig: { required: true, type: () => Object }, processingFeeType: { required: true, type: () => Object }, processingFeeValue: { required: true, type: () => Number }, minAmount: { required: true, type: () => Number }, maxAmount: { required: true, type: () => Number }, isAvailablePos: { required: true, type: () => Boolean }, isAvailableEcommerce: { required: true, type: () => Boolean }, requiresReference: { required: true, type: () => Boolean }, isActive: { required: true, type: () => Boolean }, sortOrder: { required: true, type: () => Number }, iconUrl: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.PaymentMethod = PaymentMethod;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PaymentMethod.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'method_code', length: 50, unique: true }),
    __metadata("design:type", String)
], PaymentMethod.prototype, "methodCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'method_name', length: 200 }),
    __metadata("design:type", String)
], PaymentMethod.prototype, "methodName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PaymentMethod.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'method_type',
        type: 'enum',
        enum: PaymentMethodType,
    }),
    __metadata("design:type", String)
], PaymentMethod.prototype, "methodType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gateway_code', length: 50, nullable: true }),
    __metadata("design:type", String)
], PaymentMethod.prototype, "gatewayCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gateway_config', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], PaymentMethod.prototype, "gatewayConfig", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'processing_fee_type',
        type: 'enum',
        enum: ['PERCENTAGE', 'FIXED', 'NONE'],
        default: 'NONE',
    }),
    __metadata("design:type", String)
], PaymentMethod.prototype, "processingFeeType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'processing_fee_value',
        type: 'decimal',
        precision: 10,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], PaymentMethod.prototype, "processingFeeValue", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'min_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], PaymentMethod.prototype, "minAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'max_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], PaymentMethod.prototype, "maxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_available_pos', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], PaymentMethod.prototype, "isAvailablePos", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_available_ecommerce', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], PaymentMethod.prototype, "isAvailableEcommerce", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'requires_reference', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], PaymentMethod.prototype, "requiresReference", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], PaymentMethod.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sort_order', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], PaymentMethod.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'icon_url', length: 500, nullable: true }),
    __metadata("design:type", String)
], PaymentMethod.prototype, "iconUrl", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PaymentMethod.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], PaymentMethod.prototype, "updatedAt", void 0);
exports.PaymentMethod = PaymentMethod = __decorate([
    (0, typeorm_1.Entity)('payment_methods')
], PaymentMethod);
//# sourceMappingURL=payment-method.entity.js.map