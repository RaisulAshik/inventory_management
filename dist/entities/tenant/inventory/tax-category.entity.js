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
exports.TaxCategory = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const tax_rate_entity_1 = require("./tax-rate.entity");
const product_entity_1 = require("./product.entity");
let TaxCategory = class TaxCategory {
    id;
    taxCode;
    taxName;
    description;
    isActive;
    createdAt;
    updatedAt;
    taxRates;
    products;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, taxCode: { required: true, type: () => String }, taxName: { required: true, type: () => String }, description: { required: true, type: () => String }, isActive: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, taxRates: { required: true, type: () => [require("./tax-rate.entity").TaxRate] }, products: { required: true, type: () => [require("./product.entity").Product] } };
    }
};
exports.TaxCategory = TaxCategory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TaxCategory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tax_code', length: 50, unique: true }),
    __metadata("design:type", String)
], TaxCategory.prototype, "taxCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tax_name', length: 100 }),
    __metadata("design:type", String)
], TaxCategory.prototype, "taxName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], TaxCategory.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], TaxCategory.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], TaxCategory.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], TaxCategory.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tax_rate_entity_1.TaxRate, (rate) => rate.taxCategory),
    __metadata("design:type", Array)
], TaxCategory.prototype, "taxRates", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_entity_1.Product, (product) => product.taxCategory),
    __metadata("design:type", Array)
], TaxCategory.prototype, "products", void 0);
exports.TaxCategory = TaxCategory = __decorate([
    (0, typeorm_1.Entity)('tax_categories')
], TaxCategory);
//# sourceMappingURL=tax-category.entity.js.map