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
exports.CreditNotesService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const tenant_connection_manager_1 = require("../../../database/tenant-connection.manager");
const pagination_util_1 = require("../../../common/utils/pagination.util");
const sequence_util_1 = require("../../../common/utils/sequence.util");
const tenant_1 = require("../../../entities/tenant");
const customer_dues_service_1 = require("../customer-dues/customer-dues.service");
let CreditNotesService = class CreditNotesService {
    tenantConnectionManager;
    duesService;
    constructor(tenantConnectionManager, duesService) {
        this.tenantConnectionManager = tenantConnectionManager;
        this.duesService = duesService;
    }
    async getRepo() {
        return this.tenantConnectionManager.getRepository(tenant_1.CreditNote);
    }
    async getDataSource() {
        return this.tenantConnectionManager.getDataSource();
    }
    async create(dto, userId) {
        const ds = await this.getDataSource();
        const repo = ds.getRepository(tenant_1.CreditNote);
        const creditNoteNumber = await (0, sequence_util_1.getNextSequence)(ds, 'CREDIT_NOTE');
        const cn = repo.create({
            id: (0, uuid_1.v4)(),
            creditNoteNumber,
            creditNoteDate: dto.creditNoteDate,
            customerId: dto.customerId,
            salesOrderId: dto.salesOrderId,
            salesReturnId: dto.salesReturnId,
            reason: dto.reason,
            reasonDetails: dto.reasonDetails,
            status: tenant_1.CreditNoteStatus.DRAFT,
            currency: dto.currency || 'BDT',
            subtotal: dto.subtotal,
            taxAmount: dto.taxAmount || 0,
            totalAmount: dto.totalAmount,
            usedAmount: 0,
            balanceAmount: dto.totalAmount,
            validUntil: dto.validUntil,
            notes: dto.notes,
            createdBy: userId,
        });
        return repo.save(cn);
    }
    async findAll(filterDto) {
        const repo = await this.getRepo();
        const qb = repo
            .createQueryBuilder('cn')
            .leftJoinAndSelect('cn.customer', 'customer');
        if (filterDto.status)
            qb.andWhere('cn.status = :status', { status: filterDto.status });
        if (filterDto.customerId)
            qb.andWhere('cn.customerId = :customerId', {
                customerId: filterDto.customerId,
            });
        if (filterDto.reason)
            qb.andWhere('cn.reason = :reason', { reason: filterDto.reason });
        if (filterDto.fromDate)
            qb.andWhere('cn.creditNoteDate >= :from', { from: filterDto.fromDate });
        if (filterDto.toDate)
            qb.andWhere('cn.creditNoteDate <= :to', { to: filterDto.toDate });
        if (filterDto.search) {
            qb.andWhere('(cn.creditNoteNumber LIKE :s OR customer.firstName LIKE :s OR customer.companyName LIKE :s)', { s: `%${filterDto.search}%` });
        }
        if (!filterDto.sortBy) {
            filterDto.sortBy = 'creditNoteDate';
            filterDto.sortOrder = 'DESC';
        }
        return (0, pagination_util_1.paginate)(qb, filterDto);
    }
    async findById(id) {
        const repo = await this.getRepo();
        const cn = await repo.findOne({
            where: { id },
            relations: ['customer', 'salesOrder', 'salesReturn'],
        });
        if (!cn)
            throw new common_1.NotFoundException(`Credit note ${id} not found`);
        return cn;
    }
    async findByCustomer(customerId) {
        const repo = await this.getRepo();
        return repo.find({
            where: { customerId },
            relations: ['salesOrder'],
            order: { creditNoteDate: 'DESC' },
        });
    }
    async findUsableByCustomer(customerId) {
        const repo = await this.getRepo();
        return repo
            .createQueryBuilder('cn')
            .where('cn.customerId = :customerId', { customerId })
            .andWhere('cn.status = :status', { status: tenant_1.CreditNoteStatus.APPROVED })
            .andWhere('cn.balanceAmount > 0')
            .andWhere('(cn.validUntil IS NULL OR cn.validUntil >= :today)', {
            today: new Date().toISOString().split('T')[0],
        })
            .orderBy('cn.creditNoteDate', 'ASC')
            .getMany();
    }
    async submitForApproval(id, userId) {
        const repo = await this.getRepo();
        const cn = await this.findById(id);
        if (cn.status !== tenant_1.CreditNoteStatus.DRAFT) {
            throw new common_1.BadRequestException('Only draft credit notes can be submitted');
        }
        cn.status = tenant_1.CreditNoteStatus.PENDING_APPROVAL;
        return repo.save(cn);
    }
    async approve(id, userId) {
        const repo = await this.getRepo();
        const cn = await this.findById(id);
        if (![tenant_1.CreditNoteStatus.DRAFT, tenant_1.CreditNoteStatus.PENDING_APPROVAL].includes(cn.status)) {
            throw new common_1.BadRequestException('Only draft/pending credit notes can be approved');
        }
        cn.status = tenant_1.CreditNoteStatus.APPROVED;
        cn.approvedBy = userId;
        cn.approvedAt = new Date();
        return repo.save(cn);
    }
    async applyToDue(id, dto, userId) {
        const ds = await this.getDataSource();
        const cn = await this.findById(id);
        if (cn.status !== tenant_1.CreditNoteStatus.APPROVED &&
            cn.status !== tenant_1.CreditNoteStatus.PARTIALLY_USED) {
            throw new common_1.BadRequestException('Credit note must be approved to apply');
        }
        if (cn.isExpired) {
            throw new common_1.BadRequestException('Credit note has expired');
        }
        if (dto.amount > Number(cn.balanceAmount) + 0.01) {
            throw new common_1.BadRequestException(`Amount (${dto.amount}) exceeds CN balance (${cn.balanceAmount})`);
        }
        const due = await this.duesService.findById(dto.customerDueId);
        if (due.customerId !== cn.customerId) {
            throw new common_1.BadRequestException('Due does not belong to the same customer');
        }
        await ds.transaction(async (manager) => {
            const cnRepo = manager.getRepository(tenant_1.CreditNote);
            await this.duesService.applyCreditNote(dto.customerDueId, dto.amount, manager);
            cn.usedAmount = Number(cn.usedAmount) + dto.amount;
            cn.balanceAmount = Number(cn.balanceAmount) - dto.amount;
            if (cn.balanceAmount <= 0.01) {
                cn.status = tenant_1.CreditNoteStatus.FULLY_USED;
            }
            else {
                cn.status = tenant_1.CreditNoteStatus.PARTIALLY_USED;
            }
            await cnRepo.save(cn);
        });
        return this.findById(id);
    }
    async cancel(id, userId) {
        const repo = await this.getRepo();
        const cn = await this.findById(id);
        if ([tenant_1.CreditNoteStatus.FULLY_USED, tenant_1.CreditNoteStatus.CANCELLED].includes(cn.status)) {
            throw new common_1.BadRequestException('Cannot cancel a fully used or already cancelled credit note');
        }
        if (Number(cn.usedAmount) > 0) {
            throw new common_1.BadRequestException('Cannot cancel a partially used credit note');
        }
        cn.status = tenant_1.CreditNoteStatus.CANCELLED;
        return repo.save(cn);
    }
    async markExpired() {
        const ds = await this.getDataSource();
        const result = await ds
            .createQueryBuilder()
            .update('credit_notes')
            .set({ status: tenant_1.CreditNoteStatus.EXPIRED })
            .where('status = :status', { status: tenant_1.CreditNoteStatus.APPROVED })
            .andWhere('balance_amount > 0')
            .andWhere('valid_until IS NOT NULL')
            .andWhere('valid_until < :today', {
            today: new Date().toISOString().split('T')[0],
        })
            .execute();
        return result.affected ?? 0;
    }
};
exports.CreditNotesService = CreditNotesService;
exports.CreditNotesService = CreditNotesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_connection_manager_1.TenantConnectionManager,
        customer_dues_service_1.CustomerDuesService])
], CreditNotesService);
//# sourceMappingURL=credit-notes.service.js.map