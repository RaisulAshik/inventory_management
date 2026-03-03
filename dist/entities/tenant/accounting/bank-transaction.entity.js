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
exports.BankTransaction = exports.BankTransactionStatus = exports.BankTransactionType = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const bank_account_entity_1 = require("./bank-account.entity");
const journal_entry_entity_1 = require("./journal-entry.entity");
var BankTransactionType;
(function (BankTransactionType) {
    BankTransactionType["DEPOSIT"] = "DEPOSIT";
    BankTransactionType["WITHDRAWAL"] = "WITHDRAWAL";
    BankTransactionType["TRANSFER_IN"] = "TRANSFER_IN";
    BankTransactionType["TRANSFER_OUT"] = "TRANSFER_OUT";
    BankTransactionType["INTEREST_CREDIT"] = "INTEREST_CREDIT";
    BankTransactionType["BANK_CHARGES"] = "BANK_CHARGES";
    BankTransactionType["CHEQUE_DEPOSIT"] = "CHEQUE_DEPOSIT";
    BankTransactionType["CHEQUE_ISSUED"] = "CHEQUE_ISSUED";
    BankTransactionType["LOAN_DISBURSEMENT"] = "LOAN_DISBURSEMENT";
    BankTransactionType["LOAN_REPAYMENT"] = "LOAN_REPAYMENT";
    BankTransactionType["OTHER"] = "OTHER";
})(BankTransactionType || (exports.BankTransactionType = BankTransactionType = {}));
var BankTransactionStatus;
(function (BankTransactionStatus) {
    BankTransactionStatus["PENDING"] = "PENDING";
    BankTransactionStatus["CLEARED"] = "CLEARED";
    BankTransactionStatus["BOUNCED"] = "BOUNCED";
    BankTransactionStatus["CANCELLED"] = "CANCELLED";
    BankTransactionStatus["RECONCILED"] = "RECONCILED";
})(BankTransactionStatus || (exports.BankTransactionStatus = BankTransactionStatus = {}));
let BankTransaction = class BankTransaction {
    id;
    transactionNumber;
    bankAccountId;
    transactionDate;
    valueDate;
    transactionType;
    status;
    amount;
    currency;
    runningBalance;
    description;
    referenceNumber;
    chequeNumber;
    chequeDate;
    payeePayerName;
    bankReference;
    journalEntryId;
    isReconciled;
    reconciledDate;
    reconciliationId;
    notes;
    createdBy;
    createdAt;
    updatedAt;
    bankAccount;
    journalEntry;
    get isDebit() {
        return [
            BankTransactionType.DEPOSIT,
            BankTransactionType.TRANSFER_IN,
            BankTransactionType.INTEREST_CREDIT,
            BankTransactionType.CHEQUE_DEPOSIT,
            BankTransactionType.LOAN_DISBURSEMENT,
        ].includes(this.transactionType);
    }
    get isCredit() {
        return [
            BankTransactionType.WITHDRAWAL,
            BankTransactionType.TRANSFER_OUT,
            BankTransactionType.BANK_CHARGES,
            BankTransactionType.CHEQUE_ISSUED,
            BankTransactionType.LOAN_REPAYMENT,
        ].includes(this.transactionType);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, transactionNumber: { required: true, type: () => String }, bankAccountId: { required: true, type: () => String }, transactionDate: { required: true, type: () => Date }, valueDate: { required: true, type: () => Date }, transactionType: { required: true, enum: require("./bank-transaction.entity").BankTransactionType }, status: { required: true, enum: require("./bank-transaction.entity").BankTransactionStatus }, amount: { required: true, type: () => Number }, currency: { required: true, type: () => String }, runningBalance: { required: true, type: () => Number }, description: { required: true, type: () => String }, referenceNumber: { required: true, type: () => String }, chequeNumber: { required: true, type: () => String }, chequeDate: { required: true, type: () => Date }, payeePayerName: { required: true, type: () => String }, bankReference: { required: true, type: () => String }, journalEntryId: { required: true, type: () => String }, isReconciled: { required: true, type: () => Boolean }, reconciledDate: { required: true, type: () => Date }, reconciliationId: { required: true, type: () => String }, notes: { required: true, type: () => String }, createdBy: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, bankAccount: { required: true, type: () => require("./bank-account.entity").BankAccount }, journalEntry: { required: true, type: () => require("./journal-entry.entity").JournalEntry } };
    }
};
exports.BankTransaction = BankTransaction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], BankTransaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transaction_number', length: 50, unique: true }),
    __metadata("design:type", String)
], BankTransaction.prototype, "transactionNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bank_account_id' }),
    __metadata("design:type", String)
], BankTransaction.prototype, "bankAccountId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transaction_date', type: 'date' }),
    __metadata("design:type", Date)
], BankTransaction.prototype, "transactionDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'value_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], BankTransaction.prototype, "valueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'transaction_type',
        type: 'enum',
        enum: BankTransactionType,
    }),
    __metadata("design:type", String)
], BankTransaction.prototype, "transactionType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: BankTransactionStatus,
        default: BankTransactionStatus.PENDING,
    }),
    __metadata("design:type", String)
], BankTransaction.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], BankTransaction.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 3, default: 'INR' }),
    __metadata("design:type", String)
], BankTransaction.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'running_balance',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], BankTransaction.prototype, "runningBalance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], BankTransaction.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_number', length: 100, nullable: true }),
    __metadata("design:type", String)
], BankTransaction.prototype, "referenceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cheque_number', length: 50, nullable: true }),
    __metadata("design:type", String)
], BankTransaction.prototype, "chequeNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cheque_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], BankTransaction.prototype, "chequeDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payee_payer_name', length: 200, nullable: true }),
    __metadata("design:type", String)
], BankTransaction.prototype, "payeePayerName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bank_reference', length: 100, nullable: true }),
    __metadata("design:type", String)
], BankTransaction.prototype, "bankReference", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'journal_entry_id', nullable: true }),
    __metadata("design:type", String)
], BankTransaction.prototype, "journalEntryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_reconciled', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], BankTransaction.prototype, "isReconciled", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reconciled_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], BankTransaction.prototype, "reconciledDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reconciliation_id', nullable: true }),
    __metadata("design:type", String)
], BankTransaction.prototype, "reconciliationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], BankTransaction.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", String)
], BankTransaction.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], BankTransaction.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], BankTransaction.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => bank_account_entity_1.BankAccount),
    (0, typeorm_1.JoinColumn)({ name: 'bank_account_id' }),
    __metadata("design:type", bank_account_entity_1.BankAccount)
], BankTransaction.prototype, "bankAccount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => journal_entry_entity_1.JournalEntry),
    (0, typeorm_1.JoinColumn)({ name: 'journal_entry_id' }),
    __metadata("design:type", journal_entry_entity_1.JournalEntry)
], BankTransaction.prototype, "journalEntry", void 0);
exports.BankTransaction = BankTransaction = __decorate([
    (0, typeorm_1.Entity)('bank_transactions')
], BankTransaction);
//# sourceMappingURL=bank-transaction.entity.js.map