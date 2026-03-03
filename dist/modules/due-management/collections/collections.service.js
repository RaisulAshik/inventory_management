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
exports.CollectionsService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const tenant_connection_manager_1 = require("../../../database/tenant-connection.manager");
const pagination_util_1 = require("../../../common/utils/pagination.util");
const sequence_util_1 = require("../../../common/utils/sequence.util");
const enums_1 = require("../../../common/enums");
const tenant_1 = require("../../../entities/tenant");
const enums_2 = require("../../../common/enums");
const customer_dues_service_1 = require("../customer-dues/customer-dues.service");
let CollectionsService = class CollectionsService {
    tenantConnectionManager;
    duesService;
    constructor(tenantConnectionManager, duesService) {
        this.tenantConnectionManager = tenantConnectionManager;
        this.duesService = duesService;
    }
    async getRepo() {
        return this.tenantConnectionManager.getRepository(tenant_1.CustomerDueCollection);
    }
    async getDataSource() {
        return this.tenantConnectionManager.getDataSource();
    }
    async create(dto, userId) {
        const ds = await this.getDataSource();
        const collectionNumber = await (0, sequence_util_1.getNextSequence)(ds, 'COLLECTION');
        const totalAllocation = (dto.allocations || []).reduce((s, a) => s + a.amount, 0);
        if (totalAllocation > dto.amount) {
            throw new common_1.BadRequestException(`Total allocation (${totalAllocation}) exceeds collection amount (${dto.amount})`);
        }
        let savedCollection;
        await ds.transaction(async (manager) => {
            const collRepo = manager.getRepository(tenant_1.CustomerDueCollection);
            const allocRepo = manager.getRepository(tenant_1.CustomerDueCollectionAllocation);
            const collection = collRepo.create({
                id: (0, uuid_1.v4)(),
                collectionNumber,
                collectionDate: dto.collectionDate,
                customerId: dto.customerId,
                paymentMethodId: dto.paymentMethodId,
                amount: dto.amount,
                currency: dto.currency || 'BDT',
                status: tenant_1.CollectionStatus.CONFIRMED,
                referenceNumber: dto.referenceNumber,
                chequeNumber: dto.chequeNumber,
                chequeDate: dto.chequeDate,
                chequeBank: dto.chequeBank,
                allocatedAmount: totalAllocation,
                unallocatedAmount: dto.amount - totalAllocation,
                notes: dto.notes,
                receivedBy: userId,
                createdBy: userId,
            });
            if (dto.chequeNumber) {
                collection.status = tenant_1.CollectionStatus.PENDING;
            }
            savedCollection = await collRepo.save(collection);
            for (const alloc of dto.allocations || []) {
                const due = await manager.getRepository(tenant_1.CustomerDue).findOne({
                    where: { id: alloc.customerDueId },
                });
                if (!due)
                    throw new common_1.NotFoundException(`Due ${alloc.customerDueId} not found`);
                if (due.customerId !== dto.customerId) {
                    throw new common_1.BadRequestException('Due does not belong to this customer');
                }
                const balance = Number(due.originalAmount) -
                    Number(due.paidAmount) -
                    Number(due.adjustedAmount) -
                    Number(due.writtenOffAmount);
                if (alloc.amount > balance + 0.01) {
                    throw new common_1.BadRequestException(`Allocation (${alloc.amount}) exceeds due balance (${balance}) for due ${alloc.customerDueId}`);
                }
                const allocation = allocRepo.create({
                    id: (0, uuid_1.v4)(),
                    collectionId: savedCollection.id,
                    customerDueId: alloc.customerDueId,
                    allocatedAmount: alloc.amount,
                    allocationDate: dto.collectionDate,
                    notes: alloc.notes,
                    createdBy: userId,
                });
                await allocRepo.save(allocation);
                await this.duesService.addPayment(alloc.customerDueId, alloc.amount, manager);
                if (due.salesOrderId) {
                    await this.updateOrderPayment(due.salesOrderId, alloc.amount, manager);
                }
            }
        });
        return this.findById(savedCollection.id);
    }
    async findAll(filterDto) {
        const repo = await this.getRepo();
        const qb = repo
            .createQueryBuilder('c')
            .leftJoinAndSelect('c.customer', 'customer')
            .leftJoinAndSelect('c.paymentMethod', 'pm');
        if (filterDto.status)
            qb.andWhere('c.status = :status', { status: filterDto.status });
        if (filterDto.customerId)
            qb.andWhere('c.customerId = :customerId', {
                customerId: filterDto.customerId,
            });
        if (filterDto.fromDate)
            qb.andWhere('c.collectionDate >= :from', { from: filterDto.fromDate });
        if (filterDto.toDate)
            qb.andWhere('c.collectionDate <= :to', { to: filterDto.toDate });
        if (filterDto.search) {
            qb.andWhere('(c.collectionNumber LIKE :s OR c.referenceNumber LIKE :s OR customer.firstName LIKE :s OR customer.companyName LIKE :s)', { s: `%${filterDto.search}%` });
        }
        if (!filterDto.sortBy) {
            filterDto.sortBy = 'collectionDate';
            filterDto.sortOrder = 'DESC';
        }
        return (0, pagination_util_1.paginate)(qb, filterDto);
    }
    async findById(id) {
        const ds = await this.getDataSource();
        const repo = ds.getRepository(tenant_1.CustomerDueCollection);
        const collection = await repo.findOne({
            where: { id },
            relations: ['customer', 'paymentMethod', 'bankAccount'],
        });
        if (!collection)
            throw new common_1.NotFoundException(`Collection ${id} not found`);
        const allocRepo = ds.getRepository(tenant_1.CustomerDueCollectionAllocation);
        const allocations = await allocRepo.find({
            where: { collectionId: id },
            relations: ['customerDue'],
            order: { allocationDate: 'ASC' },
        });
        collection.allocations = allocations;
        return collection;
    }
    async confirm(id, userId) {
        const repo = await this.getRepo();
        const collection = await this.findById(id);
        if (collection.status !== tenant_1.CollectionStatus.PENDING &&
            collection.status !== tenant_1.CollectionStatus.DRAFT) {
            throw new common_1.BadRequestException('Only pending/draft collections can be confirmed');
        }
        collection.status = tenant_1.CollectionStatus.CONFIRMED;
        await repo.save(collection);
        return this.findById(id);
    }
    async deposit(id, dto, userId) {
        const repo = await this.getRepo();
        const collection = await this.findById(id);
        if (collection.status !== tenant_1.CollectionStatus.CONFIRMED) {
            throw new common_1.BadRequestException('Only confirmed collections can be deposited');
        }
        collection.status = tenant_1.CollectionStatus.DEPOSITED;
        collection.bankAccountId = dto.bankAccountId;
        collection.depositDate = new Date(dto.depositDate);
        await repo.save(collection);
        return this.findById(id);
    }
    async bounce(id, dto, userId) {
        const ds = await this.getDataSource();
        const collection = await this.findById(id);
        if (![tenant_1.CollectionStatus.CONFIRMED, tenant_1.CollectionStatus.DEPOSITED].includes(collection.status)) {
            throw new common_1.BadRequestException('Only confirmed/deposited collections can bounce');
        }
        await ds.transaction(async (manager) => {
            const collRepo = manager.getRepository(tenant_1.CustomerDueCollection);
            const allocRepo = manager.getRepository(tenant_1.CustomerDueCollectionAllocation);
            const allocations = await allocRepo.find({ where: { collectionId: id } });
            for (const alloc of allocations) {
                await this.duesService.reversePayment(alloc.customerDueId, Number(alloc.allocatedAmount), manager);
                const due = await manager
                    .getRepository(tenant_1.CustomerDue)
                    .findOne({ where: { id: alloc.customerDueId } });
                if (due?.salesOrderId) {
                    await this.updateOrderPayment(due.salesOrderId, -Number(alloc.allocatedAmount), manager);
                }
            }
            collection.status = tenant_1.CollectionStatus.BOUNCED;
            collection.bounceDate = new Date(dto.bounceDate);
            collection.bounceReason = dto.bounceReason;
            collection.bounceCharges = dto.bounceCharges || 0;
            await collRepo.save(collection);
            if (dto.bounceCharges && dto.bounceCharges > 0) {
                const dueRepo = manager.getRepository(tenant_1.CustomerDue);
                const bounceDue = dueRepo.create({
                    id: (0, uuid_1.v4)(),
                    customerId: collection.customerId,
                    referenceType: tenant_1.CustomerDueReferenceType.OTHER,
                    referenceNumber: `BOUNCE-${collection.chequeNumber || collection.collectionNumber}`,
                    dueDate: new Date(),
                    originalAmount: dto.bounceCharges,
                    paidAmount: 0,
                    adjustedAmount: 0,
                    writtenOffAmount: 0,
                    currency: collection.currency,
                    status: enums_1.DueStatus.PENDING,
                    notes: `Cheque bounce charges for ${collection.collectionNumber}`,
                });
                await dueRepo.save(bounceDue);
            }
        });
        return this.findById(id);
    }
    async allocate(id, dto, userId) {
        const ds = await this.getDataSource();
        const collection = await this.findById(id);
        if (![tenant_1.CollectionStatus.CONFIRMED, tenant_1.CollectionStatus.DEPOSITED].includes(collection.status)) {
            throw new common_1.BadRequestException('Collection must be confirmed/deposited to allocate');
        }
        const totalNewAlloc = dto.allocations.reduce((s, a) => s + a.amount, 0);
        if (totalNewAlloc > Number(collection.unallocatedAmount) + 0.01) {
            throw new common_1.BadRequestException(`Total allocation (${totalNewAlloc}) exceeds unallocated amount (${collection.unallocatedAmount})`);
        }
        await ds.transaction(async (manager) => {
            const collRepo = manager.getRepository(tenant_1.CustomerDueCollection);
            const allocRepo = manager.getRepository(tenant_1.CustomerDueCollectionAllocation);
            for (const alloc of dto.allocations) {
                const due = await manager
                    .getRepository(tenant_1.CustomerDue)
                    .findOne({ where: { id: alloc.customerDueId } });
                if (!due)
                    throw new common_1.NotFoundException(`Due ${alloc.customerDueId} not found`);
                if (due.customerId !== collection.customerId) {
                    throw new common_1.BadRequestException('Due does not belong to the collection customer');
                }
                const allocation = allocRepo.create({
                    id: (0, uuid_1.v4)(),
                    collectionId: id,
                    customerDueId: alloc.customerDueId,
                    allocatedAmount: alloc.amount,
                    allocationDate: new Date().toISOString().split('T')[0],
                    notes: alloc.notes,
                    createdBy: userId,
                });
                await allocRepo.save(allocation);
                await this.duesService.addPayment(alloc.customerDueId, alloc.amount, manager);
                if (due.salesOrderId) {
                    await this.updateOrderPayment(due.salesOrderId, alloc.amount, manager);
                }
            }
            collection.allocatedAmount =
                Number(collection.allocatedAmount) + totalNewAlloc;
            collection.unallocatedAmount =
                Number(collection.unallocatedAmount) - totalNewAlloc;
            await collRepo.save(collection);
        });
        return this.findById(id);
    }
    async cancel(id, reason, userId) {
        const repo = await this.getRepo();
        const collection = await this.findById(id);
        if (![tenant_1.CollectionStatus.DRAFT, tenant_1.CollectionStatus.PENDING].includes(collection.status)) {
            throw new common_1.BadRequestException('Only draft/pending collections can be cancelled');
        }
        collection.status = tenant_1.CollectionStatus.CANCELLED;
        collection.notes = collection.notes
            ? `${collection.notes}\nCancelled: ${reason}`
            : `Cancelled: ${reason}`;
        await repo.save(collection);
        return this.findById(id);
    }
    async updateOrderPayment(salesOrderId, amount, manager) {
        const orderRepo = manager.getRepository(tenant_1.SalesOrder);
        const order = await orderRepo.findOne({ where: { id: salesOrderId } });
        if (!order)
            return;
        order.paidAmount = Math.max(0, Number(order.paidAmount) + amount);
        if (order.paidAmount <= 0) {
            order.paymentStatus = 'UNPAID';
        }
        else if (order.paidAmount >= Number(order.totalAmount)) {
            order.paymentStatus = 'PAID';
        }
        else {
            order.paymentStatus = 'PARTIAL';
        }
        if (order.status === enums_2.SalesOrderStatus.DELIVERED &&
            order.paidAmount >= Number(order.totalAmount)) {
            order.status = enums_2.SalesOrderStatus.COMPLETED;
        }
        await orderRepo.save(order);
    }
};
exports.CollectionsService = CollectionsService;
exports.CollectionsService = CollectionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_connection_manager_1.TenantConnectionManager,
        customer_dues_service_1.CustomerDuesService])
], CollectionsService);
//# sourceMappingURL=collections.service.js.map