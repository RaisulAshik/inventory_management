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
exports.DebitNote = exports.DebitNoteReason = exports.DebitNoteStatus = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const supplier_entity_1 = require("../inventory/supplier.entity");
const goods_received_note_entity_1 = require("../purchase/goods-received-note.entity");
const purchase_order_entity_1 = require("../purchase/purchase-order.entity");
const purchase_return_entity_1 = require("../purchase/purchase-return.entity");
var DebitNoteStatus;
(function (DebitNoteStatus) {
    DebitNoteStatus["DRAFT"] = "DRAFT";
    DebitNoteStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    DebitNoteStatus["APPROVED"] = "APPROVED";
    DebitNoteStatus["SENT_TO_SUPPLIER"] = "SENT_TO_SUPPLIER";
    DebitNoteStatus["ACKNOWLEDGED"] = "ACKNOWLEDGED";
    DebitNoteStatus["PARTIALLY_ADJUSTED"] = "PARTIALLY_ADJUSTED";
    DebitNoteStatus["FULLY_ADJUSTED"] = "FULLY_ADJUSTED";
    DebitNoteStatus["CANCELLED"] = "CANCELLED";
    DebitNoteStatus["REJECTED"] = "REJECTED";
})(DebitNoteStatus || (exports.DebitNoteStatus = DebitNoteStatus = {}));
var DebitNoteReason;
(function (DebitNoteReason) {
    DebitNoteReason["PURCHASE_RETURN"] = "PURCHASE_RETURN";
    DebitNoteReason["PRICE_DIFFERENCE"] = "PRICE_DIFFERENCE";
    DebitNoteReason["QUALITY_ISSUE"] = "QUALITY_ISSUE";
    DebitNoteReason["SHORT_RECEIPT"] = "SHORT_RECEIPT";
    DebitNoteReason["DAMAGED_GOODS"] = "DAMAGED_GOODS";
    DebitNoteReason["BILLING_ERROR"] = "BILLING_ERROR";
    DebitNoteReason["OTHER"] = "OTHER";
})(DebitNoteReason || (exports.DebitNoteReason = DebitNoteReason = {}));
let DebitNote = class DebitNote {
    id;
    debitNoteNumber;
    debitNoteDate;
    supplierId;
    purchaseOrderId;
    grnId;
    purchaseReturnId;
    reason;
    reasonDetails;
    status;
    currency;
    subtotal;
    taxAmount;
    totalAmount;
    adjustedAmount;
    balanceAmount;
    supplierAcknowledgementNumber;
    supplierAcknowledgementDate;
    journalEntryId;
    notes;
    approvedBy;
    approvedAt;
    createdBy;
    createdAt;
    updatedAt;
    supplier;
    purchaseOrder;
    grn;
    purchaseReturn;
    get isFullyAdjusted() {
        return Math.abs(this.totalAmount - this.adjustedAmount) < 0.01;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, debitNoteNumber: { required: true, type: () => String }, debitNoteDate: { required: true, type: () => Date }, supplierId: { required: true, type: () => String }, purchaseOrderId: { required: true, type: () => String }, grnId: { required: true, type: () => String }, purchaseReturnId: { required: true, type: () => String }, reason: { required: true, enum: require("./debit-note.entity").DebitNoteReason }, reasonDetails: { required: true, type: () => String }, status: { required: true, enum: require("./debit-note.entity").DebitNoteStatus }, currency: { required: true, type: () => String }, subtotal: { required: true, type: () => Number }, taxAmount: { required: true, type: () => Number }, totalAmount: { required: true, type: () => Number }, adjustedAmount: { required: true, type: () => Number }, balanceAmount: { required: true, type: () => Number }, supplierAcknowledgementNumber: { required: true, type: () => String }, supplierAcknowledgementDate: { required: true, type: () => Date }, journalEntryId: { required: true, type: () => String }, notes: { required: true, type: () => String }, approvedBy: { required: true, type: () => String }, approvedAt: { required: true, type: () => Date }, createdBy: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, supplier: { required: true, type: () => require("../inventory/supplier.entity").Supplier }, purchaseOrder: { required: true, type: () => require("../purchase/purchase-order.entity").PurchaseOrder }, grn: { required: true, type: () => require("../purchase/goods-received-note.entity").GoodsReceivedNote }, purchaseReturn: { required: true, type: () => require("../purchase/purchase-return.entity").PurchaseReturn } };
    }
};
exports.DebitNote = DebitNote;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DebitNote.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'debit_note_number', length: 50, unique: true }),
    __metadata("design:type", String)
], DebitNote.prototype, "debitNoteNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'debit_note_date', type: 'date' }),
    __metadata("design:type", Date)
], DebitNote.prototype, "debitNoteDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supplier_id' }),
    __metadata("design:type", String)
], DebitNote.prototype, "supplierId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'purchase_order_id', nullable: true }),
    __metadata("design:type", String)
], DebitNote.prototype, "purchaseOrderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'grn_id', nullable: true }),
    __metadata("design:type", String)
], DebitNote.prototype, "grnId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'purchase_return_id', nullable: true }),
    __metadata("design:type", String)
], DebitNote.prototype, "purchaseReturnId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: DebitNoteReason,
    }),
    __metadata("design:type", String)
], DebitNote.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reason_details', type: 'text', nullable: true }),
    __metadata("design:type", String)
], DebitNote.prototype, "reasonDetails", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: DebitNoteStatus,
        default: DebitNoteStatus.DRAFT,
    }),
    __metadata("design:type", String)
], DebitNote.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 3, default: 'INR' }),
    __metadata("design:type", String)
], DebitNote.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], DebitNote.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'tax_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], DebitNote.prototype, "taxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], DebitNote.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'adjusted_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], DebitNote.prototype, "adjustedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'balance_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], DebitNote.prototype, "balanceAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'supplier_acknowledgement_number',
        length: 100,
        nullable: true,
    }),
    __metadata("design:type", String)
], DebitNote.prototype, "supplierAcknowledgementNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'supplier_acknowledgement_date',
        type: 'date',
        nullable: true,
    }),
    __metadata("design:type", Date)
], DebitNote.prototype, "supplierAcknowledgementDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'journal_entry_id', nullable: true }),
    __metadata("design:type", String)
], DebitNote.prototype, "journalEntryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], DebitNote.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_by', nullable: true }),
    __metadata("design:type", String)
], DebitNote.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], DebitNote.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", String)
], DebitNote.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], DebitNote.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], DebitNote.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => supplier_entity_1.Supplier),
    (0, typeorm_1.JoinColumn)({ name: 'supplier_id' }),
    __metadata("design:type", supplier_entity_1.Supplier)
], DebitNote.prototype, "supplier", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => purchase_order_entity_1.PurchaseOrder),
    (0, typeorm_1.JoinColumn)({ name: 'purchase_order_id' }),
    __metadata("design:type", purchase_order_entity_1.PurchaseOrder)
], DebitNote.prototype, "purchaseOrder", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => goods_received_note_entity_1.GoodsReceivedNote),
    (0, typeorm_1.JoinColumn)({ name: 'grn_id' }),
    __metadata("design:type", goods_received_note_entity_1.GoodsReceivedNote)
], DebitNote.prototype, "grn", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => purchase_return_entity_1.PurchaseReturn),
    (0, typeorm_1.JoinColumn)({ name: 'purchase_return_id' }),
    __metadata("design:type", purchase_return_entity_1.PurchaseReturn)
], DebitNote.prototype, "purchaseReturn", void 0);
exports.DebitNote = DebitNote = __decorate([
    (0, typeorm_1.Entity)('debit_notes')
], DebitNote);
//# sourceMappingURL=debit-note.entity.js.map