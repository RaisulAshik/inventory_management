// src/modules/sales/collections/collections.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository, DataSource, DeepPartial } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { PaginatedResult } from '@common/interfaces';
import { paginate } from '@common/utils/pagination.util';
import { getNextSequence } from '@common/utils/sequence.util';
import { DueStatus, SalesOrderStatus, PaymentStatus } from '@common/enums';
import {
  CustomerDueCollection,
  CollectionStatus,
  CustomerDueCollectionAllocation,
  CustomerDue,
  CustomerDueReferenceType,
  SalesOrder,
} from '@entities/tenant';

import { CustomerDuesService } from '../customer-dues/customer-dues.service';
import { AccountingIntegrationService } from '@modules/accounting/service/accounting-integration.service';
import {
  CreateCollectionDto,
  CollectionFilterDto,
  DepositDto,
  BounceDto,
  AllocateCollectionDto,
} from './dto/create-collection.dto';

@Injectable()
export class CollectionsService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
    private readonly duesService: CustomerDuesService,
    private readonly accountingIntegration: AccountingIntegrationService,
  ) {}

  private async getRepo(): Promise<Repository<CustomerDueCollection>> {
    return this.tenantConnectionManager.getRepository(CustomerDueCollection);
  }

  private async getDataSource(): Promise<DataSource> {
    return this.tenantConnectionManager.getDataSource();
  }

  // ─────────────────────── CREATE ───────────────────────
  async create(
    dto: CreateCollectionDto,
    userId: string,
  ): Promise<CustomerDueCollection> {
    const ds = await this.getDataSource();
    const collectionNumber = await getNextSequence(ds, 'COLLECTION');

    // Validate total allocation doesn't exceed collection amount
    const totalAllocation = (dto.allocations || []).reduce(
      (s: any, a: any) => s + a.amount,
      0,
    );
    if (totalAllocation > dto.amount) {
      throw new BadRequestException(
        `Total allocation (${totalAllocation}) exceeds collection amount (${dto.amount})`,
      );
    }

    let savedCollection!: CustomerDueCollection;

    await ds.transaction(async (manager) => {
      const collRepo = manager.getRepository(CustomerDueCollection);
      const allocRepo = manager.getRepository(CustomerDueCollectionAllocation);

      const collection = collRepo.create({
        id: uuidv4(),
        collectionNumber,
        collectionDate: dto.collectionDate,
        customerId: dto.customerId,
        paymentMethodId: dto.paymentMethodId,
        amount: dto.amount,
        currency: dto.currency || 'BDT',
        status: CollectionStatus.CONFIRMED,
        referenceNumber: dto.referenceNumber,
        chequeNumber: dto.chequeNumber,
        chequeDate: dto.chequeDate,
        chequeBank: dto.chequeBank,
        allocatedAmount: totalAllocation,
        unallocatedAmount: dto.amount - totalAllocation,
        notes: dto.notes,
        receivedBy: userId,
        createdBy: userId,
      } as DeepPartial<CustomerDueCollection>);

      // If cheque, start as PENDING (not yet confirmed)
      if (dto.chequeNumber) {
        collection.status = CollectionStatus.PENDING;
      }

      savedCollection = await collRepo.save(collection);

      // Create allocations and update dues
      for (const alloc of dto.allocations || []) {
        // Validate due belongs to same customer
        const due = await manager.getRepository(CustomerDue).findOne({
          where: { id: alloc.customerDueId },
        });
        if (!due)
          throw new NotFoundException(`Due ${alloc.customerDueId} not found`);
        if (due.customerId !== dto.customerId) {
          throw new BadRequestException('Due does not belong to this customer');
        }

        const balance =
          Number(due.originalAmount) -
          Number(due.paidAmount) -
          Number(due.adjustedAmount) -
          Number(due.writtenOffAmount);
        if (alloc.amount > balance + 0.01) {
          throw new BadRequestException(
            `Allocation (${alloc.amount}) exceeds due balance (${balance}) for due ${alloc.customerDueId}`,
          );
        }

        // Create allocation record
        const allocation = allocRepo.create({
          id: uuidv4(),
          collectionId: savedCollection.id,
          customerDueId: alloc.customerDueId,
          allocatedAmount: alloc.amount,
          allocationDate: dto.collectionDate,
          notes: alloc.notes,
          createdBy: userId,
        });
        await allocRepo.save(allocation);

        // Update due
        await this.duesService.addPayment(
          alloc.customerDueId,
          alloc.amount,
          manager,
        );

        // Update SalesOrder.paidAmount if due is linked to an order
        if (due.salesOrderId) {
          await this.updateOrderPayment(
            due.salesOrderId,
            alloc.amount,
            manager,
          );
        }
      }
    });

    const result = await this.findById(savedCollection.id);

    // Auto-post JE: DR Bank/Cash / CR AR — one JE per collection, skip cheques (posted on clearance)
    if (!dto.chequeNumber) {
      void this.accountingIntegration.postPaymentCollection(result);
    }

    return result;
  }

  // ─────────────────────── FIND ALL ───────────────────────
  async findAll(
    filterDto: CollectionFilterDto,
  ): Promise<PaginatedResult<CustomerDueCollection>> {
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
      qb.andWhere(
        '(c.collectionNumber LIKE :s OR c.referenceNumber LIKE :s OR customer.firstName LIKE :s OR customer.companyName LIKE :s)',
        { s: `%${filterDto.search}%` },
      );
    }

    if (!filterDto.sortBy) {
      filterDto.sortBy = 'collectionDate';
      filterDto.sortOrder = 'DESC';
    }

    return paginate(qb, filterDto);
  }

  // ─────────────────────── FIND BY ID ───────────────────────
  async findById(id: string): Promise<CustomerDueCollection> {
    const ds = await this.getDataSource();
    const repo = ds.getRepository(CustomerDueCollection);
    const collection = await repo.findOne({
      where: { id },
      relations: ['customer', 'paymentMethod', 'bankAccount'],
    });
    if (!collection) throw new NotFoundException(`Collection ${id} not found`);

    // Load allocations separately
    const allocRepo = ds.getRepository(CustomerDueCollectionAllocation);
    const allocations = await allocRepo.find({
      where: { collectionId: id },
      relations: ['customerDue'],
      order: { allocationDate: 'ASC' },
    });
    (collection as any).allocations = allocations;

    return collection;
  }

  // ─────────────────────── CONFIRM (for cheque payments) ───────────────────────
  async confirm(id: string, userId: string): Promise<CustomerDueCollection> {
    const repo = await this.getRepo();
    const collection = await this.findById(id);

    if (
      collection.status !== CollectionStatus.PENDING &&
      collection.status !== CollectionStatus.DRAFT
    ) {
      throw new BadRequestException(
        'Only pending/draft collections can be confirmed',
      );
    }

    collection.status = CollectionStatus.CONFIRMED;
    await repo.save(collection);

    return this.findById(id);
  }

  // ─────────────────────── DEPOSIT (cheque to bank) ───────────────────────
  async deposit(
    id: string,
    dto: DepositDto,
    userId: string,
  ): Promise<CustomerDueCollection> {
    const repo = await this.getRepo();
    const collection = await this.findById(id);

    if (collection.status !== CollectionStatus.CONFIRMED) {
      throw new BadRequestException(
        'Only confirmed collections can be deposited',
      );
    }

    collection.status = CollectionStatus.DEPOSITED;
    collection.bankAccountId = dto.bankAccountId;
    collection.depositDate = new Date(dto.depositDate);
    await repo.save(collection);

    // TODO: Create Journal Entry → Dr: Bank, Cr: Cash/Cheque in Hand

    return this.findById(id);
  }

  // ─────────────────────── BOUNCE (cheque bounce — FULL REVERSAL) ───────────────────────
  async bounce(
    id: string,
    dto: BounceDto,
    userId: string,
  ): Promise<CustomerDueCollection> {
    const ds = await this.getDataSource();
    const collection = await this.findById(id);

    if (
      ![CollectionStatus.CONFIRMED, CollectionStatus.DEPOSITED].includes(
        collection.status,
      )
    ) {
      throw new BadRequestException(
        'Only confirmed/deposited collections can bounce',
      );
    }

    await ds.transaction(async (manager) => {
      const collRepo = manager.getRepository(CustomerDueCollection);
      const allocRepo = manager.getRepository(CustomerDueCollectionAllocation);

      // Reverse all allocations
      const allocations = await allocRepo.find({ where: { collectionId: id } });
      for (const alloc of allocations) {
        // Reverse payment on due
        await this.duesService.reversePayment(
          alloc.customerDueId,
          Number(alloc.allocatedAmount),
          manager,
        );

        // Reverse on linked SalesOrder
        const due = await manager
          .getRepository(CustomerDue)
          .findOne({ where: { id: alloc.customerDueId } });
        if (due?.salesOrderId) {
          await this.updateOrderPayment(
            due.salesOrderId,
            -Number(alloc.allocatedAmount),
            manager,
          );
        }
      }

      // Update collection status
      collection.status = CollectionStatus.BOUNCED;
      collection.bounceDate = new Date(dto.bounceDate);
      collection.bounceReason = dto.bounceReason;
      collection.bounceCharges = dto.bounceCharges || 0;
      await collRepo.save(collection);

      // Create new CustomerDue for bounce charges
      if (dto.bounceCharges && dto.bounceCharges > 0) {
        const dueRepo = manager.getRepository(CustomerDue);
        const bounceDue = dueRepo.create({
          id: uuidv4(),
          customerId: collection.customerId,
          referenceType: CustomerDueReferenceType.OTHER,
          referenceNumber: `BOUNCE-${collection.chequeNumber || collection.collectionNumber}`,
          dueDate: new Date(),
          originalAmount: dto.bounceCharges,
          paidAmount: 0,
          adjustedAmount: 0,
          writtenOffAmount: 0,
          currency: collection.currency,
          status: DueStatus.PENDING,
          notes: `Cheque bounce charges for ${collection.collectionNumber}`,
        });
        await dueRepo.save(bounceDue);
      }
    });

    return this.findById(id);
  }

  // ─────────────────────── ALLOCATE (for advance/unallocated payments) ───────────────────────
  async allocate(
    id: string,
    dto: AllocateCollectionDto,
    userId: string,
  ): Promise<CustomerDueCollection> {
    const ds = await this.getDataSource();
    const collection = await this.findById(id);

    if (
      ![CollectionStatus.CONFIRMED, CollectionStatus.DEPOSITED].includes(
        collection.status,
      )
    ) {
      throw new BadRequestException(
        'Collection must be confirmed/deposited to allocate',
      );
    }

    const totalNewAlloc = dto.allocations.reduce(
      (s: any, a: any) => s + a.amount,
      0,
    );
    if (totalNewAlloc > Number(collection.unallocatedAmount) + 0.01) {
      throw new BadRequestException(
        `Total allocation (${totalNewAlloc}) exceeds unallocated amount (${collection.unallocatedAmount})`,
      );
    }

    await ds.transaction(async (manager) => {
      const collRepo = manager.getRepository(CustomerDueCollection);
      const allocRepo = manager.getRepository(CustomerDueCollectionAllocation);

      for (const alloc of dto.allocations) {
        const due = await manager
          .getRepository(CustomerDue)
          .findOne({ where: { id: alloc.customerDueId } });
        if (!due)
          throw new NotFoundException(`Due ${alloc.customerDueId} not found`);
        if (due.customerId !== collection.customerId) {
          throw new BadRequestException(
            'Due does not belong to the collection customer',
          );
        }

        const allocation = allocRepo.create({
          id: uuidv4(),
          collectionId: id,
          customerDueId: alloc.customerDueId,
          allocatedAmount: alloc.amount,
          allocationDate: new Date().toISOString().split('T')[0],
          notes: alloc.notes,
          createdBy: userId,
        });
        await allocRepo.save(allocation);

        await this.duesService.addPayment(
          alloc.customerDueId,
          alloc.amount,
          manager,
        );

        if (due.salesOrderId) {
          await this.updateOrderPayment(
            due.salesOrderId,
            alloc.amount,
            manager,
          );
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

  // ─────────────────────── CANCEL ───────────────────────
  async cancel(
    id: string,
    reason: string,
    userId: string,
  ): Promise<CustomerDueCollection> {
    const repo = await this.getRepo();
    const collection = await this.findById(id);

    if (
      ![CollectionStatus.DRAFT, CollectionStatus.PENDING].includes(
        collection.status,
      )
    ) {
      throw new BadRequestException(
        'Only draft/pending collections can be cancelled',
      );
    }

    collection.status = CollectionStatus.CANCELLED;
    collection.notes = collection.notes
      ? `${collection.notes}\nCancelled: ${reason}`
      : `Cancelled: ${reason}`;

    await repo.save(collection);
    return this.findById(id);
  }

  // ─────────────────────── HELPER: Update SalesOrder paidAmount ───────────────────────
  private async updateOrderPayment(
    salesOrderId: string,
    amount: number,
    manager: any,
  ): Promise<void> {
    const orderRepo = manager.getRepository(SalesOrder);
    const order = await orderRepo.findOne({ where: { id: salesOrderId } });
    if (!order) return;

    order.paidAmount = Math.max(0, Number(order.paidAmount) + amount);

    // Sync payment status
    if (order.paidAmount <= 0) {
      order.paymentStatus = PaymentStatus.UNPAID;
    } else if (order.paidAmount >= Number(order.totalAmount)) {
      order.paymentStatus = PaymentStatus.PAID;
    } else {
      order.paymentStatus = PaymentStatus.PARTIALLY_PAID;
    }

    // Auto-complete if delivered + fully paid
    if (
      order.status === SalesOrderStatus.DELIVERED &&
      order.paidAmount >= Number(order.totalAmount)
    ) {
      order.status = SalesOrderStatus.COMPLETED;
    }

    await orderRepo.save(order);
  }
}
