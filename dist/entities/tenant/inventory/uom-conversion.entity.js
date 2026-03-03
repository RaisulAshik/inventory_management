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
exports.UomConversion = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const unit_of_measure_entity_1 = require("./unit-of-measure.entity");
let UomConversion = class UomConversion {
    id;
    fromUomId;
    toUomId;
    conversionFactor;
    isBidirectional;
    productId;
    isActive;
    description;
    createdBy;
    updatedBy;
    createdAt;
    updatedAt;
    fromUom;
    toUom;
    get reverseConversionFactor() {
        return 1 / Number(this.conversionFactor);
    }
    convert(quantity) {
        return quantity * Number(this.conversionFactor);
    }
    reverseConvert(quantity) {
        return quantity / Number(this.conversionFactor);
    }
    get displayString() {
        const fromName = this.fromUom?.uomName || 'Unit';
        const toName = this.toUom?.uomName || 'Unit';
        return `1 ${fromName} = ${this.conversionFactor} ${toName}`;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, fromUomId: { required: true, type: () => String }, toUomId: { required: true, type: () => String }, conversionFactor: { required: true, type: () => Number, description: "Conversion factor: 1 fromUom = conversionFactor toUom\nExample: 1 Box = 12 Pieces, conversionFactor = 12" }, isBidirectional: { required: true, type: () => Boolean, description: "Whether this is a bidirectional conversion\nIf true, reverse conversion is automatically calculated" }, productId: { required: true, type: () => String, description: "Optional: Product-specific conversion (null means global conversion)\nSome products might have different conversion factors" }, isActive: { required: true, type: () => Boolean }, description: { required: true, type: () => String }, createdBy: { required: true, type: () => String }, updatedBy: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, fromUom: { required: true, type: () => require("./unit-of-measure.entity").UnitOfMeasure }, toUom: { required: true, type: () => require("./unit-of-measure.entity").UnitOfMeasure } };
    }
};
exports.UomConversion = UomConversion;
__decorate([
    (0, typeorm_1.PrimaryColumn)('char', { length: 36 }),
    __metadata("design:type", String)
], UomConversion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('char', { name: 'from_uom_id', length: 36 }),
    __metadata("design:type", String)
], UomConversion.prototype, "fromUomId", void 0);
__decorate([
    (0, typeorm_1.Column)('char', { name: 'to_uom_id', length: 36 }),
    __metadata("design:type", String)
], UomConversion.prototype, "toUomId", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { name: 'conversion_factor', precision: 18, scale: 8 }),
    __metadata("design:type", Number)
], UomConversion.prototype, "conversionFactor", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { name: 'is_bidirectional', default: true }),
    __metadata("design:type", Boolean)
], UomConversion.prototype, "isBidirectional", void 0);
__decorate([
    (0, typeorm_1.Column)('char', { name: 'product_id', length: 36, nullable: true }),
    __metadata("design:type", String)
], UomConversion.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], UomConversion.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], UomConversion.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('char', { name: 'created_by', length: 36, nullable: true }),
    __metadata("design:type", String)
], UomConversion.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)('char', { name: 'updated_by', length: 36, nullable: true }),
    __metadata("design:type", String)
], UomConversion.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], UomConversion.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], UomConversion.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => unit_of_measure_entity_1.UnitOfMeasure, (uom) => uom.conversionsFrom, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'from_uom_id' }),
    __metadata("design:type", unit_of_measure_entity_1.UnitOfMeasure)
], UomConversion.prototype, "fromUom", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => unit_of_measure_entity_1.UnitOfMeasure, (uom) => uom.conversionsTo, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'to_uom_id' }),
    __metadata("design:type", unit_of_measure_entity_1.UnitOfMeasure)
], UomConversion.prototype, "toUom", void 0);
exports.UomConversion = UomConversion = __decorate([
    (0, typeorm_1.Entity)('uom_conversions'),
    (0, typeorm_1.Unique)(['fromUomId', 'toUomId']),
    (0, typeorm_1.Index)(['fromUomId']),
    (0, typeorm_1.Index)(['toUomId'])
], UomConversion);
//# sourceMappingURL=uom-conversion.entity.js.map