// src/modules/purchase/debit-notes/debit-notes.service.ts

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
import { DebitNote, DebitNoteStatus } from '@entities/tenant';
import { SupplierDuesService } from '../supplier-dues/supplier-dues.service';
import {
  CreateDebitNoteDto,
  AcknowledgeDebitNoteDto,
  ApplyToSupplierDueDto,
  DebitNoteFilterDto,
} from './dto/debit-note.dto';

@Injectable()
export class DebitNotesService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
    private readonly supplierDuesService: SupplierDuesService,
  ) {}

  private async getRepo(): Promise<Repository<DebitNote>> {
    return this.tenantConnectionManager.getRepository(DebitNote);
  }

  private async getDataSource(): Promise<DataSource> {
    return this.tenantConnectionManager.getDataSource();
  }

  // ─────────────────────── CREATE ───────────────────────
  async create(dto: CreateDebitNoteDto, userId: string): Promise<DebitNote> {
    const ds = await this.getDataSource();
    const repo = ds.getRepository(DebitNote);
    const debitNoteNumber = await getNextSequence(ds, 'DEBIT_NOTE');

    const dn = repo.create({
      id: uuidv4(),
      debitNoteNumber,
      debitNoteDate: dto.debitNoteDate,
      supplierId: dto.supplierId,
      purchaseOrderId: dto.purchaseOrderId,
      grnId: dto.grnId,
      purchaseReturnId: dto.purchaseReturnId,
      reason: dto.reason,
      reasonDetails: dto.reasonDetails,
      status: DebitNoteStatus.DRAFT,
      currency: dto.currency || 'BDT',
      subtotal: dto.subtotal,
      taxAmount: dto.taxAmount || 0,
      totalAmount: dto.totalAmount,
      adjustedAmount: 0,
      balanceAmount: dto.totalAmount,
      notes: dto.notes,
      createdBy: userId,
    } as DeepPartial<DebitNote>);

    return repo.save(dn);
  }

  // ─────────────────────── LIST ───────────────────────
  async findAll(
    filterDto: DebitNoteFilterDto,
  ): Promise<PaginatedResult<DebitNote>> {
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
      qb.andWhere(
        '(dn.debitNoteNumber LIKE :s OR supplier.name LIKE :s OR supplier.companyName LIKE :s)',
        { s: `%${filterDto.search}%` },
      );
    }

    if (!filterDto.sortBy) {
      filterDto.sortBy = 'debitNoteDate';
      filterDto.sortOrder = 'DESC';
    }
    return paginate(qb, filterDto);
  }

  // ─────────────────────── FIND BY ID ───────────────────────
  async findById(id: string): Promise<DebitNote> {
    const repo = await this.getRepo();
    const dn = await repo.findOne({
      where: { id },
      relations: ['supplier', 'purchaseOrder', 'grn', 'purchaseReturn'],
    });
    if (!dn) throw new NotFoundException(`Debit note ${id} not found`);
    return dn;
  }

  // ─────────────────────── FIND BY SUPPLIER ───────────────────────
  async findBySupplier(supplierId: string): Promise<DebitNote[]> {
    const repo = await this.getRepo();
    return repo.find({
      where: { supplierId },
      relations: ['purchaseOrder'],
      order: { debitNoteDate: 'DESC' },
    });
  }

  // ─────────────────────── SUBMIT FOR APPROVAL ───────────────────────
  async submitForApproval(id: string, userId: string): Promise<DebitNote> {
    const repo = await this.getRepo();
    const dn = await this.findById(id);

    if (dn.status !== DebitNoteStatus.DRAFT) {
      throw new BadRequestException('Only draft debit notes can be submitted');
    }

    dn.status = DebitNoteStatus.PENDING_APPROVAL;
    return repo.save(dn);
  }

  // ─────────────────────── APPROVE ───────────────────────
  async approve(id: string, userId: string): Promise<DebitNote> {
    const repo = await this.getRepo();
    const dn = await this.findById(id);

    if (
      ![DebitNoteStatus.DRAFT, DebitNoteStatus.PENDING_APPROVAL].includes(
        dn.status,
      )
    ) {
      throw new BadRequestException(
        'Only draft/pending debit notes can be approved',
      );
    }

    dn.status = DebitNoteStatus.APPROVED;
    dn.approvedBy = userId;
    dn.approvedAt = new Date();

    // TODO: Create Journal Entry → Dr: Accounts Payable, Cr: Purchase Returns

    return repo.save(dn);
  }

  // ─────────────────────── SEND TO SUPPLIER ───────────────────────
  async sendToSupplier(id: string, userId: string): Promise<DebitNote> {
    const repo = await this.getRepo();
    const dn = await this.findById(id);

    if (dn.status !== DebitNoteStatus.APPROVED) {
      throw new BadRequestException('Only approved debit notes can be sent');
    }

    dn.status = DebitNoteStatus.SENT_TO_SUPPLIER;
    return repo.save(dn);
  }

  // ─────────────────────── ACKNOWLEDGE ───────────────────────
  async acknowledge(
    id: string,
    dto: AcknowledgeDebitNoteDto,
    userId: string,
  ): Promise<DebitNote> {
    const repo = await this.getRepo();
    const dn = await this.findById(id);

    if (dn.status !== DebitNoteStatus.SENT_TO_SUPPLIER) {
      throw new BadRequestException(
        'Only sent debit notes can be acknowledged',
      );
    }

    dn.status = DebitNoteStatus.ACKNOWLEDGED;
    dn.supplierAcknowledgementNumber = dto.acknowledgementNumber || '';
    dn.supplierAcknowledgementDate = dto.acknowledgementDate
      ? new Date(dto.acknowledgementDate)
      : new Date();
    return repo.save(dn);
  }

  // ─────────────────────── APPLY TO SUPPLIER DUE ───────────────────────
  async applyToDue(
    id: string,
    dto: ApplyToSupplierDueDto,
    userId: string,
  ): Promise<DebitNote> {
    const ds = await this.getDataSource();
    const dn = await this.findById(id);

    const validStatuses = [
      DebitNoteStatus.APPROVED,
      DebitNoteStatus.SENT_TO_SUPPLIER,
      DebitNoteStatus.ACKNOWLEDGED,
      DebitNoteStatus.PARTIALLY_ADJUSTED,
    ];
    if (!validStatuses.includes(dn.status)) {
      throw new BadRequestException(
        'Debit note must be approved/sent/acknowledged to apply',
      );
    }

    if (dto.amount > Number(dn.balanceAmount) + 0.01) {
      throw new BadRequestException(
        `Amount (${dto.amount}) exceeds DN balance (${dn.balanceAmount})`,
      );
    }

    // Validate due belongs to same supplier
    const due = await this.supplierDuesService.findById(dto.supplierDueId);
    if (due.supplierId !== dn.supplierId) {
      throw new BadRequestException('Due does not belong to the same supplier');
    }

    await ds.transaction(async (manager) => {
      const dnRepo = manager.getRepository(DebitNote);

      // Apply to supplier due
      await this.supplierDuesService.applyDebitNote(
        dto.supplierDueId,
        dto.amount,
        manager,
      );

      // Update debit note
      dn.adjustedAmount = Number(dn.adjustedAmount) + dto.amount;
      dn.balanceAmount = Number(dn.balanceAmount) - dto.amount;

      if (dn.balanceAmount <= 0.01) {
        dn.status = DebitNoteStatus.FULLY_ADJUSTED;
      } else {
        dn.status = DebitNoteStatus.PARTIALLY_ADJUSTED;
      }

      await dnRepo.save(dn);
    });

    return this.findById(id);
  }

  // ─────────────────────── CANCEL ───────────────────────
  async cancel(id: string, userId: string): Promise<DebitNote> {
    const repo = await this.getRepo();
    const dn = await this.findById(id);

    if (
      [DebitNoteStatus.FULLY_ADJUSTED, DebitNoteStatus.CANCELLED].includes(
        dn.status,
      )
    ) {
      throw new BadRequestException('Cannot cancel');
    }
    if (Number(dn.adjustedAmount) > 0) {
      throw new BadRequestException(
        'Cannot cancel a partially adjusted debit note',
      );
    }

    dn.status = DebitNoteStatus.CANCELLED;
    return repo.save(dn);
  }
}
