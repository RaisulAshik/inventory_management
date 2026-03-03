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
exports.PosTransaction = exports.PosTransactionStatus = exports.PosTransactionType = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const pos_session_entity_1 = require("./pos-session.entity");
const customer_entity_1 = require("../eCommerce/customer.entity");
const sales_order_entity_1 = require("../eCommerce/sales-order.entity");
const store_entity_1 = require("./store.entity");
const pos_terminal_entity_1 = require("./pos-terminal.entity");
const user_entity_1 = require("../user/user.entity");
const pos_transaction_item_entity_1 = require("./pos-transaction-item.entity");
const pos_transaction_payment_entity_1 = require("./pos-transaction-payment.entity");
var PosTransactionType;
(function (PosTransactionType) {
    PosTransactionType["SALE"] = "SALE";
    PosTransactionType["RETURN"] = "RETURN";
    PosTransactionType["EXCHANGE"] = "EXCHANGE";
    PosTransactionType["VOID"] = "VOID";
})(PosTransactionType || (exports.PosTransactionType = PosTransactionType = {}));
var PosTransactionStatus;
(function (PosTransactionStatus) {
    PosTransactionStatus["COMPLETED"] = "COMPLETED";
    PosTransactionStatus["VOIDED"] = "VOIDED";
    PosTransactionStatus["HELD"] = "HELD";
    PosTransactionStatus["PENDING"] = "PENDING";
})(PosTransactionStatus || (exports.PosTransactionStatus = PosTransactionStatus = {}));
let PosTransaction = class PosTransaction {
    id;
    transactionNumber;
    sessionId;
    storeId;
    terminalId;
    salesOrderId;
    transactionType;
    customerId;
    customerName;
    customerPhone;
    transactionDate;
    subtotal;
    discountAmount;
    taxAmount;
    totalAmount;
    paidAmount;
    changeAmount;
    status;
    voidReason;
    voidedBy;
    voidedAt;
    notes;
    cashierId;
    createdAt;
    updatedAt;
    session;
    store;
    terminal;
    salesOrder;
    customer;
    cashier;
    items;
    payments;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, transactionNumber: { required: true, type: () => String }, sessionId: { required: true, type: () => String }, storeId: { required: true, type: () => String }, terminalId: { required: true, type: () => String }, salesOrderId: { required: true, type: () => String }, transactionType: { required: true, enum: require("./pos-transaction.entity").PosTransactionType }, customerId: { required: true, type: () => String }, customerName: { required: true, type: () => String }, customerPhone: { required: true, type: () => String }, transactionDate: { required: true, type: () => Date }, subtotal: { required: true, type: () => Number }, discountAmount: { required: true, type: () => Number }, taxAmount: { required: true, type: () => Number }, totalAmount: { required: true, type: () => Number }, paidAmount: { required: true, type: () => Number }, changeAmount: { required: true, type: () => Number }, status: { required: true, enum: require("./pos-transaction.entity").PosTransactionStatus }, voidReason: { required: true, type: () => String }, voidedBy: { required: true, type: () => String }, voidedAt: { required: true, type: () => Date }, notes: { required: true, type: () => String }, cashierId: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, session: { required: true, type: () => require("./pos-session.entity").PosSession }, store: { required: true, type: () => require("./store.entity").Store }, terminal: { required: true, type: () => require("./pos-terminal.entity").PosTerminal }, salesOrder: { required: true, type: () => require("../eCommerce/sales-order.entity").SalesOrder }, customer: { required: true, type: () => require("../eCommerce/customer.entity").Customer }, cashier: { required: true, type: () => require("../user/user.entity").User }, items: { required: true, type: () => [require("./pos-transaction-item.entity").PosTransactionItem] }, payments: { required: true, type: () => [require("./pos-transaction-payment.entity").PosTransactionPayment] } };
    }
};
exports.PosTransaction = PosTransaction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PosTransaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transaction_number', length: 50, unique: true }),
    __metadata("design:type", String)
], PosTransaction.prototype, "transactionNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'session_id' }),
    __metadata("design:type", String)
], PosTransaction.prototype, "sessionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'store_id' }),
    __metadata("design:type", String)
], PosTransaction.prototype, "storeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'terminal_id' }),
    __metadata("design:type", String)
], PosTransaction.prototype, "terminalId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sales_order_id', nullable: true }),
    __metadata("design:type", String)
], PosTransaction.prototype, "salesOrderId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'transaction_type',
        type: 'enum',
        enum: PosTransactionType,
        default: PosTransactionType.SALE,
    }),
    __metadata("design:type", String)
], PosTransaction.prototype, "transactionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_id', nullable: true }),
    __metadata("design:type", String)
], PosTransaction.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_name', length: 200, nullable: true }),
    __metadata("design:type", String)
], PosTransaction.prototype, "customerName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_phone', length: 50, nullable: true }),
    __metadata("design:type", String)
], PosTransaction.prototype, "customerPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transaction_date', type: 'timestamp' }),
    __metadata("design:type", Date)
], PosTransaction.prototype, "transactionDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], PosTransaction.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'discount_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], PosTransaction.prototype, "discountAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'tax_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], PosTransaction.prototype, "taxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], PosTransaction.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'paid_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], PosTransaction.prototype, "paidAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'change_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], PosTransaction.prototype, "changeAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PosTransactionStatus,
        default: PosTransactionStatus.COMPLETED,
    }),
    __metadata("design:type", String)
], PosTransaction.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'void_reason', type: 'text', nullable: true }),
    __metadata("design:type", String)
], PosTransaction.prototype, "voidReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'voided_by', nullable: true }),
    __metadata("design:type", String)
], PosTransaction.prototype, "voidedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'voided_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], PosTransaction.prototype, "voidedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PosTransaction.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cashier_id' }),
    __metadata("design:type", String)
], PosTransaction.prototype, "cashierId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PosTransaction.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], PosTransaction.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pos_session_entity_1.PosSession, (session) => session.transactions),
    (0, typeorm_1.JoinColumn)({ name: 'session_id' }),
    __metadata("design:type", pos_session_entity_1.PosSession)
], PosTransaction.prototype, "session", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => store_entity_1.Store),
    (0, typeorm_1.JoinColumn)({ name: 'store_id' }),
    __metadata("design:type", store_entity_1.Store)
], PosTransaction.prototype, "store", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pos_terminal_entity_1.PosTerminal),
    (0, typeorm_1.JoinColumn)({ name: 'terminal_id' }),
    __metadata("design:type", pos_terminal_entity_1.PosTerminal)
], PosTransaction.prototype, "terminal", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sales_order_entity_1.SalesOrder),
    (0, typeorm_1.JoinColumn)({ name: 'sales_order_id' }),
    __metadata("design:type", sales_order_entity_1.SalesOrder)
], PosTransaction.prototype, "salesOrder", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer),
    (0, typeorm_1.JoinColumn)({ name: 'customer_id' }),
    __metadata("design:type", customer_entity_1.Customer)
], PosTransaction.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'cashier_id' }),
    __metadata("design:type", user_entity_1.User)
], PosTransaction.prototype, "cashier", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => pos_transaction_item_entity_1.PosTransactionItem, (item) => item.transaction),
    __metadata("design:type", Array)
], PosTransaction.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => pos_transaction_payment_entity_1.PosTransactionPayment, (payment) => payment.transaction),
    __metadata("design:type", Array)
], PosTransaction.prototype, "payments", void 0);
exports.PosTransaction = PosTransaction = __decorate([
    (0, typeorm_1.Entity)('pos_transactions')
], PosTransaction);
//# sourceMappingURL=pos-transaction.entity.js.map