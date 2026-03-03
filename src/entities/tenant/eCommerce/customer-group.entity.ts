import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Customer } from './customer.entity';
import { PriceList } from '../inventory/price-list.entity';

@Entity('customer_groups')
export class CustomerGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('idx_customer_group_code', { unique: true })
  @Column({ name: 'group_code', length: 50, unique: true })
  groupCode: string;

  @Column({ name: 'group_name', length: 200 })
  groupName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'default_price_list_id', nullable: true })
  defaultPriceListId: string;

  @Column({
    name: 'discount_percentage',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
  })
  discountPercentage: number;

  @Column({ name: 'payment_terms_days', type: 'int', nullable: true })
  paymentTermsDays: number;

  @Column({
    name: 'credit_limit',
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true,
  })
  creditLimit: number;

  @Column({ name: 'is_tax_exempt', type: 'tinyint', default: 0 })
  isTaxExempt: boolean;

  @Column({
    name: 'loyalty_multiplier',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 1,
  })
  loyaltyMultiplier: number;

  @Column({ name: 'is_active', type: 'tinyint', default: 1 })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => PriceList)
  @JoinColumn({ name: 'default_price_list_id' })
  defaultPriceList: PriceList;

  @OneToMany(() => Customer, (customer) => customer.customerGroup)
  customers: Customer[];
}
