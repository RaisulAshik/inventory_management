// src/modules/purchase/supplier-payments/supplier-payments.service.ts

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
import {
  SupplierPayment,
  SupplierPaymentStatus,
  SupplierPaymentAllocation,
  SupplierDue,
} from '@entities/tenant';
import { SupplierDuesService } from '../supplier-dues/supplier-dues.service';
import {
  CreateSupplierPaymentDto,
  SupplierPaymentFilterDto,
  AllocatePaymentDto,
} from './dto/supplier-payment.dto';

@Injectable()
export class SupplierPaymentsService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
    private readonly supplierDuesService: SupplierDuesService,
  ) {}

  private async getRepo(): Promise<Repository<SupplierPayment>> {
    return this.tenantConnectionManager.getRepository(SupplierPayment);
  }

  private async getDataSource(): Promise<DataSource> {
    return this.tenantConnectionManager.getDataSource();
  }

  // ─────────────────────── CREATE ───────────────────────
  async create(
    dto: CreateSupplierPaymentDto,
    userId: string,
  ): Promise<SupplierPayment> {
    const ds = await this.getDataSource();
    const paymentNumber = await getNextSequence(ds, 'SUPPLIER_PAYMENT');

    // Calculate TDS
    let tdsAmount = dto.tdsAmount || 0;
    if (!tdsAmount && dto.tdsPercentage && dto.tdsPercentage > 0) {
      tdsAmount = (dto.amount * dto.tdsPercentage) / 100;
    }

    const totalAllocation = (dto.allocations || []).reduce(
      (s: any, a: any) => s + a.amount,
      0,
    );
    if (totalAllocation > dto.amount + 0.01) {
      throw new BadRequestException(
        `Total allocation (${totalAllocation}) exceeds payment amount (${dto.amount})`,
      );
    }

    let savedPayment!: SupplierPayment;

    await ds.transaction(async (manager) => {
      const payRepo = manager.getRepository(SupplierPayment);
      const allocRepo = manager.getRepository(SupplierPaymentAllocation);

      const payment = payRepo.create({
        id: uuidv4(),
        paymentNumber,
        paymentDate: dto.paymentDate,
        supplierId: dto.supplierId,
        paymentMethodId: dto.paymentMethodId,
        bankAccountId: dto.bankAccountId,
        amount: dto.amount,
        currency: dto.currency || 'BDT',
        exchangeRate: dto.exchangeRate || 1,
        status: SupplierPaymentStatus.DRAFT,
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
      } as DeepPartial<SupplierPayment>);

      savedPayment = await payRepo.save(payment);

      // Create allocations (payment still DRAFT — dues updated on process/complete)
      for (const alloc of dto.allocations || []) {
        const due = await manager
          .getRepository(SupplierDue)
          .findOne({ where: { id: alloc.supplierDueId } });
        if (!due)
          throw new NotFoundException(
            `Supplier due ${alloc.supplierDueId} not found`,
          );
        if (due.supplierId !== dto.supplierId) {
          throw new BadRequestException('Due does not belong to this supplier');
        }

        const balance = due.balanceAmount;
        if (alloc.amount > balance + 0.01) {
          throw new BadRequestException(
            `Allocation (${alloc.amount}) exceeds due balance (${balance})`,
          );
        }

        const allocation = allocRepo.create({
          id: uuidv4(),
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

  // ─────────────────────── LIST ───────────────────────
  async findAll(
    filterDto: SupplierPaymentFilterDto,
  ): Promise<PaginatedResult<SupplierPayment>> {
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
      qb.andWhere(
        '(p.paymentNumber LIKE :s OR p.referenceNumber LIKE :s OR supplier.name LIKE :s OR supplier.companyName LIKE :s)',
        { s: `%${filterDto.search}%` },
      );
    }

    if (!filterDto.sortBy) {
      filterDto.sortBy = 'paymentDate';
      filterDto.sortOrder = 'DESC';
    }
    return paginate(qb, filterDto);
  }

  // ─────────────────────── FIND BY ID ───────────────────────
  async findById(id: string): Promise<SupplierPayment> {
    const ds = await this.getDataSource();
    const repo = ds.getRepository(SupplierPayment);
    const payment = await repo.findOne({
      where: { id },
      relations: ['supplier', 'paymentMethod', 'bankAccount'],
    });
    if (!payment)
      throw new NotFoundException(`Supplier payment ${id} not found`);

    // Load allocations
    const allocRepo = ds.getRepository(SupplierPaymentAllocation);
    const allocations = await allocRepo.find({
      where: { paymentId: id },
      relations: ['supplierDue'],
      order: { allocationDate: 'ASC' },
    });
    (payment as any).allocations = allocations;

    return payment;
  }

  // ─────────────────────── SUBMIT FOR APPROVAL ───────────────────────
  async submitForApproval(
    id: string,
    userId: string,
  ): Promise<SupplierPayment> {
    const repo = await this.getRepo();
    const payment = await this.findById(id);

    if (payment.status !== SupplierPaymentStatus.DRAFT) {
      throw new BadRequestException('Only draft payments can be submitted');
    }

    payment.status = SupplierPaymentStatus.PENDING_APPROVAL;
    return repo.save(payment);
  }

  // ─────────────────────── APPROVE ───────────────────────
  async approve(id: string, userId: string): Promise<SupplierPayment> {
    const repo = await this.getRepo();
    const payment = await this.findById(id);

    if (
      ![
        SupplierPaymentStatus.DRAFT,
        SupplierPaymentStatus.PENDING_APPROVAL,
      ].includes(payment.status)
    ) {
      throw new BadRequestException(
        'Only draft/pending payments can be approved',
      );
    }

    payment.status = SupplierPaymentStatus.APPROVED;
    payment.approvedBy = userId;
    payment.approvedAt = new Date();
    return repo.save(payment);
  }

  // ─────────────────────── PROCESS (execute payment + update dues) ───────────────────────
  async process(id: string, userId: string): Promise<SupplierPayment> {
    const ds = await this.getDataSource();
    const payment = await this.findById(id);

    if (payment.status !== SupplierPaymentStatus.APPROVED) {
      throw new BadRequestException('Only approved payments can be processed');
    }

    await ds.transaction(async (manager) => {
      const payRepo = manager.getRepository(SupplierPayment);
      const allocRepo = manager.getRepository(SupplierPaymentAllocation);

      // Apply allocations to supplier dues
      const allocations = await allocRepo.find({ where: { paymentId: id } });
      for (const alloc of allocations) {
        await this.supplierDuesService.addPayment(
          alloc.supplierDueId,
          Number(alloc.allocatedAmount),
          manager,
        );
      }

      payment.status = SupplierPaymentStatus.PROCESSING;
      await payRepo.save(payment);

      // TODO: Create Journal Entry:
      //   Dr: Accounts Payable          = payment.amount
      //   Cr: Bank Account              = payment.amount - payment.tdsAmount
      //   Cr: TDS Payable (if TDS > 0)  = payment.tdsAmount
    });

    return this.findById(id);
  }

  // ─────────────────────── COMPLETE ───────────────────────
  async complete(id: string, userId: string): Promise<SupplierPayment> {
    const repo = await this.getRepo();
    const payment = await this.findById(id);

    if (payment.status !== SupplierPaymentStatus.PROCESSING) {
      throw new BadRequestException(
        'Only processing payments can be completed',
      );
    }

    payment.status = SupplierPaymentStatus.COMPLETED;
    return repo.save(payment);
  }

  // ─────────────────────── ALLOCATE (late allocation) ───────────────────────
  async allocate(
    id: string,
    dto: AllocatePaymentDto,
    userId: string,
  ): Promise<SupplierPayment> {
    const ds = await this.getDataSource();
    const payment = await this.findById(id);

    if (
      ![
        SupplierPaymentStatus.APPROVED,
        SupplierPaymentStatus.PROCESSING,
        SupplierPaymentStatus.COMPLETED,
      ].includes(payment.status)
    ) {
      throw new BadRequestException(
        'Payment must be approved/processing/completed to allocate',
      );
    }

    const totalNew = dto.allocations.reduce(
      (s: any, a: any) => s + a.amount,
      0,
    );
    if (totalNew > Number(payment.unallocatedAmount) + 0.01) {
      throw new BadRequestException(
        `Total (${totalNew}) exceeds unallocated (${payment.unallocatedAmount})`,
      );
    }

    await ds.transaction(async (manager) => {
      const payRepo = manager.getRepository(SupplierPayment);
      const allocRepo = manager.getRepository(SupplierPaymentAllocation);

      for (const alloc of dto.allocations) {
        const due = await manager
          .getRepository(SupplierDue)
          .findOne({ where: { id: alloc.supplierDueId } });
        if (!due)
          throw new NotFoundException(
            `Supplier due ${alloc.supplierDueId} not found`,
          );
        if (due.supplierId !== payment.supplierId) {
          throw new BadRequestException(
            'Due does not belong to payment supplier',
          );
        }

        const allocation = allocRepo.create({
          id: uuidv4(),
          paymentId: id,
          supplierDueId: alloc.supplierDueId,
          allocatedAmount: alloc.amount,
          allocationDate: new Date().toISOString().split('T')[0],
          notes: alloc.notes,
          createdBy: userId,
        });
        await allocRepo.save(allocation);

        // Update due if payment already processed
        if (
          [
            SupplierPaymentStatus.PROCESSING,
            SupplierPaymentStatus.COMPLETED,
          ].includes(payment.status)
        ) {
          await this.supplierDuesService.addPayment(
            alloc.supplierDueId,
            alloc.amount,
            manager,
          );
        }
      }

      payment.allocatedAmount = Number(payment.allocatedAmount) + totalNew;
      payment.unallocatedAmount = Number(payment.unallocatedAmount) - totalNew;
      await payRepo.save(payment);
    });

    return this.findById(id);
  }

  // ─────────────────────── CANCEL ───────────────────────
  async cancel(
    id: string,
    reason: string,
    userId: string,
  ): Promise<SupplierPayment> {
    const ds = await this.getDataSource();
    const payment = await this.findById(id);

    if (
      [
        SupplierPaymentStatus.COMPLETED,
        SupplierPaymentStatus.CANCELLED,
      ].includes(payment.status)
    ) {
      throw new BadRequestException(
        'Completed/cancelled payments cannot be cancelled',
      );
    }

    await ds.transaction(async (manager) => {
      const payRepo = manager.getRepository(SupplierPayment);
      const allocRepo = manager.getRepository(SupplierPaymentAllocation);

      // If payment was processed, reverse dues
      if (payment.status === SupplierPaymentStatus.PROCESSING) {
        const allocations = await allocRepo.find({ where: { paymentId: id } });
        for (const alloc of allocations) {
          await this.supplierDuesService.reversePayment(
            alloc.supplierDueId,
            Number(alloc.allocatedAmount),
            manager,
          );
        }
      }

      payment.status = SupplierPaymentStatus.CANCELLED;
      payment.notes = payment.notes
        ? `${payment.notes}\nCancelled: ${reason}`
        : `Cancelled: ${reason}`;
      await payRepo.save(payment);
    });

    return this.findById(id);
  }
}
