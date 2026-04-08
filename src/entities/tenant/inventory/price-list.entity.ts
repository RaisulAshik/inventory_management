import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { PriceListItem } from './price-list-item.entity';

export enum PriceListType {
  SALES = 'SALES',
  PURCHASE = 'PURCHASE',
}

@Entity('price_lists')
export class PriceList {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'price_list_code', length: 50, unique: true })
  priceListCode: string;

  @Column({ name: 'price_list_name', length: 200 })
  priceListName: string;

  @Column({
    name: 'price_list_type',
    type: 'enum',
    enum: PriceListType,
    default: PriceListType.SALES,
  })
  priceListType: PriceListType;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 3, default: 'BDT' })
  currency: string;

  @Column({ name: 'is_tax_inclusive', type: 'tinyint', default: 0 })
  isTaxInclusive: boolean;

  @Column({ name: 'effective_from', type: 'date', nullable: true })
  effectiveFrom: Date;

  @Column({ name: 'effective_to', type: 'date', nullable: true })
  effectiveTo: Date;

  @Column({
    name: 'min_order_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  minOrderAmount: number;

  @Column({
    name: 'discount_percentage',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
  })
  discountPercentage: number;

  @Column({ type: 'int', default: 0 })
  priority: number;

  @Column({ name: 'is_default', type: 'tinyint', default: 0 })
  isDefault: boolean;

  @Column({ name: 'is_active', type: 'tinyint', default: 1 })
  isActive: boolean;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => PriceListItem, (item) => item.priceList)
  items: PriceListItem[];

  // Helper
  get isEffective(): boolean {
    const now = new Date();
    const fromValid =
      !this.effectiveFrom || new Date(this.effectiveFrom) <= now;
    const toValid = !this.effectiveTo || new Date(this.effectiveTo) >= now;
    return fromValid && toValid && this.isActive;
  }
}
