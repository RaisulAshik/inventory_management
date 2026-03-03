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
exports.Quotation = exports.QuotationStatus = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const quotation_item_entity_1 = require("./quotation-item.entity");
const customer_entity_1 = require("../eCommerce/customer.entity");
const warehouse_entity_1 = require("../warehouse/warehouse.entity");
var QuotationStatus;
(function (QuotationStatus) {
    QuotationStatus["DRAFT"] = "DRAFT";
    QuotationStatus["SENT"] = "SENT";
    QuotationStatus["ACCEPTED"] = "ACCEPTED";
    QuotationStatus["REJECTED"] = "REJECTED";
    QuotationStatus["EXPIRED"] = "EXPIRED";
    QuotationStatus["CONVERTED"] = "CONVERTED";
    QuotationStatus["CANCELLED"] = "CANCELLED";
})(QuotationStatus || (exports.QuotationStatus = QuotationStatus = {}));
let Quotation = class Quotation {
    id;
    quotationNumber;
    customerId;
    customer;
    warehouseId;
    warehouse;
    quotationDate;
    validUntil;
    status;
    currency;
    subtotal;
    discountType;
    discountValue;
    discountAmount;
    taxAmount;
    shippingAmount;
    totalAmount;
    billingAddressId;
    shippingAddressId;
    referenceNumber;
    salesPersonId;
    paymentTermsId;
    salesOrderId;
    salesOrderNumber;
    notes;
    internalNotes;
    termsAndConditions;
    rejectionReason;
    createdBy;
    updatedBy;
    createdAt;
    updatedAt;
    items;
    get isExpired() {
        if (!this.validUntil)
            return false;
        return new Date() > new Date(this.validUntil);
    }
    get isConverted() {
        return this.status === QuotationStatus.CONVERTED && !!this.salesOrderId;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, quotationNumber: { required: true, type: () => String }, customerId: { required: true, type: () => String }, customer: { required: true, type: () => require("../eCommerce/customer.entity").Customer }, warehouseId: { required: true, type: () => String }, warehouse: { required: true, type: () => require("../warehouse/warehouse.entity").Warehouse }, quotationDate: { required: true, type: () => Date }, validUntil: { required: true, type: () => Date }, status: { required: true, enum: require("./quotation.entity").QuotationStatus }, currency: { required: true, type: () => String }, subtotal: { required: true, type: () => Number }, discountType: { required: true, type: () => String }, discountValue: { required: true, type: () => Number }, discountAmount: { required: true, type: () => Number }, taxAmount: { required: true, type: () => Number }, shippingAmount: { required: true, type: () => Number }, totalAmount: { required: true, type: () => Number }, billingAddressId: { required: true, type: () => String }, shippingAddressId: { required: true, type: () => String }, referenceNumber: { required: true, type: () => String }, salesPersonId: { required: true, type: () => String }, paymentTermsId: { required: true, type: () => String }, salesOrderId: { required: true, type: () => String }, salesOrderNumber: { required: true, type: () => String }, notes: { required: true, type: () => String }, internalNotes: { required: true, type: () => String }, termsAndConditions: { required: true, type: () => String }, rejectionReason: { required: true, type: () => String }, createdBy: { required: true, type: () => String }, updatedBy: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, items: { required: true, type: () => [require("./quotation-item.entity").QuotationItem] } };
    }
};
exports.Quotation = Quotation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Quotation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_quotation_number', { unique: true }),
    (0, typeorm_1.Column)({ name: 'quotation_number', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Quotation.prototype, "quotationNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], Quotation.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer),
    (0, typeorm_1.JoinColumn)({ name: 'customer_id' }),
    __metadata("design:type", customer_entity_1.Customer)
], Quotation.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warehouse_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], Quotation.prototype, "warehouseId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_entity_1.Warehouse),
    (0, typeorm_1.JoinColumn)({ name: 'warehouse_id' }),
    __metadata("design:type", warehouse_entity_1.Warehouse)
], Quotation.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quotation_date', type: 'date' }),
    __metadata("design:type", Date)
], Quotation.prototype, "quotationDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'valid_until', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Quotation.prototype, "validUntil", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: QuotationStatus,
        default: QuotationStatus.DRAFT,
    }),
    __metadata("design:type", String)
], Quotation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'char', length: 3, default: 'INR' }),
    __metadata("design:type", String)
], Quotation.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], Quotation.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'discount_type',
        type: 'enum',
        enum: ['PERCENTAGE', 'FIXED'],
        default: 'FIXED',
    }),
    __metadata("design:type", String)
], Quotation.prototype, "discountType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'discount_value',
        type: 'decimal',
        precision: 15,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], Quotation.prototype, "discountValue", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'discount_amount',
        type: 'decimal',
        precision: 15,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], Quotation.prototype, "discountAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'tax_amount',
        type: 'decimal',
        precision: 15,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], Quotation.prototype, "taxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'shipping_amount',
        type: 'decimal',
        precision: 15,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], Quotation.prototype, "shippingAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_amount',
        type: 'decimal',
        precision: 15,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], Quotation.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'billing_address_id',
        type: 'char',
        length: 36,
        nullable: true,
    }),
    __metadata("design:type", String)
], Quotation.prototype, "billingAddressId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'shipping_address_id',
        type: 'char',
        length: 36,
        nullable: true,
    }),
    __metadata("design:type", String)
], Quotation.prototype, "shippingAddressId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'reference_number',
        type: 'varchar',
        length: 100,
        nullable: true,
    }),
    __metadata("design:type", String)
], Quotation.prototype, "referenceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sales_person_id', type: 'char', length: 36, nullable: true }),
    __metadata("design:type", String)
], Quotation.prototype, "salesPersonId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'payment_terms_id',
        type: 'char',
        length: 36,
        nullable: true,
    }),
    __metadata("design:type", String)
], Quotation.prototype, "paymentTermsId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sales_order_id', type: 'char', length: 36, nullable: true }),
    __metadata("design:type", String)
], Quotation.prototype, "salesOrderId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'sales_order_number',
        type: 'varchar',
        length: 50,
        nullable: true,
    }),
    __metadata("design:type", String)
], Quotation.prototype, "salesOrderNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Quotation.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'internal_notes', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Quotation.prototype, "internalNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'terms_and_conditions', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Quotation.prototype, "termsAndConditions", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rejection_reason', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Quotation.prototype, "rejectionReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'char', length: 36, nullable: true }),
    __metadata("design:type", String)
], Quotation.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_by', type: 'char', length: 36, nullable: true }),
    __metadata("design:type", String)
], Quotation.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Quotation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Quotation.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => quotation_item_entity_1.QuotationItem, (item) => item.quotation, { cascade: true }),
    __metadata("design:type", Array)
], Quotation.prototype, "items", void 0);
exports.Quotation = Quotation = __decorate([
    (0, typeorm_1.Entity)('quotations')
], Quotation);
//# sourceMappingURL=quotation.entity.js.map