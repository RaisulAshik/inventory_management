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
exports.FiscalPeriod = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const enums_1 = require("../../../common/enums");
const fiscal_year_entity_1 = require("./fiscal-year.entity");
let FiscalPeriod = class FiscalPeriod {
    id;
    fiscalYearId;
    periodNumber;
    periodName;
    startDate;
    endDate;
    status;
    closedBy;
    closedAt;
    createdAt;
    updatedAt;
    fiscalYear;
    get isOpen() {
        return this.status === enums_1.FiscalPeriodStatus.OPEN;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, fiscalYearId: { required: true, type: () => String }, periodNumber: { required: true, type: () => Number }, periodName: { required: true, type: () => String }, startDate: { required: true, type: () => Date }, endDate: { required: true, type: () => Date }, status: { required: true, enum: require("../../../common/enums/index").FiscalPeriodStatus }, closedBy: { required: true, type: () => String }, closedAt: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, fiscalYear: { required: true, type: () => require("./fiscal-year.entity").FiscalYear } };
    }
};
exports.FiscalPeriod = FiscalPeriod;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FiscalPeriod.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fiscal_year_id' }),
    __metadata("design:type", String)
], FiscalPeriod.prototype, "fiscalYearId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'period_number', type: 'int' }),
    __metadata("design:type", Number)
], FiscalPeriod.prototype, "periodNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'period_name', length: 50 }),
    __metadata("design:type", String)
], FiscalPeriod.prototype, "periodName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'start_date', type: 'date' }),
    __metadata("design:type", Date)
], FiscalPeriod.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'end_date', type: 'date' }),
    __metadata("design:type", Date)
], FiscalPeriod.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.FiscalPeriodStatus,
        default: enums_1.FiscalPeriodStatus.OPEN,
    }),
    __metadata("design:type", String)
], FiscalPeriod.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'closed_by', nullable: true }),
    __metadata("design:type", String)
], FiscalPeriod.prototype, "closedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'closed_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], FiscalPeriod.prototype, "closedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], FiscalPeriod.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], FiscalPeriod.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => fiscal_year_entity_1.FiscalYear, (year) => year.periods),
    (0, typeorm_1.JoinColumn)({ name: 'fiscal_year_id' }),
    __metadata("design:type", fiscal_year_entity_1.FiscalYear)
], FiscalPeriod.prototype, "fiscalYear", void 0);
exports.FiscalPeriod = FiscalPeriod = __decorate([
    (0, typeorm_1.Entity)('fiscal_periods')
], FiscalPeriod);
//# sourceMappingURL=fiscal-period.entity.js.map