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
exports.SalesOrder = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const enums_1 = require("../../../common/enums");
const customer_entity_1 = require("./customer.entity");
const sales_order_item_entity_1 = require("./sales-order-item.entity");
const warehouse_entity_1 = require("../warehouse/warehouse.entity");
const coupon_entity_1 = require("./coupon.entity");
const order_payment_entity_1 = require("./order-payment.entity");
let SalesOrder = class SalesOrder {
    id;
    orderNumber;
    orderDate;
    createdBy;
    createdAt;
    deliveredAt;
    orderSource;
    customerId;
    customerName;
    customerEmail;
    notes;
    customerPhone;
    warehouseId;
    storeId;
    shippedAt;
    shippedBy;
    trackingNumber;
    shippingCarrier;
    status;
    paymentStatus;
    fulfillmentStatus;
    currency;
    exchangeRate;
    subtotal;
    discountPercentage;
    discountType;
    discountValue;
    discountAmount;
    couponId;
    couponCode;
    couponDiscount;
    taxAmount;
    shippingAmount;
    shippingTax;
    otherCharges;
    roundingAdjustment;
    totalAmount;
    paidAmount;
    refundedAmount;
    billingName;
    billingPhone;
    billingAddressLine1;
    billingAddressLine2;
    billingCity;
    billingState;
    billingCountry;
    billingPostalCode;
    shippingName;
    shippingPhone;
    shippingAddressLine1;
    shippingAddressLine2;
    shippingCity;
    shippingState;
    shippingCountry;
    shippingPostalCode;
    shippingMethodId;
    shippingMethodName;
    expectedDeliveryDate;
    actualDeliveryDate;
    customerNotes;
    internalNotes;
    cancellationReason;
    cancelledAt;
    cancelledBy;
    confirmedBy;
    confirmedAt;
    updatedAt;
    paymentTermsDays;
    customer;
    warehouse;
    coupon;
    items;
    payments;
    get balanceAmount() {
        return this.totalAmount - this.paidAmount + this.refundedAmount;
    }
    get itemCount() {
        return this.items?.length || 0;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, orderNumber: { required: true, type: () => String }, orderDate: { required: true, type: () => Date }, createdBy: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, deliveredAt: { required: false, type: () => Date }, orderSource: { required: true, enum: require("../../../common/enums/index").OrderSource }, customerId: { required: true, type: () => String }, customerName: { required: true, type: () => String }, customerEmail: { required: true, type: () => String }, notes: { required: true, type: () => String }, customerPhone: { required: true, type: () => String }, warehouseId: { required: true, type: () => String }, storeId: { required: true, type: () => String }, shippedAt: { required: true, type: () => Date }, shippedBy: { required: true, type: () => String }, trackingNumber: { required: true, type: () => String }, shippingCarrier: { required: true, type: () => String }, status: { required: true, enum: require("../../../common/enums/index").SalesOrderStatus }, paymentStatus: { required: true, enum: require("../../../common/enums/index").PaymentStatus }, fulfillmentStatus: { required: true, enum: require("../../../common/enums/index").FulfillmentStatus }, currency: { required: true, type: () => String }, exchangeRate: { required: true, type: () => Number }, subtotal: { required: true, type: () => Number }, discountPercentage: { required: true, type: () => Number }, discountType: { required: true, type: () => Object }, discountValue: { required: true, type: () => Number }, discountAmount: { required: true, type: () => Number }, couponId: { required: true, type: () => String }, couponCode: { required: true, type: () => String }, couponDiscount: { required: true, type: () => Number }, taxAmount: { required: true, type: () => Number }, shippingAmount: { required: true, type: () => Number }, shippingTax: { required: true, type: () => Number }, otherCharges: { required: true, type: () => Number }, roundingAdjustment: { required: true, type: () => Number }, totalAmount: { required: true, type: () => Number }, paidAmount: { required: true, type: () => Number }, refundedAmount: { required: true, type: () => Number }, billingName: { required: true, type: () => String }, billingPhone: { required: true, type: () => String }, billingAddressLine1: { required: true, type: () => String }, billingAddressLine2: { required: true, type: () => String }, billingCity: { required: true, type: () => String }, billingState: { required: true, type: () => String }, billingCountry: { required: true, type: () => String }, billingPostalCode: { required: true, type: () => String }, shippingName: { required: true, type: () => String }, shippingPhone: { required: true, type: () => String }, shippingAddressLine1: { required: true, type: () => String }, shippingAddressLine2: { required: true, type: () => String }, shippingCity: { required: true, type: () => String }, shippingState: { required: true, type: () => String }, shippingCountry: { required: true, type: () => String }, shippingPostalCode: { required: true, type: () => String }, shippingMethodId: { required: true, type: () => String }, shippingMethodName: { required: true, type: () => String }, expectedDeliveryDate: { required: true, type: () => Date }, actualDeliveryDate: { required: true, type: () => Date }, customerNotes: { required: true, type: () => String }, internalNotes: { required: true, type: () => String }, cancellationReason: { required: true, type: () => String }, cancelledAt: { required: true, type: () => Date }, cancelledBy: { required: true, type: () => String }, confirmedBy: { required: true, type: () => String }, confirmedAt: { required: false, type: () => Date }, updatedAt: { required: true, type: () => Date }, paymentTermsDays: { required: true, type: () => Number }, customer: { required: true, type: () => require("./customer.entity").Customer }, warehouse: { required: true, type: () => require("../warehouse/warehouse.entity").Warehouse }, coupon: { required: true, type: () => require("./coupon.entity").Coupon }, items: { required: true, type: () => [require("./sales-order-item.entity").SalesOrderItem] }, payments: { required: true, type: () => [require("./order-payment.entity").OrderPayment] } };
    }
};
exports.SalesOrder = SalesOrder;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SalesOrder.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_number', length: 50, unique: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "orderNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_date', type: 'timestamp' }),
    __metadata("design:type", Date)
], SalesOrder.prototype, "orderDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SalesOrder.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'delivered_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], SalesOrder.prototype, "deliveredAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'order_source',
        type: 'enum',
        enum: enums_1.OrderSource,
        default: enums_1.OrderSource.WEBSITE,
    }),
    __metadata("design:type", String)
], SalesOrder.prototype, "orderSource", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_id', nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_name', length: 200, nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "customerName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_email', length: 255, nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "customerEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'note', length: 255, nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_phone', length: 50, nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "customerPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warehouse_id' }),
    __metadata("design:type", String)
], SalesOrder.prototype, "warehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'store_id', nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "storeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipped_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], SalesOrder.prototype, "shippedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipped_by', nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "shippedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tracking_number', length: 100, nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "trackingNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_carrier', length: 100, nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "shippingCarrier", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.SalesOrderStatus,
        default: enums_1.SalesOrderStatus.PENDING,
    }),
    __metadata("design:type", String)
], SalesOrder.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'payment_status',
        type: 'enum',
        enum: enums_1.PaymentStatus,
        default: enums_1.PaymentStatus.UNPAID,
    }),
    __metadata("design:type", String)
], SalesOrder.prototype, "paymentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'fulfillment_status',
        type: 'enum',
        enum: enums_1.FulfillmentStatus,
        default: enums_1.FulfillmentStatus.UNFULFILLED,
    }),
    __metadata("design:type", String)
], SalesOrder.prototype, "fulfillmentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 3, default: 'INR' }),
    __metadata("design:type", String)
], SalesOrder.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'exchange_rate',
        type: 'decimal',
        precision: 12,
        scale: 6,
        default: 1,
    }),
    __metadata("design:type", Number)
], SalesOrder.prototype, "exchangeRate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], SalesOrder.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], SalesOrder.prototype, "discountPercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'discount_type',
        type: 'enum',
        enum: ['PERCENTAGE', 'FIXED'],
        nullable: true,
    }),
    __metadata("design:type", String)
], SalesOrder.prototype, "discountType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'discount_value',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], SalesOrder.prototype, "discountValue", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'discount_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], SalesOrder.prototype, "discountAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'coupon_id', nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "couponId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'coupon_code', length: 50, nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "couponCode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'coupon_discount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], SalesOrder.prototype, "couponDiscount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'tax_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], SalesOrder.prototype, "taxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'shipping_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], SalesOrder.prototype, "shippingAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'shipping_tax',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], SalesOrder.prototype, "shippingTax", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'other_charges',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], SalesOrder.prototype, "otherCharges", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'rounding_adjustment',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], SalesOrder.prototype, "roundingAdjustment", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], SalesOrder.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'paid_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], SalesOrder.prototype, "paidAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'refunded_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], SalesOrder.prototype, "refundedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'billing_name', length: 200, nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "billingName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'billing_phone', length: 50, nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "billingPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'billing_address_line1', length: 255, nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "billingAddressLine1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'billing_address_line2', length: 255, nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "billingAddressLine2", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'billing_city', length: 100, nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "billingCity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'billing_state', length: 100, nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "billingState", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'billing_country', length: 100, nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "billingCountry", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'billing_postal_code', length: 20, nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "billingPostalCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_name', length: 200, nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "shippingName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_phone', length: 50, nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "shippingPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_address_line1', length: 255, nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "shippingAddressLine1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_address_line2', length: 255, nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "shippingAddressLine2", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_city', length: 100, nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "shippingCity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_state', length: 100, nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "shippingState", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_country', length: 100, nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "shippingCountry", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_postal_code', length: 20, nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "shippingPostalCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_method_id', nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "shippingMethodId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_method_name', length: 200, nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "shippingMethodName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expected_delivery_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], SalesOrder.prototype, "expectedDeliveryDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'actual_delivery_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], SalesOrder.prototype, "actualDeliveryDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_notes', type: 'text', nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "customerNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'internal_notes', type: 'text', nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "internalNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cancellation_reason', type: 'text', nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "cancellationReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cancelled_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], SalesOrder.prototype, "cancelledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cancelled_by', nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "cancelledBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'confirmed_by', nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "confirmedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'confirmed_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], SalesOrder.prototype, "confirmedAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], SalesOrder.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_terms_days', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], SalesOrder.prototype, "paymentTermsDays", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer, (customer) => customer.orders),
    (0, typeorm_1.JoinColumn)({ name: 'customer_id' }),
    __metadata("design:type", customer_entity_1.Customer)
], SalesOrder.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_entity_1.Warehouse),
    (0, typeorm_1.JoinColumn)({ name: 'warehouse_id' }),
    __metadata("design:type", warehouse_entity_1.Warehouse)
], SalesOrder.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => coupon_entity_1.Coupon),
    (0, typeorm_1.JoinColumn)({ name: 'coupon_id' }),
    __metadata("design:type", coupon_entity_1.Coupon)
], SalesOrder.prototype, "coupon", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sales_order_item_entity_1.SalesOrderItem, (item) => item.salesOrder),
    __metadata("design:type", Array)
], SalesOrder.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_payment_entity_1.OrderPayment, (payment) => payment.order),
    __metadata("design:type", Array)
], SalesOrder.prototype, "payments", void 0);
exports.SalesOrder = SalesOrder = __decorate([
    (0, typeorm_1.Entity)('sales_orders')
], SalesOrder);
//# sourceMappingURL=sales-order.entity.js.map