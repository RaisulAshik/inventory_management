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
exports.Budget = exports.BudgetStatus = exports.BudgetType = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const fiscal_year_entity_1 = require("./fiscal-year.entity");
const cost_center_entity_1 = require("./cost-center.entity");
const budget_line_entity_1 = require("./budget-line.entity");
var BudgetType;
(function (BudgetType) {
    BudgetType["REVENUE"] = "REVENUE";
    BudgetType["EXPENSE"] = "EXPENSE";
    BudgetType["CAPITAL"] = "CAPITAL";
    BudgetType["PROJECT"] = "PROJECT";
})(BudgetType || (exports.BudgetType = BudgetType = {}));
var BudgetStatus;
(function (BudgetStatus) {
    BudgetStatus["DRAFT"] = "DRAFT";
    BudgetStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    BudgetStatus["APPROVED"] = "APPROVED";
    BudgetStatus["REJECTED"] = "REJECTED";
    BudgetStatus["ACTIVE"] = "ACTIVE";
    BudgetStatus["CLOSED"] = "CLOSED";
})(BudgetStatus || (exports.BudgetStatus = BudgetStatus = {}));
let Budget = class Budget {
    id;
    budgetCode;
    budgetName;
    description;
    budgetType;
    fiscalYearId;
    costCenterId;
    status;
    currency;
    totalBudgetAmount;
    allocatedAmount;
    utilizedAmount;
    committedAmount;
    startDate;
    endDate;
    allowOverBudget;
    overBudgetTolerancePercentage;
    notes;
    approvedBy;
    approvedAt;
    createdBy;
    createdAt;
    updatedAt;
    fiscalYear;
    costCenter;
    lines;
    get availableAmount() {
        return this.totalBudgetAmount - this.utilizedAmount - this.committedAmount;
    }
    get utilizationPercentage() {
        return this.totalBudgetAmount > 0
            ? (this.utilizedAmount / this.totalBudgetAmount) * 100
            : 0;
    }
    get isOverBudget() {
        return this.utilizedAmount > this.totalBudgetAmount;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, budgetCode: { required: true, type: () => String }, budgetName: { required: true, type: () => String }, description: { required: true, type: () => String }, budgetType: { required: true, enum: require("./budget.entity").BudgetType }, fiscalYearId: { required: true, type: () => String }, costCenterId: { required: true, type: () => String }, status: { required: true, enum: require("./budget.entity").BudgetStatus }, currency: { required: true, type: () => String }, totalBudgetAmount: { required: true, type: () => Number }, allocatedAmount: { required: true, type: () => Number }, utilizedAmount: { required: true, type: () => Number }, committedAmount: { required: true, type: () => Number }, startDate: { required: true, type: () => Date }, endDate: { required: true, type: () => Date }, allowOverBudget: { required: true, type: () => Boolean }, overBudgetTolerancePercentage: { required: true, type: () => Number }, notes: { required: true, type: () => String }, approvedBy: { required: true, type: () => String }, approvedAt: { required: true, type: () => Date }, createdBy: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, fiscalYear: { required: true, type: () => require("./fiscal-year.entity").FiscalYear }, costCenter: { required: true, type: () => require("./cost-center.entity").CostCenter }, lines: { required: true, type: () => [require("./budget-line.entity").BudgetLine] } };
    }
};
exports.Budget = Budget;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Budget.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'budget_code', length: 50, unique: true }),
    __metadata("design:type", String)
], Budget.prototype, "budgetCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'budget_name', length: 200 }),
    __metadata("design:type", String)
], Budget.prototype, "budgetName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Budget.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'budget_type',
        type: 'enum',
        enum: BudgetType,
        default: BudgetType.EXPENSE,
    }),
    __metadata("design:type", String)
], Budget.prototype, "budgetType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fiscal_year_id' }),
    __metadata("design:type", String)
], Budget.prototype, "fiscalYearId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cost_center_id', nullable: true }),
    __metadata("design:type", String)
], Budget.prototype, "costCenterId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: BudgetStatus,
        default: BudgetStatus.DRAFT,
    }),
    __metadata("design:type", String)
], Budget.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 3, default: 'INR' }),
    __metadata("design:type", String)
], Budget.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_budget_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], Budget.prototype, "totalBudgetAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'allocated_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], Budget.prototype, "allocatedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'utilized_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], Budget.prototype, "utilizedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'committed_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], Budget.prototype, "committedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'start_date', type: 'date' }),
    __metadata("design:type", Date)
], Budget.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'end_date', type: 'date' }),
    __metadata("design:type", Date)
], Budget.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'allow_over_budget', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], Budget.prototype, "allowOverBudget", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'over_budget_tolerance_percentage',
        type: 'decimal',
        precision: 5,
        scale: 2,
        default: 0,
    }),
    __metadata("design:type", Number)
], Budget.prototype, "overBudgetTolerancePercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Budget.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_by', nullable: true }),
    __metadata("design:type", String)
], Budget.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Budget.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", String)
], Budget.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Budget.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Budget.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => fiscal_year_entity_1.FiscalYear),
    (0, typeorm_1.JoinColumn)({ name: 'fiscal_year_id' }),
    __metadata("design:type", fiscal_year_entity_1.FiscalYear)
], Budget.prototype, "fiscalYear", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cost_center_entity_1.CostCenter),
    (0, typeorm_1.JoinColumn)({ name: 'cost_center_id' }),
    __metadata("design:type", cost_center_entity_1.CostCenter)
], Budget.prototype, "costCenter", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => budget_line_entity_1.BudgetLine, (line) => line.budget),
    __metadata("design:type", Array)
], Budget.prototype, "lines", void 0);
exports.Budget = Budget = __decorate([
    (0, typeorm_1.Entity)('budgets')
], Budget);
//# sourceMappingURL=budget.entity.js.map