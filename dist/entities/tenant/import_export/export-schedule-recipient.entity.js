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
exports.ExportScheduleRecipient = exports.RecipientType = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const export_schedule_entity_1 = require("./export-schedule.entity");
const user_entity_1 = require("../user/user.entity");
var RecipientType;
(function (RecipientType) {
    RecipientType["USER"] = "USER";
    RecipientType["EMAIL"] = "EMAIL";
    RecipientType["WEBHOOK"] = "WEBHOOK";
    RecipientType["FTP"] = "FTP";
    RecipientType["S3"] = "S3";
})(RecipientType || (exports.RecipientType = RecipientType = {}));
let ExportScheduleRecipient = class ExportScheduleRecipient {
    id;
    scheduleId;
    recipientType;
    userId;
    email;
    recipientName;
    webhookUrl;
    ftpHost;
    ftpUsername;
    ftpPassword;
    ftpPath;
    s3Bucket;
    s3Path;
    isActive;
    createdAt;
    schedule;
    user;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, scheduleId: { required: true, type: () => String }, recipientType: { required: true, enum: require("./export-schedule-recipient.entity").RecipientType }, userId: { required: true, type: () => String }, email: { required: true, type: () => String }, recipientName: { required: true, type: () => String }, webhookUrl: { required: true, type: () => String }, ftpHost: { required: true, type: () => String }, ftpUsername: { required: true, type: () => String }, ftpPassword: { required: true, type: () => String }, ftpPath: { required: true, type: () => String }, s3Bucket: { required: true, type: () => String }, s3Path: { required: true, type: () => String }, isActive: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, schedule: { required: true, type: () => require("./export-schedule.entity").ExportSchedule }, user: { required: true, type: () => require("../user/user.entity").User } };
    }
};
exports.ExportScheduleRecipient = ExportScheduleRecipient;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ExportScheduleRecipient.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'schedule_id' }),
    __metadata("design:type", String)
], ExportScheduleRecipient.prototype, "scheduleId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'recipient_type',
        type: 'enum',
        enum: RecipientType,
        default: RecipientType.EMAIL,
    }),
    __metadata("design:type", String)
], ExportScheduleRecipient.prototype, "recipientType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', nullable: true }),
    __metadata("design:type", String)
], ExportScheduleRecipient.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], ExportScheduleRecipient.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'recipient_name', length: 200, nullable: true }),
    __metadata("design:type", String)
], ExportScheduleRecipient.prototype, "recipientName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'webhook_url', length: 500, nullable: true }),
    __metadata("design:type", String)
], ExportScheduleRecipient.prototype, "webhookUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ftp_host', length: 255, nullable: true }),
    __metadata("design:type", String)
], ExportScheduleRecipient.prototype, "ftpHost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ftp_username', length: 100, nullable: true }),
    __metadata("design:type", String)
], ExportScheduleRecipient.prototype, "ftpUsername", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ftp_password', length: 255, nullable: true }),
    __metadata("design:type", String)
], ExportScheduleRecipient.prototype, "ftpPassword", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ftp_path', length: 500, nullable: true }),
    __metadata("design:type", String)
], ExportScheduleRecipient.prototype, "ftpPath", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 's3_bucket', length: 255, nullable: true }),
    __metadata("design:type", String)
], ExportScheduleRecipient.prototype, "s3Bucket", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 's3_path', length: 500, nullable: true }),
    __metadata("design:type", String)
], ExportScheduleRecipient.prototype, "s3Path", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], ExportScheduleRecipient.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ExportScheduleRecipient.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => export_schedule_entity_1.ExportSchedule, (schedule) => schedule.recipients, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'schedule_id' }),
    __metadata("design:type", export_schedule_entity_1.ExportSchedule)
], ExportScheduleRecipient.prototype, "schedule", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], ExportScheduleRecipient.prototype, "user", void 0);
exports.ExportScheduleRecipient = ExportScheduleRecipient = __decorate([
    (0, typeorm_1.Entity)('export_schedule_recipients')
], ExportScheduleRecipient);
//# sourceMappingURL=export-schedule-recipient.entity.js.map