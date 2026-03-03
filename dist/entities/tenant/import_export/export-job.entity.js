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
exports.ExportJob = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const enums_1 = require("../../../common/enums");
const user_entity_1 = require("../user/user.entity");
let ExportJob = class ExportJob {
    id;
    jobNumber;
    exportName;
    entityType;
    status;
    fileFormat;
    filters;
    columns;
    sortBy;
    sortOrder;
    includeHeaders;
    totalRecords;
    processedRecords;
    fileName;
    fileSize;
    fileUrl;
    startedAt;
    completedAt;
    expiresAt;
    errorMessage;
    notes;
    createdBy;
    createdAt;
    updatedAt;
    createdByUser;
    get progressPercentage() {
        return this.totalRecords > 0
            ? Math.round((this.processedRecords / this.totalRecords) * 100)
            : 0;
    }
    get isExpired() {
        return this.expiresAt && new Date(this.expiresAt) < new Date();
    }
    get processingDurationSeconds() {
        if (!this.startedAt || !this.completedAt)
            return null;
        return Math.round((this.completedAt.getTime() - this.startedAt.getTime()) / 1000);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, jobNumber: { required: true, type: () => String }, exportName: { required: true, type: () => String }, entityType: { required: true, type: () => String }, status: { required: true, enum: require("../../../common/enums/index").ExportJobStatus }, fileFormat: { required: true, enum: require("../../../common/enums/index").FileFormat }, filters: { required: true, type: () => Object }, columns: { required: true, type: () => [String] }, sortBy: { required: true, type: () => String }, sortOrder: { required: true, type: () => Object }, includeHeaders: { required: true, type: () => Boolean }, totalRecords: { required: true, type: () => Number }, processedRecords: { required: true, type: () => Number }, fileName: { required: true, type: () => String }, fileSize: { required: true, type: () => Number }, fileUrl: { required: true, type: () => String }, startedAt: { required: true, type: () => Date }, completedAt: { required: true, type: () => Date }, expiresAt: { required: true, type: () => Date }, errorMessage: { required: true, type: () => String }, notes: { required: true, type: () => String }, createdBy: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, createdByUser: { required: true, type: () => require("../user/user.entity").User } };
    }
};
exports.ExportJob = ExportJob;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ExportJob.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'job_number', length: 50, unique: true }),
    __metadata("design:type", String)
], ExportJob.prototype, "jobNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'export_name', length: 200 }),
    __metadata("design:type", String)
], ExportJob.prototype, "exportName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'entity_type', length: 100 }),
    __metadata("design:type", String)
], ExportJob.prototype, "entityType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.ExportJobStatus,
        default: enums_1.ExportJobStatus.PENDING,
    }),
    __metadata("design:type", String)
], ExportJob.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'file_format',
        type: 'enum',
        enum: enums_1.FileFormat,
        default: enums_1.FileFormat.XLSX,
    }),
    __metadata("design:type", String)
], ExportJob.prototype, "fileFormat", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], ExportJob.prototype, "filters", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], ExportJob.prototype, "columns", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sort_by', length: 100, nullable: true }),
    __metadata("design:type", String)
], ExportJob.prototype, "sortBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sort_order', length: 10, nullable: true }),
    __metadata("design:type", String)
], ExportJob.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'include_headers', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], ExportJob.prototype, "includeHeaders", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_records', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ExportJob.prototype, "totalRecords", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'processed_records', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ExportJob.prototype, "processedRecords", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_name', length: 255, nullable: true }),
    __metadata("design:type", String)
], ExportJob.prototype, "fileName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_size', type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], ExportJob.prototype, "fileSize", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_url', length: 500, nullable: true }),
    __metadata("design:type", String)
], ExportJob.prototype, "fileUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'started_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], ExportJob.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'completed_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], ExportJob.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expires_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], ExportJob.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'error_message', type: 'text', nullable: true }),
    __metadata("design:type", String)
], ExportJob.prototype, "errorMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ExportJob.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", String)
], ExportJob.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ExportJob.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ExportJob.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], ExportJob.prototype, "createdByUser", void 0);
exports.ExportJob = ExportJob = __decorate([
    (0, typeorm_1.Entity)('export_jobs')
], ExportJob);
//# sourceMappingURL=export-job.entity.js.map