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
exports.PriceListResponseDto = void 0;
const openapi = require("@nestjs/swagger");
const tenant_1 = require("../../../../entities/tenant");
const swagger_1 = require("@nestjs/swagger");
class PriceListItemDto {
    id;
    productId;
    productName;
    productSku;
    variantId;
    variantName;
    price;
    minQuantity;
    maxQuantity;
    discountPercentage;
    discountAmount;
    effectiveFrom;
    effectiveTo;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, productId: { required: true, type: () => String }, productName: { required: false, type: () => String }, productSku: { required: false, type: () => String }, variantId: { required: false, type: () => String }, variantName: { required: false, type: () => String }, price: { required: true, type: () => Number }, minQuantity: { required: true, type: () => Number }, maxQuantity: { required: false, type: () => Number }, discountPercentage: { required: true, type: () => Number }, discountAmount: { required: true, type: () => Number }, effectiveFrom: { required: false, type: () => Date }, effectiveTo: { required: false, type: () => Date } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PriceListItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PriceListItemDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PriceListItemDto.prototype, "productName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PriceListItemDto.prototype, "productSku", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PriceListItemDto.prototype, "variantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PriceListItemDto.prototype, "variantName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PriceListItemDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PriceListItemDto.prototype, "minQuantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], PriceListItemDto.prototype, "maxQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PriceListItemDto.prototype, "discountPercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PriceListItemDto.prototype, "discountAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], PriceListItemDto.prototype, "effectiveFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], PriceListItemDto.prototype, "effectiveTo", void 0);
class PriceListResponseDto {
    id;
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
    isEffective;
    items;
    createdAt;
    updatedAt;
    constructor(priceList) {
        this.id = priceList.id;
        this.priceListCode = priceList.priceListCode;
        this.priceListName = priceList.priceListName;
        this.priceListType = priceList.priceListType;
        this.description = priceList.description;
        this.currency = priceList.currency;
        this.isTaxInclusive = priceList.isTaxInclusive;
        this.effectiveFrom = priceList.effectiveFrom;
        this.effectiveTo = priceList.effectiveTo;
        this.minOrderAmount = priceList.minOrderAmount
            ? Number(priceList.minOrderAmount)
            : undefined;
        this.discountPercentage = Number(priceList.discountPercentage);
        this.priority = priceList.priority;
        this.isDefault = priceList.isDefault;
        this.isActive = priceList.isActive;
        this.isEffective = priceList.isEffective;
        this.createdAt = priceList.createdAt;
        this.updatedAt = priceList.updatedAt;
        if (priceList.items) {
            this.items = priceList.items.map((item) => ({
                id: item.id,
                productId: item.productId,
                productName: item.product?.productName,
                productSku: item.product?.sku,
                variantId: item.variantId,
                variantName: item.variant?.variantName,
                price: Number(item.price),
                minQuantity: Number(item.minQuantity),
                maxQuantity: item.maxQuantity ? Number(item.maxQuantity) : undefined,
                discountPercentage: Number(item.discountPercentage),
                discountAmount: Number(item.discountAmount),
                effectiveFrom: item.effectiveFrom,
                effectiveTo: item.effectiveTo,
            }));
        }
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, priceListCode: { required: true, type: () => String }, priceListName: { required: true, type: () => String }, priceListType: { required: true, enum: require("../../../../entities/tenant/inventory/price-list.entity").PriceListType }, description: { required: false, type: () => String }, currency: { required: true, type: () => String }, isTaxInclusive: { required: true, type: () => Boolean }, effectiveFrom: { required: false, type: () => Date }, effectiveTo: { required: false, type: () => Date }, minOrderAmount: { required: false, type: () => Number }, discountPercentage: { required: true, type: () => Number }, priority: { required: true, type: () => Number }, isDefault: { required: true, type: () => Boolean }, isActive: { required: true, type: () => Boolean }, isEffective: { required: true, type: () => Boolean }, items: { required: false, type: () => [PriceListItemDto] }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.PriceListResponseDto = PriceListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PriceListResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PriceListResponseDto.prototype, "priceListCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PriceListResponseDto.prototype, "priceListName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: tenant_1.PriceListType }),
    __metadata("design:type", String)
], PriceListResponseDto.prototype, "priceListType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PriceListResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PriceListResponseDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], PriceListResponseDto.prototype, "isTaxInclusive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], PriceListResponseDto.prototype, "effectiveFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], PriceListResponseDto.prototype, "effectiveTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], PriceListResponseDto.prototype, "minOrderAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PriceListResponseDto.prototype, "discountPercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PriceListResponseDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], PriceListResponseDto.prototype, "isDefault", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], PriceListResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], PriceListResponseDto.prototype, "isEffective", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [PriceListItemDto] }),
    __metadata("design:type", Array)
], PriceListResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], PriceListResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], PriceListResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=price-list-response.dto.js.map