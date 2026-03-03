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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRemindersController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const payment_reminders_service_1 = require("./payment-reminders.service");
const reminder_dto_1 = require("./dto/reminder.dto");
let PaymentRemindersController = class PaymentRemindersController {
    remindersService;
    constructor(remindersService) {
        this.remindersService = remindersService;
    }
    async findAll(filterDto) {
        return this.remindersService.findAll(filterDto);
    }
    async getFollowUpsToday() {
        return this.remindersService.getFollowUpsToday();
    }
    async getBrokenPromises() {
        return this.remindersService.getBrokenPromises();
    }
    async findByDue(dueId) {
        return this.remindersService.findByDue(dueId);
    }
    async findOne(id) {
        return this.remindersService.findById(id);
    }
    async create(dto, user) {
        return this.remindersService.createManual(dto, user.sub);
    }
    async markSent(id, user) {
        return this.remindersService.markSent(id, user.sub);
    }
    async recordResponse(id, dto, user) {
        return this.remindersService.recordResponse(id, dto, user.sub);
    }
    async cancel(id, user) {
        return this.remindersService.cancel(id, user.sub);
    }
};
exports.PaymentRemindersController = PaymentRemindersController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('payment_reminders.read'),
    (0, swagger_1.ApiOperation)({ summary: 'List reminders with filters' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reminder_dto_1.ReminderFilterDto]),
    __metadata("design:returntype", Promise)
], PaymentRemindersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('follow-ups-today'),
    (0, permissions_decorator_1.Permissions)('payment_reminders.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Reminders with follow-up due today or earlier' }),
    openapi.ApiResponse({ status: 200, type: [require("../../../entities/tenant/dueManagement/payment-reminder.entity").PaymentReminder] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentRemindersController.prototype, "getFollowUpsToday", null);
__decorate([
    (0, common_1.Get)('broken-promises'),
    (0, permissions_decorator_1.Permissions)('payment_reminders.read'),
    (0, swagger_1.ApiOperation)({
        summary: 'Reminders where promise-to-pay date passed but due still unpaid',
    }),
    openapi.ApiResponse({ status: 200, type: [require("../../../entities/tenant/dueManagement/payment-reminder.entity").PaymentReminder] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentRemindersController.prototype, "getBrokenPromises", null);
__decorate([
    (0, common_1.Get)('due/:dueId'),
    (0, permissions_decorator_1.Permissions)('payment_reminders.read'),
    (0, swagger_1.ApiOperation)({ summary: 'All reminders for a specific due' }),
    openapi.ApiResponse({ status: 200, type: [require("../../../entities/tenant/dueManagement/payment-reminder.entity").PaymentReminder] }),
    __param(0, (0, common_1.Param)('dueId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentRemindersController.prototype, "findByDue", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('payment_reminders.read'),
    (0, swagger_1.ApiParam)({ name: 'id', format: 'uuid' }),
    openapi.ApiResponse({ status: 200, type: require("../../../entities/tenant/dueManagement/payment-reminder.entity").PaymentReminder }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentRemindersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('payment_reminders.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create manual reminder' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/dueManagement/payment-reminder.entity").PaymentReminder }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reminder_dto_1.CreateReminderDto, Object]),
    __metadata("design:returntype", Promise)
], PaymentRemindersController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/send'),
    (0, permissions_decorator_1.Permissions)('payment_reminders.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark reminder as sent' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/dueManagement/payment-reminder.entity").PaymentReminder }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentRemindersController.prototype, "markSent", null);
__decorate([
    (0, common_1.Post)(':id/response'),
    (0, permissions_decorator_1.Permissions)('payment_reminders.update'),
    (0, swagger_1.ApiOperation)({
        summary: 'Record customer response (promise to pay, follow-up, etc.)',
    }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/dueManagement/payment-reminder.entity").PaymentReminder }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reminder_dto_1.RecordResponseDto, Object]),
    __metadata("design:returntype", Promise)
], PaymentRemindersController.prototype, "recordResponse", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, permissions_decorator_1.Permissions)('payment_reminders.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel a scheduled reminder' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/dueManagement/payment-reminder.entity").PaymentReminder }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentRemindersController.prototype, "cancel", null);
exports.PaymentRemindersController = PaymentRemindersController = __decorate([
    (0, swagger_1.ApiTags)('Payment Reminders'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('payment-reminders'),
    __metadata("design:paramtypes", [payment_reminders_service_1.PaymentRemindersService])
], PaymentRemindersController);
//# sourceMappingURL=payment-reminders.controller.js.map