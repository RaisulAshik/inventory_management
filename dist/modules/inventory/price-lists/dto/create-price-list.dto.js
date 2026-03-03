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
exports.CreatePriceListDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const tenant_1 = require("../../../../entities/tenant");
const create_price_list_item_dto_1 = require("./create-price-list-item.dto");
class CreatePriceListDto {
    priceListCode;
    priceListName;
    priceListType;
    description;
    currency;
    isTaxInclusive;
    effectiveFrom;
    effectiveTo;
    minOrderAmount;
    discountPercentage;
    priority;
    isDefault;
    isActive;
    items;
    static _OPENAPI_METADATA_FACTORY() {
        return { priceListCode: { required: true, type: () => String, maxLength: 50 }, priceListName: { required: true, type: () => String, maxLength: 200 }, priceListType: { required: true, enum: require("../../../../entities/tenant/inventory/price-list.entity").PriceListType }, description: { required: false, type: () => String }, currency: { required: false, type: () => String, maxLength: 3 }, isTaxInclusive: { required: false, type: () => Boolean }, effectiveFrom: { required: false, type: () => Date }, effectiveTo: { required: false, type: () => Date }, minOrderAmount: { required: false, type: () => Number, minimum: 0 }, discountPercentage: { required: false, type: () => Number, minimum: 0 }, priority: { required: false, type: () => Number, minimum: 0 }, isDefault: { required: false, type: () => Boolean }, isActive: { required: false, type: () => Boolean }, items: { required: false, type: () => [require("./create-price-list-item.dto").CreatePriceListItemDto] } };
    }
}
exports.CreatePriceListDto = CreatePriceListDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PL-RETAIL-001' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreatePriceListDto.prototype, "priceListCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Retail Price List' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreatePriceListDto.prototype, "priceListName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: tenant_1.PriceListType, default: tenant_1.PriceListType.SALES }),
    (0, class_validator_1.IsEnum)(tenant_1.PriceListType),
    __metadata("design:type", String)
], CreatePriceListDto.prototype, "priceListType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePriceListDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'INR', default: 'INR' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(3),
    __metadata("design:type", String)
], CreatePriceListDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePriceListDto.prototype, "isTaxInclusive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: 'string', format: 'date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreatePriceListDto.prototype, "effectiveFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: 'string', format: 'date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreatePriceListDto.prototype, "effectiveTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePriceListDto.prototype, "minOrderAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePriceListDto.prototype, "discountPercentage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePriceListDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePriceListDto.prototype, "isDefault", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePriceListDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [create_price_list_item_dto_1.CreatePriceListItemDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_price_list_item_dto_1.CreatePriceListItemDto),
    __metadata("design:type", Array)
], CreatePriceListDto.prototype, "items", void 0);
//# sourceMappingURL=create-price-list.dto.js.map