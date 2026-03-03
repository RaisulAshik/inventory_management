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
exports.PurchaseReturn = exports.PurchaseReturnStatus = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const purchase_order_entity_1 = require("./purchase-order.entity");
const purchase_return_item_entity_1 = require("./purchase-return-item.entity");
const supplier_entity_1 = require("../inventory/supplier.entity");
const warehouse_entity_1 = require("../warehouse/warehouse.entity");
const goods_received_note_entity_1 = require("./goods-received-note.entity");
var PurchaseReturnStatus;
(function (PurchaseReturnStatus) {
    PurchaseReturnStatus["DRAFT"] = "DRAFT";
    PurchaseReturnStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    PurchaseReturnStatus["APPROVED"] = "APPROVED";
    PurchaseReturnStatus["REJECTED"] = "REJECTED";
    PurchaseReturnStatus["SHIPPED"] = "SHIPPED";
    PurchaseReturnStatus["RECEIVED_BY_SUPPLIER"] = "RECEIVED_BY_SUPPLIER";
    PurchaseReturnStatus["CREDIT_NOTE_RECEIVED"] = "CREDIT_NOTE_RECEIVED";
    PurchaseReturnStatus["COMPLETED"] = "COMPLETED";
    PurchaseReturnStatus["CANCELLED"] = "CANCELLED";
})(PurchaseReturnStatus || (exports.PurchaseReturnStatus = PurchaseReturnStatus = {}));
let PurchaseReturn = class PurchaseReturn {
    id;
    returnNumber;
    purchaseOrderId;
    grnId;
    supplierId;
    warehouseId;
    returnDate;
    status;
    returnType;
    reason;
    reasonDetails;
    currency;
    subtotal;
    taxAmount;
    totalAmount;
    trackingNumber;
    creditNoteNumber;
    creditNoteAmount;
    creditNoteDate;
    approvedBy;
    approvedAt;
    shippedBy;
    shippedAt;
    receivedBySupplierAt;
    rejectionReason;
    notes;
    createdBy;
    updatedBy;
    createdAt;
    updatedAt;
    supplier;
    warehouse;
    purchaseOrder;
    grn;
    items;
    get itemCount() {
        return this.items?.length || 0;
    }
    get totalQuantity() {
        return (this.items?.reduce((sum, item) => sum + Number(item.quantity), 0) || 0);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, returnNumber: { required: true, type: () => String }, purchaseOrderId: { required: true, type: () => String }, grnId: { required: true, type: () => String }, supplierId: { required: true, type: () => String }, warehouseId: { required: true, type: () => String }, returnDate: { required: true, type: () => Date }, status: { required: true, enum: require("./purchase-return.entity").PurchaseReturnStatus }, returnType: { required: true, type: () => String }, reason: { required: true, type: () => String }, reasonDetails: { required: true, type: () => String }, currency: { required: true, type: () => String }, subtotal: { required: true, type: () => Number }, taxAmount: { required: true, type: () => Number }, totalAmount: { required: true, type: () => Number }, trackingNumber: { required: true, type: () => String }, creditNoteNumber: { required: true, type: () => String }, creditNoteAmount: { required: true, type: () => Number }, creditNoteDate: { required: true, type: () => Date }, approvedBy: { required: true, type: () => String }, approvedAt: { required: true, type: () => Date }, shippedBy: { required: true, type: () => String }, shippedAt: { required: true, type: () => Date }, receivedBySupplierAt: { required: true, type: () => Date }, rejectionReason: { required: true, type: () => String }, notes: { required: true, type: () => String }, createdBy: { required: true, type: () => String }, updatedBy: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, supplier: { required: true, type: () => require("../inventory/supplier.entity").Supplier }, warehouse: { required: true, type: () => require("../warehouse/warehouse.entity").Warehouse }, purchaseOrder: { required: true, type: () => require("./purchase-order.entity").PurchaseOrder }, grn: { required: true, type: () => require("./goods-received-note.entity").GoodsReceivedNote }, items: { required: true, type: () => [require("./purchase-return-item.entity").PurchaseReturnItem] } };
    }
};
exports.PurchaseReturn = PurchaseReturn;
__decorate([
    (0, typeorm_1.PrimaryColumn)('char', { length: 36 }),
    __metadata("design:type", String)
], PurchaseReturn.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'return_number', length: 50 }),
    __metadata("design:type", String)
], PurchaseReturn.prototype, "returnNumber", void 0);
__decorate([
    (0, typeorm_1.Column)('char', { name: 'purchase_order_id', length: 36, nullable: true }),
    __metadata("design:type", String)
], PurchaseReturn.prototype, "purchaseOrderId", void 0);
__decorate([
    (0, typeorm_1.Column)('char', { name: 'grn_id', length: 36, nullable: true }),
    __metadata("design:type", String)
], PurchaseReturn.prototype, "grnId", void 0);
__decorate([
    (0, typeorm_1.Column)('char', { name: 'supplier_id', length: 36 }),
    __metadata("design:type", String)
], PurchaseReturn.prototype, "supplierId", void 0);
__decorate([
    (0, typeorm_1.Column)('char', { name: 'warehouse_id', length: 36 }),
    __metadata("design:type", String)
], PurchaseReturn.prototype, "warehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)('date', { name: 'return_date' }),
    __metadata("design:type", Date)
], PurchaseReturn.prototype, "returnDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PurchaseReturnStatus,
        default: PurchaseReturnStatus.DRAFT,
    }),
    __metadata("design:type", String)
], PurchaseReturn.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'return_type', length: 50 }),
    __metadata("design:type", String)
], PurchaseReturn.prototype, "returnType", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 500 }),
    __metadata("design:type", String)
], PurchaseReturn.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'reason_details', nullable: true }),
    __metadata("design:type", String)
], PurchaseReturn.prototype, "reasonDetails", void 0);
__decorate([
    (0, typeorm_1.Column)('char', { length: 3, default: 'INR' }),
    __metadata("design:type", String)
], PurchaseReturn.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], PurchaseReturn.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', {
        name: 'tax_amount',
        precision: 15,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], PurchaseReturn.prototype, "taxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', {
        name: 'total_amount',
        precision: 15,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], PurchaseReturn.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'tracking_number', length: 100, nullable: true }),
    __metadata("design:type", String)
], PurchaseReturn.prototype, "trackingNumber", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'credit_note_number',
        length: 100,
        nullable: true,
    }),
    __metadata("design:type", String)
], PurchaseReturn.prototype, "creditNoteNumber", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', {
        name: 'credit_note_amount',
        precision: 15,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], PurchaseReturn.prototype, "creditNoteAmount", void 0);
