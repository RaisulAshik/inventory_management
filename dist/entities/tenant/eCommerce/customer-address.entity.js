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
exports.CustomerAddress = exports.AddressType = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const customer_entity_1 = require("./customer.entity");
var AddressType;
(function (AddressType) {
    AddressType["BILLING"] = "BILLING";
    AddressType["SHIPPING"] = "SHIPPING";
    AddressType["BOTH"] = "BOTH";
})(AddressType || (exports.AddressType = AddressType = {}));
let CustomerAddress = class CustomerAddress {
    id;
    addressLabel;
    customerId;
    addressType;
    isDefault;
    contactName;
    contactPhone;
    addressLine1;
    addressLine2;
    landmark;
    city;
    state;
    country;
    postalCode;
    latitude;
    longitude;
    createdAt;
    updatedAt;
    customer;
    get formattedAddress() {
        const parts = [
            this.addressLine1,
            this.addressLine2,
            this.landmark,
            this.city,
            this.state,
            this.postalCode,
            this.country,
        ].filter(Boolean);
        return parts.join(', ');
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, addressLabel: { required: true, type: () => String }, customerId: { required: true, type: () => String }, addressType: { required: true, enum: require("./customer-address.entity").AddressType }, isDefault: { required: true, type: () => Boolean }, contactName: { required: true, type: () => String }, contactPhone: { required: true, type: () => String }, addressLine1: { required: true, type: () => String }, addressLine2: { required: true, type: () => String }, landmark: { required: true, type: () => String }, city: { required: true, type: () => String }, state: { required: true, type: () => String }, country: { required: true, type: () => String }, postalCode: { required: true, type: () => String }, latitude: { required: true, type: () => Number }, longitude: { required: true, type: () => Number }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, customer: { required: true, type: () => require("./customer.entity").Customer } };
    }
};
exports.CustomerAddress = CustomerAddress;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CustomerAddress.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'address_label', length: 100, nullable: true }),
    __metadata("design:type", String)
], CustomerAddress.prototype, "addressLabel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_id' }),
    __metadata("design:type", String)
], CustomerAddress.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'address_type',
        type: 'enum',
        enum: AddressType,
        default: AddressType.BOTH,
    }),
    __metadata("design:type", String)
], CustomerAddress.prototype, "addressType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_default', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], CustomerAddress.prototype, "isDefault", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contact_name', length: 200, nullable: true }),
    __metadata("design:type", String)
], CustomerAddress.prototype, "contactName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contact_phone', length: 50, nullable: true }),
    __metadata("design:type", String)
], CustomerAddress.prototype, "contactPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'address_line1', length: 255 }),
    __metadata("design:type", String)
], CustomerAddress.prototype, "addressLine1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'address_line2', length: 255, nullable: true }),
    __metadata("design:type", String)
], CustomerAddress.prototype, "addressLine2", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200, nullable: true }),
    __metadata("design:type", String)
], CustomerAddress.prototype, "landmark", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], CustomerAddress.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], CustomerAddress.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, default: 'Bangladesh' }),
    __metadata("design:type", String)
], CustomerAddress.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'postal_code', length: 20 }),
    __metadata("design:type", String)
], CustomerAddress.prototype, "postalCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 8, nullable: true }),
    __metadata("design:type", Number)
], CustomerAddress.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 11, scale: 8, nullable: true }),
    __metadata("design:type", Number)
], CustomerAddress.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], CustomerAddress.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], CustomerAddress.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer, (customer) => customer.addresses, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'customer_id' }),
    __metadata("design:type", customer_entity_1.Customer)
], CustomerAddress.prototype, "customer", void 0);
exports.CustomerAddress = CustomerAddress = __decorate([
    (0, typeorm_1.Entity)('customer_addresses')
], CustomerAddress);
//# sourceMappingURL=customer-address.entity.js.map