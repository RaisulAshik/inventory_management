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
exports.CustomerDueCollection = exports.CollectionStatus = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const bank_account_entity_1 = require("../accounting/bank-account.entity");
const customer_entity_1 = require("../eCommerce/customer.entity");
const payment_method_entity_1 = require("../eCommerce/payment-method.entity");
const user_entity_1 = require("../user/user.entity");
var CollectionStatus;
(function (CollectionStatus) {
    CollectionStatus["DRAFT"] = "DRAFT";
    CollectionStatus["PENDING"] = "PENDING";
    CollectionStatus["CONFIRMED"] = "CONFIRMED";
    CollectionStatus["DEPOSITED"] = "DEPOSITED";
    CollectionStatus["BOUNCED"] = "BOUNCED";
    CollectionStatus["CANCELLED"] = "CANCELLED";
})(CollectionStatus || (exports.CollectionStatus = CollectionStatus = {}));
let CustomerDueCollection = class CustomerDueCollection {
    id;
    collectionNumber;
    collectionDate;
    customerId;
    paymentMethodId;
    amount;
    currency;
    status;
    referenceNumber;
    chequeNumber;
    chequeDate;
    chequeBank;
    bankAccountId;
    depositDate;
    clearanceDate;
    bounceDate;
    bounceReason;
    bounceCharges;
    allocatedAmount;
    unallocatedAmount;
    journalEntryId;
    notes;
    receivedBy;
    createdBy;
    createdAt;
    updatedAt;
    customer;
    paymentMethod;
    bankAccount;
    receivedByUser;
    get isFullyAllocated() {
        return Math.abs(this.amount - this.allocatedAmount) < 0.01;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, collectionNumber: { required: true, type: () => String }, collectionDate: { required: true, type: () => Date }, customerId: { required: true, type: () => String }, paymentMethodId: { required: true, type: () => String }, amount: { required: true, type: () => Number }, currency: { required: true, type: () => String }, status: { required: true, enum: require("./customer-due-collection.entity").CollectionStatus }, referenceNumber: { required: true, type: () => String }, chequeNumber: { required: true, type: () => String }, chequeDate: { required: true, type: () => Date }, chequeBank: { required: true, type: () => String }, bankAccountId: { required: true, type: () => String }, depositDate: { required: true, type: () => Date }, clearanceDate: { required: true, type: () => Date }, bounceDate: { required: true, type: () => Date }, bounceReason: { required: true, type: () => String }, bounceCharges: { required: true, type: () => Number }, allocatedAmount: { required: true, type: () => Number }, unallocatedAmount: { required: true, type: () => Number }, journalEntryId: { required: true, type: () => String }, notes: { required: true, type: () => String }, receivedBy: { required: true, type: () => String }, createdBy: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, customer: { required: true, type: () => require("../eCommerce/customer.entity").Customer }, paymentMethod: { required: true, type: () => require("../eCommerce/payment-method.entity").PaymentMethod }, bankAccount: { required: true, type: () => require("../accounting/bank-account.entity").BankAccount }, receivedByUser: { required: true, type: () => require("../user/user.entity").User } };
    }
};
exports.CustomerDueCollection = CustomerDueCollection;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CustomerDueCollection.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'collection_number', length: 50, unique: true }),
    __metadata("design:type", String)
], CustomerDueCollection.prototype, "collectionNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'collection_date', type: 'date' }),
    __metadata("design:type", Date)
], CustomerDueCollection.prototype, "collectionDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_id' }),
    __metadata("design:type", String)
], CustomerDueCollection.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_method_id' }),
    __metadata("design:type", String)
], CustomerDueCollection.prototype, "paymentMethodId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], CustomerDueCollection.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 3, default: 'INR' }),
    __metadata("design:type", String)
], CustomerDueCollection.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CollectionStatus,
        default: CollectionStatus.DRAFT,
    }),
    __metadata("design:type", String)
], CustomerDueCollection.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_number', length: 100, nullable: true }),
    __metadata("design:type", String)
], CustomerDueCollection.prototype, "referenceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cheque_number', length: 50, nullable: true }),
    __metadata("design:type", String)
], CustomerDueCollection.prototype, "chequeNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cheque_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], CustomerDueCollection.prototype, "chequeDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cheque_bank', length: 200, nullable: true }),
    __metadata("design:type", String)
], CustomerDueCollection.prototype, "chequeBank", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bank_account_id', nullable: true }),
    __metadata("design:type", String)
], CustomerDueCollection.prototype, "bankAccountId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'deposit_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], CustomerDueCollection.prototype, "depositDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'clearance_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], CustomerDueCollection.prototype, "clearanceDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bounce_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], CustomerDueCollection.prototype, "bounceDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bounce_reason', type: 'text', nullable: true }),
    __metadata("design:type", String)
], CustomerDueCollection.prototype, "bounceReason", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'bounce_charges',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], CustomerDueCollection.prototype, "bounceCharges", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'allocated_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], CustomerDueCollection.prototype, "allocatedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'unallocated_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], CustomerDueCollection.prototype, "unallocatedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'journal_entry_id', nullable: true }),
    __metadata("design:type", String)
], CustomerDueCollection.prototype, "journalEntryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CustomerDueCollection.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'received_by', nullable: true }),
    __metadata("design:type", String)
], CustomerDueCollection.prototype, "receivedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", String)
], CustomerDueCollection.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], CustomerDueCollection.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], CustomerDueCollection.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer),
    (0, typeorm_1.JoinColumn)({ name: 'customer_id' }),
    __metadata("design:type", customer_entity_1.Customer)
], CustomerDueCollection.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => payment_method_entity_1.PaymentMethod),
    (0, typeorm_1.JoinColumn)({ name: 'payment_method_id' }),
    __metadata("design:type", payment_method_entity_1.PaymentMethod)
], CustomerDueCollection.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => bank_account_entity_1.BankAccount),
    (0, typeorm_1.JoinColumn)({ name: 'bank_account_id' }),
    __metadata("design:type", bank_account_entity_1.BankAccount)
], CustomerDueCollection.prototype, "bankAccount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'received_by' }),
    __metadata("design:type", user_entity_1.User)
], CustomerDueCollection.prototype, "receivedByUser", void 0);
exports.CustomerDueCollection = CustomerDueCollection = __decorate([
    (0, typeorm_1.Entity)('customer_due_collections')
], CustomerDueCollection);
//# sourceMappingURL=customer-due-collection.entity.js.map