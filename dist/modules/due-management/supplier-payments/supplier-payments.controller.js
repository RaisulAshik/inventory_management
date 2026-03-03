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
exports.SupplierPaymentsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const supplier_payments_service_1 = require("./supplier-payments.service");
const supplier_payment_dto_1 = require("./dto/supplier-payment.dto");
let SupplierPaymentsController = class SupplierPaymentsController {
    paymentsService;
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    async create(dto, user) {
        return this.paymentsService.create(dto, user.sub);
    }
    async findAll(filterDto) {
        return this.paymentsService.findAll(filterDto);
    }
    async findOne(id) {
        return this.paymentsService.findById(id);
    }
    async submit(id, user) {
        return this.paymentsService.submitForApproval(id, user.sub);
    }
    async approve(id, user) {
        return this.paymentsService.approve(id, user.sub);
    }
    async process(id, user) {
        return this.paymentsService.process(id, user.sub);
    }
    async complete(id, user) {
        return this.paymentsService.complete(id, user.sub);
    }
    async allocate(id, dto, user) {
        return this.paymentsService.allocate(id, dto, user.sub);
    }
    async cancel(id, reason, user) {
        return this.paymentsService.cancel(id, reason, user.sub);
    }
};
exports.SupplierPaymentsController = SupplierPaymentsController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('supplier_payments.create'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create supplier payment (with optional allocation)',
    }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/dueManagement/supplier-payment.entity").SupplierPayment }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [supplier_payment_dto_1.CreateSupplierPaymentDto, Object]),
    __metadata("design:returntype", Promise)
], SupplierPaymentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('supplier_payments.read'),
    (0, swagger_1.ApiOperation)({ summary: 'List supplier payments' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [supplier_payment_dto_1.SupplierPaymentFilterDto]),
    __metadata("design:returntype", Promise)
], SupplierPaymentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('supplier_payments.read'),
    (0, swagger_1.ApiParam)({ name: 'id', format: 'uuid' }),
    openapi.ApiResponse({ status: 200, type: require("../../../entities/tenant/dueManagement/supplier-payment.entity").SupplierPayment }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupplierPaymentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/submit'),
    (0, permissions_decorator_1.Permissions)('supplier_payments.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit for approval' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/dueManagement/supplier-payment.entity").SupplierPayment }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SupplierPaymentsController.prototype, "submit", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, permissions_decorator_1.Permissions)('supplier_payments.approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve payment' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/dueManagement/supplier-payment.entity").SupplierPayment }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SupplierPaymentsController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/process'),
    (0, permissions_decorator_1.Permissions)('supplier_payments.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Process payment (executes + updates dues)' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/dueManagement/supplier-payment.entity").SupplierPayment }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SupplierPaymentsController.prototype, "process", null);
__decorate([
    (0, common_1.Post)(':id/complete'),
    (0, permissions_decorator_1.Permissions)('supplier_payments.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark payment as completed' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/dueManagement/supplier-payment.entity").SupplierPayment }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SupplierPaymentsController.prototype, "complete", null);
__decorate([
    (0, common_1.Post)(':id/allocate'),
    (0, permissions_decorator_1.Permissions)('supplier_payments.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Allocate unallocated amount to dues' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/dueManagement/supplier-payment.entity").SupplierPayment }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, supplier_payment_dto_1.AllocatePaymentDto, Object]),
    __metadata("design:returntype", Promise)
], SupplierPaymentsController.prototype, "allocate", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, permissions_decorator_1.Permissions)('supplier_payments.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel payment' }),
    openapi.ApiResponse({ status: 201, type: require("../../../entities/tenant/dueManagement/supplier-payment.entity").SupplierPayment }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('reason')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], SupplierPaymentsController.prototype, "cancel", null);
exports.SupplierPaymentsController = SupplierPaymentsController = __decorate([
    (0, swagger_1.ApiTags)('Supplier Payments'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('supplier-payments'),
    __metadata("design:paramtypes", [supplier_payments_service_1.SupplierPaymentsService])
], SupplierPaymentsController);
//# sourceMappingURL=supplier-payments.controller.js.map