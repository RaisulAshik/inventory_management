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
exports.JournalEntriesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const journal_entries_dto_1 = require("../dto/journal-entries.dto");
const journal_entries_service_1 = require("../service/journal-entries.service");
let JournalEntriesController = class JournalEntriesController {
    journalEntriesService;
    constructor(journalEntriesService) {
        this.journalEntriesService = journalEntriesService;
    }
    create(dto, currentUser) {
        return this.journalEntriesService.create(dto, currentUser.sub);
    }
    findAll(query) {
        return this.journalEntriesService.findAll(query);
    }
    findOne(id) {
        return this.journalEntriesService.findOne(id);
    }
    update(id, dto) {
        return this.journalEntriesService.update(id, dto);
    }
    post(id, currentUser) {
        return this.journalEntriesService.post(id, currentUser.sub);
    }
    reverse(id, dto, currentUser) {
        return this.journalEntriesService.reverse(id, dto, currentUser.sub);
    }
    remove(id) {
        return this.journalEntriesService.remove(id);
    }
};
exports.JournalEntriesController = JournalEntriesController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('accounting.journal-entries.create'),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/accounting/journal-entry.entity").JournalEntry }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [journal_entries_dto_1.CreateJournalEntryDto, Object]),
    __metadata("design:returntype", void 0)
], JournalEntriesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('accounting.journal-entries.read'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [journal_entries_dto_1.QueryJournalEntryDto]),
    __metadata("design:returntype", void 0)
], JournalEntriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('accounting.journal-entries.read'),
    openapi.ApiResponse({ status: 200, type: require("../../../entities/tenant/accounting/journal-entry.entity").JournalEntry }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JournalEntriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.Permissions)('accounting.journal-entries.update'),
    openapi.ApiResponse({ status: 200, type: require("../../../entities/tenant/accounting/journal-entry.entity").JournalEntry }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, journal_entries_dto_1.UpdateJournalEntryDto]),
    __metadata("design:returntype", void 0)
], JournalEntriesController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/post'),
    (0, permissions_decorator_1.Permissions)('accounting.journal-entries.post'),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/accounting/journal-entry.entity").JournalEntry }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], JournalEntriesController.prototype, "post", null);
__decorate([
    (0, common_1.Post)(':id/reverse'),
    (0, permissions_decorator_1.Permissions)('accounting.journal-entries.reverse'),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/accounting/journal-entry.entity").JournalEntry }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, journal_entries_dto_1.ReverseJournalEntryDto, Object]),
    __metadata("design:returntype", void 0)
], JournalEntriesController.prototype, "reverse", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('accounting.journal-entries.delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JournalEntriesController.prototype, "remove", null);
exports.JournalEntriesController = JournalEntriesController = __decorate([
    (0, common_1.Controller)('api/v1/accounting/journal-entries'),
    __metadata("design:paramtypes", [journal_entries_service_1.JournalEntriesService])
], JournalEntriesController);
//# sourceMappingURL=journal-entries.controller.js.map