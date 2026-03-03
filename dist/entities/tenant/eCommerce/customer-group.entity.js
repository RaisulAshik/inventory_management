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
exports.CustomerGroup = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const customer_entity_1 = require("./customer.entity");
const price_list_entity_1 = require("../inventory/price-list.entity");
let CustomerGroup = class CustomerGroup {
    id;
    groupCode;
    groupName;
    description;
    defaultPriceListId;
    discountPercentage;
    paymentTermsDays;
    creditLimit;
    isTaxExempt;
    loyaltyMultiplier;
    isActive;
    createdAt;
    updatedAt;
    defaultPriceList;
    customers;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, groupCode: { required: true, type: () => String }, groupName: { required: true, type: () => String }, description: { required: true, type: () => String }, defaultPriceListId: { required: true, type: () => String }, discountPercentage: { required: true, type: () => Number }, paymentTermsDays: { required: true, type: () => Number }, creditLimit: { required: true, type: () => Number }, isTaxExempt: { required: true, type: () => Boolean }, loyaltyMultiplier: { required: true, type: () => Number }, isActive: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, defaultPriceList: { required: true, type: () => require("../inventory/price-list.entity").PriceList }, customers: { required: true, type: () => [require("./customer.entity").Customer] } };
    }
};
exports.CustomerGroup = CustomerGroup;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CustomerGroup.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_customer_group_code', { unique: true }),
    (0, typeorm_1.Column)({ name: 'group_code', length: 50, unique: true }),
    __metadata("design:type", String)
], CustomerGroup.prototype, "groupCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'group_name', length: 200 }),
    __metadata("design:type", String)
], CustomerGroup.prototype, "groupName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CustomerGroup.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'default_price_list_id', nullable: true }),
    __metadata("design:type", String)
], CustomerGroup.prototype, "defaultPriceListId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'discount_percentage',
        type: 'decimal',
        precision: 5,
        scale: 2,
        default: 0,
    }),
    __metadata("design:type", Number)
], CustomerGroup.prototype, "discountPercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_terms_days', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], CustomerGroup.prototype, "paymentTermsDays", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'credit_limit',
        type: 'decimal',
        precision: 18,
        scale: 2,
        nullable: true,
    }),
    __metadata("design:type", Number)
], CustomerGroup.prototype, "creditLimit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_tax_exempt', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], CustomerGroup.prototype, "isTaxExempt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'loyalty_multiplier',
        type: 'decimal',
        precision: 5,
        scale: 2,
        default: 1,
    }),
    __metadata("design:type", Number)
], CustomerGroup.prototype, "loyaltyMultiplier", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], CustomerGroup.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], CustomerGroup.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], CustomerGroup.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => price_list_entity_1.PriceList),
    (0, typeorm_1.JoinColumn)({ name: 'default_price_list_id' }),
    __metadata("design:type", price_list_entity_1.PriceList)
], CustomerGroup.prototype, "defaultPriceList", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => customer_entity_1.Customer, (customer) => customer.customerGroup),
    __metadata("design:type", Array)
], CustomerGroup.prototype, "customers", void 0);
exports.CustomerGroup = CustomerGroup = __decorate([
    (0, typeorm_1.Entity)('customer_groups')
], CustomerGroup);
//# sourceMappingURL=customer-group.entity.js.map