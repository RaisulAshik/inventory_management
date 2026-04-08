import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';
import { PurchaseReturnItem } from './purchase-return-item.entity';
import { Supplier } from '../inventory/supplier.entity';
import { Warehouse } from '../warehouse/warehouse.entity';
import { GoodsReceivedNote } from './goods-received-note.entity';

export enum PurchaseReturnStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SHIPPED = 'SHIPPED',
  RECEIVED_BY_SUPPLIER = 'RECEIVED_BY_SUPPLIER',
  CREDIT_NOTE_RECEIVED = 'CREDIT_NOTE_RECEIVED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('purchase_returns')
@Index(['returnNumber'], { unique: true })
@Index(['supplierId', 'returnDate'])
@Index(['status'])
export class PurchaseReturn {
  @PrimaryColumn('char', { length: 36 })
  id: string;

  @Column('varchar', { name: 'return_number', length: 50 })
  returnNumber: string;

  @Column('char', { name: 'purchase_order_id', length: 36, nullable: true })
  purchaseOrderId: string;

  @Column('char', { name: 'grn_id', length: 36, nullable: true })
  grnId: string;

  @Column('char', { name: 'supplier_id', length: 36 })
  supplierId: string;

  @Column('char', { name: 'warehouse_id', length: 36 })
  warehouseId: string;

  @Column('date', { name: 'return_date' })
  returnDate: Date;

  @Column({
    type: 'enum',
    enum: PurchaseReturnStatus,
    default: PurchaseReturnStatus.DRAFT,
  })
  status: PurchaseReturnStatus;

  @Column('varchar', { name: 'return_type', length: 50 })
  returnType: string;

  @Column('varchar', { length: 500 })
  reason: string;

  @Column('text', { name: 'reason_details', nullable: true })
  reasonDetails: string;

  @Column('char', { length: 3, default: 'BDT' })
  currency: string;

  @Column('decimal', { precision: 15, scale: 4, default: 0 })
  subtotal: number;

  @Column('decimal', {
    name: 'tax_amount',
    precision: 15,
    scale: 4,
    default: 0,
  })
  taxAmount: number;

  @Column('decimal', {
    name: 'total_amount',
    precision: 15,
    scale: 4,
    default: 0,
  })
  totalAmount: number;

  @Column('varchar', { name: 'tracking_number', length: 100, nullable: true })
  trackingNumber: string;

  @Column('varchar', {
    name: 'credit_note_number',
    length: 100,
    nullable: true,
  })
  creditNoteNumber: string;

  @Column('decimal', {
    name: 'credit_note_amount',
    precision: 15,
    scale: 4,
    nullable: true,
  })
  creditNoteAmount: number;

  @Column('date', { name: 'credit_note_date', nullable: true })
  creditNoteDate: Date;

  @Column('char', { name: 'approved_by', length: 36, nullable: true })
  approvedBy: string;

  @Column('datetime', { name: 'approved_at', nullable: true })
  approvedAt: Date;

  @Column('char', { name: 'shipped_by', length: 36, nullable: true })
  shippedBy: string;

  @Column('datetime', { name: 'shipped_at', nullable: true })
  shippedAt: Date;

  @Column('datetime', { name: 'received_by_supplier_at', nullable: true })
  receivedBySupplierAt: Date;

  @Column('varchar', { name: 'rejection_reason', length: 500, nullable: true })
  rejectionReason: string;

  @Column('text', { nullable: true })
  notes: string;

  @Column('char', { name: 'created_by', length: 36, nullable: true })
  createdBy: string;

  @Column('char', { name: 'updated_by', length: 36, nullable: true })
  updatedBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @ManyToOne(() => PurchaseOrder)
  @JoinColumn({ name: 'purchase_order_id' })
  purchaseOrder: PurchaseOrder;

  @ManyToOne(() => GoodsReceivedNote)
  @JoinColumn({ name: 'grn_id' })
  grn: GoodsReceivedNote;

  @OneToMany(() => PurchaseReturnItem, (item) => item.purchaseReturn, {
    cascade: true,
  })
  items: PurchaseReturnItem[];

  // Computed properties
  get itemCount(): number {
    return this.items?.length || 0;
  }

  get totalQuantity(): number {
    return (
      this.items?.reduce((sum, item) => sum + Number(item.quantity), 0) || 0
    );
  }
}
