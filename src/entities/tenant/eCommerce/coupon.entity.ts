import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CouponType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  FREE_SHIPPING = 'FREE_SHIPPING',
  BUY_X_GET_Y = 'BUY_X_GET_Y',
}

export enum CouponStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  EXPIRED = 'EXPIRED',
  EXHAUSTED = 'EXHAUSTED',
}

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'coupon_code', length: 50, unique: true })
  couponCode: string;

  @Column({ name: 'coupon_name', length: 200 })
  couponName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    name: 'coupon_type',
    type: 'enum',
    enum: CouponType,
    default: CouponType.PERCENTAGE,
  })
  couponType: CouponType;

  @Column({
    name: 'discount_value',
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  discountValue: number;

  @Column({
    name: 'max_discount_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  maxDiscountAmount: number;

  @Column({
    name: 'min_order_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  minOrderAmount: number;

  @Column({ name: 'min_quantity', type: 'int', nullable: true })
  minQuantity: number;

  @Column({ name: 'start_date', type: 'timestamp' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({ name: 'usage_limit', type: 'int', nullable: true })
  usageLimit: number;

  @Column({ name: 'usage_limit_per_customer', type: 'int', nullable: true })
  usageLimitPerCustomer: number;

  @Column({ name: 'times_used', type: 'int', default: 0 })
  timesUsed: number;

  @Column({
    type: 'enum',
    enum: CouponStatus,
    default: CouponStatus.ACTIVE,
  })
  status: CouponStatus;

  @Column({ name: 'applies_to_all_products', type: 'tinyint', default: 1 })
  appliesToAllProducts: boolean;

  @Column({ name: 'applies_to_all_customers', type: 'tinyint', default: 1 })
  appliesToAllCustomers: boolean;

  @Column({ name: 'is_first_order_only', type: 'tinyint', default: 0 })
  isFirstOrderOnly: boolean;

  @Column({ name: 'is_combinable', type: 'tinyint', default: 0 })
  isCombinable: boolean;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Helpers
  get isValid(): boolean {
    const now = new Date();
    return (
      this.status === CouponStatus.ACTIVE &&
      this.startDate <= now &&
      (!this.endDate || this.endDate >= now) &&
      (!this.usageLimit || this.timesUsed < this.usageLimit)
    );
  }

  get remainingUses(): number | null {
    if (!this.usageLimit) return null;
    return Math.max(0, this.usageLimit - this.timesUsed);
  }
}
