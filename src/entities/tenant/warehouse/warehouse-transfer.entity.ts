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
import { Warehouse } from './warehouse.entity';
import { WarehouseTransferItem } from './warehouse-transfer-item.entity';

export enum TransferStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  IN_TRANSIT = 'IN_TRANSIT',
  PARTIALLY_RECEIVED = 'PARTIALLY_RECEIVED',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED',
}

export enum TransferType {
  INTER_WAREHOUSE = 'INTER_WAREHOUSE',
  INTER_LOCATION = 'INTER_LOCATION',
}

@Entity('warehouse_transfers')
export class WarehouseTransfer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'transfer_number', length: 50, unique: true })
  transferNumber: string;

  @Column({
    name: 'transfer_type',
    type: 'enum',
    enum: TransferType,
    default: TransferType.INTER_WAREHOUSE,
  })
  transferType: TransferType;

  @Column({ name: 'transfer_date', type: 'date' })
  transferDate: Date;

  @Column({ name: 'from_warehouse_id' })
  fromWarehouseId: string;

  @Column({ name: 'to_warehouse_id' })
  toWarehouseId: string;

  @Column({
    type: 'enum',
    enum: TransferStatus,
    default: TransferStatus.DRAFT,
  })
  status: TransferStatus;

  @Column({ name: 'expected_delivery_date', type: 'date', nullable: true })
  expectedDeliveryDate: Date;

  @Column({ name: 'actual_delivery_date', type: 'date', nullable: true })
  actualDeliveryDate: Date;

  @Column({ name: 'shipping_method', length: 100, nullable: true })
  shippingMethod: string;

  @Column({ name: 'tracking_number', length: 100, nullable: true })
  trackingNumber: string;

  @Column({
    name: 'shipping_cost',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  shippingCost: number;

  @Column({
    name: 'total_value',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  totalValue: number;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'approved_by', nullable: true })
  approvedBy: string;

  @Column({ name: 'approved_at', type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ name: 'shipped_by', nullable: true })
  shippedBy: string;

  @Column({ name: 'shipped_at', type: 'timestamp', nullable: true })
  shippedAt: Date;

  @Column({ name: 'received_by', nullable: true })
  receivedBy: string;

  @Column({ name: 'received_at', type: 'timestamp', nullable: true })
  receivedAt: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'from_warehouse_id' })
  fromWarehouse: Warehouse;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'to_warehouse_id' })
  toWarehouse: Warehouse;

  @OneToMany(() => WarehouseTransferItem, (item) => item.warehouseTransfer)
  items: WarehouseTransferItem[];
}
