import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TaxCategory } from './tax-category.entity';

@Entity('tax_rates')
export class TaxRate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tax_category_id' })
  taxCategoryId: string;

  @Column({ name: 'tax_type', length: 50 })
  taxType: string;

  @Column({ name: 'rate_name', length: 100 })
  rateName: string;

  @Column({ name: 'rate_percentage', type: 'decimal', precision: 5, scale: 2 })
  ratePercentage: number;

  @Column({ name: 'effective_from', type: 'date' })
  effectiveFrom: Date;

  @Column({ name: 'effective_to', type: 'date', nullable: true })
  effectiveTo: Date;

  @Column({ name: 'is_active', type: 'tinyint', default: 1 })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => TaxCategory, (category) => category.taxRates)
  @JoinColumn({ name: 'tax_category_id' })
  taxCategory: TaxCategory;
}
