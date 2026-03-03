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
exports.SalesReturn = exports.RefundType = exports.SalesReturnReason = exports.SalesReturnStatus = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const sales_order_entity_1 = require("./sales-order.entity");
const customer_entity_1 = require("./customer.entity");
const warehouse_entity_1 = require("../warehouse/warehouse.entity");
const sales_return_item_entity_1 = require("./sales-return-item.entity");
var SalesReturnStatus;
(function (SalesReturnStatus) {
    SalesReturnStatus["REQUESTED"] = "REQUESTED";
    SalesReturnStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    SalesReturnStatus["APPROVED"] = "APPROVED";
    SalesReturnStatus["REJECTED"] = "REJECTED";
    SalesReturnStatus["RECEIVED"] = "RECEIVED";
    SalesReturnStatus["INSPECTING"] = "INSPECTING";
    SalesReturnStatus["REFUND_PENDING"] = "REFUND_PENDING";
    SalesReturnStatus["REFUNDED"] = "REFUNDED";
    SalesReturnStatus["EXCHANGED"] = "EXCHANGED";
    SalesReturnStatus["COMPLETED"] = "COMPLETED";
    SalesReturnStatus["CANCELLED"] = "CANCELLED";
})(SalesReturnStatus || (exports.SalesReturnStatus = SalesReturnStatus = {}));
var SalesReturnReason;
(function (SalesReturnReason) {
    SalesReturnReason["DEFECTIVE"] = "DEFECTIVE";
    SalesReturnReason["WRONG_ITEM"] = "WRONG_ITEM";
    SalesReturnReason["NOT_AS_DESCRIBED"] = "NOT_AS_DESCRIBED";
    SalesReturnReason["CHANGED_MIND"] = "CHANGED_MIND";
    SalesReturnReason["SIZE_FIT_ISSUE"] = "SIZE_FIT_ISSUE";
    SalesReturnReason["DAMAGED_IN_TRANSIT"] = "DAMAGED_IN_TRANSIT";
    SalesReturnReason["LATE_DELIVERY"] = "LATE_DELIVERY";
    SalesReturnReason["DUPLICATE_ORDER"] = "DUPLICATE_ORDER";
    SalesReturnReason["OTHER"] = "OTHER";
})(SalesReturnReason || (exports.SalesReturnReason = SalesReturnReason = {}));
var RefundType;
(function (RefundType) {
    RefundType["ORIGINAL_PAYMENT"] = "ORIGINAL_PAYMENT";
    RefundType["STORE_CREDIT"] = "STORE_CREDIT";
    RefundType["BANK_TRANSFER"] = "BANK_TRANSFER";
    RefundType["EXCHANGE"] = "EXCHANGE";
})(RefundType || (exports.RefundType = RefundType = {}));
let SalesReturn = class SalesReturn {
    id;
    returnNumber;
    returnDate;
    salesOrderId;
    customerId;
    warehouseId;
    status;
    returnReason;
    reasonDetails;
    refundType;
    currency;
    subtotal;
    taxAmount;
    restockingFee;
    shippingFeeDeduction;
    totalAmount;
    refundAmount;
    isPickupRequired;
    pickupAddress;
    pickupDate;
    trackingNumber;
    receivedDate;
    inspectionNotes;
    customerNotes;
    internalNotes;
    refundTransactionId;
    refundedAt;
    approvedBy;
    approvedAt;
    createdBy;
    createdAt;
    updatedAt;
    salesOrder;
    customer;
    warehouse;
    items;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, returnNumber: { required: true, type: () => String }, returnDate: { required: true, type: () => Date }, salesOrderId: { required: true, type: () => String }, customerId: { required: true, type: () => String }, warehouseId: { required: true, type: () => String }, status: { required: true, enum: require("./sales-return.entity").SalesReturnStatus }, returnReason: { required: true, enum: require("./sales-return.entity").SalesReturnReason }, reasonDetails: { required: true, type: () => String }, refundType: { required: true, enum: require("./sales-return.entity").RefundType }, currency: { required: true, type: () => String }, subtotal: { required: true, type: () => Number }, taxAmount: { required: true, type: () => Number }, restockingFee: { required: true, type: () => Number }, shippingFeeDeduction: { required: true, type: () => Number }, totalAmount: { required: true, type: () => Number }, refundAmount: { required: true, type: () => Number }, isPickupRequired: { required: true, type: () => Boolean }, pickupAddress: { required: true, type: () => String }, pickupDate: { required: true, type: () => Date }, trackingNumber: { required: true, type: () => String }, receivedDate: { required: true, type: () => Date }, inspectionNotes: { required: true, type: () => String }, customerNotes: { required: true, type: () => String }, internalNotes: { required: true, type: () => String }, refundTransactionId: { required: true, type: () => String }, refundedAt: { required: true, type: () => Date }, approvedBy: { required: true, type: () => String }, approvedAt: { required: true, type: () => Date }, createdBy: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, salesOrder: { required: true, type: () => require("./sales-order.entity").SalesOrder }, customer: { required: true, type: () => require("./customer.entity").Customer }, warehouse: { required: true, type: () => require("../warehouse/warehouse.entity").Warehouse }, items: { required: true, type: () => [require("./sales-return-item.entity").SalesReturnItem] } };
    }
};
exports.SalesReturn = SalesReturn;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SalesReturn.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'return_number', length: 50, unique: true }),
    __metadata("design:type", String)
], SalesReturn.prototype, "returnNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'return_date', type: 'date' }),
    __metadata("design:type", Date)
], SalesReturn.prototype, "returnDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sales_order_id' }),
    __metadata("design:type", String)
], SalesReturn.prototype, "salesOrderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_id' }),
    __metadata("design:type", String)
], SalesReturn.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warehouse_id' }),
    __metadata("design:type", String)
], SalesReturn.prototype, "warehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SalesReturnStatus,
        default: SalesReturnStatus.REQUESTED,
    }),
    __metadata("design:type", String)
], SalesReturn.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'return_reason',
        type: 'enum',
        enum: SalesReturnReason,
    }),
    __metadata("design:type", String)
], SalesReturn.prototype, "returnReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reason_details', type: 'text', nullable: true }),
    __metadata("design:type", String)
], SalesReturn.prototype, "reasonDetails", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'refund_type',
        type: 'enum',
        enum: RefundType,
        nullable: true,
    }),
    __metadata("design:type", String)
], SalesReturn.prototype, "refundType", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 3, default: 'INR' }),
    __metadata("design:type", String)
], SalesReturn.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], SalesReturn.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'tax_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], SalesReturn.prototype, "taxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'restocking_fee',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], SalesReturn.prototype, "restockingFee", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'shipping_fee_deduction',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], SalesReturn.prototype, "shippingFeeDeduction", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], SalesReturn.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'refund_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], SalesReturn.prototype, "refundAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_pickup_required', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], SalesReturn.prototype, "isPickupRequired", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pickup_address', type: 'text', nullable: true }),
    __metadata("design:type", String)
], SalesReturn.prototype, "pickupAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pickup_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], SalesReturn.prototype, "pickupDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tracking_number', length: 100, nullable: true }),
    __metadata("design:type", String)
], SalesReturn.prototype, "trackingNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'received_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], SalesReturn.prototype, "receivedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'inspection_notes', type: 'text', nullable: true }),
    __metadata("design:type", String)
], SalesReturn.prototype, "inspectionNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_notes', type: 'text', nullable: true }),
    __metadata("design:type", String)
], SalesReturn.prototype, "customerNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'internal_notes', type: 'text', nullable: true }),
    __metadata("design:type", String)
], SalesReturn.prototype, "internalNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'refund_transaction_id', length: 255, nullable: true }),
    __metadata("design:type", String)
], SalesReturn.prototype, "refundTransactionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'refunded_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], SalesReturn.prototype, "refundedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_by', nullable: true }),
    __metadata("design:type", String)
], SalesReturn.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], SalesReturn.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", String)
], SalesReturn.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SalesReturn.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], SalesReturn.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sales_order_entity_1.SalesOrder),
    (0, typeorm_1.JoinColumn)({ name: 'sales_order_id' }),
    __metadata("design:type", sales_order_entity_1.SalesOrder)
], SalesReturn.prototype, "salesOrder", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer),
    (0, typeorm_1.JoinColumn)({ name: 'customer_id' }),
    __metadata("design:type", customer_entity_1.Customer)
], SalesReturn.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_entity_1.Warehouse),
    (0, typeorm_1.JoinColumn)({ name: 'warehouse_id' }),
    __metadata("design:type", warehouse_entity_1.Warehouse)
], SalesReturn.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sales_return_item_entity_1.SalesReturnItem, (item) => item.salesReturn),
    __metadata("design:type", Array)
], SalesReturn.prototype, "items", void 0);
exports.SalesReturn = SalesReturn = __decorate([
    (0, typeorm_1.Entity)('sales_returns')
], SalesReturn);
//# sourceMappingURL=sales-return.entity.js.map