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
exports.SalesReturnItem = exports.ReturnItemDisposition = exports.ReturnItemCondition = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const sales_return_entity_1 = require("./sales-return.entity");
const sales_order_item_entity_1 = require("./sales-order-item.entity");
const product_entity_1 = require("../inventory/product.entity");
const product_variant_entity_1 = require("../inventory/product-variant.entity");
const unit_of_measure_entity_1 = require("../inventory/unit-of-measure.entity");
var ReturnItemCondition;
(function (ReturnItemCondition) {
    ReturnItemCondition["GOOD"] = "GOOD";
    ReturnItemCondition["LIKE_NEW"] = "LIKE_NEW";
    ReturnItemCondition["NEW"] = "NEW";
    ReturnItemCondition["OPENED"] = "OPENED";
    ReturnItemCondition["DAMAGED"] = "DAMAGED";
    ReturnItemCondition["DEFECTIVE"] = "DEFECTIVE";
    ReturnItemCondition["EXPIRED"] = "EXPIRED";
})(ReturnItemCondition || (exports.ReturnItemCondition = ReturnItemCondition = {}));
var ReturnItemDisposition;
(function (ReturnItemDisposition) {
    ReturnItemDisposition["RESTOCK"] = "RESTOCK";
    ReturnItemDisposition["SCRAP"] = "SCRAP";
    ReturnItemDisposition["REFURBISH"] = "REFURBISH";
    ReturnItemDisposition["RETURN_TO_VENDOR"] = "RETURN_TO_VENDOR";
    ReturnItemDisposition["PENDING"] = "PENDING";
})(ReturnItemDisposition || (exports.ReturnItemDisposition = ReturnItemDisposition = {}));
let SalesReturnItem = class SalesReturnItem {
    id;
    salesReturnId;
    orderItemId;
    productId;
    variantId;
    quantityReturned;
    quantityReceived;
    quantityRestocked;
    uomId;
    unitPrice;
    taxAmount;
    lineTotal;
    refundAmount;
    condition;
    disposition;
    reason;
    inspectionNotes;
    createdAt;
    isRestocked;
    restockedQuantity;
    salesOrderItemId;
    salesOrderItem;
    salesReturn;
    orderItem;
    product;
    variant;
    uom;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, salesReturnId: { required: true, type: () => String }, orderItemId: { required: true, type: () => String }, productId: { required: true, type: () => String }, variantId: { required: true, type: () => String }, quantityReturned: { required: true, type: () => Number }, quantityReceived: { required: true, type: () => Number }, quantityRestocked: { required: true, type: () => Number }, uomId: { required: true, type: () => String }, unitPrice: { required: true, type: () => Number }, taxAmount: { required: true, type: () => Number }, lineTotal: { required: true, type: () => Number }, refundAmount: { required: true, type: () => Number }, condition: { required: true, enum: require("./sales-return-item.entity").ReturnItemCondition }, disposition: { required: true, enum: require("./sales-return-item.entity").ReturnItemDisposition }, reason: { required: true, type: () => String }, inspectionNotes: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, isRestocked: { required: true, type: () => Boolean }, restockedQuantity: { required: true, type: () => Number }, salesOrderItemId: { required: true, type: () => String }, salesOrderItem: { required: true, type: () => require("./sales-order-item.entity").SalesOrderItem }, salesReturn: { required: true, type: () => require("./sales-return.entity").SalesReturn }, orderItem: { required: true, type: () => require("./sales-order-item.entity").SalesOrderItem }, product: { required: true, type: () => require("../inventory/product.entity").Product }, variant: { required: true, type: () => require("../inventory/product-variant.entity").ProductVariant }, uom: { required: true, type: () => require("../inventory/unit-of-measure.entity").UnitOfMeasure } };
    }
};
exports.SalesReturnItem = SalesReturnItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SalesReturnItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sales_return_id' }),
    __metadata("design:type", String)
], SalesReturnItem.prototype, "salesReturnId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_item_id', nullable: true }),
    __metadata("design:type", String)
], SalesReturnItem.prototype, "orderItemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", String)
], SalesReturnItem.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'variant_id', nullable: true }),
    __metadata("design:type", String)
], SalesReturnItem.prototype, "variantId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'quantity_returned',
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], SalesReturnItem.prototype, "quantityReturned", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'quantity_received',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], SalesReturnItem.prototype, "quantityReceived", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'quantity_restocked',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], SalesReturnItem.prototype, "quantityRestocked", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'uom_id' }),
    __metadata("design:type", String)
], SalesReturnItem.prototype, "uomId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'unit_price',
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], SalesReturnItem.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'tax_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], SalesReturnItem.prototype, "taxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'line_total',
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], SalesReturnItem.prototype, "lineTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'refund_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], SalesReturnItem.prototype, "refundAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ReturnItemCondition,
        nullable: true,
    }),
    __metadata("design:type", String)
], SalesReturnItem.prototype, "condition", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ReturnItemDisposition,
        default: ReturnItemDisposition.PENDING,
    }),
    __metadata("design:type", String)
], SalesReturnItem.prototype, "disposition", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SalesReturnItem.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'inspection_notes', type: 'text', nullable: true }),
    __metadata("design:type", String)
], SalesReturnItem.prototype, "inspectionNotes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SalesReturnItem.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_restocked', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], SalesReturnItem.prototype, "isRestocked", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'restocked_quantity',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], SalesReturnItem.prototype, "restockedQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sales_order_item_id', nullable: true }),
    __metadata("design:type", String)
], SalesReturnItem.prototype, "salesOrderItemId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sales_order_item_entity_1.SalesOrderItem),
    (0, typeorm_1.JoinColumn)({ name: 'sales_order_item_id' }),
    __metadata("design:type", sales_order_item_entity_1.SalesOrderItem)
], SalesReturnItem.prototype, "salesOrderItem", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sales_return_entity_1.SalesReturn, (sr) => sr.items, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'sales_return_id' }),
    __metadata("design:type", sales_return_entity_1.SalesReturn)
], SalesReturnItem.prototype, "salesReturn", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sales_order_item_entity_1.SalesOrderItem),
    (0, typeorm_1.JoinColumn)({ name: 'order_item_id' }),
    __metadata("design:type", sales_order_item_entity_1.SalesOrderItem)
], SalesReturnItem.prototype, "orderItem", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], SalesReturnItem.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_variant_entity_1.ProductVariant),
    (0, typeorm_1.JoinColumn)({ name: 'variant_id' }),
    __metadata("design:type", product_variant_entity_1.ProductVariant)
], SalesReturnItem.prototype, "variant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => unit_of_measure_entity_1.UnitOfMeasure),
    (0, typeorm_1.JoinColumn)({ name: 'uom_id' }),
    __metadata("design:type", unit_of_measure_entity_1.UnitOfMeasure)
], SalesReturnItem.prototype, "uom", void 0);
exports.SalesReturnItem = SalesReturnItem = __decorate([
    (0, typeorm_1.Entity)('sales_return_items')
], SalesReturnItem);
//# sourceMappingURL=sales-return-item.entity.js.map