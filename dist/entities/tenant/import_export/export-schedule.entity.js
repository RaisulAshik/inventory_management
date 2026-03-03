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
exports.ExportSchedule = exports.ScheduleFrequency = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const enums_1 = require("../../../common/enums");
const export_schedule_recipient_entity_1 = require("./export-schedule-recipient.entity");
var ScheduleFrequency;
(function (ScheduleFrequency) {
    ScheduleFrequency["DAILY"] = "DAILY";
    ScheduleFrequency["WEEKLY"] = "WEEKLY";
    ScheduleFrequency["BIWEEKLY"] = "BIWEEKLY";
    ScheduleFrequency["MONTHLY"] = "MONTHLY";
    ScheduleFrequency["QUARTERLY"] = "QUARTERLY";
    ScheduleFrequency["YEARLY"] = "YEARLY";
    ScheduleFrequency["CUSTOM"] = "CUSTOM";
})(ScheduleFrequency || (exports.ScheduleFrequency = ScheduleFrequency = {}));
let ExportSchedule = class ExportSchedule {
    id;
    scheduleName;
    description;
    entityType;
    fileFormat;
    filters;
    columns;
    frequency;
    cronExpression;
    dayOfWeek;
    dayOfMonth;
    timeOfDay;
    timezone;
    isActive;
    sendEmptyReport;
    emailSubject;
    emailBody;
    lastRunAt;
    lastRunStatus;
    nextRunAt;
    runCount;
    createdBy;
    createdAt;
    updatedAt;
    recipients;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, scheduleName: { required: true, type: () => String }, description: { required: true, type: () => String }, entityType: { required: true, type: () => String }, fileFormat: { required: true, enum: require("../../../common/enums/index").FileFormat }, filters: { required: true, type: () => Object }, columns: { required: true, type: () => [String] }, frequency: { required: true, enum: require("./export-schedule.entity").ScheduleFrequency }, cronExpression: { required: true, type: () => String }, dayOfWeek: { required: true, type: () => Number }, dayOfMonth: { required: true, type: () => Number }, timeOfDay: { required: true, type: () => String }, timezone: { required: true, type: () => String }, isActive: { required: true, type: () => Boolean }, sendEmptyReport: { required: true, type: () => Boolean }, emailSubject: { required: true, type: () => String }, emailBody: { required: true, type: () => String }, lastRunAt: { required: true, type: () => Date }, lastRunStatus: { required: true, type: () => String }, nextRunAt: { required: true, type: () => Date }, runCount: { required: true, type: () => Number }, createdBy: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, recipients: { required: true, type: () => [require("./export-schedule-recipient.entity").ExportScheduleRecipient] } };
    }
};
exports.ExportSchedule = ExportSchedule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ExportSchedule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'schedule_name', length: 200 }),
    __metadata("design:type", String)
], ExportSchedule.prototype, "scheduleName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ExportSchedule.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'entity_type', length: 100 }),
    __metadata("design:type", String)
], ExportSchedule.prototype, "entityType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'file_format',
        type: 'enum',
        enum: enums_1.FileFormat,
        default: enums_1.FileFormat.XLSX,
    }),
    __metadata("design:type", String)
], ExportSchedule.prototype, "fileFormat", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], ExportSchedule.prototype, "filters", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], ExportSchedule.prototype, "columns", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ScheduleFrequency,
    }),
    __metadata("design:type", String)
], ExportSchedule.prototype, "frequency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cron_expression', length: 100, nullable: true }),
    __metadata("design:type", String)
], ExportSchedule.prototype, "cronExpression", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'day_of_week', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], ExportSchedule.prototype, "dayOfWeek", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'day_of_month', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], ExportSchedule.prototype, "dayOfMonth", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'time_of_day', type: 'time' }),
    __metadata("design:type", String)
], ExportSchedule.prototype, "timeOfDay", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, default: 'Asia/Kolkata' }),
    __metadata("design:type", String)
], ExportSchedule.prototype, "timezone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], ExportSchedule.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'send_empty_report', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], ExportSchedule.prototype, "sendEmptyReport", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email_subject', length: 500, nullable: true }),
    __metadata("design:type", String)
], ExportSchedule.prototype, "emailSubject", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email_body', type: 'text', nullable: true }),
    __metadata("design:type", String)
], ExportSchedule.prototype, "emailBody", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_run_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], ExportSchedule.prototype, "lastRunAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_run_status', length: 50, nullable: true }),
    __metadata("design:type", String)
], ExportSchedule.prototype, "lastRunStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'next_run_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], ExportSchedule.prototype, "nextRunAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'run_count', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ExportSchedule.prototype, "runCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", String)
], ExportSchedule.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ExportSchedule.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ExportSchedule.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => export_schedule_recipient_entity_1.ExportScheduleRecipient, (recipient) => recipient.schedule),
    __metadata("design:type", Array)
], ExportSchedule.prototype, "recipients", void 0);
exports.ExportSchedule = ExportSchedule = __decorate([
    (0, typeorm_1.Entity)('export_schedules')
], ExportSchedule);
//# sourceMappingURL=export-schedule.entity.js.map