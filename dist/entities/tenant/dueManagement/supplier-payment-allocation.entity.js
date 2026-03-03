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
exports.SupplierPaymentAllocation = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const supplier_payment_entity_1 = require("./supplier-payment.entity");
const supplier_due_entity_1 = require("./supplier-due.entity");
let SupplierPaymentAllocation = class SupplierPaymentAllocation {
    id;
    paymentId;
    supplierDueId;
    allocatedAmount;
    allocationDate;
    notes;
    createdBy;
    createdAt;
    payment;
    supplierDue;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, paymentId: { required: true, type: () => String }, supplierDueId: { required: true, type: () => String }, allocatedAmount: { required: true, type: () => Number }, allocationDate: { required: true, type: () => Date }, notes: { required: true, type: () => String }, createdBy: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, payment: { required: true, type: () => require("./supplier-payment.entity").SupplierPayment }, supplierDue: { required: true, type: () => require("./supplier-due.entity").SupplierDue } };
    }
};
exports.SupplierPaymentAllocation = SupplierPaymentAllocation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SupplierPaymentAllocation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_id' }),
    __metadata("design:type", String)
], SupplierPaymentAllocation.prototype, "paymentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supplier_due_id' }),
    __metadata("design:type", String)
], SupplierPaymentAllocation.prototype, "supplierDueId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'allocated_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], SupplierPaymentAllocation.prototype, "allocatedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'allocation_date', type: 'date' }),
    __metadata("design:type", Date)
], SupplierPaymentAllocation.prototype, "allocationDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SupplierPaymentAllocation.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", String)
], SupplierPaymentAllocation.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SupplierPaymentAllocation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => supplier_payment_entity_1.SupplierPayment, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'payment_id' }),
    __metadata("design:type", supplier_payment_entity_1.SupplierPayment)
], SupplierPaymentAllocation.prototype, "payment", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => supplier_due_entity_1.SupplierDue, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'supplier_due_id' }),
    __metadata("design:type", supplier_due_entity_1.SupplierDue)
], SupplierPaymentAllocation.prototype, "supplierDue", void 0);
exports.SupplierPaymentAllocation = SupplierPaymentAllocation = __decorate([
    (0, typeorm_1.Entity)('supplier_payment_allocations')
], SupplierPaymentAllocation);
//# sourceMappingURL=supplier-payment-allocation.entity.js.map