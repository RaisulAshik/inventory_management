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
exports.CreditNote = exports.CreditNoteReason = exports.CreditNoteStatus = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const customer_entity_1 = require("../eCommerce/customer.entity");
const sales_order_entity_1 = require("../eCommerce/sales-order.entity");
const sales_return_entity_1 = require("../eCommerce/sales-return.entity");
var CreditNoteStatus;
(function (CreditNoteStatus) {
    CreditNoteStatus["DRAFT"] = "DRAFT";
    CreditNoteStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    CreditNoteStatus["APPROVED"] = "APPROVED";
    CreditNoteStatus["PARTIALLY_USED"] = "PARTIALLY_USED";
    CreditNoteStatus["FULLY_USED"] = "FULLY_USED";
    CreditNoteStatus["CANCELLED"] = "CANCELLED";
    CreditNoteStatus["EXPIRED"] = "EXPIRED";
})(CreditNoteStatus || (exports.CreditNoteStatus = CreditNoteStatus = {}));
var CreditNoteReason;
(function (CreditNoteReason) {
    CreditNoteReason["SALES_RETURN"] = "SALES_RETURN";
    CreditNoteReason["PRICE_ADJUSTMENT"] = "PRICE_ADJUSTMENT";
    CreditNoteReason["QUALITY_ISSUE"] = "QUALITY_ISSUE";
    CreditNoteReason["BILLING_ERROR"] = "BILLING_ERROR";
    CreditNoteReason["GOODWILL"] = "GOODWILL";
    CreditNoteReason["DAMAGED_GOODS"] = "DAMAGED_GOODS";
    CreditNoteReason["SHORT_DELIVERY"] = "SHORT_DELIVERY";
    CreditNoteReason["OTHER"] = "OTHER";
})(CreditNoteReason || (exports.CreditNoteReason = CreditNoteReason = {}));
let CreditNote = class CreditNote {
    id;
    creditNoteNumber;
    creditNoteDate;
    customerId;
    salesOrderId;
    salesReturnId;
    reason;
    reasonDetails;
    status;
    currency;
    subtotal;
    taxAmount;
    totalAmount;
    usedAmount;
    balanceAmount;
    validUntil;
    journalEntryId;
    notes;
    approvedBy;
    approvedAt;
    createdBy;
    createdAt;
    updatedAt;
    customer;
    salesOrder;
    salesReturn;
    get isExpired() {
        return this.validUntil && new Date(this.validUntil) < new Date();
    }
    get isUsable() {
        return (this.status === CreditNoteStatus.APPROVED &&
            this.balanceAmount > 0 &&
            !this.isExpired);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, creditNoteNumber: { required: true, type: () => String }, creditNoteDate: { required: true, type: () => Date }, customerId: { required: true, type: () => String }, salesOrderId: { required: true, type: () => String }, salesReturnId: { required: true, type: () => String }, reason: { required: true, enum: require("./credit-note.entity").CreditNoteReason }, reasonDetails: { required: true, type: () => String }, status: { required: true, enum: require("./credit-note.entity").CreditNoteStatus }, currency: { required: true, type: () => String }, subtotal: { required: true, type: () => Number }, taxAmount: { required: true, type: () => Number }, totalAmount: { required: true, type: () => Number }, usedAmount: { required: true, type: () => Number }, balanceAmount: { required: true, type: () => Number }, validUntil: { required: true, type: () => Date }, journalEntryId: { required: true, type: () => String }, notes: { required: true, type: () => String }, approvedBy: { required: true, type: () => String }, approvedAt: { required: true, type: () => Date }, createdBy: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, customer: { required: true, type: () => require("../eCommerce/customer.entity").Customer }, salesOrder: { required: true, type: () => require("../eCommerce/sales-order.entity").SalesOrder }, salesReturn: { required: true, type: () => require("../eCommerce/sales-return.entity").SalesReturn } };
    }
};
exports.CreditNote = CreditNote;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CreditNote.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'credit_note_number', length: 50, unique: true }),
    __metadata("design:type", String)
], CreditNote.prototype, "creditNoteNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'credit_note_date', type: 'date' }),
    __metadata("design:type", Date)
], CreditNote.prototype, "creditNoteDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_id' }),
    __metadata("design:type", String)
], CreditNote.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sales_order_id', nullable: true }),
    __metadata("design:type", String)
], CreditNote.prototype, "salesOrderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sales_return_id', nullable: true }),
    __metadata("design:type", String)
], CreditNote.prototype, "salesReturnId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CreditNoteReason,
    }),
    __metadata("design:type", String)
], CreditNote.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reason_details', type: 'text', nullable: true }),
    __metadata("design:type", String)
], CreditNote.prototype, "reasonDetails", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CreditNoteStatus,
        default: CreditNoteStatus.DRAFT,
    }),
    __metadata("design:type", String)
], CreditNote.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 3, default: 'INR' }),
    __metadata("design:type", String)
], CreditNote.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], CreditNote.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'tax_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], CreditNote.prototype, "taxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], CreditNote.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'used_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], CreditNote.prototype, "usedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'balance_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], CreditNote.prototype, "balanceAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'valid_until', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], CreditNote.prototype, "validUntil", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'journal_entry_id', nullable: true }),
    __metadata("design:type", String)
], CreditNote.prototype, "journalEntryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CreditNote.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_by', nullable: true }),
    __metadata("design:type", String)
], CreditNote.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], CreditNote.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", String)
], CreditNote.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], CreditNote.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], CreditNote.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer),
    (0, typeorm_1.JoinColumn)({ name: 'customer_id' }),
    __metadata("design:type", customer_entity_1.Customer)
], CreditNote.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sales_order_entity_1.SalesOrder),
    (0, typeorm_1.JoinColumn)({ name: 'sales_order_id' }),
    __metadata("design:type", sales_order_entity_1.SalesOrder)
], CreditNote.prototype, "salesOrder", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sales_return_entity_1.SalesReturn),
    (0, typeorm_1.JoinColumn)({ name: 'sales_return_id' }),
    __metadata("design:type", sales_return_entity_1.SalesReturn)
], CreditNote.prototype, "salesReturn", void 0);
exports.CreditNote = CreditNote = __decorate([
    (0, typeorm_1.Entity)('credit_notes')
], CreditNote);
//# sourceMappingURL=credit-note.entity.js.map