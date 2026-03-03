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
exports.TaxRate = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const tax_category_entity_1 = require("./tax-category.entity");
let TaxRate = class TaxRate {
    id;
    taxCategoryId;
    taxType;
    rateName;
    ratePercentage;
    effectiveFrom;
    effectiveTo;
    isActive;
    createdAt;
    updatedAt;
    taxCategory;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, taxCategoryId: { required: true, type: () => String }, taxType: { required: true, type: () => String }, rateName: { required: true, type: () => String }, ratePercentage: { required: true, type: () => Number }, effectiveFrom: { required: true, type: () => Date }, effectiveTo: { required: true, type: () => Date }, isActive: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, taxCategory: { required: true, type: () => require("./tax-category.entity").TaxCategory } };
    }
};
exports.TaxRate = TaxRate;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TaxRate.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tax_category_id' }),
    __metadata("design:type", String)
], TaxRate.prototype, "taxCategoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tax_type', length: 50 }),
    __metadata("design:type", String)
], TaxRate.prototype, "taxType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rate_name', length: 100 }),
    __metadata("design:type", String)
], TaxRate.prototype, "rateName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rate_percentage', type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], TaxRate.prototype, "ratePercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'effective_from', type: 'date' }),
    __metadata("design:type", Date)
], TaxRate.prototype, "effectiveFrom", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'effective_to', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], TaxRate.prototype, "effectiveTo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], TaxRate.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], TaxRate.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], TaxRate.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tax_category_entity_1.TaxCategory, (category) => category.taxRates),
    (0, typeorm_1.JoinColumn)({ name: 'tax_category_id' }),
    __metadata("design:type", tax_category_entity_1.TaxCategory)
], TaxRate.prototype, "taxCategory", void 0);
exports.TaxRate = TaxRate = __decorate([
    (0, typeorm_1.Entity)('tax_rates')
], TaxRate);
//# sourceMappingURL=tax-rate.entity.js.map