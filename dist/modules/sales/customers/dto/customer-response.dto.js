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
exports.CustomerResponseDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../../../common/enums");
class CustomerAddressDto {
    id;
    addressLabel;
    addressType;
    contactName;
    contactPhone;
    addressLine1;
    addressLine2;
    city;
    state;
    country;
    postalCode;
    isDefault;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, addressLabel: { required: false, type: () => String }, addressType: { required: true, type: () => String }, contactName: { required: true, type: () => String }, contactPhone: { required: false, type: () => String }, addressLine1: { required: true, type: () => String }, addressLine2: { required: false, type: () => String }, city: { required: true, type: () => String }, state: { required: true, type: () => String }, country: { required: true, type: () => String }, postalCode: { required: true, type: () => String }, isDefault: { required: true, type: () => Boolean } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CustomerAddressDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CustomerAddressDto.prototype, "addressLabel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CustomerAddressDto.prototype, "addressType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CustomerAddressDto.prototype, "contactName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CustomerAddressDto.prototype, "contactPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CustomerAddressDto.prototype, "addressLine1", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CustomerAddressDto.prototype, "addressLine2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CustomerAddressDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CustomerAddressDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CustomerAddressDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CustomerAddressDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], CustomerAddressDto.prototype, "isDefault", void 0);
class CustomerGroupDto {
    id;
    groupCode;
    groupName;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, groupCode: { required: true, type: () => String }, groupName: { required: true, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CustomerGroupDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CustomerGroupDto.prototype, "groupCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CustomerGroupDto.prototype, "groupName", void 0);
class CustomerResponseDto {
    id;
    customerCode;
    customerType;
    firstName;
    lastName;
    displayName;
    companyName;
    email;
    phone;
    mobile;
    taxId;
    panNumber;
    paymentTermsDays;
    creditLimit;
    currency;
    totalPurchases;
    totalOrders;
    lastOrderDate;
    isActive;
    customerGroup;
    addresses;
    createdAt;
    updatedAt;
    constructor(customer) {
        this.id = customer.id;
        this.customerCode = customer.customerCode;
        this.customerType = customer.customerType;
        this.firstName = customer.firstName;
        this.lastName = customer.lastName;
        this.displayName = customer.displayName;
        this.companyName = customer.companyName;
        this.email = customer.email;
        this.phone = customer.phone;
        this.mobile = customer.mobile;
        this.taxId = customer.taxId;
        this.panNumber = customer.panNumber;
        this.paymentTermsDays = customer.paymentTermsDays;
        this.creditLimit = customer.creditLimit
            ? Number(customer.creditLimit)
            : undefined;
        this.currency = customer.currency;
        this.totalPurchases = Number(customer.totalPurchases) || 0;
        this.totalOrders = customer.totalOrders || 0;
        this.lastOrderDate = customer.lastOrderDate;
        this.isActive = customer.isActive;
        this.createdAt = customer.createdAt;
        this.updatedAt = customer.updatedAt;
        if (customer.customerGroup) {
            this.customerGroup = {
                id: customer.customerGroup.id,
                groupCode: customer.customerGroup.groupCode,
                groupName: customer.customerGroup.groupName,
            };
        }
        if (customer.addresses) {
            this.addresses = customer.addresses.map((addr) => ({
                id: addr.id,
                addressLabel: addr.addressLabel,
                addressType: addr.addressType,
                contactName: addr.contactName,
                contactPhone: addr.contactPhone,
                addressLine1: addr.addressLine1,
                addressLine2: addr.addressLine2,
                city: addr.city,
                state: addr.state,
                country: addr.country,
                postalCode: addr.postalCode,
                isDefault: addr.isDefault,
            }));
        }
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, customerCode: { required: true, type: () => String }, customerType: { required: true, enum: require("../../../../common/enums/index").CustomerType }, firstName: { required: true, type: () => String }, lastName: { required: false, type: () => String }, displayName: { required: true, type: () => String }, companyName: { required: false, type: () => String }, email: { required: false, type: () => String }, phone: { required: false, type: () => String }, mobile: { required: false, type: () => String }, taxId: { required: false, type: () => String }, panNumber: { required: false, type: () => String }, paymentTermsDays: { required: false, type: () => String }, creditLimit: { required: false, type: () => Number }, currency: { required: true, type: () => String }, totalPurchases: { required: true, type: () => Number }, totalOrders: { required: true, type: () => Number }, lastOrderDate: { required: false, type: () => Date }, isActive: { required: true, type: () => Boolean }, customerGroup: { required: false, type: () => CustomerGroupDto }, addresses: { required: false, type: () => [CustomerAddressDto] }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.CustomerResponseDto = CustomerResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "customerCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.CustomerType }),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "customerType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "displayName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "companyName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "mobile", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "taxId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "panNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "paymentTermsDays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], CustomerResponseDto.prototype, "creditLimit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CustomerResponseDto.prototype, "totalPurchases", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CustomerResponseDto.prototype, "totalOrders", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], CustomerResponseDto.prototype, "lastOrderDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], CustomerResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: CustomerGroupDto }),
    __metadata("design:type", CustomerGroupDto)
], CustomerResponseDto.prototype, "customerGroup", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [CustomerAddressDto] }),
    __metadata("design:type", Array)
], CustomerResponseDto.prototype, "addresses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], CustomerResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], CustomerResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=customer-response.dto.js.map