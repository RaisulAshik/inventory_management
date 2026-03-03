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
exports.BudgetLine = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const budget_entity_1 = require("./budget.entity");
const chart_of_accounts_entity_1 = require("./chart-of-accounts.entity");
const fiscal_period_entity_1 = require("./fiscal-period.entity");
let BudgetLine = class BudgetLine {
    id;
    budgetId;
    accountId;
    fiscalPeriodId;
    description;
    budgetAmount;
    revisedAmount;
    utilizedAmount;
    committedAmount;
    januaryAmount;
    februaryAmount;
    marchAmount;
    aprilAmount;
    mayAmount;
    juneAmount;
    julyAmount;
    augustAmount;
    septemberAmount;
    octoberAmount;
    novemberAmount;
    decemberAmount;
    notes;
    createdAt;
    updatedAt;
    budget;
    account;
    fiscalPeriod;
    get effectiveBudgetAmount() {
        return this.revisedAmount !== null ? this.revisedAmount : this.budgetAmount;
    }
    get availableAmount() {
        return (this.effectiveBudgetAmount - this.utilizedAmount - this.committedAmount);
    }
    get variance() {
        return this.effectiveBudgetAmount - this.utilizedAmount;
    }
    get variancePercentage() {
        return this.effectiveBudgetAmount > 0
            ? (this.variance / this.effectiveBudgetAmount) * 100
            : 0;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, budgetId: { required: true, type: () => String }, accountId: { required: true, type: () => String }, fiscalPeriodId: { required: true, type: () => String }, description: { required: true, type: () => String }, budgetAmount: { required: true, type: () => Number }, revisedAmount: { required: true, type: () => Number }, utilizedAmount: { required: true, type: () => Number }, committedAmount: { required: true, type: () => Number }, januaryAmount: { required: true, type: () => Number }, februaryAmount: { required: true, type: () => Number }, marchAmount: { required: true, type: () => Number }, aprilAmount: { required: true, type: () => Number }, mayAmount: { required: true, type: () => Number }, juneAmount: { required: true, type: () => Number }, julyAmount: { required: true, type: () => Number }, augustAmount: { required: true, type: () => Number }, septemberAmount: { required: true, type: () => Number }, octoberAmount: { required: true, type: () => Number }, novemberAmount: { required: true, type: () => Number }, decemberAmount: { required: true, type: () => Number }, notes: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, budget: { required: true, type: () => require("./budget.entity").Budget }, account: { required: true, type: () => require("./chart-of-accounts.entity").ChartOfAccounts }, fiscalPeriod: { required: true, type: () => require("./fiscal-period.entity").FiscalPeriod } };
    }
};
exports.BudgetLine = BudgetLine;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], BudgetLine.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'budget_id' }),
    __metadata("design:type", String)
], BudgetLine.prototype, "budgetId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'account_id' }),
    __metadata("design:type", String)
], BudgetLine.prototype, "accountId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fiscal_period_id', nullable: true }),
    __metadata("design:type", String)
], BudgetLine.prototype, "fiscalPeriodId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], BudgetLine.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'budget_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], BudgetLine.prototype, "budgetAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'revised_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], BudgetLine.prototype, "revisedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'utilized_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], BudgetLine.prototype, "utilizedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'committed_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], BudgetLine.prototype, "committedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'january_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], BudgetLine.prototype, "januaryAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'february_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], BudgetLine.prototype, "februaryAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'march_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], BudgetLine.prototype, "marchAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'april_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], BudgetLine.prototype, "aprilAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'may_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], BudgetLine.prototype, "mayAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'june_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], BudgetLine.prototype, "juneAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'july_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], BudgetLine.prototype, "julyAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'august_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], BudgetLine.prototype, "augustAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'september_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], BudgetLine.prototype, "septemberAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'october_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], BudgetLine.prototype, "octoberAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'november_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], BudgetLine.prototype, "novemberAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'december_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], BudgetLine.prototype, "decemberAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], BudgetLine.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], BudgetLine.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], BudgetLine.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => budget_entity_1.Budget, (budget) => budget.lines, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'budget_id' }),
    __metadata("design:type", budget_entity_1.Budget)
], BudgetLine.prototype, "budget", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => chart_of_accounts_entity_1.ChartOfAccounts),
    (0, typeorm_1.JoinColumn)({ name: 'account_id' }),
    __metadata("design:type", chart_of_accounts_entity_1.ChartOfAccounts)
], BudgetLine.prototype, "account", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => fiscal_period_entity_1.FiscalPeriod),
    (0, typeorm_1.JoinColumn)({ name: 'fiscal_period_id' }),
    __metadata("design:type", fiscal_period_entity_1.FiscalPeriod)
], BudgetLine.prototype, "fiscalPeriod", void 0);
exports.BudgetLine = BudgetLine = __decorate([
    (0, typeorm_1.Entity)('budget_lines')
], BudgetLine);
//# sourceMappingURL=budget-line.entity.js.map