__decorate([
    (0, typeorm_1.Column)('date', { name: 'credit_note_date', nullable: true }),
    __metadata("design:type", Date)
], PurchaseReturn.prototype, "creditNoteDate", void 0);
__decorate([
    (0, typeorm_1.Column)('char', { name: 'approved_by', length: 36, nullable: true }),
    __metadata("design:type", String)
], PurchaseReturn.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { name: 'approved_at', nullable: true }),
    __metadata("design:type", Date)
], PurchaseReturn.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)('char', { name: 'shipped_by', length: 36, nullable: true }),
    __metadata("design:type", String)
], PurchaseReturn.prototype, "shippedBy", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { name: 'shipped_at', nullable: true }),
    __metadata("design:type", Date)
], PurchaseReturn.prototype, "shippedAt", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { name: 'received_by_supplier_at', nullable: true }),
    __metadata("design:type", Date)
], PurchaseReturn.prototype, "receivedBySupplierAt", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'rejection_reason', length: 500, nullable: true }),
    __metadata("design:type", String)
], PurchaseReturn.prototype, "rejectionReason", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], PurchaseReturn.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)('char', { name: 'created_by', length: 36, nullable: true }),
    __metadata("design:type", String)
], PurchaseReturn.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)('char', { name: 'updated_by', length: 36, nullable: true }),
    __metadata("design:type", String)
], PurchaseReturn.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PurchaseReturn.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], PurchaseReturn.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => supplier_entity_1.Supplier),
    (0, typeorm_1.JoinColumn)({ name: 'supplier_id' }),
    __metadata("design:type", supplier_entity_1.Supplier)
], PurchaseReturn.prototype, "supplier", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_entity_1.Warehouse),
    (0, typeorm_1.JoinColumn)({ name: 'warehouse_id' }),
    __metadata("design:type", warehouse_entity_1.Warehouse)
], PurchaseReturn.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => purchase_order_entity_1.PurchaseOrder),
    (0, typeorm_1.JoinColumn)({ name: 'purchase_order_id' }),
    __metadata("design:type", purchase_order_entity_1.PurchaseOrder)
], PurchaseReturn.prototype, "purchaseOrder", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => goods_received_note_entity_1.GoodsReceivedNote),
    (0, typeorm_1.JoinColumn)({ name: 'grn_id' }),
    __metadata("design:type", goods_received_note_entity_1.GoodsReceivedNote)
], PurchaseReturn.prototype, "grn", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => purchase_return_item_entity_1.PurchaseReturnItem, (item) => item.purchaseReturn, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], PurchaseReturn.prototype, "items", void 0);
exports.PurchaseReturn = PurchaseReturn = __decorate([
    (0, typeorm_1.Entity)('purchase_returns'),
    (0, typeorm_1.Index)(['returnNumber'], { unique: true }),
    (0, typeorm_1.Index)(['supplierId', 'returnDate']),
    (0, typeorm_1.Index)(['status'])
], PurchaseReturn);
//# sourceMappingURL=purchase-return.entity.js.map