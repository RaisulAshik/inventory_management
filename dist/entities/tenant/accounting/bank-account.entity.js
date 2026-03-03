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
exports.BankAccount = exports.BankAccountType = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const chart_of_accounts_entity_1 = require("./chart-of-accounts.entity");
var BankAccountType;
(function (BankAccountType) {
    BankAccountType["SAVINGS"] = "SAVINGS";
    BankAccountType["CURRENT"] = "CURRENT";
    BankAccountType["CASH_CREDIT"] = "CASH_CREDIT";
    BankAccountType["OVERDRAFT"] = "OVERDRAFT";
    BankAccountType["FIXED_DEPOSIT"] = "FIXED_DEPOSIT";
    BankAccountType["OTHER"] = "OTHER";
})(BankAccountType || (exports.BankAccountType = BankAccountType = {}));
let BankAccount = class BankAccount {
    id;
    accountCode;
    accountName;
    accountType;
    bankName;
    branchName;
    accountNumber;
    ifscCode;
    swiftCode;
    micrCode;
    currency;
    glAccountId;
    openingBalance;
    currentBalance;
    overdraftLimit;
    interestRate;
    contactPerson;
    contactPhone;
    contactEmail;
    address;
    isPrimary;
    isActive;
    lastReconciledDate;
    lastReconciledBalance;
    notes;
    createdAt;
    updatedAt;
    glAccount;
    get availableBalance() {
        if (this.overdraftLimit) {
            return this.currentBalance + this.overdraftLimit;
        }
        return this.currentBalance;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, accountCode: { required: true, type: () => String }, accountName: { required: true, type: () => String }, accountType: { required: true, enum: require("./bank-account.entity").BankAccountType }, bankName: { required: true, type: () => String }, branchName: { required: true, type: () => String }, accountNumber: { required: true, type: () => String }, ifscCode: { required: true, type: () => String }, swiftCode: { required: true, type: () => String }, micrCode: { required: true, type: () => String }, currency: { required: true, type: () => String }, glAccountId: { required: true, type: () => String }, openingBalance: { required: true, type: () => Number }, currentBalance: { required: true, type: () => Number }, overdraftLimit: { required: true, type: () => Number }, interestRate: { required: true, type: () => Number }, contactPerson: { required: true, type: () => String }, contactPhone: { required: true, type: () => String }, contactEmail: { required: true, type: () => String }, address: { required: true, type: () => String }, isPrimary: { required: true, type: () => Boolean }, isActive: { required: true, type: () => Boolean }, lastReconciledDate: { required: true, type: () => Date }, lastReconciledBalance: { required: true, type: () => Number }, notes: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, glAccount: { required: true, type: () => require("./chart-of-accounts.entity").ChartOfAccounts } };
    }
};
exports.BankAccount = BankAccount;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], BankAccount.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'account_code', length: 50, unique: true }),
    __metadata("design:type", String)
], BankAccount.prototype, "accountCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'account_name', length: 200 }),
    __metadata("design:type", String)
], BankAccount.prototype, "accountName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'account_type',
        type: 'enum',
        enum: BankAccountType,
        default: BankAccountType.CURRENT,
    }),
    __metadata("design:type", String)
], BankAccount.prototype, "accountType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bank_name', length: 200 }),
    __metadata("design:type", String)
], BankAccount.prototype, "bankName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'branch_name', length: 200, nullable: true }),
    __metadata("design:type", String)
], BankAccount.prototype, "branchName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'account_number', length: 50 }),
    __metadata("design:type", String)
], BankAccount.prototype, "accountNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ifsc_code', length: 20, nullable: true }),
    __metadata("design:type", String)
], BankAccount.prototype, "ifscCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'swift_code', length: 20, nullable: true }),
    __metadata("design:type", String)
], BankAccount.prototype, "swiftCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'micr_code', length: 20, nullable: true }),
    __metadata("design:type", String)
], BankAccount.prototype, "micrCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 3, default: 'INR' }),
    __metadata("design:type", String)
], BankAccount.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gl_account_id', nullable: true }),
    __metadata("design:type", String)
], BankAccount.prototype, "glAccountId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'opening_balance',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], BankAccount.prototype, "openingBalance", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'current_balance',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], BankAccount.prototype, "currentBalance", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'overdraft_limit',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], BankAccount.prototype, "overdraftLimit", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'interest_rate',
        type: 'decimal',
        precision: 5,
        scale: 2,
        nullable: true,
    }),
    __metadata("design:type", Number)
], BankAccount.prototype, "interestRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contact_person', length: 200, nullable: true }),
    __metadata("design:type", String)
], BankAccount.prototype, "contactPerson", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contact_phone', length: 50, nullable: true }),
    __metadata("design:type", String)
], BankAccount.prototype, "contactPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contact_email', length: 255, nullable: true }),
    __metadata("design:type", String)
], BankAccount.prototype, "contactEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], BankAccount.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_primary', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], BankAccount.prototype, "isPrimary", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], BankAccount.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_reconciled_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], BankAccount.prototype, "lastReconciledDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'last_reconciled_balance',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], BankAccount.prototype, "lastReconciledBalance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], BankAccount.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], BankAccount.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], BankAccount.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => chart_of_accounts_entity_1.ChartOfAccounts),
    (0, typeorm_1.JoinColumn)({ name: 'gl_account_id' }),
    __metadata("design:type", chart_of_accounts_entity_1.ChartOfAccounts)
], BankAccount.prototype, "glAccount", void 0);
exports.BankAccount = BankAccount = __decorate([
    (0, typeorm_1.Entity)('bank_accounts')
], BankAccount);
//# sourceMappingURL=bank-account.entity.js.map