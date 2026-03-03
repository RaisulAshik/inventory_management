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
exports.BankReconciliation = exports.ReconciliationStatus = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const bank_account_entity_1 = require("./bank-account.entity");
const user_entity_1 = require("../user/user.entity");
var ReconciliationStatus;
(function (ReconciliationStatus) {
    ReconciliationStatus["DRAFT"] = "DRAFT";
    ReconciliationStatus["IN_PROGRESS"] = "IN_PROGRESS";
    ReconciliationStatus["COMPLETED"] = "COMPLETED";
    ReconciliationStatus["CANCELLED"] = "CANCELLED";
})(ReconciliationStatus || (exports.ReconciliationStatus = ReconciliationStatus = {}));
let BankReconciliation = class BankReconciliation {
    id;
    reconciliationNumber;
    bankAccountId;
    statementDate;
    statementStartDate;
    statementEndDate;
    status;
    openingBalanceBook;
    closingBalanceBook;
    openingBalanceBank;
    closingBalanceBank;
    totalDepositsBook;
    totalWithdrawalsBook;
    totalDepositsBank;
    totalWithdrawalsBank;
    depositsInTransit;
    outstandingCheques;
    bankErrors;
    bookErrors;
    adjustedBalanceBook;
    adjustedBalanceBank;
    difference;
    isReconciled;
    notes;
    reconciledBy;
    reconciledAt;
    createdBy;
    createdAt;
    updatedAt;
    bankAccount;
    reconciledByUser;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, reconciliationNumber: { required: true, type: () => String }, bankAccountId: { required: true, type: () => String }, statementDate: { required: true, type: () => Date }, statementStartDate: { required: true, type: () => Date }, statementEndDate: { required: true, type: () => Date }, status: { required: true, enum: require("./bank-reconciliation.entity").ReconciliationStatus }, openingBalanceBook: { required: true, type: () => Number }, closingBalanceBook: { required: true, type: () => Number }, openingBalanceBank: { required: true, type: () => Number }, closingBalanceBank: { required: true, type: () => Number }, totalDepositsBook: { required: true, type: () => Number }, totalWithdrawalsBook: { required: true, type: () => Number }, totalDepositsBank: { required: true, type: () => Number }, totalWithdrawalsBank: { required: true, type: () => Number }, depositsInTransit: { required: true, type: () => Number }, outstandingCheques: { required: true, type: () => Number }, bankErrors: { required: true, type: () => Number }, bookErrors: { required: true, type: () => Number }, adjustedBalanceBook: { required: true, type: () => Number }, adjustedBalanceBank: { required: true, type: () => Number }, difference: { required: true, type: () => Number }, isReconciled: { required: true, type: () => Boolean }, notes: { required: true, type: () => String }, reconciledBy: { required: true, type: () => String }, reconciledAt: { required: true, type: () => Date }, createdBy: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, bankAccount: { required: true, type: () => require("./bank-account.entity").BankAccount }, reconciledByUser: { required: true, type: () => require("../user/user.entity").User } };
    }
};
exports.BankReconciliation = BankReconciliation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], BankReconciliation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reconciliation_number', length: 50, unique: true }),
    __metadata("design:type", String)
], BankReconciliation.prototype, "reconciliationNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bank_account_id' }),
    __metadata("design:type", String)
], BankReconciliation.prototype, "bankAccountId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'statement_date', type: 'date' }),
    __metadata("design:type", Date)
], BankReconciliation.prototype, "statementDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'statement_start_date', type: 'date' }),
    __metadata("design:type", Date)
], BankReconciliation.prototype, "statementStartDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'statement_end_date', type: 'date' }),
    __metadata("design:type", Date)
], BankReconciliation.prototype, "statementEndDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ReconciliationStatus,
        default: ReconciliationStatus.DRAFT,
    }),
    __metadata("design:type", String)
], BankReconciliation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'opening_balance_book',
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], BankReconciliation.prototype, "openingBalanceBook", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'closing_balance_book',
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], BankReconciliation.prototype, "closingBalanceBook", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'opening_balance_bank',
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], BankReconciliation.prototype, "openingBalanceBank", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'closing_balance_bank',
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], BankReconciliation.prototype, "closingBalanceBank", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_deposits_book',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], BankReconciliation.prototype, "totalDepositsBook", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_withdrawals_book',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], BankReconciliation.prototype, "totalWithdrawalsBook", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_deposits_bank',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], BankReconciliation.prototype, "totalDepositsBank", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_withdrawals_bank',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], BankReconciliation.prototype, "totalWithdrawalsBank", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'deposits_in_transit',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], BankReconciliation.prototype, "depositsInTransit", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'outstanding_cheques',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], BankReconciliation.prototype, "outstandingCheques", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'bank_errors',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], BankReconciliation.prototype, "bankErrors", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'book_errors',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], BankReconciliation.prototype, "bookErrors", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'adjusted_balance_book',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], BankReconciliation.prototype, "adjustedBalanceBook", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'adjusted_balance_bank',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], BankReconciliation.prototype, "adjustedBalanceBank", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], BankReconciliation.prototype, "difference", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_reconciled', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], BankReconciliation.prototype, "isReconciled", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], BankReconciliation.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reconciled_by', nullable: true }),
    __metadata("design:type", String)
], BankReconciliation.prototype, "reconciledBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reconciled_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], BankReconciliation.prototype, "reconciledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", String)
], BankReconciliation.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], BankReconciliation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], BankReconciliation.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => bank_account_entity_1.BankAccount),
    (0, typeorm_1.JoinColumn)({ name: 'bank_account_id' }),
    __metadata("design:type", bank_account_entity_1.BankAccount)
], BankReconciliation.prototype, "bankAccount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'reconciled_by' }),
    __metadata("design:type", user_entity_1.User)
], BankReconciliation.prototype, "reconciledByUser", void 0);
exports.BankReconciliation = BankReconciliation = __decorate([
    (0, typeorm_1.Entity)('bank_reconciliations')
], BankReconciliation);
//# sourceMappingURL=bank-reconciliation.entity.js.map