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
exports.SupplierPaymentsService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const tenant_connection_manager_1 = require("../../../database/tenant-connection.manager");
const pagination_util_1 = require("../../../common/utils/pagination.util");
const sequence_util_1 = require("../../../common/utils/sequence.util");
const tenant_1 = require("../../../entities/tenant");
const supplier_dues_service_1 = require("../supplier-dues/supplier-dues.service");
let SupplierPaymentsService = class SupplierPaymentsService {
    tenantConnectionManager;
    supplierDuesService;
    constructor(tenantConnectionManager, supplierDuesService) {
        this.tenantConnectionManager = tenantConnectionManager;
        this.supplierDuesService = supplierDuesService;
    }
    async getRepo() {
        return this.tenantConnectionManager.getRepository(tenant_1.SupplierPayment);
    }
    async getDataSource() {
        return this.tenantConnectionManager.getDataSource();
    }
    async create(dto, userId) {
        const ds = await this.getDataSource();
        const paymentNumber = await (0, sequence_util_1.getNextSequence)(ds, 'SUPPLIER_PAYMENT');
        let tdsAmount = dto.tdsAmount || 0;
        if (!tdsAmount && dto.tdsPercentage && dto.tdsPercentage > 0) {
            tdsAmount = (dto.amount * dto.tdsPercentage) / 100;
        }
        const totalAllocation = (dto.allocations || []).reduce((s, a) => s + a.amount, 0);
        if (totalAllocation > dto.amount + 0.01) {
            throw new common_1.BadRequestException(`Total allocation (${totalAllocation}) exceeds payment amount (${dto.amount})`);
        }
        let savedPayment;
        await ds.transaction(async (manager) => {
            const payRepo = manager.getRepository(tenant_1.SupplierPayment);
            const allocRepo = manager.getRepository(tenant_1.SupplierPaymentAllocation);
            const payment = payRepo.create({
                id: (0, uuid_1.v4)(),
                paymentNumber,
                paymentDate: dto.paymentDate,
                supplierId: dto.supplierId,
                paymentMethodId: dto.paymentMethodId,
                bankAccountId: dto.bankAccountId,
                amount: dto.amount,
                currency: dto.currency || 'BDT',
                exchangeRate: dto.exchangeRate || 1,
                status: tenant_1.SupplierPaymentStatus.DRAFT,
                referenceNumber: dto.referenceNumber,
                chequeNumber: dto.chequeNumber,
                chequeDate: dto.chequeDate,
                bankReference: dto.bankReference,
                transactionId: dto.transactionId,
                tdsPercentage: dto.tdsPercentage || 0,
                tdsAmount,
                allocatedAmount: totalAllocation,
                unallocatedAmount: dto.amount - totalAllocation,
                notes: dto.notes,
                createdBy: userId,
            });
            savedPayment = await payRepo.save(payment);
            for (const alloc of dto.allocations || []) {
                const due = await manager
                    .getRepository(tenant_1.SupplierDue)
                    .findOne({ where: { id: alloc.supplierDueId } });
                if (!due)
                    throw new common_1.NotFoundException(`Supplier due ${alloc.supplierDueId} not found`);
                if (due.supplierId !== dto.supplierId) {
                    throw new common_1.BadRequestException('Due does not belong to this supplier');
                }
                const balance = due.balanceAmount;
                if (alloc.amount > balance + 0.01) {
                    throw new common_1.BadRequestException(`Allocation (${alloc.amount}) exceeds due balance (${balance})`);
                }
                const allocation = allocRepo.create({
                    id: (0, uuid_1.v4)(),
                    paymentId: savedPayment.id,
                    supplierDueId: alloc.supplierDueId,
                    allocatedAmount: alloc.amount,
                    allocationDate: dto.paymentDate,
                    notes: alloc.notes,
                    createdBy: userId,
                });
                await allocRepo.save(allocation);
            }
        });
        return this.findById(savedPayment.id);
    }
    async findAll(filterDto) {
        const repo = await this.getRepo();
        const qb = repo
            .createQueryBuilder('p')
            .leftJoinAndSelect('p.supplier', 'supplier')
            .leftJoinAndSelect('p.paymentMethod', 'pm');
        if (filterDto.status)
            qb.andWhere('p.status = :status', { status: filterDto.status });
        if (filterDto.supplierId)
            qb.andWhere('p.supplierId = :sid', { sid: filterDto.supplierId });
        if (filterDto.fromDate)
            qb.andWhere('p.paymentDate >= :from', { from: filterDto.fromDate });
        if (filterDto.toDate)
            qb.andWhere('p.paymentDate <= :to', { to: filterDto.toDate });
        if (filterDto.search) {
            qb.andWhere('(p.paymentNumber LIKE :s OR p.referenceNumber LIKE :s OR supplier.name LIKE :s OR supplier.companyName LIKE :s)', { s: `%${filterDto.search}%` });
        }
        if (!filterDto.sortBy) {
            filterDto.sortBy = 'paymentDate';
            filterDto.sortOrder = 'DESC';
        }
        return (0, pagination_util_1.paginate)(qb, filterDto);
    }
    async findById(id) {
        const ds = await this.getDataSource();
        const repo = ds.getRepository(tenant_1.SupplierPayment);
        const payment = await repo.findOne({
            where: { id },
            relations: ['supplier', 'paymentMethod', 'bankAccount'],
        });
        if (!payment)
            throw new common_1.NotFoundException(`Supplier payment ${id} not found`);
        const allocRepo = ds.getRepository(tenant_1.SupplierPaymentAllocation);
        const allocations = await allocRepo.find({
            where: { paymentId: id },
            relations: ['supplierDue'],
            order: { allocationDate: 'ASC' },
        });
        payment.allocations = allocations;
        return payment;
    }
    async submitForApproval(id, userId) {
        const repo = await this.getRepo();
        const payment = await this.findById(id);
        if (payment.status !== tenant_1.SupplierPaymentStatus.DRAFT) {
            throw new common_1.BadRequestException('Only draft payments can be submitted');
        }
        payment.status = tenant_1.SupplierPaymentStatus.PENDING_APPROVAL;
        return repo.save(payment);
    }
    async approve(id, userId) {
        const repo = await this.getRepo();
        const payment = await this.findById(id);
        if (![
            tenant_1.SupplierPaymentStatus.DRAFT,
            tenant_1.SupplierPaymentStatus.PENDING_APPROVAL,
        ].includes(payment.status)) {
            throw new common_1.BadRequestException('Only draft/pending payments can be approved');
        }
        payment.status = tenant_1.SupplierPaymentStatus.APPROVED;
        payment.approvedBy = userId;
        payment.approvedAt = new Date();
        return repo.save(payment);
    }
    async process(id, userId) {
        const ds = await this.getDataSource();
        const payment = await this.findById(id);
        if (payment.status !== tenant_1.SupplierPaymentStatus.APPROVED) {
            throw new common_1.BadRequestException('Only approved payments can be processed');
        }
        await ds.transaction(async (manager) => {
            const payRepo = manager.getRepository(tenant_1.SupplierPayment);
            const allocRepo = manager.getRepository(tenant_1.SupplierPaymentAllocation);
            const allocations = await allocRepo.find({ where: { paymentId: id } });
            for (const alloc of allocations) {
                await this.supplierDuesService.addPayment(alloc.supplierDueId, Number(alloc.allocatedAmount), manager);
            }
            payment.status = tenant_1.SupplierPaymentStatus.PROCESSING;
            await payRepo.save(payment);
        });
        return this.findById(id);
    }
    async complete(id, userId) {
        const repo = await this.getRepo();
        const payment = await this.findById(id);
        if (payment.status !== tenant_1.SupplierPaymentStatus.PROCESSING) {
            throw new common_1.BadRequestException('Only processing payments can be completed');
        }
        payment.status = tenant_1.SupplierPaymentStatus.COMPLETED;
        return repo.save(payment);
    }
    async allocate(id, dto, userId) {
        const ds = await this.getDataSource();
        const payment = await this.findById(id);
        if (![
            tenant_1.SupplierPaymentStatus.APPROVED,
            tenant_1.SupplierPaymentStatus.PROCESSING,
            tenant_1.SupplierPaymentStatus.COMPLETED,
        ].includes(payment.status)) {
            throw new common_1.BadRequestException('Payment must be approved/processing/completed to allocate');
        }
        const totalNew = dto.allocations.reduce((s, a) => s + a.amount, 0);
        if (totalNew > Number(payment.unallocatedAmount) + 0.01) {
            throw new common_1.BadRequestException(`Total (${totalNew}) exceeds unallocated (${payment.unallocatedAmount})`);
        }
        await ds.transaction(async (manager) => {
            const payRepo = manager.getRepository(tenant_1.SupplierPayment);
            const allocRepo = manager.getRepository(tenant_1.SupplierPaymentAllocation);
            for (const alloc of dto.allocations) {
                const due = await manager
                    .getRepository(tenant_1.SupplierDue)
                    .findOne({ where: { id: alloc.supplierDueId } });
                if (!due)
                    throw new common_1.NotFoundException(`Supplier due ${alloc.supplierDueId} not found`);
                if (due.supplierId !== payment.supplierId) {
                    throw new common_1.BadRequestException('Due does not belong to payment supplier');
                }
                const allocation = allocRepo.create({
                    id: (0, uuid_1.v4)(),
                    paymentId: id,
                    supplierDueId: alloc.supplierDueId,
                    allocatedAmount: alloc.amount,
                    allocationDate: new Date().toISOString().split('T')[0],
                    notes: alloc.notes,
                    createdBy: userId,
                });
                await allocRepo.save(allocation);
                if ([
                    tenant_1.SupplierPaymentStatus.PROCESSING,
                    tenant_1.SupplierPaymentStatus.COMPLETED,
                ].includes(payment.status)) {
                    await this.supplierDuesService.addPayment(alloc.supplierDueId, alloc.amount, manager);
                }
            }
            payment.allocatedAmount = Number(payment.allocatedAmount) + totalNew;
            payment.unallocatedAmount = Number(payment.unallocatedAmount) - totalNew;
            await payRepo.save(payment);
        });
        return this.findById(id);
    }
    async cancel(id, reason, userId) {
        const ds = await this.getDataSource();
        const payment = await this.findById(id);
        if ([
            tenant_1.SupplierPaymentStatus.COMPLETED,
            tenant_1.SupplierPaymentStatus.CANCELLED,
        ].includes(payment.status)) {
            throw new common_1.BadRequestException('Completed/cancelled payments cannot be cancelled');
        }
        await ds.transaction(async (manager) => {
            const payRepo = manager.getRepository(tenant_1.SupplierPayment);
            const allocRepo = manager.getRepository(tenant_1.SupplierPaymentAllocation);
            if (payment.status === tenant_1.SupplierPaymentStatus.PROCESSING) {
                const allocations = await allocRepo.find({ where: { paymentId: id } });
                for (const alloc of allocations) {
                    await this.supplierDuesService.reversePayment(alloc.supplierDueId, Number(alloc.allocatedAmount), manager);
                }
            }
            payment.status = tenant_1.SupplierPaymentStatus.CANCELLED;
            payment.notes = payment.notes
                ? `${payment.notes}\nCancelled: ${reason}`
                : `Cancelled: ${reason}`;
            await payRepo.save(payment);
        });
        return this.findById(id);
    }
};
exports.SupplierPaymentsService = SupplierPaymentsService;
exports.SupplierPaymentsService = SupplierPaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_connection_manager_1.TenantConnectionManager,
        supplier_dues_service_1.SupplierDuesService])
], SupplierPaymentsService);
//# sourceMappingURL=supplier-payments.service.js.map