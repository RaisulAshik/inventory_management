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
exports.Customer = exports.Gender = exports.CustomerType = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const customer_address_entity_1 = require("./customer-address.entity");
const sales_order_entity_1 = require("./sales-order.entity");
const customer_group_entity_1 = require("./customer-group.entity");
const price_list_entity_1 = require("../inventory/price-list.entity");
var CustomerType;
(function (CustomerType) {
    CustomerType["INDIVIDUAL"] = "INDIVIDUAL";
    CustomerType["BUSINESS"] = "BUSINESS";
})(CustomerType || (exports.CustomerType = CustomerType = {}));
var Gender;
(function (Gender) {
    Gender["MALE"] = "MALE";
    Gender["FEMALE"] = "FEMALE";
    Gender["OTHER"] = "OTHER";
})(Gender || (exports.Gender = Gender = {}));
let Customer = class Customer {
    id;
    customerCode;
    customerType;
    firstName;
    lastName;
    companyName;
    email;
    phone;
    mobile;
    panNumber;
    paymentTermsDays;
    currency;
    taxId;
    dateOfBirth;
    gender;
    customerGroupId;
    priceListId;
    defaultPaymentTermsDays;
    creditLimit;
    totalPurchases;
    currentBalance;
    loyaltyPoints;
    totalOrders;
    totalSpent;
    lastOrderDate;
    notes;
    isActive;
    isVerified;
    acceptsMarketing;
    source;
    referralCode;
    referredBy;
    createdBy;
    createdAt;
    updatedAt;
    deletedAt;
    customerGroup;
    priceList;
    referrer;
    addresses;
    orders;
    get fullName() {
        return `${this.firstName} ${this.lastName || ''}`.trim();
    }
    get displayName() {
        return this.customerType === CustomerType.BUSINESS
            ? this.companyName || this.fullName
            : this.fullName;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, customerCode: { required: true, type: () => String }, customerType: { required: true, enum: require("./customer.entity").CustomerType }, firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, companyName: { required: true, type: () => String }, email: { required: true, type: () => String }, phone: { required: true, type: () => String }, mobile: { required: true, type: () => String }, panNumber: { required: true, type: () => String }, paymentTermsDays: { required: true, type: () => String }, currency: { required: true, type: () => String }, taxId: { required: true, type: () => String }, dateOfBirth: { required: true, type: () => Date }, gender: { required: true, enum: require("./customer.entity").Gender }, customerGroupId: { required: true, type: () => String }, priceListId: { required: true, type: () => String }, defaultPaymentTermsDays: { required: true, type: () => Number }, creditLimit: { required: true, type: () => Number }, totalPurchases: { required: true, type: () => Number }, currentBalance: { required: true, type: () => Number }, loyaltyPoints: { required: true, type: () => Number }, totalOrders: { required: true, type: () => Number }, totalSpent: { required: true, type: () => Number }, lastOrderDate: { required: true, type: () => Date }, notes: { required: true, type: () => String }, isActive: { required: true, type: () => Boolean }, isVerified: { required: true, type: () => Boolean }, acceptsMarketing: { required: true, type: () => Boolean }, source: { required: true, type: () => String }, referralCode: { required: true, type: () => String }, referredBy: { required: true, type: () => String }, createdBy: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, deletedAt: { required: true, type: () => Date }, customerGroup: { required: true, type: () => require("./customer-group.entity").CustomerGroup }, priceList: { required: true, type: () => require("../inventory/price-list.entity").PriceList }, referrer: { required: true, type: () => require("./customer.entity").Customer }, addresses: { required: true, type: () => [require("./customer-address.entity").CustomerAddress] }, orders: { required: true, type: () => [require("./sales-order.entity").SalesOrder] } };
    }
};
exports.Customer = Customer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Customer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_code', length: 50, unique: true }),
    __metadata("design:type", String)
], Customer.prototype, "customerCode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'customer_type',
        type: 'enum',
        enum: CustomerType,
        default: CustomerType.INDIVIDUAL,
    }),
    __metadata("design:type", String)
], Customer.prototype, "customerType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'first_name', length: 100 }),
    __metadata("design:type", String)
], Customer.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_name', length: 100, nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'company_name', length: 200, nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "companyName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "mobile", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "panNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "paymentTermsDays", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tax_id', length: 100, nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "taxId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date_of_birth', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Customer.prototype, "dateOfBirth", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: Gender,
        nullable: true,
    }),
    __metadata("design:type", String)
], Customer.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_group_id', nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "customerGroupId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'price_list_id', nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "priceListId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'default_payment_terms_days', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Customer.prototype, "defaultPaymentTermsDays", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'credit_limit',
        type: 'decimal',
        precision: 18,
        scale: 2,
        default: 0,
    }),
    __metadata("design:type", Number)
], Customer.prototype, "creditLimit", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_purchases',
        type: 'decimal',
        precision: 18,
        scale: 2,
        default: 0,
    }),
    __metadata("design:type", Number)
], Customer.prototype, "totalPurchases", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'current_balance',
        type: 'decimal',
        precision: 18,
        scale: 2,
        default: 0,
    }),
    __metadata("design:type", Number)
], Customer.prototype, "currentBalance", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'loyalty_points', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Customer.prototype, "loyaltyPoints", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_orders', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Customer.prototype, "totalOrders", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_spent',
        type: 'decimal',
        precision: 18,
        scale: 2,
        default: 0,
    }),
    __metadata("design:type", Number)
], Customer.prototype, "totalSpent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_order_date', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Customer.prototype, "lastOrderDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], Customer.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_verified', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], Customer.prototype, "isVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'accepts_marketing', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], Customer.prototype, "acceptsMarketing", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'referral_code', length: 50, nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "referralCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'referred_by', nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "referredBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Customer.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Customer.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], Customer.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_group_entity_1.CustomerGroup),
    (0, typeorm_1.JoinColumn)({ name: 'customer_group_id' }),
    __metadata("design:type", customer_group_entity_1.CustomerGroup)
], Customer.prototype, "customerGroup", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => price_list_entity_1.PriceList),
    (0, typeorm_1.JoinColumn)({ name: 'price_list_id' }),
    __metadata("design:type", price_list_entity_1.PriceList)
], Customer.prototype, "priceList", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Customer),
    (0, typeorm_1.JoinColumn)({ name: 'referred_by' }),
    __metadata("design:type", Customer)
], Customer.prototype, "referrer", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => customer_address_entity_1.CustomerAddress, (address) => address.customer),
    __metadata("design:type", Array)
], Customer.prototype, "addresses", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sales_order_entity_1.SalesOrder, (order) => order.customer),
    __metadata("design:type", Array)
], Customer.prototype, "orders", void 0);
exports.Customer = Customer = __decorate([
    (0, typeorm_1.Entity)('customers')
], Customer);
//# sourceMappingURL=customer.entity.js.map