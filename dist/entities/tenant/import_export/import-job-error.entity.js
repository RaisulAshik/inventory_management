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
exports.ImportJobError = exports.ImportErrorSeverity = exports.ImportErrorType = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const import_job_entity_1 = require("./import-job.entity");
var ImportErrorType;
(function (ImportErrorType) {
    ImportErrorType["VALIDATION"] = "VALIDATION";
    ImportErrorType["DATA_TYPE"] = "DATA_TYPE";
    ImportErrorType["REQUIRED_FIELD"] = "REQUIRED_FIELD";
    ImportErrorType["DUPLICATE"] = "DUPLICATE";
    ImportErrorType["REFERENCE_NOT_FOUND"] = "REFERENCE_NOT_FOUND";
    ImportErrorType["FORMAT"] = "FORMAT";
    ImportErrorType["BUSINESS_RULE"] = "BUSINESS_RULE";
    ImportErrorType["SYSTEM"] = "SYSTEM";
})(ImportErrorType || (exports.ImportErrorType = ImportErrorType = {}));
var ImportErrorSeverity;
(function (ImportErrorSeverity) {
    ImportErrorSeverity["WARNING"] = "WARNING";
    ImportErrorSeverity["ERROR"] = "ERROR";
    ImportErrorSeverity["CRITICAL"] = "CRITICAL";
})(ImportErrorSeverity || (exports.ImportErrorSeverity = ImportErrorSeverity = {}));
let ImportJobError = class ImportJobError {
    id;
    importJobId;
    rowNumber;
    columnName;
    columnIndex;
    errorType;
    severity;
    errorCode;
    errorMessage;
    fieldValue;
    expectedValue;
    rowData;
    isResolved;
    resolutionNotes;
    createdAt;
    importJob;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, importJobId: { required: true, type: () => String }, rowNumber: { required: true, type: () => Number }, columnName: { required: true, type: () => String }, columnIndex: { required: true, type: () => Number }, errorType: { required: true, enum: require("./import-job-error.entity").ImportErrorType }, severity: { required: true, enum: require("./import-job-error.entity").ImportErrorSeverity }, errorCode: { required: true, type: () => String }, errorMessage: { required: true, type: () => String }, fieldValue: { required: true, type: () => String }, expectedValue: { required: true, type: () => String }, rowData: { required: true, type: () => Object }, isResolved: { required: true, type: () => Boolean }, resolutionNotes: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, importJob: { required: true, type: () => require("./import-job.entity").ImportJob } };
    }
};
exports.ImportJobError = ImportJobError;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ImportJobError.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'import_job_id' }),
    __metadata("design:type", String)
], ImportJobError.prototype, "importJobId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'row_number', type: 'int' }),
    __metadata("design:type", Number)
], ImportJobError.prototype, "rowNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'column_name', length: 200, nullable: true }),
    __metadata("design:type", String)
], ImportJobError.prototype, "columnName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'column_index', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], ImportJobError.prototype, "columnIndex", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'error_type',
        type: 'enum',
        enum: ImportErrorType,
    }),
    __metadata("design:type", String)
], ImportJobError.prototype, "errorType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ImportErrorSeverity,
        default: ImportErrorSeverity.ERROR,
    }),
    __metadata("design:type", String)
], ImportJobError.prototype, "severity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'error_code', length: 50, nullable: true }),
    __metadata("design:type", String)
], ImportJobError.prototype, "errorCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'error_message', type: 'text' }),
    __metadata("design:type", String)
], ImportJobError.prototype, "errorMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'field_value', type: 'text', nullable: true }),
    __metadata("design:type", String)
], ImportJobError.prototype, "fieldValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expected_value', type: 'text', nullable: true }),
    __metadata("design:type", String)
], ImportJobError.prototype, "expectedValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'row_data', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], ImportJobError.prototype, "rowData", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_resolved', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], ImportJobError.prototype, "isResolved", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'resolution_notes', type: 'text', nullable: true }),
    __metadata("design:type", String)
], ImportJobError.prototype, "resolutionNotes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ImportJobError.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => import_job_entity_1.ImportJob, (job) => job.errors, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'import_job_id' }),
    __metadata("design:type", import_job_entity_1.ImportJob)
], ImportJobError.prototype, "importJob", void 0);
exports.ImportJobError = ImportJobError = __decorate([
    (0, typeorm_1.Entity)('import_job_errors')
], ImportJobError);
//# sourceMappingURL=import-job-error.entity.js.map