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
exports.AdminRegisterDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AdminRegisterDto {
    tenantCode;
    companyName;
    email;
    password;
    firstName;
    lastName;
    phone;
    industry;
    country;
    timezone;
    currency;
    static _OPENAPI_METADATA_FACTORY() {
        return { tenantCode: { required: true, type: () => String, minLength: 2, maxLength: 20, pattern: "/^[A-Za-z0-9_-]+$/" }, companyName: { required: true, type: () => String, maxLength: 300 }, email: { required: true, type: () => String, format: "email" }, password: { required: true, type: () => String, minLength: 8, pattern: "/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9!@#$%^&*])/" }, firstName: { required: true, type: () => String, maxLength: 100 }, lastName: { required: false, type: () => String, maxLength: 100 }, phone: { required: false, type: () => String, maxLength: 50 }, industry: { required: false, type: () => String, maxLength: 100 }, country: { required: false, type: () => String, maxLength: 100 }, timezone: { required: false, type: () => String }, currency: { required: false, type: () => String, maxLength: 3 } };
    }
}
exports.AdminRegisterDto = AdminRegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique tenant code (will be uppercased)',
        example: 'ACME',
        minLength: 2,
        maxLength: 20,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Tenant code is required' }),
    (0, class_validator_1.MinLength)(2, { message: 'Tenant code must be at least 2 characters' }),
    (0, class_validator_1.MaxLength)(20, { message: 'Tenant code must not exceed 20 characters' }),
    (0, class_validator_1.Matches)(/^[A-Za-z0-9_-]+$/, {
        message: 'Tenant code can only contain letters, numbers, hyphens and underscores',
    }),
    __metadata("design:type", String)
], AdminRegisterDto.prototype, "tenantCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Company name',
        example: 'Acme Corporation',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Company name is required' }),
    (0, class_validator_1.MaxLength)(300, { message: 'Company name must not exceed 300 characters' }),
    __metadata("design:type", String)
], AdminRegisterDto.prototype, "companyName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Admin email address',
        example: 'admin@acme.com',
    }),
    (0, class_validator_1.IsEmail)({}, { message: 'Please provide a valid email address' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email is required' }),
    __metadata("design:type", String)
], AdminRegisterDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Password (min 8 chars, must include uppercase, lowercase, and number/special char)',
        example: 'Password123!',
        minLength: 8,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Password is required' }),
    (0, class_validator_1.MinLength)(8, { message: 'Password must be at least 8 characters' }),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9!@#$%^&*])/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number or special character',
    }),
    __metadata("design:type", String)
], AdminRegisterDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'First name',
        example: 'John',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'First name is required' }),
    (0, class_validator_1.MaxLength)(100, { message: 'First name must not exceed 100 characters' }),
    __metadata("design:type", String)
], AdminRegisterDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Last name',
        example: 'Doe',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(100, { message: 'Last name must not exceed 100 characters' }),
    __metadata("design:type", String)
], AdminRegisterDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Phone number',
        example: '+880-19876543',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(50, { message: 'Phone must not exceed 50 characters' }),
    __metadata("design:type", String)
], AdminRegisterDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Industry type',
        example: 'Manufacturing',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], AdminRegisterDto.prototype, "industry", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Country',
        example: 'BD',
        default: 'BD',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], AdminRegisterDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Timezone',
        example: 'Asia/Kolkata',
        default: 'Asia/Kolkata',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AdminRegisterDto.prototype, "timezone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Currency code',
        example: 'INR',
        default: 'INR',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(3),
    __metadata("design:type", String)
], AdminRegisterDto.prototype, "currency", void 0);
//# sourceMappingURL=admin-register.dto.js.map