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
exports.PurchaseOrder = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const enums_1 = require("../../../common/enums");
const supplier_entity_1 = require("../inventory/supplier.entity");
const warehouse_entity_1 = require("../warehouse/warehouse.entity");
const purchase_order_item_entity_1 = require("./purchase-order-item.entity");
let PurchaseOrder = class PurchaseOrder {
    id;
    poNumber;
    supplierId;
    warehouseId;
    poDate;
    orderDate;
    expectedDate;
    status;
    currency;
    exchangeRate;
    subtotal;
    discountType;
    discountValue;
    discountAmount;
    taxAmount;
    shippingAmount;
    otherCharges;
    totalAmount;
    paidAmount;
    paymentStatus;
    paymentTermsDays;
    paymentDueDate;
    billingAddressLine1;
    billingAddressLine2;
    billingCity;
    billingState;
    billingCountry;
    billingPostalCode;
    shippingAddressLine1;
    shippingAddressLine2;
    shippingCity;
    shippingState;
    shippingCountry;
    shippingPostalCode;
    notes;
    internalNotes;
    termsAndConditions;
    approvedBy;
    approvedAt;
    acknowledgedAt;
    supplierReferenceNumber;
    sentAt;
    sentBy;
    cancelledAt;
    cancelledBy;
    createdBy;
    cancellationReason;
    createdAt;
    updatedAt;
    supplier;
    warehouse;
    items;
    get balanceAmount() {
        return this.totalAmount - this.paidAmount;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, poNumber: { required: true, type: () => String }, supplierId: { required: true, type: () => String }, warehouseId: { required: true, type: () => String }, poDate: { required: true, type: () => Date }, orderDate: { required: true, type: () => Date }, expectedDate: { required: true, type: () => Date }, status: { required: true, enum: require("../../../common/enums/index").PurchaseOrderStatus }, currency: { required: true, type: () => String }, exchangeRate: { required: true, type: () => Number }, subtotal: { required: true, type: () => Number }, discountType: { required: true, type: () => Object }, discountValue: { required: true, type: () => Number }, discountAmount: { required: true, type: () => Number }, taxAmount: { required: true, type: () => Number }, shippingAmount: { required: true, type: () => Number }, otherCharges: { required: true, type: () => Number }, totalAmount: { required: true, type: () => Number }, paidAmount: { required: true, type: () => Number }, paymentStatus: { required: true, enum: require("../../../common/enums/index").PaymentStatus }, paymentTermsDays: { required: true, type: () => Number }, paymentDueDate: { required: true, type: () => Date }, billingAddressLine1: { required: true, type: () => String }, billingAddressLine2: { required: true, type: () => String }, billingCity: { required: true, type: () => String }, billingState: { required: true, type: () => String }, billingCountry: { required: true, type: () => String }, billingPostalCode: { required: true, type: () => String }, shippingAddressLine1: { required: true, type: () => String }, shippingAddressLine2: { required: true, type: () => String }, shippingCity: { required: true, type: () => String }, shippingState: { required: true, type: () => String }, shippingCountry: { required: true, type: () => String }, shippingPostalCode: { required: true, type: () => String }, notes: { required: true, type: () => String }, internalNotes: { required: true, type: () => String }, termsAndConditions: { required: true, type: () => String }, approvedBy: { required: true, type: () => String }, approvedAt: { required: true, type: () => Date }, acknowledgedAt: { required: true, type: () => Date }, supplierReferenceNumber: { required: true, type: () => String }, sentAt: { required: true, type: () => Date }, sentBy: { required: true, type: () => String }, cancelledAt: { required: true, type: () => Date }, cancelledBy: { required: true, type: () => String }, createdBy: { required: true, type: () => String }, cancellationReason: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, supplier: { required: true, type: () => require("../inventory/supplier.entity").Supplier }, warehouse: { required: true, type: () => require("../warehouse/warehouse.entity").Warehouse }, items: { required: true, type: () => [require("./purchase-order-item.entity").PurchaseOrderItem] } };
    }
};
exports.PurchaseOrder = PurchaseOrder;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'po_number', length: 50, unique: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "poNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supplier_id' }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "supplierId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warehouse_id' }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "warehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'po_date', type: 'date' }),
    __metadata("design:type", Date)
], PurchaseOrder.prototype, "poDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_date', type: 'date' }),
    __metadata("design:type", Date)
], PurchaseOrder.prototype, "orderDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expected_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], PurchaseOrder.prototype, "expectedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.PurchaseOrderStatus,
        default: enums_1.PurchaseOrderStatus.DRAFT,
    }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 3, default: 'INR' }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'exchange_rate',
        type: 'decimal',
        precision: 12,
        scale: 6,
        default: 1,
    }),
    __metadata("design:type", Number)
], PurchaseOrder.prototype, "exchangeRate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], PurchaseOrder.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'discount_type',
        type: 'enum',
        enum: ['PERCENTAGE', 'FIXED'],
        nullable: true,
    }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "discountType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'discount_value',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], PurchaseOrder.prototype, "discountValue", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'discount_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], PurchaseOrder.prototype, "discountAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'tax_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], PurchaseOrder.prototype, "taxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'shipping_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], PurchaseOrder.prototype, "shippingAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'other_charges',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], PurchaseOrder.prototype, "otherCharges", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], PurchaseOrder.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'paid_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], PurchaseOrder.prototype, "paidAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'payment_status',
        type: 'enum',
        enum: enums_1.PaymentStatus,
        default: enums_1.PaymentStatus.UNPAID,
    }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "paymentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_terms_days', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], PurchaseOrder.prototype, "paymentTermsDays", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_due_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], PurchaseOrder.prototype, "paymentDueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'billing_address_line1', length: 255, nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "billingAddressLine1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'billing_address_line2', length: 255, nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "billingAddressLine2", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'billing_city', length: 100, nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "billingCity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'billing_state', length: 100, nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "billingState", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'billing_country', length: 100, nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "billingCountry", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'billing_postal_code', length: 20, nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "billingPostalCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_address_line1', length: 255, nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "shippingAddressLine1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_address_line2', length: 255, nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "shippingAddressLine2", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_city', length: 100, nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "shippingCity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_state', length: 100, nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "shippingState", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_country', length: 100, nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "shippingCountry", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_postal_code', length: 20, nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "shippingPostalCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'internal_notes', type: 'text', nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "internalNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'terms_and_conditions', type: 'text', nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "termsAndConditions", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_by', nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], PurchaseOrder.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'acknowledged_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], PurchaseOrder.prototype, "acknowledgedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supplier_reference_number', nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "supplierReferenceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sent_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], PurchaseOrder.prototype, "sentAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sent_by', nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "sentBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cancelled_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], PurchaseOrder.prototype, "cancelledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cancelled_by', nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "cancelledBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cancellation_reason', nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "cancellationReason", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PurchaseOrder.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], PurchaseOrder.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => supplier_entity_1.Supplier, (supplier) => supplier.purchaseOrders),
    (0, typeorm_1.JoinColumn)({ name: 'supplier_id' }),
    __metadata("design:type", supplier_entity_1.Supplier)
], PurchaseOrder.prototype, "supplier", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_entity_1.Warehouse),
    (0, typeorm_1.JoinColumn)({ name: 'warehouse_id' }),
    __metadata("design:type", warehouse_entity_1.Warehouse)
], PurchaseOrder.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => purchase_order_item_entity_1.PurchaseOrderItem, (item) => item.purchaseOrder),
    __metadata("design:type", Array)
], PurchaseOrder.prototype, "items", void 0);
exports.PurchaseOrder = PurchaseOrder = __decorate([
    (0, typeorm_1.Entity)('purchase_orders')
], PurchaseOrder);
//# sourceMappingURL=purchase-order.entity.js.map