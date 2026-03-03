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
exports.ChartOfAccounts = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const enums_1 = require("../../../common/enums");
const journal_entry_line_entity_1 = require("./journal-entry-line.entity");
let ChartOfAccounts = class ChartOfAccounts {
    id;
    accountCode;
    accountName;
    accountType;
    accountSubtype;
    parentId;
    level;
    path;
    normalBalance;
    isHeader;
    isSystem;
    isActive;
    isBankAccount;
    isCashAccount;
    isReceivable;
    isPayable;
    currency;
    openingBalanceDebit;
    openingBalanceCredit;
    currentBalance;
    description;
    createdAt;
    updatedAt;
    parent;
    children;
    journalEntryLines;
    get openingBalance() {
        return this.openingBalanceDebit - this.openingBalanceCredit;
    }
    get isDebitBalance() {
        return this.normalBalance === enums_1.NormalBalance.DEBIT;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, accountCode: { required: true, type: () => String }, accountName: { required: true, type: () => String }, accountType: { required: true, enum: require("../../../common/enums/index").AccountType }, accountSubtype: { required: true, type: () => String }, parentId: { required: true, type: () => String }, level: { required: true, type: () => Number }, path: { required: true, type: () => String }, normalBalance: { required: true, enum: require("../../../common/enums/index").NormalBalance }, isHeader: { required: true, type: () => Boolean }, isSystem: { required: true, type: () => Boolean }, isActive: { required: true, type: () => Boolean }, isBankAccount: { required: true, type: () => Boolean }, isCashAccount: { required: true, type: () => Boolean }, isReceivable: { required: true, type: () => Boolean }, isPayable: { required: true, type: () => Boolean }, currency: { required: true, type: () => String }, openingBalanceDebit: { required: true, type: () => Number }, openingBalanceCredit: { required: true, type: () => Number }, currentBalance: { required: true, type: () => Number }, description: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, parent: { required: true, type: () => require("./chart-of-accounts.entity").ChartOfAccounts }, children: { required: true, type: () => [require("./chart-of-accounts.entity").ChartOfAccounts] }, journalEntryLines: { required: true, type: () => [require("./journal-entry-line.entity").JournalEntryLine] } };
    }
};
exports.ChartOfAccounts = ChartOfAccounts;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ChartOfAccounts.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'account_code', length: 50, unique: true }),
    __metadata("design:type", String)
], ChartOfAccounts.prototype, "accountCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'account_name', length: 200 }),
    __metadata("design:type", String)
], ChartOfAccounts.prototype, "accountName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'account_type',
        type: 'enum',
        enum: enums_1.AccountType,
    }),
    __metadata("design:type", String)
], ChartOfAccounts.prototype, "accountType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'account_subtype', length: 50, nullable: true }),
    __metadata("design:type", String)
], ChartOfAccounts.prototype, "accountSubtype", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'parent_id', nullable: true }),
    __metadata("design:type", String)
], ChartOfAccounts.prototype, "parentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ChartOfAccounts.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 500, nullable: true }),
    __metadata("design:type", String)
], ChartOfAccounts.prototype, "path", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'normal_balance',
        type: 'enum',
        enum: enums_1.NormalBalance,
    }),
    __metadata("design:type", String)
], ChartOfAccounts.prototype, "normalBalance", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_header', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], ChartOfAccounts.prototype, "isHeader", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_system', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], ChartOfAccounts.prototype, "isSystem", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], ChartOfAccounts.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_bank_account', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], ChartOfAccounts.prototype, "isBankAccount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_cash_account', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], ChartOfAccounts.prototype, "isCashAccount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_receivable', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], ChartOfAccounts.prototype, "isReceivable", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_payable', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], ChartOfAccounts.prototype, "isPayable", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 3, nullable: true }),
    __metadata("design:type", String)
], ChartOfAccounts.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'opening_balance_debit',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], ChartOfAccounts.prototype, "openingBalanceDebit", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'opening_balance_credit',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], ChartOfAccounts.prototype, "openingBalanceCredit", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'current_balance',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], ChartOfAccounts.prototype, "currentBalance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ChartOfAccounts.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ChartOfAccounts.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ChartOfAccounts.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ChartOfAccounts, (account) => account.children),
    (0, typeorm_1.JoinColumn)({ name: 'parent_id' }),
    __metadata("design:type", ChartOfAccounts)
], ChartOfAccounts.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ChartOfAccounts, (account) => account.parent),
    __metadata("design:type", Array)
], ChartOfAccounts.prototype, "children", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => journal_entry_line_entity_1.JournalEntryLine, (line) => line.account),
    __metadata("design:type", Array)
], ChartOfAccounts.prototype, "journalEntryLines", void 0);
exports.ChartOfAccounts = ChartOfAccounts = __decorate([
    (0, typeorm_1.Entity)('chart_of_accounts')
], ChartOfAccounts);
//# sourceMappingURL=chart-of-accounts.entity.js.map