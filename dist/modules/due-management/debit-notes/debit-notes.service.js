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
exports.DebitNotesService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const tenant_connection_manager_1 = require("../../../database/tenant-connection.manager");
const pagination_util_1 = require("../../../common/utils/pagination.util");
const sequence_util_1 = require("../../../common/utils/sequence.util");
const tenant_1 = require("../../../entities/tenant");
const supplier_dues_service_1 = require("../supplier-dues/supplier-dues.service");
let DebitNotesService = class DebitNotesService {
    tenantConnectionManager;
    supplierDuesService;
    constructor(tenantConnectionManager, supplierDuesService) {
        this.tenantConnectionManager = tenantConnectionManager;
        this.supplierDuesService = supplierDuesService;
    }
    async getRepo() {
        return this.tenantConnectionManager.getRepository(tenant_1.DebitNote);
    }
    async getDataSource() {
        return this.tenantConnectionManager.getDataSource();
    }
    async create(dto, userId) {
        const ds = await this.getDataSource();
        const repo = ds.getRepository(tenant_1.DebitNote);
        const debitNoteNumber = await (0, sequence_util_1.getNextSequence)(ds, 'DEBIT_NOTE');
        const dn = repo.create({
            id: (0, uuid_1.v4)(),
            debitNoteNumber,
            debitNoteDate: dto.debitNoteDate,
            supplierId: dto.supplierId,
            purchaseOrderId: dto.purchaseOrderId,
            grnId: dto.grnId,
            purchaseReturnId: dto.purchaseReturnId,
            reason: dto.reason,
            reasonDetails: dto.reasonDetails,
            status: tenant_1.DebitNoteStatus.DRAFT,
            currency: dto.currency || 'BDT',
            subtotal: dto.subtotal,
            taxAmount: dto.taxAmount || 0,
            totalAmount: dto.totalAmount,
            adjustedAmount: 0,
            balanceAmount: dto.totalAmount,
            notes: dto.notes,
            createdBy: userId,
        });
        return repo.save(dn);
    }
    async findAll(filterDto) {
        const repo = await this.getRepo();
        const qb = repo
            .createQueryBuilder('dn')
            .leftJoinAndSelect('dn.supplier', 'supplier');
        if (filterDto.status)
            qb.andWhere('dn.status = :status', { status: filterDto.status });
        if (filterDto.supplierId)
            qb.andWhere('dn.supplierId = :sid', { sid: filterDto.supplierId });
        if (filterDto.reason)
            qb.andWhere('dn.reason = :reason', { reason: filterDto.reason });
        if (filterDto.fromDate)
            qb.andWhere('dn.debitNoteDate >= :from', { from: filterDto.fromDate });
        if (filterDto.toDate)
            qb.andWhere('dn.debitNoteDate <= :to', { to: filterDto.toDate });
        if (filterDto.search) {
            qb.andWhere('(dn.debitNoteNumber LIKE :s OR supplier.name LIKE :s OR supplier.companyName LIKE :s)', { s: `%${filterDto.search}%` });
        }
        if (!filterDto.sortBy) {
            filterDto.sortBy = 'debitNoteDate';
            filterDto.sortOrder = 'DESC';
        }
        return (0, pagination_util_1.paginate)(qb, filterDto);
    }
    async findById(id) {
        const repo = await this.getRepo();
        const dn = await repo.findOne({
            where: { id },
            relations: ['supplier', 'purchaseOrder', 'grn', 'purchaseReturn'],
        });
        if (!dn)
            throw new common_1.NotFoundException(`Debit note ${id} not found`);
        return dn;
    }
    async findBySupplier(supplierId) {
        const repo = await this.getRepo();
        return repo.find({
            where: { supplierId },
            relations: ['purchaseOrder'],
            order: { debitNoteDate: 'DESC' },
        });
    }
    async submitForApproval(id, userId) {
        const repo = await this.getRepo();
        const dn = await this.findById(id);
        if (dn.status !== tenant_1.DebitNoteStatus.DRAFT) {
            throw new common_1.BadRequestException('Only draft debit notes can be submitted');
        }
        dn.status = tenant_1.DebitNoteStatus.PENDING_APPROVAL;
        return repo.save(dn);
    }
    async approve(id, userId) {
        const repo = await this.getRepo();
        const dn = await this.findById(id);
        if (![tenant_1.DebitNoteStatus.DRAFT, tenant_1.DebitNoteStatus.PENDING_APPROVAL].includes(dn.status)) {
            throw new common_1.BadRequestException('Only draft/pending debit notes can be approved');
        }
        dn.status = tenant_1.DebitNoteStatus.APPROVED;
        dn.approvedBy = userId;
        dn.approvedAt = new Date();
        return repo.save(dn);
    }
    async sendToSupplier(id, userId) {
        const repo = await this.getRepo();
        const dn = await this.findById(id);
        if (dn.status !== tenant_1.DebitNoteStatus.APPROVED) {
            throw new common_1.BadRequestException('Only approved debit notes can be sent');
        }
        dn.status = tenant_1.DebitNoteStatus.SENT_TO_SUPPLIER;
        return repo.save(dn);
    }
    async acknowledge(id, dto, userId) {
        const repo = await this.getRepo();
        const dn = await this.findById(id);
        if (dn.status !== tenant_1.DebitNoteStatus.SENT_TO_SUPPLIER) {
            throw new common_1.BadRequestException('Only sent debit notes can be acknowledged');
        }
        dn.status = tenant_1.DebitNoteStatus.ACKNOWLEDGED;
        dn.supplierAcknowledgementNumber = dto.acknowledgementNumber || '';
        dn.supplierAcknowledgementDate = dto.acknowledgementDate
            ? new Date(dto.acknowledgementDate)
            : new Date();
        return repo.save(dn);
    }
    async applyToDue(id, dto, userId) {
        const ds = await this.getDataSource();
        const dn = await this.findById(id);
        const validStatuses = [
            tenant_1.DebitNoteStatus.APPROVED,
            tenant_1.DebitNoteStatus.SENT_TO_SUPPLIER,
            tenant_1.DebitNoteStatus.ACKNOWLEDGED,
            tenant_1.DebitNoteStatus.PARTIALLY_ADJUSTED,
        ];
        if (!validStatuses.includes(dn.status)) {
            throw new common_1.BadRequestException('Debit note must be approved/sent/acknowledged to apply');
        }
        if (dto.amount > Number(dn.balanceAmount) + 0.01) {
            throw new common_1.BadRequestException(`Amount (${dto.amount}) exceeds DN balance (${dn.balanceAmount})`);
        }
        const due = await this.supplierDuesService.findById(dto.supplierDueId);
        if (due.supplierId !== dn.supplierId) {
            throw new common_1.BadRequestException('Due does not belong to the same supplier');
        }
        await ds.transaction(async (manager) => {
            const dnRepo = manager.getRepository(tenant_1.DebitNote);
            await this.supplierDuesService.applyDebitNote(dto.supplierDueId, dto.amount, manager);
            dn.adjustedAmount = Number(dn.adjustedAmount) + dto.amount;
            dn.balanceAmount = Number(dn.balanceAmount) - dto.amount;
            if (dn.balanceAmount <= 0.01) {
                dn.status = tenant_1.DebitNoteStatus.FULLY_ADJUSTED;
            }
            else {
                dn.status = tenant_1.DebitNoteStatus.PARTIALLY_ADJUSTED;
            }
            await dnRepo.save(dn);
        });
        return this.findById(id);
    }
    async cancel(id, userId) {
        const repo = await this.getRepo();
        const dn = await this.findById(id);
        if ([tenant_1.DebitNoteStatus.FULLY_ADJUSTED, tenant_1.DebitNoteStatus.CANCELLED].includes(dn.status)) {
            throw new common_1.BadRequestException('Cannot cancel');
        }
        if (Number(dn.adjustedAmount) > 0) {
            throw new common_1.BadRequestException('Cannot cancel a partially adjusted debit note');
        }
        dn.status = tenant_1.DebitNoteStatus.CANCELLED;
        return repo.save(dn);
    }
};
exports.DebitNotesService = DebitNotesService;
exports.DebitNotesService = DebitNotesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_connection_manager_1.TenantConnectionManager,
        supplier_dues_service_1.SupplierDuesService])
], DebitNotesService);
//# sourceMappingURL=debit-notes.service.js.map