// src/modules/sales/credit-notes/credit-notes.service.ts

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
import { CreditNote, CreditNoteStatus } from '@entities/tenant';
import { CustomerDuesService } from '../customer-dues/customer-dues.service';
import {
  CreateCreditNoteDto,
  CreditNoteFilterDto,
  ApplyToDueDto,
} from './dto/credit-note.dto';

@Injectable()
export class CreditNotesService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
    private readonly duesService: CustomerDuesService,
  ) {}

  private async getRepo(): Promise<Repository<CreditNote>> {
    return this.tenantConnectionManager.getRepository(CreditNote);
  }

  private async getDataSource(): Promise<DataSource> {
    return this.tenantConnectionManager.getDataSource();
  }

  // ─────────────────────── CREATE ───────────────────────
  async create(dto: CreateCreditNoteDto, userId: string): Promise<CreditNote> {
    const ds = await this.getDataSource();
    const repo = ds.getRepository(CreditNote);
    const creditNoteNumber = await getNextSequence(ds, 'CREDIT_NOTE');

    const cn = repo.create({
      id: uuidv4(),
      creditNoteNumber,
      creditNoteDate: dto.creditNoteDate,
      customerId: dto.customerId,
      salesOrderId: dto.salesOrderId,
      salesReturnId: dto.salesReturnId,
      reason: dto.reason,
      reasonDetails: dto.reasonDetails,
      status: CreditNoteStatus.DRAFT,
      currency: dto.currency || 'BDT',
      subtotal: dto.subtotal,
      taxAmount: dto.taxAmount || 0,
      totalAmount: dto.totalAmount,
      usedAmount: 0,
      balanceAmount: dto.totalAmount,
      validUntil: dto.validUntil,
      notes: dto.notes,
      createdBy: userId,
    } as DeepPartial<CreditNote>);

    return repo.save(cn);
  }

  // ─────────────────────── LIST ───────────────────────
  async findAll(
    filterDto: CreditNoteFilterDto,
  ): Promise<PaginatedResult<CreditNote>> {
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
      qb.andWhere(
        '(cn.creditNoteNumber LIKE :s OR customer.firstName LIKE :s OR customer.companyName LIKE :s)',
        { s: `%${filterDto.search}%` },
      );
    }

    if (!filterDto.sortBy) {
      filterDto.sortBy = 'creditNoteDate';
      filterDto.sortOrder = 'DESC';
    }
    return paginate(qb, filterDto);
  }

  // ─────────────────────── FIND BY ID ───────────────────────
  async findById(id: string): Promise<CreditNote> {
    const repo = await this.getRepo();
    const cn = await repo.findOne({
      where: { id },
      relations: ['customer', 'salesOrder', 'salesReturn'],
    });
    if (!cn) throw new NotFoundException(`Credit note ${id} not found`);
    return cn;
  }

  // ─────────────────────── FIND BY CUSTOMER ───────────────────────
  async findByCustomer(customerId: string): Promise<CreditNote[]> {
    const repo = await this.getRepo();
    return repo.find({
      where: { customerId },
      relations: ['salesOrder'],
      order: { creditNoteDate: 'DESC' },
    });
  }

  // ─────────────────────── AVAILABLE (usable) BY CUSTOMER ───────────────────────
  async findUsableByCustomer(customerId: string): Promise<CreditNote[]> {
    const repo = await this.getRepo();
    return repo
      .createQueryBuilder('cn')
      .where('cn.customerId = :customerId', { customerId })
      .andWhere('cn.status = :status', { status: CreditNoteStatus.APPROVED })
      .andWhere('cn.balanceAmount > 0')
      .andWhere('(cn.validUntil IS NULL OR cn.validUntil >= :today)', {
        today: new Date().toISOString().split('T')[0],
      })
      .orderBy('cn.creditNoteDate', 'ASC')
      .getMany();
  }

  // ─────────────────────── SUBMIT FOR APPROVAL ───────────────────────
  async submitForApproval(id: string, userId: string): Promise<CreditNote> {
    const repo = await this.getRepo();
    const cn = await this.findById(id);

    if (cn.status !== CreditNoteStatus.DRAFT) {
      throw new BadRequestException('Only draft credit notes can be submitted');
    }

    cn.status = CreditNoteStatus.PENDING_APPROVAL;
    return repo.save(cn);
  }

  // ─────────────────────── APPROVE ───────────────────────
  async approve(id: string, userId: string): Promise<CreditNote> {
    const repo = await this.getRepo();
    const cn = await this.findById(id);

    if (
      ![CreditNoteStatus.DRAFT, CreditNoteStatus.PENDING_APPROVAL].includes(
        cn.status,
      )
    ) {
      throw new BadRequestException(
        'Only draft/pending credit notes can be approved',
      );
    }

    cn.status = CreditNoteStatus.APPROVED;
    cn.approvedBy = userId;
    cn.approvedAt = new Date();

    // TODO: Create Journal Entry → Dr: Sales Returns/Adjustment, Cr: Accounts Receivable

    return repo.save(cn);
  }

  // ─────────────────────── APPLY TO CUSTOMER DUE ───────────────────────
  async applyToDue(
    id: string,
    dto: ApplyToDueDto,
    userId: string,
  ): Promise<CreditNote> {
    const ds = await this.getDataSource();
    const cn = await this.findById(id);

    if (
      cn.status !== CreditNoteStatus.APPROVED &&
      cn.status !== CreditNoteStatus.PARTIALLY_USED
    ) {
      throw new BadRequestException('Credit note must be approved to apply');
    }

    if (cn.isExpired) {
      throw new BadRequestException('Credit note has expired');
    }

    if (dto.amount > Number(cn.balanceAmount) + 0.01) {
      throw new BadRequestException(
        `Amount (${dto.amount}) exceeds CN balance (${cn.balanceAmount})`,
      );
    }

    // Validate due belongs to same customer
    const due = await this.duesService.findById(dto.customerDueId);
    if (due.customerId !== cn.customerId) {
      throw new BadRequestException('Due does not belong to the same customer');
    }

    await ds.transaction(async (manager) => {
      const cnRepo = manager.getRepository(CreditNote);

      // Apply to due
      await this.duesService.applyCreditNote(
        dto.customerDueId,
        dto.amount,
        manager,
      );

      // Update credit note
      cn.usedAmount = Number(cn.usedAmount) + dto.amount;
      cn.balanceAmount = Number(cn.balanceAmount) - dto.amount;

      if (cn.balanceAmount <= 0.01) {
        cn.status = CreditNoteStatus.FULLY_USED;
      } else {
        cn.status = CreditNoteStatus.PARTIALLY_USED;
      }

      await cnRepo.save(cn);
    });

    return this.findById(id);
  }

  // ─────────────────────── CANCEL ───────────────────────
  async cancel(id: string, userId: string): Promise<CreditNote> {
    const repo = await this.getRepo();
    const cn = await this.findById(id);

    if (
      [CreditNoteStatus.FULLY_USED, CreditNoteStatus.CANCELLED].includes(
        cn.status,
      )
    ) {
      throw new BadRequestException(
        'Cannot cancel a fully used or already cancelled credit note',
      );
    }
    if (Number(cn.usedAmount) > 0) {
      throw new BadRequestException(
        'Cannot cancel a partially used credit note',
      );
    }

    cn.status = CreditNoteStatus.CANCELLED;
    return repo.save(cn);
  }

  // ─────────────────────── MARK EXPIRED (cron) ───────────────────────
  async markExpired(): Promise<number> {
    const ds = await this.getDataSource();
    const result = await ds
      .createQueryBuilder()
      .update('credit_notes')
      .set({ status: CreditNoteStatus.EXPIRED })
      .where('status = :status', { status: CreditNoteStatus.APPROVED })
      .andWhere('balance_amount > 0')
      .andWhere('valid_until IS NOT NULL')
      .andWhere('valid_until < :today', {
        today: new Date().toISOString().split('T')[0],
      })
      .execute();
    return result.affected ?? 0;
  }
}
