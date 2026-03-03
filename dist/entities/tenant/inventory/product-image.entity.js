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
exports.ProductImage = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const product_entity_1 = require("./product.entity");
let ProductImage = class ProductImage {
    id;
    productId;
    imageUrl;
    thumbnailUrl;
    altText;
    title;
    isPrimary;
    sortOrder;
    fileName;
    fileSize;
    mimeType;
    width;
    height;
    createdAt;
    updatedAt;
    product;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, productId: { required: true, type: () => String }, imageUrl: { required: true, type: () => String }, thumbnailUrl: { required: true, type: () => String }, altText: { required: true, type: () => String }, title: { required: true, type: () => String }, isPrimary: { required: true, type: () => Boolean }, sortOrder: { required: true, type: () => Number }, fileName: { required: true, type: () => String }, fileSize: { required: true, type: () => Number }, mimeType: { required: true, type: () => String }, width: { required: true, type: () => Number }, height: { required: true, type: () => Number }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, product: { required: true, type: () => require("./product.entity").Product } };
    }
};
exports.ProductImage = ProductImage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ProductImage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", String)
], ProductImage.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'image_url', length: 500 }),
    __metadata("design:type", String)
], ProductImage.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'thumbnail_url', length: 500, nullable: true }),
    __metadata("design:type", String)
], ProductImage.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'alt_text', length: 255, nullable: true }),
    __metadata("design:type", String)
], ProductImage.prototype, "altText", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], ProductImage.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_primary', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], ProductImage.prototype, "isPrimary", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sort_order', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ProductImage.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_name', length: 255, nullable: true }),
    __metadata("design:type", String)
], ProductImage.prototype, "fileName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_size', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], ProductImage.prototype, "fileSize", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'mime_type', length: 50, nullable: true }),
    __metadata("design:type", String)
], ProductImage.prototype, "mimeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], ProductImage.prototype, "width", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], ProductImage.prototype, "height", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ProductImage.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ProductImage.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, (product) => product.images, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], ProductImage.prototype, "product", void 0);
exports.ProductImage = ProductImage = __decorate([
    (0, typeorm_1.Entity)('product_images')
], ProductImage);
//# sourceMappingURL=product-image.entity.js.map