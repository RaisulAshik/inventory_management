import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PriceList } from './price-list.entity';
import { Product } from './product.entity';
import { ProductVariant } from './product-variant.entity';
import { UnitOfMeasure } from './unit-of-measure.entity';

@Entity('price_list_items')
export class PriceListItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'price_list_id' })
  priceListId: string;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'variant_id', nullable: true })
  variantId: string;

  @Column({ name: 'uom_id', nullable: true })
  uomId: string;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  price: number;

  @Column({
    name: 'min_quantity',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 1,
  })
  minQuantity: number;

  @Column({
    name: 'max_quantity',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  maxQuantity: number;

  @Column({
    name: 'discount_percentage',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
  })
  discountPercentage: number;

  @Column({
    name: 'discount_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  discountAmount: number;

  @Column({ name: 'effective_from', type: 'date', nullable: true })
  effectiveFrom: Date;

  @Column({ name: 'effective_to', type: 'date', nullable: true })
  effectiveTo: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => PriceList, (priceList) => priceList.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'price_list_id' })
  priceList: PriceList;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => ProductVariant)
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;

  @ManyToOne(() => UnitOfMeasure)
  @JoinColumn({ name: 'uom_id' })
  uom: UnitOfMeasure;

  // Helper
  get netPrice(): number {
    let netPrice = this.price;
    if (this.discountPercentage > 0) {
      netPrice = netPrice * (1 - this.discountPercentage / 100);
    }
    if (this.discountAmount > 0) {
      netPrice = netPrice - this.discountAmount;
    }
    return Math.max(0, netPrice);
  }
}
