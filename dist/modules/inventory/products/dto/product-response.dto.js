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
exports.ProductResponseDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../../../common/enums");
class CategoryDto {
    id;
    categoryCode;
    categoryName;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, categoryCode: { required: true, type: () => String }, categoryName: { required: true, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CategoryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CategoryDto.prototype, "categoryCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CategoryDto.prototype, "categoryName", void 0);
class BrandDto {
    id;
    brandCode;
    brandName;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, brandCode: { required: true, type: () => String }, brandName: { required: true, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BrandDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BrandDto.prototype, "brandCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BrandDto.prototype, "brandName", void 0);
class UomDto {
    id;
    uomCode;
    uomName;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, uomCode: { required: true, type: () => String }, uomName: { required: true, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UomDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UomDto.prototype, "uomCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UomDto.prototype, "uomName", void 0);
class ProductImageDto {
    id;
    imageUrl;
    thumbnailUrl;
    altText;
    isPrimary;
    sortOrder;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, imageUrl: { required: true, type: () => String }, thumbnailUrl: { required: false, type: () => String }, altText: { required: false, type: () => String }, isPrimary: { required: true, type: () => Boolean }, sortOrder: { required: true, type: () => Number } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProductImageDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProductImageDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ProductImageDto.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ProductImageDto.prototype, "altText", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ProductImageDto.prototype, "isPrimary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ProductImageDto.prototype, "sortOrder", void 0);
class ProductVariantDto {
    id;
    variantSku;
    variantBarcode;
    variantName;
    costPrice;
    sellingPrice;
    mrp;
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, variantSku: { required: true, type: () => String }, variantBarcode: { required: false, type: () => String }, variantName: { required: true, type: () => String }, costPrice: { required: false, type: () => Number }, sellingPrice: { required: false, type: () => Number }, mrp: { required: false, type: () => Number }, isActive: { required: true, type: () => Boolean } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProductVariantDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProductVariantDto.prototype, "variantSku", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ProductVariantDto.prototype, "variantBarcode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProductVariantDto.prototype, "variantName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], ProductVariantDto.prototype, "costPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], ProductVariantDto.prototype, "sellingPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], ProductVariantDto.prototype, "mrp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ProductVariantDto.prototype, "isActive", void 0);
class ProductResponseDto {
    id;
    sku;
    barcode;
    productName;
    shortName;
    description;
    productType;
    isStockable;
    isPurchasable;
    isSellable;
    isActive;
    trackSerial;
    trackBatch;
    trackExpiry;
    shelfLifeDays;
    hsnCode;
    costPrice;
    sellingPrice;
    mrp;
    minimumPrice;
    wholesalePrice;
    reorderLevel;
    reorderQuantity;
    minimumOrderQuantity;
    maximumOrderQuantity;
    category;
    brand;
    baseUom;
    images;
    variants;
    createdAt;
    updatedAt;
    constructor(product) {
        this.id = product.id;
        this.sku = product.sku;
        this.barcode = product.barcode;
        this.productName = product.productName;
        this.shortName = product.shortName;
        this.description = product.description;
        this.productType = product.productType;
        this.isStockable = product.isStockable;
        this.isPurchasable = product.isPurchasable;
        this.isSellable = product.isSellable;
        this.isActive = product.isActive;
        this.trackSerial = product.trackSerial;
        this.trackBatch = product.trackBatch;
        this.trackExpiry = product.trackExpiry;
        this.shelfLifeDays = product.shelfLifeDays;
        this.hsnCode = product.hsnCode;
        this.costPrice = Number(product.costPrice);
        this.sellingPrice = Number(product.sellingPrice);
        this.mrp = product.mrp ? Number(product.mrp) : undefined;
        this.minimumPrice = product.minimumPrice
            ? Number(product.minimumPrice)
            : undefined;
        this.wholesalePrice = product.wholesalePrice
            ? Number(product.wholesalePrice)
            : undefined;
        this.reorderLevel = Number(product.reorderLevel);
        this.reorderQuantity = Number(product.reorderQuantity);
        this.minimumOrderQuantity = Number(product.minimumOrderQuantity);
        this.maximumOrderQuantity = product.maximumOrderQuantity
            ? Number(product.maximumOrderQuantity)
            : undefined;
        this.createdAt = product.createdAt;
        this.updatedAt = product.updatedAt;
        if (product.category) {
            this.category = {
                id: product.category.id,
                categoryCode: product.category.categoryCode,
                categoryName: product.category.categoryName,
            };
        }
        if (product.brand) {
            this.brand = {
                id: product.brand.id,
                brandCode: product.brand.brandCode,
                brandName: product.brand.brandName,
            };
        }
        if (product.baseUom) {
            this.baseUom = {
                id: product.baseUom.id,
                uomCode: product.baseUom.uomCode,
                uomName: product.baseUom.uomName,
            };
        }
        if (product.images) {
            this.images = product.images.map((img) => ({
                id: img.id,
                imageUrl: img.imageUrl,
                thumbnailUrl: img.thumbnailUrl,
                altText: img.altText,
                isPrimary: img.isPrimary,
                sortOrder: img.sortOrder,
            }));
        }
        if (product.variants) {
            this.variants = product.variants.map((v) => ({
                id: v.id,
                variantSku: v.variantSku,
                variantBarcode: v.variantBarcode,
                variantName: v.variantName,
                costPrice: v.costPrice ? Number(v.costPrice) : undefined,
                sellingPrice: v.sellingPrice ? Number(v.sellingPrice) : undefined,
                mrp: v.mrp ? Number(v.mrp) : undefined,
                isActive: v.isActive,
            }));
        }
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, sku: { required: true, type: () => String }, barcode: { required: false, type: () => String }, productName: { required: true, type: () => String }, shortName: { required: false, type: () => String }, description: { required: false, type: () => String }, productType: { required: true, enum: require("../../../../common/enums/index").ProductType }, isStockable: { required: true, type: () => Boolean }, isPurchasable: { required: true, type: () => Boolean }, isSellable: { required: true, type: () => Boolean }, isActive: { required: true, type: () => Boolean }, trackSerial: { required: true, type: () => Boolean }, trackBatch: { required: true, type: () => Boolean }, trackExpiry: { required: true, type: () => Boolean }, shelfLifeDays: { required: false, type: () => Number }, hsnCode: { required: false, type: () => String }, costPrice: { required: true, type: () => Number }, sellingPrice: { required: true, type: () => Number }, mrp: { required: false, type: () => Number }, minimumPrice: { required: false, type: () => Number }, wholesalePrice: { required: false, type: () => Number }, reorderLevel: { required: true, type: () => Number }, reorderQuantity: { required: true, type: () => Number }, minimumOrderQuantity: { required: true, type: () => Number }, maximumOrderQuantity: { required: false, type: () => Number }, category: { required: false, type: () => CategoryDto }, brand: { required: false, type: () => BrandDto }, baseUom: { required: false, type: () => UomDto }, images: { required: false, type: () => [ProductImageDto] }, variants: { required: false, type: () => [ProductVariantDto] }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.ProductResponseDto = ProductResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "barcode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "productName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "shortName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.ProductType }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "productType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ProductResponseDto.prototype, "isStockable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ProductResponseDto.prototype, "isPurchasable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ProductResponseDto.prototype, "isSellable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ProductResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ProductResponseDto.prototype, "trackSerial", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ProductResponseDto.prototype, "trackBatch", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ProductResponseDto.prototype, "trackExpiry", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], ProductResponseDto.prototype, "shelfLifeDays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "hsnCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ProductResponseDto.prototype, "costPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ProductResponseDto.prototype, "sellingPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], ProductResponseDto.prototype, "mrp", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], ProductResponseDto.prototype, "minimumPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], ProductResponseDto.prototype, "wholesalePrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ProductResponseDto.prototype, "reorderLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ProductResponseDto.prototype, "reorderQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ProductResponseDto.prototype, "minimumOrderQuantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], ProductResponseDto.prototype, "maximumOrderQuantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: CategoryDto }),
    __metadata("design:type", CategoryDto)
], ProductResponseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: BrandDto }),
    __metadata("design:type", BrandDto)
], ProductResponseDto.prototype, "brand", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: UomDto }),
    __metadata("design:type", UomDto)
], ProductResponseDto.prototype, "baseUom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [ProductImageDto] }),
    __metadata("design:type", Array)
], ProductResponseDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [ProductVariantDto] }),
    __metadata("design:type", Array)
], ProductResponseDto.prototype, "variants", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ProductResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ProductResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=product-response.dto.js.map