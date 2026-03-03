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
exports.SupplierDue = exports.SupplierDueReferenceType = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const enums_1 = require("../../../common/enums");
const supplier_entity_1 = require("../inventory/supplier.entity");
var SupplierDueReferenceType;
(function (SupplierDueReferenceType) {
    SupplierDueReferenceType["PURCHASE_ORDER"] = "PURCHASE_ORDER";
    SupplierDueReferenceType["GRN"] = "GRN";
    SupplierDueReferenceType["BILL"] = "BILL";
    SupplierDueReferenceType["CREDIT_NOTE"] = "CREDIT_NOTE";
    SupplierDueReferenceType["OPENING_BALANCE"] = "OPENING_BALANCE";
    SupplierDueReferenceType["OTHER"] = "OTHER";
})(SupplierDueReferenceType || (exports.SupplierDueReferenceType = SupplierDueReferenceType = {}));
let SupplierDue = class SupplierDue {
    id;
    supplierId;
    referenceType;
    referenceId;
    purchaseOrderId;
    referenceNumber;
    billNumber;
    billDate;
    dueDate;
    currency;
    originalAmount;
    paidAmount;
    adjustedAmount;
    status;
    paymentScheduledDate;
    notes;
    createdAt;
    updatedAt;
    supplier;
    get balanceAmount() {
        return this.originalAmount - this.paidAmount - this.adjustedAmount;
    }
    get overdueDays() {
        if (this.balanceAmount <= 0)
            return 0;
        const today = new Date();
        const due = new Date(this.dueDate);
        const diff = today.getTime() - due.getTime();
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, supplierId: { required: true, type: () => String }, referenceType: { required: true, enum: require("./supplier-due.entity").SupplierDueReferenceType }, referenceId: { required: true, type: () => String }, purchaseOrderId: { required: true, type: () => String }, referenceNumber: { required: true, type: () => String }, billNumber: { required: true, type: () => String }, billDate: { required: true, type: () => Date }, dueDate: { required: true, type: () => Date }, currency: { required: true, type: () => String }, originalAmount: { required: true, type: () => Number }, paidAmount: { required: true, type: () => Number }, adjustedAmount: { required: true, type: () => Number }, status: { required: true, enum: require("../../../common/enums/index").DueStatus }, paymentScheduledDate: { required: true, type: () => Date }, notes: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, supplier: { required: true, type: () => require("../inventory/supplier.entity").Supplier } };
    }
};
exports.SupplierDue = SupplierDue;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SupplierDue.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supplier_id' }),
    __metadata("design:type", String)
], SupplierDue.prototype, "supplierId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'reference_type',
        type: 'enum',
        enum: SupplierDueReferenceType,
    }),
    __metadata("design:type", String)
], SupplierDue.prototype, "referenceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_id', nullable: true }),
    __metadata("design:type", String)
], SupplierDue.prototype, "referenceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'purchase_order_id', nullable: true }),
    __metadata("design:type", String)
], SupplierDue.prototype, "purchaseOrderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_number', length: 50, nullable: true }),
    __metadata("design:type", String)
], SupplierDue.prototype, "referenceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bill_number', length: 100, nullable: true }),
    __metadata("design:type", String)
], SupplierDue.prototype, "billNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bill_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], SupplierDue.prototype, "billDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'due_date', type: 'date' }),
    __metadata("design:type", Date)
], SupplierDue.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 3, default: 'INR' }),
    __metadata("design:type", String)
], SupplierDue.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'original_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], SupplierDue.prototype, "originalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'paid_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], SupplierDue.prototype, "paidAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'adjusted_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], SupplierDue.prototype, "adjustedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.DueStatus,
        default: enums_1.DueStatus.PENDING,
    }),
    __metadata("design:type", String)
], SupplierDue.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_scheduled_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], SupplierDue.prototype, "paymentScheduledDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SupplierDue.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SupplierDue.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], SupplierDue.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => supplier_entity_1.Supplier),
    (0, typeorm_1.JoinColumn)({ name: 'supplier_id' }),
    __metadata("design:type", supplier_entity_1.Supplier)
], SupplierDue.prototype, "supplier", void 0);
exports.SupplierDue = SupplierDue = __decorate([
    (0, typeorm_1.Entity)('supplier_dues')
], SupplierDue);
//# sourceMappingURL=supplier-due.entity.js.map