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
exports.JournalEntryLine = exports.PartyType = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const journal_entry_entity_1 = require("./journal-entry.entity");
const chart_of_accounts_entity_1 = require("./chart-of-accounts.entity");
const tax_category_entity_1 = require("../inventory/tax-category.entity");
const cost_center_entity_1 = require("./cost-center.entity");
var PartyType;
(function (PartyType) {
    PartyType["CUSTOMER"] = "CUSTOMER";
    PartyType["SUPPLIER"] = "SUPPLIER";
    PartyType["EMPLOYEE"] = "EMPLOYEE";
    PartyType["OTHER"] = "OTHER";
})(PartyType || (exports.PartyType = PartyType = {}));
let JournalEntryLine = class JournalEntryLine {
    id;
    journalEntryId;
    lineNumber;
    accountId;
    costCenterId;
    description;
    debitAmount;
    creditAmount;
    currency;
    exchangeRate;
    baseDebitAmount;
    baseCreditAmount;
    partyType;
    partyId;
    taxCategoryId;
    createdAt;
    journalEntry;
    account;
    costCenter;
    taxCategory;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, journalEntryId: { required: true, type: () => String }, lineNumber: { required: true, type: () => Number }, accountId: { required: true, type: () => String }, costCenterId: { required: true, type: () => String }, description: { required: true, type: () => String }, debitAmount: { required: true, type: () => Number }, creditAmount: { required: true, type: () => Number }, currency: { required: true, type: () => String }, exchangeRate: { required: true, type: () => Number }, baseDebitAmount: { required: true, type: () => Number }, baseCreditAmount: { required: true, type: () => Number }, partyType: { required: true, enum: require("./journal-entry-line.entity").PartyType }, partyId: { required: true, type: () => String }, taxCategoryId: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, journalEntry: { required: true, type: () => require("./journal-entry.entity").JournalEntry }, account: { required: true, type: () => require("./chart-of-accounts.entity").ChartOfAccounts }, costCenter: { required: true, type: () => require("./cost-center.entity").CostCenter }, taxCategory: { required: true, type: () => require("../inventory/tax-category.entity").TaxCategory } };
    }
};
exports.JournalEntryLine = JournalEntryLine;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], JournalEntryLine.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'journal_entry_id' }),
    __metadata("design:type", String)
], JournalEntryLine.prototype, "journalEntryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'line_number', type: 'int' }),
    __metadata("design:type", Number)
], JournalEntryLine.prototype, "lineNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'account_id' }),
    __metadata("design:type", String)
], JournalEntryLine.prototype, "accountId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cost_center_id', nullable: true }),
    __metadata("design:type", String)
], JournalEntryLine.prototype, "costCenterId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 500, nullable: true }),
    __metadata("design:type", String)
], JournalEntryLine.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'debit_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], JournalEntryLine.prototype, "debitAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'credit_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], JournalEntryLine.prototype, "creditAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 3, default: 'INR' }),
    __metadata("design:type", String)
], JournalEntryLine.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'exchange_rate',
        type: 'decimal',
        precision: 12,
        scale: 6,
        default: 1,
    }),
    __metadata("design:type", Number)
], JournalEntryLine.prototype, "exchangeRate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'base_debit_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], JournalEntryLine.prototype, "baseDebitAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'base_credit_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], JournalEntryLine.prototype, "baseCreditAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'party_type',
        type: 'enum',
        enum: PartyType,
        nullable: true,
    }),
    __metadata("design:type", String)
], JournalEntryLine.prototype, "partyType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'party_id', nullable: true }),
    __metadata("design:type", String)
], JournalEntryLine.prototype, "partyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tax_category_id', nullable: true }),
    __metadata("design:type", String)
], JournalEntryLine.prototype, "taxCategoryId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], JournalEntryLine.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => journal_entry_entity_1.JournalEntry, (entry) => entry.lines, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'journal_entry_id' }),
    __metadata("design:type", journal_entry_entity_1.JournalEntry)
], JournalEntryLine.prototype, "journalEntry", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => chart_of_accounts_entity_1.ChartOfAccounts, (account) => account.journalEntryLines),
    (0, typeorm_1.JoinColumn)({ name: 'account_id' }),
    __metadata("design:type", chart_of_accounts_entity_1.ChartOfAccounts)
], JournalEntryLine.prototype, "account", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cost_center_entity_1.CostCenter),
    (0, typeorm_1.JoinColumn)({ name: 'cost_center_id' }),
    __metadata("design:type", cost_center_entity_1.CostCenter)
], JournalEntryLine.prototype, "costCenter", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tax_category_entity_1.TaxCategory),
    (0, typeorm_1.JoinColumn)({ name: 'tax_category_id' }),
    __metadata("design:type", tax_category_entity_1.TaxCategory)
], JournalEntryLine.prototype, "taxCategory", void 0);
exports.JournalEntryLine = JournalEntryLine = __decorate([
    (0, typeorm_1.Entity)('journal_entry_lines')
], JournalEntryLine);
//# sourceMappingURL=journal-entry-line.entity.js.map