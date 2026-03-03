import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { TaxRate } from './tax-rate.entity';
import { Product } from './product.entity';

@Entity('tax_categories')
export class TaxCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tax_code', length: 50, unique: true })
  taxCode: string;

  @Column({ name: 'tax_name', length: 100 })
  taxName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'is_active', type: 'tinyint', default: 1 })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => TaxRate, (rate) => rate.taxCategory)
  taxRates: TaxRate[];

  @OneToMany(() => Product, (product) => product.taxCategory)
  products: Product[];
}
