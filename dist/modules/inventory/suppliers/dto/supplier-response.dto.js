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
exports.SupplierResponseDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
class SupplierContactDto {
    id;
    contactName;
    designation;
    department;
    email;
    phone;
    mobile;
    isPrimary;
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, contactName: { required: true, type: () => String }, designation: { required: false, type: () => String }, department: { required: false, type: () => String }, email: { required: false, type: () => String }, phone: { required: false, type: () => String }, mobile: { required: false, type: () => String }, isPrimary: { required: true, type: () => Boolean }, isActive: { required: true, type: () => Boolean } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SupplierContactDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SupplierContactDto.prototype, "contactName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SupplierContactDto.prototype, "designation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SupplierContactDto.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SupplierContactDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SupplierContactDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SupplierContactDto.prototype, "mobile", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SupplierContactDto.prototype, "isPrimary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SupplierContactDto.prototype, "isActive", void 0);
class SupplierResponseDto {
    id;
    supplierCode;
    companyName;
    contactPerson;
    email;
    phone;
    website;
    taxId;
    panNumber;
    addressLine1;
    addressLine2;
    city;
    state;
    country;
    postalCode;
    paymentTermsDays;
    creditLimit;
    currency;
    isActive;
    contacts;
    createdAt;
    updatedAt;
    constructor(supplier) {
        this.id = supplier.id;
        this.supplierCode = supplier.supplierCode;
        this.companyName = supplier.companyName;
        this.contactPerson = supplier.contactPerson;
        this.email = supplier.email;
        this.phone = supplier.phone;
        this.website = supplier.website;
        this.taxId = supplier.taxId;
        this.panNumber = supplier.panNumber;
        this.addressLine1 = supplier.addressLine1;
        this.addressLine2 = supplier.addressLine2;
        this.city = supplier.city;
        this.state = supplier.state;
        this.country = supplier.country;
        this.postalCode = supplier.postalCode;
        this.paymentTermsDays = supplier.paymentTermsDays;
        this.creditLimit = supplier.creditLimit
            ? Number(supplier.creditLimit)
            : undefined;
        this.currency = supplier.currency;
        this.isActive = supplier.isActive;
        this.createdAt = supplier.createdAt;
        this.updatedAt = supplier.updatedAt;
        if (supplier.contacts) {
            this.contacts = supplier.contacts.map((c) => ({
                id: c.id,
                contactName: c.contactName,
                designation: c.designation,
                department: c.department,
                email: c.email,
                phone: c.phone,
                mobile: c.mobile,
                isPrimary: c.isPrimary,
                isActive: c.isActive,
            }));
        }
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, supplierCode: { required: true, type: () => String }, companyName: { required: true, type: () => String }, contactPerson: { required: false, type: () => String }, email: { required: false, type: () => String }, phone: { required: false, type: () => String }, website: { required: false, type: () => String }, taxId: { required: false, type: () => String }, panNumber: { required: false, type: () => String }, addressLine1: { required: false, type: () => String }, addressLine2: { required: false, type: () => String }, city: { required: false, type: () => String }, state: { required: false, type: () => String }, country: { required: false, type: () => String }, postalCode: { required: false, type: () => String }, paymentTermsDays: { required: false, type: () => Number }, creditLimit: { required: false, type: () => Number }, currency: { required: true, type: () => String }, isActive: { required: true, type: () => Boolean }, contacts: { required: false, type: () => [SupplierContactDto] }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.SupplierResponseDto = SupplierResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SupplierResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SupplierResponseDto.prototype, "supplierCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SupplierResponseDto.prototype, "companyName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SupplierResponseDto.prototype, "contactPerson", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SupplierResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SupplierResponseDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SupplierResponseDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SupplierResponseDto.prototype, "taxId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SupplierResponseDto.prototype, "panNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SupplierResponseDto.prototype, "addressLine1", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SupplierResponseDto.prototype, "addressLine2", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SupplierResponseDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SupplierResponseDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SupplierResponseDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SupplierResponseDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], SupplierResponseDto.prototype, "paymentTermsDays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], SupplierResponseDto.prototype, "creditLimit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SupplierResponseDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SupplierResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [SupplierContactDto] }),
    __metadata("design:type", Array)
], SupplierResponseDto.prototype, "contacts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SupplierResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SupplierResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=supplier-response.dto.js.map