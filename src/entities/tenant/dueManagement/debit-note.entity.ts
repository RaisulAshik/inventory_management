import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Supplier } from '../inventory/supplier.entity';
import { GoodsReceivedNote } from '../purchase/goods-received-note.entity';
import { PurchaseOrder } from '../purchase/purchase-order.entity';
import { PurchaseReturn } from '../purchase/purchase-return.entity';

export enum DebitNoteStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  SENT_TO_SUPPLIER = 'SENT_TO_SUPPLIER',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  PARTIALLY_ADJUSTED = 'PARTIALLY_ADJUSTED',
  FULLY_ADJUSTED = 'FULLY_ADJUSTED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
}

export enum DebitNoteReason {
  PURCHASE_RETURN = 'PURCHASE_RETURN',
  PRICE_DIFFERENCE = 'PRICE_DIFFERENCE',
  QUALITY_ISSUE = 'QUALITY_ISSUE',
  SHORT_RECEIPT = 'SHORT_RECEIPT',
  DAMAGED_GOODS = 'DAMAGED_GOODS',
  BILLING_ERROR = 'BILLING_ERROR',
  OTHER = 'OTHER',
}

@Entity('debit_notes')
export class DebitNote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'debit_note_number', length: 50, unique: true })
  debitNoteNumber: string;

  @Column({ name: 'debit_note_date', type: 'date' })
  debitNoteDate: Date;

  @Column({ name: 'supplier_id' })
  supplierId: string;

  @Column({ name: 'purchase_order_id', nullable: true })
  purchaseOrderId: string;

  @Column({ name: 'grn_id', nullable: true })
  grnId: string;

  @Column({ name: 'purchase_return_id', nullable: true })
  purchaseReturnId: string;

  @Column({
    type: 'enum',
    enum: DebitNoteReason,
  })
  reason: DebitNoteReason;

  @Column({ name: 'reason_details', type: 'text', nullable: true })
  reasonDetails: string;

  @Column({
    type: 'enum',
    enum: DebitNoteStatus,
    default: DebitNoteStatus.DRAFT,
  })
  status: DebitNoteStatus;

  @Column({ length: 3, default: 'BDT' })
  currency: string;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  subtotal: number;

  @Column({
    name: 'tax_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  taxAmount: number;

  @Column({
    name: 'total_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  totalAmount: number;

  @Column({
    name: 'adjusted_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  adjustedAmount: number;

  @Column({
    name: 'balance_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  balanceAmount: number;

  @Column({
    name: 'supplier_acknowledgement_number',
    length: 100,
    nullable: true,
  })
  supplierAcknowledgementNumber: string;

  @Column({
    name: 'supplier_acknowledgement_date',
    type: 'date',
    nullable: true,
  })
  supplierAcknowledgementDate: Date;

  @Column({ name: 'journal_entry_id', nullable: true })
  journalEntryId: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'approved_by', nullable: true })
  approvedBy: string;

  @Column({ name: 'approved_at', type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @ManyToOne(() => PurchaseOrder)
  @JoinColumn({ name: 'purchase_order_id' })
  purchaseOrder: PurchaseOrder;

  @ManyToOne(() => GoodsReceivedNote)
  @JoinColumn({ name: 'grn_id' })
  grn: GoodsReceivedNote;

  @ManyToOne(() => PurchaseReturn)
  @JoinColumn({ name: 'purchase_return_id' })
  purchaseReturn: PurchaseReturn;

  // Computed
  get isFullyAdjusted(): boolean {
    return Math.abs(this.totalAmount - this.adjustedAmount) < 0.01;
  }
}
