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
import { Customer } from './customer.entity';
import { Coupon } from './coupon.entity';
import { ShoppingCartItem } from './shopping-cart-item.entity';
export enum CartStatus {
  ACTIVE = 'ACTIVE',
  CONVERTED = 'CONVERTED',
  ABANDONED = 'ABANDONED',
  MERGED = 'MERGED',
}

@Entity('shopping_carts')
export class ShoppingCart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'customer_id', nullable: true })
  customerId: string;

  @Column({ name: 'session_id', length: 255, nullable: true })
  sessionId: string;

  @Column({
    type: 'enum',
    enum: CartStatus,
    default: CartStatus.ACTIVE,
  })
  status: CartStatus;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  subtotal: number;

  @Column({
    name: 'discount_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  discountAmount: number;

  @Column({
    name: 'tax_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  taxAmount: number;

  @Column({
    name: 'total_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  totalAmount: number;

  @Column({ name: 'coupon_id', nullable: true })
  couponId: string;

  @Column({ name: 'coupon_code', length: 50, nullable: true })
  couponCode: string;

  @Column({
    name: 'coupon_discount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  couponDiscount: number;

  @Column({ name: 'item_count', type: 'int', default: 0 })
  itemCount: number;

  @Column({ length: 3, default: 'BDT' })
  currency: string;

  @Column({ name: 'ip_address', length: 45, nullable: true })
  ipAddress: string;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string;

  @Column({ name: 'last_activity_at', type: 'timestamp', nullable: true })
  lastActivityAt: Date;

  @Column({ name: 'converted_order_id', nullable: true })
  convertedOrderId: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => Coupon)
  @JoinColumn({ name: 'coupon_id' })
  coupon: Coupon;

  @OneToMany(() => ShoppingCartItem, (item) => item.cart)
  items: ShoppingCartItem[];

  // Helper
  get isEmpty(): boolean {
    return this.itemCount === 0;
  }
}
