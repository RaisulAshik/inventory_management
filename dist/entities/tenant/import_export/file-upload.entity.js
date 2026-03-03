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
exports.FileUpload = exports.FileUploadPurpose = exports.FileUploadStatus = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../user/user.entity");
var FileUploadStatus;
(function (FileUploadStatus) {
    FileUploadStatus["PENDING"] = "PENDING";
    FileUploadStatus["UPLOADING"] = "UPLOADING";
    FileUploadStatus["COMPLETED"] = "COMPLETED";
    FileUploadStatus["FAILED"] = "FAILED";
    FileUploadStatus["PROCESSING"] = "PROCESSING";
    FileUploadStatus["PROCESSED"] = "PROCESSED";
    FileUploadStatus["EXPIRED"] = "EXPIRED";
    FileUploadStatus["DELETED"] = "DELETED";
})(FileUploadStatus || (exports.FileUploadStatus = FileUploadStatus = {}));
var FileUploadPurpose;
(function (FileUploadPurpose) {
    FileUploadPurpose["IMPORT"] = "IMPORT";
    FileUploadPurpose["ATTACHMENT"] = "ATTACHMENT";
    FileUploadPurpose["PRODUCT_IMAGE"] = "PRODUCT_IMAGE";
    FileUploadPurpose["DOCUMENT"] = "DOCUMENT";
    FileUploadPurpose["REPORT"] = "REPORT";
    FileUploadPurpose["BACKUP"] = "BACKUP";
    FileUploadPurpose["OTHER"] = "OTHER";
})(FileUploadPurpose || (exports.FileUploadPurpose = FileUploadPurpose = {}));
let FileUpload = class FileUpload {
    id;
    originalFilename;
    storedFilename;
    filePath;
    fileUrl;
    mimeType;
    fileExtension;
    fileSize;
    checksum;
    status;
    purpose;
    referenceType;
    referenceId;
    storageProvider;
    storageBucket;
    isPublic;
    isTemporary;
    expiresAt;
    deletedAt;
    metadata;
    errorMessage;
    uploadedBy;
    createdAt;
    uploadedByUser;
    get fileSizeFormatted() {
        const bytes = this.fileSize;
        if (bytes === 0)
            return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    get isExpired() {
        return this.expiresAt && new Date(this.expiresAt) < new Date();
    }
    get isDeleted() {
        return this.deletedAt !== null;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, originalFilename: { required: true, type: () => String }, storedFilename: { required: true, type: () => String }, filePath: { required: true, type: () => String }, fileUrl: { required: true, type: () => String }, mimeType: { required: true, type: () => String }, fileExtension: { required: true, type: () => String }, fileSize: { required: true, type: () => Number }, checksum: { required: true, type: () => String }, status: { required: true, enum: require("./file-upload.entity").FileUploadStatus }, purpose: { required: true, enum: require("./file-upload.entity").FileUploadPurpose }, referenceType: { required: true, type: () => String }, referenceId: { required: true, type: () => String }, storageProvider: { required: true, type: () => String }, storageBucket: { required: true, type: () => String }, isPublic: { required: true, type: () => Boolean }, isTemporary: { required: true, type: () => Boolean }, expiresAt: { required: true, type: () => Date }, deletedAt: { required: true, type: () => Date }, metadata: { required: true, type: () => Object }, errorMessage: { required: true, type: () => String }, uploadedBy: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, uploadedByUser: { required: true, type: () => require("../user/user.entity").User } };
    }
};
exports.FileUpload = FileUpload;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FileUpload.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'original_filename', length: 255 }),
    __metadata("design:type", String)
], FileUpload.prototype, "originalFilename", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stored_filename', length: 255 }),
    __metadata("design:type", String)
], FileUpload.prototype, "storedFilename", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_path', length: 500 }),
    __metadata("design:type", String)
], FileUpload.prototype, "filePath", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_url', length: 500, nullable: true }),
    __metadata("design:type", String)
], FileUpload.prototype, "fileUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'mime_type', length: 100 }),
    __metadata("design:type", String)
], FileUpload.prototype, "mimeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_extension', length: 20 }),
    __metadata("design:type", String)
], FileUpload.prototype, "fileExtension", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_size', type: 'bigint' }),
    __metadata("design:type", Number)
], FileUpload.prototype, "fileSize", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'checksum', length: 64, nullable: true }),
    __metadata("design:type", String)
], FileUpload.prototype, "checksum", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: FileUploadStatus,
        default: FileUploadStatus.PENDING,
    }),
    __metadata("design:type", String)
], FileUpload.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: FileUploadPurpose,
        default: FileUploadPurpose.OTHER,
    }),
    __metadata("design:type", String)
], FileUpload.prototype, "purpose", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_type', length: 100, nullable: true }),
    __metadata("design:type", String)
], FileUpload.prototype, "referenceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_id', nullable: true }),
    __metadata("design:type", String)
], FileUpload.prototype, "referenceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'storage_provider', length: 50, default: 'LOCAL' }),
    __metadata("design:type", String)
], FileUpload.prototype, "storageProvider", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'storage_bucket', length: 255, nullable: true }),
    __metadata("design:type", String)
], FileUpload.prototype, "storageBucket", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_public', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], FileUpload.prototype, "isPublic", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_temporary', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], FileUpload.prototype, "isTemporary", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expires_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], FileUpload.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'deleted_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], FileUpload.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], FileUpload.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'error_message', type: 'text', nullable: true }),
    __metadata("design:type", String)
], FileUpload.prototype, "errorMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'uploaded_by', nullable: true }),
    __metadata("design:type", String)
], FileUpload.prototype, "uploadedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], FileUpload.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'uploaded_by' }),
    __metadata("design:type", user_entity_1.User)
], FileUpload.prototype, "uploadedByUser", void 0);
exports.FileUpload = FileUpload = __decorate([
    (0, typeorm_1.Entity)('file_uploads')
], FileUpload);
//# sourceMappingURL=file-upload.entity.js.map