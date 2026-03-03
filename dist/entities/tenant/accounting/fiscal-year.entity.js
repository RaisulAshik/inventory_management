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
exports.FiscalYear = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const enums_1 = require("../../../common/enums");
const fiscal_period_entity_1 = require("./fiscal-period.entity");
let FiscalYear = class FiscalYear {
    id;
    yearCode;
    yearName;
    startDate;
    endDate;
    status;
    isCurrent;
    closedBy;
    closedAt;
    createdAt;
    updatedAt;
    periods;
    get isOpen() {
        return this.status === enums_1.FiscalPeriodStatus.OPEN;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, yearCode: { required: true, type: () => String }, yearName: { required: true, type: () => String }, startDate: { required: true, type: () => Date }, endDate: { required: true, type: () => Date }, status: { required: true, enum: require("../../../common/enums/index").FiscalPeriodStatus }, isCurrent: { required: true, type: () => Boolean }, closedBy: { required: true, type: () => String }, closedAt: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, periods: { required: true, type: () => [require("./fiscal-period.entity").FiscalPeriod] } };
    }
};
exports.FiscalYear = FiscalYear;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FiscalYear.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'year_code', length: 20, unique: true }),
    __metadata("design:type", String)
], FiscalYear.prototype, "yearCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'year_name', length: 100 }),
    __metadata("design:type", String)
], FiscalYear.prototype, "yearName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'start_date', type: 'date' }),
    __metadata("design:type", Date)
], FiscalYear.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'end_date', type: 'date' }),
    __metadata("design:type", Date)
], FiscalYear.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.FiscalPeriodStatus,
        default: enums_1.FiscalPeriodStatus.OPEN,
    }),
    __metadata("design:type", String)
], FiscalYear.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_current', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], FiscalYear.prototype, "isCurrent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'closed_by', nullable: true }),
    __metadata("design:type", String)
], FiscalYear.prototype, "closedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'closed_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], FiscalYear.prototype, "closedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], FiscalYear.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], FiscalYear.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => fiscal_period_entity_1.FiscalPeriod, (period) => period.fiscalYear),
    __metadata("design:type", Array)
], FiscalYear.prototype, "periods", void 0);
exports.FiscalYear = FiscalYear = __decorate([
    (0, typeorm_1.Entity)('fiscal_years')
], FiscalYear);
//# sourceMappingURL=fiscal-year.entity.js.map