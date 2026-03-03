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
exports.DebitNotesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const debit_notes_service_1 = require("./debit-notes.service");
const debit_note_dto_1 = require("./dto/debit-note.dto");
let DebitNotesController = class DebitNotesController {
    debitNotesService;
    constructor(debitNotesService) {
        this.debitNotesService = debitNotesService;
    }
    async create(dto, user) {
        return this.debitNotesService.create(dto, user.sub);
    }
    async findAll(filterDto) {
        return this.debitNotesService.findAll(filterDto);
    }
    async findBySupplier(supplierId) {
        return this.debitNotesService.findBySupplier(supplierId);
    }
    async findOne(id) {
        return this.debitNotesService.findById(id);
    }
    async submit(id, user) {
        return this.debitNotesService.submitForApproval(id, user.sub);
    }
    async approve(id, user) {
        return this.debitNotesService.approve(id, user.sub);
    }
    async send(id, user) {
        return this.debitNotesService.sendToSupplier(id, user.sub);
    }
    async acknowledge(id, dto, user) {
        return this.debitNotesService.acknowledge(id, dto, user.sub);
    }
    async applyToDue(id, dto, user) {
        return this.debitNotesService.applyToDue(id, dto, user.sub);
    }
    async cancel(id, user) {
        return this.debitNotesService.cancel(id, user.sub);
    }
};
exports.DebitNotesController = DebitNotesController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('debit_notes.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create debit note' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/dueManagement/debit-note.entity").DebitNote }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [debit_note_dto_1.CreateDebitNoteDto, Object]),
    __metadata("design:returntype", Promise)
], DebitNotesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('debit_notes.read'),
    (0, swagger_1.ApiOperation)({ summary: 'List debit notes' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [debit_note_dto_1.DebitNoteFilterDto]),
    __metadata("design:returntype", Promise)
], DebitNotesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('supplier/:supplierId'),
    (0, permissions_decorator_1.Permissions)('debit_notes.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Debit notes by supplier' }),
    openapi.ApiResponse({ status: 200, type: [require("../../../entities/tenant/dueManagement/debit-note.entity").DebitNote] }),
    __param(0, (0, common_1.Param)('supplierId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DebitNotesController.prototype, "findBySupplier", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('debit_notes.read'),
    (0, swagger_1.ApiParam)({ name: 'id', format: 'uuid' }),
    openapi.ApiResponse({ status: 200, type: require("../../../entities/tenant/dueManagement/debit-note.entity").DebitNote }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DebitNotesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/submit'),
    (0, permissions_decorator_1.Permissions)('debit_notes.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit for approval' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/dueManagement/debit-note.entity").DebitNote }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DebitNotesController.prototype, "submit", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, permissions_decorator_1.Permissions)('debit_notes.approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve debit note' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/dueManagement/debit-note.entity").DebitNote }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DebitNotesController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/send'),
    (0, permissions_decorator_1.Permissions)('debit_notes.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Send to supplier' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/dueManagement/debit-note.entity").DebitNote }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DebitNotesController.prototype, "send", null);
__decorate([
    (0, common_1.Post)(':id/acknowledge'),
    (0, permissions_decorator_1.Permissions)('debit_notes.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Record supplier acknowledgement' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/dueManagement/debit-note.entity").DebitNote }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, debit_note_dto_1.AcknowledgeDebitNoteDto, Object]),
    __metadata("design:returntype", Promise)
], DebitNotesController.prototype, "acknowledge", null);
__decorate([
    (0, common_1.Post)(':id/apply'),
    (0, permissions_decorator_1.Permissions)('debit_notes.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Apply debit note against a supplier due' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/dueManagement/debit-note.entity").DebitNote }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, debit_note_dto_1.ApplyToSupplierDueDto, Object]),
    __metadata("design:returntype", Promise)
], DebitNotesController.prototype, "applyToDue", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, permissions_decorator_1.Permissions)('debit_notes.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel debit note (unused only)' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/dueManagement/debit-note.entity").DebitNote }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DebitNotesController.prototype, "cancel", null);
exports.DebitNotesController = DebitNotesController = __decorate([
    (0, swagger_1.ApiTags)('Debit Notes'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('debit-notes'),
    __metadata("design:paramtypes", [debit_notes_service_1.DebitNotesService])
], DebitNotesController);
//# sourceMappingURL=debit-notes.controller.js.map