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
exports.ImportJob = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const import_template_entity_1 = require("./import-template.entity");
const enums_1 = require("../../../common/enums");
const user_entity_1 = require("../user/user.entity");
const file_upload_entity_1 = require("./file-upload.entity");
const import_job_error_entity_1 = require("./import-job-error.entity");
let ImportJob = class ImportJob {
    id;
    jobNumber;
    templateId;
    fileUploadId;
    status;
    importMode;
    totalRows;
    processedRows;
    successfulRows;
    failedRows;
    skippedRows;
    insertedCount;
    updatedCount;
    validationStartedAt;
    validationCompletedAt;
    processingStartedAt;
    processingCompletedAt;
    errorFileUrl;
    resultSummary;
    options;
    notes;
    cancelledAt;
    cancelledBy;
    createdBy;
    createdAt;
    updatedAt;
    template;
    fileUpload;
    createdByUser;
    errors;
    get progressPercentage() {
        return this.totalRows > 0
            ? Math.round((this.processedRows / this.totalRows) * 100)
            : 0;
    }
    get successRate() {
        return this.processedRows > 0
            ? Math.round((this.successfulRows / this.processedRows) * 100)
            : 0;
    }
    get processingDurationSeconds() {
        if (!this.processingStartedAt || !this.processingCompletedAt)
            return null;
        return Math.round((this.processingCompletedAt.getTime() -
            this.processingStartedAt.getTime()) /
            1000);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, jobNumber: { required: true, type: () => String }, templateId: { required: true, type: () => String }, fileUploadId: { required: true, type: () => String }, status: { required: true, enum: require("../../../common/enums/index").ImportJobStatus }, importMode: { required: true, enum: require("../../../common/enums/index").ImportMode }, totalRows: { required: true, type: () => Number }, processedRows: { required: true, type: () => Number }, successfulRows: { required: true, type: () => Number }, failedRows: { required: true, type: () => Number }, skippedRows: { required: true, type: () => Number }, insertedCount: { required: true, type: () => Number }, updatedCount: { required: true, type: () => Number }, validationStartedAt: { required: true, type: () => Date }, validationCompletedAt: { required: true, type: () => Date }, processingStartedAt: { required: true, type: () => Date }, processingCompletedAt: { required: true, type: () => Date }, errorFileUrl: { required: true, type: () => String }, resultSummary: { required: true, type: () => Object }, options: { required: true, type: () => Object }, notes: { required: true, type: () => String }, cancelledAt: { required: true, type: () => Date }, cancelledBy: { required: true, type: () => String }, createdBy: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, template: { required: true, type: () => require("./import-template.entity").ImportTemplate }, fileUpload: { required: true, type: () => require("./file-upload.entity").FileUpload }, createdByUser: { required: true, type: () => require("../user/user.entity").User }, errors: { required: true, type: () => [require("./import-job-error.entity").ImportJobError] } };
    }
};
exports.ImportJob = ImportJob;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ImportJob.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'job_number', length: 50, unique: true }),
    __metadata("design:type", String)
], ImportJob.prototype, "jobNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'template_id' }),
    __metadata("design:type", String)
], ImportJob.prototype, "templateId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_upload_id' }),
    __metadata("design:type", String)
], ImportJob.prototype, "fileUploadId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.ImportJobStatus,
        default: enums_1.ImportJobStatus.PENDING,
    }),
    __metadata("design:type", String)
], ImportJob.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'import_mode',
        type: 'enum',
        enum: enums_1.ImportMode,
        default: enums_1.ImportMode.INSERT,
    }),
    __metadata("design:type", String)
], ImportJob.prototype, "importMode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_rows', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ImportJob.prototype, "totalRows", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'processed_rows', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ImportJob.prototype, "processedRows", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'successful_rows', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ImportJob.prototype, "successfulRows", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'failed_rows', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ImportJob.prototype, "failedRows", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'skipped_rows', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ImportJob.prototype, "skippedRows", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'inserted_count', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ImportJob.prototype, "insertedCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_count', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ImportJob.prototype, "updatedCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'validation_started_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], ImportJob.prototype, "validationStartedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'validation_completed_at',
        type: 'timestamp',
        nullable: true,
    }),
    __metadata("design:type", Date)
], ImportJob.prototype, "validationCompletedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'processing_started_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], ImportJob.prototype, "processingStartedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'processing_completed_at',
        type: 'timestamp',
        nullable: true,
    }),
    __metadata("design:type", Date)
], ImportJob.prototype, "processingCompletedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'error_file_url', length: 500, nullable: true }),
    __metadata("design:type", String)
], ImportJob.prototype, "errorFileUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'result_summary', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], ImportJob.prototype, "resultSummary", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'options', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], ImportJob.prototype, "options", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ImportJob.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cancelled_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], ImportJob.prototype, "cancelledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cancelled_by', nullable: true }),
    __metadata("design:type", String)
], ImportJob.prototype, "cancelledBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", String)
], ImportJob.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ImportJob.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ImportJob.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => import_template_entity_1.ImportTemplate),
    (0, typeorm_1.JoinColumn)({ name: 'template_id' }),
    __metadata("design:type", import_template_entity_1.ImportTemplate)
], ImportJob.prototype, "template", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => file_upload_entity_1.FileUpload),
    (0, typeorm_1.JoinColumn)({ name: 'file_upload_id' }),
    __metadata("design:type", file_upload_entity_1.FileUpload)
], ImportJob.prototype, "fileUpload", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], ImportJob.prototype, "createdByUser", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => import_job_error_entity_1.ImportJobError, (error) => error.importJob),
    __metadata("design:type", Array)
], ImportJob.prototype, "errors", void 0);
exports.ImportJob = ImportJob = __decorate([
    (0, typeorm_1.Entity)('import_jobs')
], ImportJob);
//# sourceMappingURL=import-job.entity.js.map