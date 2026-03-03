import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { GRNStatus } from '@common/enums';
import { PurchaseOrder } from './purchase-order.entity';
import { Supplier } from '../inventory/supplier.entity';
import { Warehouse } from '../warehouse/warehouse.entity';
import { GrnItem } from './grn-item.entity';

@Entity('goods_received_notes')
export class GoodsReceivedNote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'grn_number', length: 50, unique: true })
  grnNumber: string;

  @Column({ name: 'grn_date', type: 'date' })
  grnDate: Date;

  @Column({ name: 'receipt_date', type: 'date' })
  receiptDate: Date;

  @Column({ name: 'purchase_order_id', nullable: true })
  purchaseOrderId: string;

  @Column({ name: 'supplier_id' })
  supplierId: string;

  @Column({ name: 'warehouse_id' })
  warehouseId: string;

  @Column({
    type: 'enum',
    enum: GRNStatus,
    default: GRNStatus.DRAFT,
  })
  status: GRNStatus;

  @Column({ name: 'supplier_invoice_number', length: 100, nullable: true })
  supplierInvoiceNumber: string;

  @Column({ name: 'supplier_invoice_date', type: 'date', nullable: true })
  supplierInvoiceDate: Date;

  @Column({ name: 'delivery_note_number', length: 100, nullable: true })
  deliveryNoteNumber: string;

  @Column({ name: 'vehicle_number', length: 50, nullable: true })
  vehicleNumber: string;

  @Column({ name: 'transporter_name', length: 200, nullable: true })
  transporterName: string;

  @Column({ name: 'lr_number', length: 100, nullable: true })
  lrNumber: string;

  @Column({ name: 'currency', length: 100, nullable: true })
  currency: string;

  @Column({ name: 'lr_date', type: 'date', nullable: true })
  lrDate: Date;

  @Column({
    name: 'total_quantity',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  totalQuantity: number;

  @Column({
    name: 'accepted_quantity',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  acceptedQuantity: number;

  @Column({
    name: 'rejected_quantity',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  rejectedQuantity: number;

  @Column({
    name: 'total_value',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  totalValue: number;

  @Column({
    name: 'tax_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  taxAmount: number;

  @Column({
    name: 'subtotal',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  subtotal: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'qc_notes', type: 'text', nullable: true })
  qcNotes: string;

  @Column({ name: 'qc_by', nullable: true })
  qcBy: string;

  @Column({ name: 'qc_at', type: 'timestamp', nullable: true })
  qcAt: Date;

  @Column({ name: 'received_by', nullable: true })
  receivedBy: string;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @Column({ name: 'approved_by', nullable: true })
  approvedBy: string;

  @CreateDateColumn({ name: 'approved_at' })
  approvedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => PurchaseOrder)
  @JoinColumn({ name: 'purchase_order_id' })
  purchaseOrder: PurchaseOrder;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @OneToMany(() => GrnItem, (item) => item.grn)
  items: GrnItem[];
}
