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
exports.UnitOfMeasure = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const enums_1 = require("../../../common/enums");
const product_entity_1 = require("./product.entity");
const uom_conversion_entity_1 = require("./uom-conversion.entity");
let UnitOfMeasure = class UnitOfMeasure {
    id;
    uomCode;
    uomName;
    description;
    symbol;
    uomType;
    decimalPlaces;
    isActive;
    createdAt;
    updatedAt;
    products;
    conversionsFrom;
    conversionsTo;
    formatQuantity(quantity) {
        return quantity.toFixed(this.decimalPlaces);
    }
    get displayName() {
        return this.symbol ? `${this.uomName} (${this.symbol})` : this.uomName;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, uomCode: { required: true, type: () => String }, uomName: { required: true, type: () => String }, description: { required: true, type: () => String }, symbol: { required: true, type: () => String }, uomType: { required: true, enum: require("../../../common/enums/index").UomType }, decimalPlaces: { required: true, type: () => Number }, isActive: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, products: { required: true, type: () => [require("./product.entity").Product] }, conversionsFrom: { required: true, type: () => [require("./uom-conversion.entity").UomConversion] }, conversionsTo: { required: true, type: () => [require("./uom-conversion.entity").UomConversion] } };
    }
};
exports.UnitOfMeasure = UnitOfMeasure;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UnitOfMeasure.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'uom_code', length: 20, unique: true }),
    __metadata("design:type", String)
], UnitOfMeasure.prototype, "uomCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'uom_name', length: 100 }),
    __metadata("design:type", String)
], UnitOfMeasure.prototype, "uomName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', type: 'text', nullable: true }),
    __metadata("design:type", String)
], UnitOfMeasure.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'symbol', length: 20, nullable: true }),
    __metadata("design:type", String)
], UnitOfMeasure.prototype, "symbol", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'uom_type',
        type: 'enum',
        enum: enums_1.UomType,
        default: enums_1.UomType.COUNT,
    }),
    __metadata("design:type", String)
], UnitOfMeasure.prototype, "uomType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'decimal_places', type: 'tinyint', default: 0 }),
    __metadata("design:type", Number)
], UnitOfMeasure.prototype, "decimalPlaces", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], UnitOfMeasure.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], UnitOfMeasure.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], UnitOfMeasure.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_entity_1.Product, (product) => product.baseUom),
    __metadata("design:type", Array)
], UnitOfMeasure.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => uom_conversion_entity_1.UomConversion, (conversion) => conversion.fromUom),
    __metadata("design:type", Array)
], UnitOfMeasure.prototype, "conversionsFrom", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => uom_conversion_entity_1.UomConversion, (conversion) => conversion.toUom),
    __metadata("design:type", Array)
], UnitOfMeasure.prototype, "conversionsTo", void 0);
exports.UnitOfMeasure = UnitOfMeasure = __decorate([
    (0, typeorm_1.Entity)('units_of_measure')
], UnitOfMeasure);
//# sourceMappingURL=unit-of-measure.entity.js.map