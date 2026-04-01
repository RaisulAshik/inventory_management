import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('payment_terms')
export class PaymentTerm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'term_code', length: 50, unique: true })
  termCode: string;

  @Column({ name: 'term_name', length: 100 })
  termName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'due_days', type: 'int', default: 0 })
  dueDays: number;

  @Column({ name: 'discount_days', type: 'int', nullable: true })
  discountDays: number;

  @Column({
    name: 'discount_percentage',
    type: 'decimal',
    precision: 8,
    scale: 4,
    nullable: true,
  })
  discountPercentage: number;

  @Column({ name: 'is_active', type: 'tinyint', default: 1 })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
