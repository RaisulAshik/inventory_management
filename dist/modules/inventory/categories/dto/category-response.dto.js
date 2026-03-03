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
exports.CategoryResponseDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
class CategoryResponseDto {
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
    parent;
    children;
    createdAt;
    updatedAt;
    constructor(category) {
        this.id = category.id;
        this.categoryCode = category.categoryCode;
        this.categoryName = category.categoryName;
        this.parentId = category.parentId;
        this.level = category.level;
        this.path = category.path;
        this.description = category.description;
        this.imageUrl = category.imageUrl;
        this.isActive = category.isActive;
        this.sortOrder = category.sortOrder;
        this.createdAt = category.createdAt;
        this.updatedAt = category.updatedAt;
        if (category.parent) {
            this.parent = new CategoryResponseDto(category.parent);
        }
        if (category.children && category.children.length > 0) {
            this.children = category.children.map((child) => new CategoryResponseDto(child));
        }
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, categoryCode: { required: true, type: () => String }, categoryName: { required: true, type: () => String }, parentId: { required: false, type: () => String }, level: { required: true, type: () => Number }, path: { required: false, type: () => String }, description: { required: false, type: () => String }, imageUrl: { required: false, type: () => String }, isActive: { required: true, type: () => Boolean }, sortOrder: { required: true, type: () => Number }, parent: { required: false, type: () => require("./category-response.dto").CategoryResponseDto }, children: { required: false, type: () => [require("./category-response.dto").CategoryResponseDto] }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.CategoryResponseDto = CategoryResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CategoryResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CategoryResponseDto.prototype, "categoryCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CategoryResponseDto.prototype, "categoryName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CategoryResponseDto.prototype, "parentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CategoryResponseDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CategoryResponseDto.prototype, "path", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CategoryResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CategoryResponseDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], CategoryResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CategoryResponseDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => CategoryResponseDto }),
    __metadata("design:type", CategoryResponseDto)
], CategoryResponseDto.prototype, "parent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [CategoryResponseDto] }),
    __metadata("design:type", Array)
], CategoryResponseDto.prototype, "children", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], CategoryResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], CategoryResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=category-response.dto.js.map