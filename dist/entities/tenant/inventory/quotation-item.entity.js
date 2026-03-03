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
exports.QuotationItem = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const quotation_entity_1 = require("./quotation.entity");
const product_entity_1 = require("./product.entity");
let QuotationItem = class QuotationItem {
    id;
    quotationId;
    quotation;
    productId;
    product;
    variantId;
    productName;
    sku;
    quantity;
    unitPrice;
    discountType;
    discountValue;
    discountAmount;
    taxRate;
    taxAmount;
    lineTotal;
    notes;
    createdAt;
    name;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, quotationId: { required: true, type: () => String }, quotation: { required: true, type: () => require("./quotation.entity").Quotation }, productId: { required: true, type: () => String }, product: { required: true, type: () => require("./product.entity").Product }, variantId: { required: true, type: () => String }, productName: { required: true, type: () => String }, sku: { required: true, type: () => String }, quantity: { required: true, type: () => Number }, unitPrice: { required: true, type: () => Number }, discountType: { required: true, type: () => String }, discountValue: { required: true, type: () => Number }, discountAmount: { required: true, type: () => Number }, taxRate: { required: true, type: () => Number }, taxAmount: { required: true, type: () => Number }, lineTotal: { required: true, type: () => Number }, notes: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, name: { required: true, type: () => String } };
    }
};
exports.QuotationItem = QuotationItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], QuotationItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quotation_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], QuotationItem.prototype, "quotationId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => quotation_entity_1.Quotation, (quotation) => quotation.items, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'quotation_id' }),
    __metadata("design:type", quotation_entity_1.Quotation)
], QuotationItem.prototype, "quotation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], QuotationItem.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], QuotationItem.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'variant_id', type: 'char', length: 36, nullable: true }),
    __metadata("design:type", String)
], QuotationItem.prototype, "variantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_name', type: 'varchar', length: 300 }),
    __metadata("design:type", String)
], QuotationItem.prototype, "productName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], QuotationItem.prototype, "sku", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 4 }),
    __metadata("design:type", Number)
], QuotationItem.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit_price', type: 'decimal', precision: 15, scale: 4 }),
    __metadata("design:type", Number)
], QuotationItem.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'discount_type',
        type: 'enum',
        enum: ['PERCENTAGE', 'FIXED'],
        default: 'FIXED',
    }),
    __metadata("design:type", String)
], QuotationItem.prototype, "discountType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'discount_value',
        type: 'decimal',
        precision: 15,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], QuotationItem.prototype, "discountValue", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'discount_amount',
        type: 'decimal',
        precision: 15,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], QuotationItem.prototype, "discountAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'tax_rate',
        type: 'decimal',
        precision: 8,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], QuotationItem.prototype, "taxRate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'tax_amount',
        type: 'decimal',
        precision: 15,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], QuotationItem.prototype, "taxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'line_total', type: 'decimal', precision: 15, scale: 4 }),
    __metadata("design:type", Number)
], QuotationItem.prototype, "lineTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], QuotationItem.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], QuotationItem.prototype, "createdAt", void 0);
exports.QuotationItem = QuotationItem = __decorate([
    (0, typeorm_1.Entity)('quotation_items')
], QuotationItem);
//# sourceMappingURL=quotation-item.entity.js.map