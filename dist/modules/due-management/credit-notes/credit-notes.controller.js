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
exports.CreditNotesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const credit_notes_service_1 = require("./credit-notes.service");
const credit_note_dto_1 = require("./dto/credit-note.dto");
let CreditNotesController = class CreditNotesController {
    creditNotesService;
    constructor(creditNotesService) {
        this.creditNotesService = creditNotesService;
    }
    async create(dto, user) {
        return this.creditNotesService.create(dto, user.sub);
    }
    async findAll(filterDto) {
        return this.creditNotesService.findAll(filterDto);
    }
    async findByCustomer(customerId) {
        return this.creditNotesService.findByCustomer(customerId);
    }
    async findUsable(customerId) {
        return this.creditNotesService.findUsableByCustomer(customerId);
    }
    async findOne(id) {
        return this.creditNotesService.findById(id);
    }
    async submit(id, user) {
        return this.creditNotesService.submitForApproval(id, user.sub);
    }
    async approve(id, user) {
        return this.creditNotesService.approve(id, user.sub);
    }
    async applyToDue(id, dto, user) {
        return this.creditNotesService.applyToDue(id, dto, user.sub);
    }
    async cancel(id, user) {
        return this.creditNotesService.cancel(id, user.sub);
    }
};
exports.CreditNotesController = CreditNotesController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('credit_notes.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create credit note' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/dueManagement/credit-note.entity").CreditNote }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [credit_note_dto_1.CreateCreditNoteDto, Object]),
    __metadata("design:returntype", Promise)
], CreditNotesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('credit_notes.read'),
    (0, swagger_1.ApiOperation)({ summary: 'List credit notes with filters' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [credit_note_dto_1.CreditNoteFilterDto]),
    __metadata("design:returntype", Promise)
], CreditNotesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('customer/:customerId'),
    (0, permissions_decorator_1.Permissions)('credit_notes.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Credit notes by customer' }),
    openapi.ApiResponse({ status: 200, type: [require("../../../entities/tenant/dueManagement/credit-note.entity").CreditNote] }),
    __param(0, (0, common_1.Param)('customerId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CreditNotesController.prototype, "findByCustomer", null);
__decorate([
    (0, common_1.Get)('customer/:customerId/usable'),
    (0, permissions_decorator_1.Permissions)('credit_notes.read'),
    (0, swagger_1.ApiOperation)({
        summary: 'Usable (approved + balance > 0 + not expired) credit notes',
    }),
    openapi.ApiResponse({ status: 200, type: [require("../../../entities/tenant/dueManagement/credit-note.entity").CreditNote] }),
    __param(0, (0, common_1.Param)('customerId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CreditNotesController.prototype, "findUsable", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('credit_notes.read'),
    (0, swagger_1.ApiParam)({ name: 'id', format: 'uuid' }),
    openapi.ApiResponse({ status: 200, type: require("../../../entities/tenant/dueManagement/credit-note.entity").CreditNote }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CreditNotesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/submit'),
    (0, permissions_decorator_1.Permissions)('credit_notes.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit for approval' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/dueManagement/credit-note.entity").CreditNote }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CreditNotesController.prototype, "submit", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, permissions_decorator_1.Permissions)('credit_notes.approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve credit note' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/dueManagement/credit-note.entity").CreditNote }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CreditNotesController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/apply'),
    (0, permissions_decorator_1.Permissions)('credit_notes.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Apply credit note against a customer due' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/dueManagement/credit-note.entity").CreditNote }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, credit_note_dto_1.ApplyToDueDto, Object]),
    __metadata("design:returntype", Promise)
], CreditNotesController.prototype, "applyToDue", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, permissions_decorator_1.Permissions)('credit_notes.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel credit note (unused only)' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/dueManagement/credit-note.entity").CreditNote }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CreditNotesController.prototype, "cancel", null);
exports.CreditNotesController = CreditNotesController = __decorate([
    (0, swagger_1.ApiTags)('Credit Notes'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('credit-notes'),
    __metadata("design:paramtypes", [credit_notes_service_1.CreditNotesService])
], CreditNotesController);
//# sourceMappingURL=credit-notes.controller.js.map