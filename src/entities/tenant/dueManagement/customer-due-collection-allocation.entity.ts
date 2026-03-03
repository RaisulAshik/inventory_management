import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CustomerDueCollection } from './customer-due-collection.entity';
import { CustomerDue } from './customer-due.entity';

@Entity('customer_due_collection_allocations')
export class CustomerDueCollectionAllocation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'collection_id' })
  collectionId: string;

  @Column({ name: 'customer_due_id' })
  customerDueId: string;

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
  @ManyToOne(() => CustomerDueCollection, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'collection_id' })
  collection: CustomerDueCollection;

  @ManyToOne(() => CustomerDue, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_due_id' })
  customerDue: CustomerDue;
}
