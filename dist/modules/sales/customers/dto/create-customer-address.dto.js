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
exports.CreateCustomerAddressDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const enums_1 = require("../../../../common/enums");
class CreateCustomerAddressDto {
    addressLabel;
    addressType;
    contactName;
    contactPhone;
    addressLine1;
    addressLine2;
    landmark;
    city;
    state;
    country;
    postalCode;
    isDefault;
    static _OPENAPI_METADATA_FACTORY() {
        return { addressLabel: { required: false, type: () => String, maxLength: 100 }, addressType: { required: true, enum: require("../../../../common/enums/index").AddressType }, contactName: { required: true, type: () => String, maxLength: 200 }, contactPhone: { required: false, type: () => String, maxLength: 50 }, addressLine1: { required: true, type: () => String, maxLength: 255 }, addressLine2: { required: false, type: () => String, maxLength: 255 }, landmark: { required: false, type: () => String, maxLength: 200 }, city: { required: true, type: () => String, maxLength: 100 }, state: { required: true, type: () => String, maxLength: 100 }, country: { required: false, type: () => String, maxLength: 100 }, postalCode: { required: true, type: () => String, maxLength: 20 }, isDefault: { required: false, type: () => Boolean } };
    }
}
exports.CreateCustomerAddressDto = CreateCustomerAddressDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Home Address' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateCustomerAddressDto.prototype, "addressLabel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.AddressType, default: enums_1.AddressType.BOTH }),
    (0, class_validator_1.IsEnum)(enums_1.AddressType),
    __metadata("design:type", String)
], CreateCustomerAddressDto.prototype, "addressType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Doe' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateCustomerAddressDto.prototype, "contactName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+880-19876543210' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateCustomerAddressDto.prototype, "contactPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123 Main Street' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateCustomerAddressDto.prototype, "addressLine1", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Apt 4B' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateCustomerAddressDto.prototype, "addressLine2", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Downtown' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateCustomerAddressDto.prototype, "landmark", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Mumbai' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateCustomerAddressDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Maharashtra' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateCustomerAddressDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Bangladesh', default: 'Bangladesh' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateCustomerAddressDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '400001' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreateCustomerAddressDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCustomerAddressDto.prototype, "isDefault", void 0);
//# sourceMappingURL=create-customer-address.dto.js.map