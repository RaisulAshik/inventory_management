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
exports.BomItem = exports.BomItemType = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const bill_of_materials_entity_1 = require("./bill-of-materials.entity");
const product_entity_1 = require("../inventory/product.entity");
const product_variant_entity_1 = require("../inventory/product-variant.entity");
const unit_of_measure_entity_1 = require("../inventory/unit-of-measure.entity");
var BomItemType;
(function (BomItemType) {
    BomItemType["RAW_MATERIAL"] = "RAW_MATERIAL";
    BomItemType["SEMI_FINISHED"] = "SEMI_FINISHED";
    BomItemType["SUB_ASSEMBLY"] = "SUB_ASSEMBLY";
    BomItemType["PACKAGING"] = "PACKAGING";
    BomItemType["CONSUMABLE"] = "CONSUMABLE";
})(BomItemType || (exports.BomItemType = BomItemType = {}));
let BomItem = class BomItem {
    id;
    bomId;
    itemType;
    productId;
    variantId;
    quantity;
    uomId;
    unitCost;
    totalCost;
    scrapPercentage;
    isCritical;
    substituteProductId;
    sequence;
    notes;
    createdAt;
    updatedAt;
    bom;
    product;
    variant;
    uom;
    substituteProduct;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, bomId: { required: true, type: () => String }, itemType: { required: true, enum: require("./bom-item.entity").BomItemType }, productId: { required: true, type: () => String }, variantId: { required: true, type: () => String }, quantity: { required: true, type: () => Number }, uomId: { required: true, type: () => String }, unitCost: { required: true, type: () => Number }, totalCost: { required: true, type: () => Number }, scrapPercentage: { required: true, type: () => Number }, isCritical: { required: true, type: () => Boolean }, substituteProductId: { required: true, type: () => String }, sequence: { required: true, type: () => Number }, notes: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, bom: { required: true, type: () => require("./bill-of-materials.entity").BillOfMaterials }, product: { required: true, type: () => require("../inventory/product.entity").Product }, variant: { required: true, type: () => require("../inventory/product-variant.entity").ProductVariant }, uom: { required: true, type: () => require("../inventory/unit-of-measure.entity").UnitOfMeasure }, substituteProduct: { required: true, type: () => require("../inventory/product.entity").Product } };
    }
};
exports.BomItem = BomItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], BomItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bom_id' }),
    __metadata("design:type", String)
], BomItem.prototype, "bomId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'item_type',
        type: 'enum',
        enum: BomItemType,
        default: BomItemType.RAW_MATERIAL,
    }),
    __metadata("design:type", String)
], BomItem.prototype, "itemType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", String)
], BomItem.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'variant_id', nullable: true }),
    __metadata("design:type", String)
], BomItem.prototype, "variantId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 6,
    }),
    __metadata("design:type", Number)
], BomItem.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'uom_id' }),
    __metadata("design:type", String)
], BomItem.prototype, "uomId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'unit_cost',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], BomItem.prototype, "unitCost", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_cost',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], BomItem.prototype, "totalCost", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'scrap_percentage',
        type: 'decimal',
        precision: 5,
        scale: 2,
        default: 0,
    }),
    __metadata("design:type", Number)
], BomItem.prototype, "scrapPercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_critical', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], BomItem.prototype, "isCritical", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'substitute_product_id', nullable: true }),
    __metadata("design:type", String)
], BomItem.prototype, "substituteProductId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], BomItem.prototype, "sequence", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], BomItem.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], BomItem.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], BomItem.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => bill_of_materials_entity_1.BillOfMaterials, (bom) => bom.items, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'bom_id' }),
    __metadata("design:type", bill_of_materials_entity_1.BillOfMaterials)
], BomItem.prototype, "bom", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], BomItem.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_variant_entity_1.ProductVariant),
    (0, typeorm_1.JoinColumn)({ name: 'variant_id' }),
    __metadata("design:type", product_variant_entity_1.ProductVariant)
], BomItem.prototype, "variant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => unit_of_measure_entity_1.UnitOfMeasure),
    (0, typeorm_1.JoinColumn)({ name: 'uom_id' }),
    __metadata("design:type", unit_of_measure_entity_1.UnitOfMeasure)
], BomItem.prototype, "uom", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product),
    (0, typeorm_1.JoinColumn)({ name: 'substitute_product_id' }),
    __metadata("design:type", product_entity_1.Product)
], BomItem.prototype, "substituteProduct", void 0);
exports.BomItem = BomItem = __decorate([
    (0, typeorm_1.Entity)('bom_items')
], BomItem);
//# sourceMappingURL=bom-item.entity.js.map