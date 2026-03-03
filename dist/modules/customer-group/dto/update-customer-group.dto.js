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
exports.UpdateCustomerGroupDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateCustomerGroupDto {
    groupCode;
    groupName;
    description;
    discountPercentage;
    creditLimit;
    paymentTermsDays;
    defaultPriceListId;
    isDefault;
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { groupCode: { required: false, type: () => String, maxLength: 50 }, groupName: { required: false, type: () => String, maxLength: 100 }, description: { required: false, type: () => String, maxLength: 500 }, discountPercentage: { required: false, type: () => Number, minimum: 0, maximum: 100 }, creditLimit: { required: false, type: () => Number, minimum: 0 }, paymentTermsDays: { required: false, type: () => Number, minimum: 0 }, defaultPriceListId: { required: false, type: () => String, format: "uuid" }, isDefault: { required: false, type: () => Boolean }, isActive: { required: false, type: () => Boolean } };
    }
}
exports.UpdateCustomerGroupDto = UpdateCustomerGroupDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Unique group code',
        example: 'RETAIL',
        maxLength: 50,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateCustomerGroupDto.prototype, "groupCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Group name',
        example: 'Retail Customers',
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateCustomerGroupDto.prototype, "groupName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Group description',
        example: 'Standard retail customers with normal pricing',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateCustomerGroupDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Default discount percentage for this group',
        example: 5,
        minimum: 0,
        maximum: 100,
    }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdateCustomerGroupDto.prototype, "discountPercentage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Credit limit for customers in this group',
        example: 50000,
        minimum: 0,
    }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateCustomerGroupDto.prototype, "creditLimit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Default payment term days for this group',
        example: 30,
        minimum: 0,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateCustomerGroupDto.prototype, "paymentTermsDays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Price list ID to associate with this group',
        example: 'uuid',
    }),
    (0, class_validator_1.IsUUID)('4'),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCustomerGroupDto.prototype, "defaultPriceListId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Is this the default group for new customers',
        example: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateCustomerGroupDto.prototype, "isDefault", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Is the group active',
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateCustomerGroupDto.prototype, "isActive", void 0);
//# sourceMappingURL=update-customer-group.dto.js.map