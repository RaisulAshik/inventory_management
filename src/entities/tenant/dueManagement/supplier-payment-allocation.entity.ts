import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SupplierPayment } from './supplier-payment.entity';
import { SupplierDue } from './supplier-due.entity';

@Entity('supplier_payment_allocations')
export class SupplierPaymentAllocation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'payment_id' })
  paymentId: string;

  @Column({ name: 'supplier_due_id' })
  supplierDueId: string;

  @Column({
    name: 'allocated_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  allocatedAmount: number;

  @Column({ name: 'allocation_date', type: 'date' })
  allocationDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => SupplierPayment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'payment_id' })
  payment: SupplierPayment;

  @ManyToOne(() => SupplierDue, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'supplier_due_id' })
  supplierDue: SupplierDue;
}
