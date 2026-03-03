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
exports.ReminderFilterDto = exports.RecordResponseDto = exports.CreateReminderDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const pagination_dto_1 = require("../../../../common/dto/pagination.dto");
const class_transformer_1 = require("class-transformer");
const payment_reminder_entity_1 = require("../../../../entities/tenant/dueManagement/payment-reminder.entity");
class CreateReminderDto {
    customerId;
    customerDueId;
    reminderType;
    reminderDate;
    scheduledTime;
    subject;
    message;
    recipientEmail;
    recipientPhone;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { customerId: { required: true, type: () => String, format: "uuid" }, customerDueId: { required: false, type: () => String, format: "uuid" }, reminderType: { required: true, enum: require("../../../../entities/tenant/dueManagement/payment-reminder.entity").ReminderType }, reminderDate: { required: true, type: () => String }, scheduledTime: { required: false, type: () => String }, subject: { required: false, type: () => String }, message: { required: false, type: () => String }, recipientEmail: { required: false, type: () => String }, recipientPhone: { required: false, type: () => String }, notes: { required: false, type: () => String } };
    }
}
exports.CreateReminderDto = CreateReminderDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateReminderDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateReminderDto.prototype, "customerDueId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: payment_reminder_entity_1.ReminderType }),
    (0, class_validator_1.IsEnum)(payment_reminder_entity_1.ReminderType),
    __metadata("design:type", String)
], CreateReminderDto.prototype, "reminderType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateReminderDto.prototype, "reminderDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateReminderDto.prototype, "scheduledTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateReminderDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateReminderDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateReminderDto.prototype, "recipientEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateReminderDto.prototype, "recipientPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateReminderDto.prototype, "notes", void 0);
class RecordResponseDto {
    responseReceived;
    responseDate;
    responseNotes;
    promiseToPayDate;
    promisedAmount;
    followUpRequired;
    followUpDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { responseReceived: { required: true, type: () => Boolean }, responseDate: { required: false, type: () => String }, responseNotes: { required: false, type: () => String }, promiseToPayDate: { required: false, type: () => String }, promisedAmount: { required: false, type: () => Number, minimum: 0 }, followUpRequired: { required: false, type: () => Boolean }, followUpDate: { required: false, type: () => String } };
    }
}
exports.RecordResponseDto = RecordResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], RecordResponseDto.prototype, "responseReceived", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RecordResponseDto.prototype, "responseDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RecordResponseDto.prototype, "responseNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RecordResponseDto.prototype, "promiseToPayDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], RecordResponseDto.prototype, "promisedAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], RecordResponseDto.prototype, "followUpRequired", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RecordResponseDto.prototype, "followUpDate", void 0);
class ReminderFilterDto extends pagination_dto_1.PaginationDto {
    status;
    reminderType;
    customerId;
    customerDueId;
    fromDate;
    toDate;
    followUpToday;
    brokenPromises;
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: false, enum: require("../../../../entities/tenant/dueManagement/payment-reminder.entity").ReminderStatus }, reminderType: { required: false, enum: require("../../../../entities/tenant/dueManagement/payment-reminder.entity").ReminderType }, customerId: { required: false, type: () => String, format: "uuid" }, customerDueId: { required: false, type: () => String, format: "uuid" }, fromDate: { required: false, type: () => String }, toDate: { required: false, type: () => String }, followUpToday: { required: false, type: () => Boolean }, brokenPromises: { required: false, type: () => Boolean } };
    }
}
exports.ReminderFilterDto = ReminderFilterDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(payment_reminder_entity_1.ReminderStatus),
    __metadata("design:type", String)
], ReminderFilterDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(payment_reminder_entity_1.ReminderType),
    __metadata("design:type", String)
], ReminderFilterDto.prototype, "reminderType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ReminderFilterDto.prototype, "customerId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ReminderFilterDto.prototype, "customerDueId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReminderFilterDto.prototype, "fromDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReminderFilterDto.prototype, "toDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true'),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ReminderFilterDto.prototype, "followUpToday", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true'),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ReminderFilterDto.prototype, "brokenPromises", void 0);
//# sourceMappingURL=reminder.dto.js.map