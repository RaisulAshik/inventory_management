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
exports.BillOfMaterials = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const enums_1 = require("../../../common/enums");
const bom_item_entity_1 = require("./bom-item.entity");
const product_variant_entity_1 = require("../inventory/product-variant.entity");
const product_entity_1 = require("../inventory/product.entity");
const unit_of_measure_entity_1 = require("../inventory/unit-of-measure.entity");
const bom_operation_entity_1 = require("./bom-operation.entity");
let BillOfMaterials = class BillOfMaterials {
    id;
    bomCode;
    bomName;
    productId;
    variantId;
    version;
    status;
    effectiveFrom;
    effectiveTo;
    quantity;
    uomId;
    description;
    totalMaterialCost;
    totalOperationCost;
    totalCost;
    scrapPercentage;
    isDefault;
    notes;
    createdBy;
    approvedBy;
    approvedAt;
    createdAt;
    updatedAt;
    product;
    variant;
    uom;
    items;
    operations;
    get unitCost() {
        return this.quantity > 0 ? this.totalCost / this.quantity : 0;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, bomCode: { required: true, type: () => String }, bomName: { required: true, type: () => String }, productId: { required: true, type: () => String }, variantId: { required: true, type: () => String }, version: { required: true, type: () => Number }, status: { required: true, enum: require("../../../common/enums/index").BOMStatus }, effectiveFrom: { required: true, type: () => Date }, effectiveTo: { required: true, type: () => Date }, quantity: { required: true, type: () => Number }, uomId: { required: true, type: () => String }, description: { required: true, type: () => String }, totalMaterialCost: { required: true, type: () => Number }, totalOperationCost: { required: true, type: () => Number }, totalCost: { required: true, type: () => Number }, scrapPercentage: { required: true, type: () => Number }, isDefault: { required: true, type: () => Boolean }, notes: { required: true, type: () => String }, createdBy: { required: true, type: () => String }, approvedBy: { required: true, type: () => String }, approvedAt: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, product: { required: true, type: () => require("../inventory/product.entity").Product }, variant: { required: true, type: () => require("../inventory/product-variant.entity").ProductVariant }, uom: { required: true, type: () => require("../inventory/unit-of-measure.entity").UnitOfMeasure }, items: { required: true, type: () => [require("./bom-item.entity").BomItem] }, operations: { required: true, type: () => [require("./bom-operation.entity").BomOperation] } };
    }
};
exports.BillOfMaterials = BillOfMaterials;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], BillOfMaterials.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bom_code', length: 50 }),
    __metadata("design:type", String)
], BillOfMaterials.prototype, "bomCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bom_name', length: 200 }),
    __metadata("design:type", String)
], BillOfMaterials.prototype, "bomName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", String)
], BillOfMaterials.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'variant_id', nullable: true }),
    __metadata("design:type", String)
], BillOfMaterials.prototype, "variantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], BillOfMaterials.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.BOMStatus,
        default: enums_1.BOMStatus.DRAFT,
    }),
    __metadata("design:type", String)
], BillOfMaterials.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'effective_from', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], BillOfMaterials.prototype, "effectiveFrom", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'effective_to', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], BillOfMaterials.prototype, "effectiveTo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 1,
    }),
    __metadata("design:type", Number)
], BillOfMaterials.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'uom_id' }),
    __metadata("design:type", String)
], BillOfMaterials.prototype, "uomId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], BillOfMaterials.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_material_cost',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], BillOfMaterials.prototype, "totalMaterialCost", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_operation_cost',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], BillOfMaterials.prototype, "totalOperationCost", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_cost',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], BillOfMaterials.prototype, "totalCost", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'scrap_percentage',
        type: 'decimal',
        precision: 5,
        scale: 2,
        default: 0,
    }),
    __metadata("design:type", Number)
], BillOfMaterials.prototype, "scrapPercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_default', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], BillOfMaterials.prototype, "isDefault", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], BillOfMaterials.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", String)
], BillOfMaterials.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_by', nullable: true }),
    __metadata("design:type", String)
], BillOfMaterials.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], BillOfMaterials.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], BillOfMaterials.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], BillOfMaterials.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], BillOfMaterials.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_variant_entity_1.ProductVariant),
    (0, typeorm_1.JoinColumn)({ name: 'variant_id' }),
    __metadata("design:type", product_variant_entity_1.ProductVariant)
], BillOfMaterials.prototype, "variant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => unit_of_measure_entity_1.UnitOfMeasure),
    (0, typeorm_1.JoinColumn)({ name: 'uom_id' }),
    __metadata("design:type", unit_of_measure_entity_1.UnitOfMeasure)
], BillOfMaterials.prototype, "uom", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => bom_item_entity_1.BomItem, (item) => item.bom),
    __metadata("design:type", Array)
], BillOfMaterials.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => bom_operation_entity_1.BomOperation, (operation) => operation.bom),
    __metadata("design:type", Array)
], BillOfMaterials.prototype, "operations", void 0);
exports.BillOfMaterials = BillOfMaterials = __decorate([
    (0, typeorm_1.Entity)('bill_of_materials')
], BillOfMaterials);
//# sourceMappingURL=bill-of-materials.entity.js.map