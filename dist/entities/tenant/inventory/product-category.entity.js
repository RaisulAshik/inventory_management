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
exports.ProductCategory = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const product_entity_1 = require("./product.entity");
let ProductCategory = class ProductCategory {
    id;
    categoryCode;
    categoryName;
    parentId;
    level;
    path;
    description;
    imageUrl;
    isActive;
    sortOrder;
    createdAt;
    updatedAt;
    parent;
    children;
    products;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, categoryCode: { required: true, type: () => String }, categoryName: { required: true, type: () => String }, parentId: { required: true, type: () => String }, level: { required: true, type: () => Number }, path: { required: true, type: () => String }, description: { required: true, type: () => String }, imageUrl: { required: true, type: () => String }, isActive: { required: true, type: () => Boolean }, sortOrder: { required: true, type: () => Number }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, parent: { required: true, type: () => require("./product-category.entity").ProductCategory, nullable: true }, children: { required: true, type: () => [require("./product-category.entity").ProductCategory] }, products: { required: true, type: () => [require("./product.entity").Product] } };
    }
};
exports.ProductCategory = ProductCategory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ProductCategory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'category_code', length: 50, unique: true }),
    __metadata("design:type", String)
], ProductCategory.prototype, "categoryCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'category_name', length: 200 }),
    __metadata("design:type", String)
], ProductCategory.prototype, "categoryName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'parent_id', nullable: true }),
    __metadata("design:type", String)
], ProductCategory.prototype, "parentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ProductCategory.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 500, nullable: true }),
    __metadata("design:type", String)
], ProductCategory.prototype, "path", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ProductCategory.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'image_url', length: 500, nullable: true }),
    __metadata("design:type", String)
], ProductCategory.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], ProductCategory.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sort_order', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ProductCategory.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ProductCategory.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ProductCategory.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ProductCategory, (category) => category.children, {
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'parent_id' }),
    __metadata("design:type", Object)
], ProductCategory.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ProductCategory, (category) => category.parent),
    __metadata("design:type", Array)
], ProductCategory.prototype, "children", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_entity_1.Product, (product) => product.category),
    __metadata("design:type", Array)
], ProductCategory.prototype, "products", void 0);
exports.ProductCategory = ProductCategory = __decorate([
    (0, typeorm_1.Entity)('product_categories')
], ProductCategory);
//# sourceMappingURL=product-category.entity.js.map