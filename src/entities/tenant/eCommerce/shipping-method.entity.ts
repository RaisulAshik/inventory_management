import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ShippingCarrierType {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
  PICKUP = 'PICKUP',
}

export enum ShippingCalculationType {
  FLAT_RATE = 'FLAT_RATE',
  WEIGHT_BASED = 'WEIGHT_BASED',
  PRICE_BASED = 'PRICE_BASED',
  ITEM_BASED = 'ITEM_BASED',
  REAL_TIME = 'REAL_TIME',
  FREE = 'FREE',
}

@Entity('shipping_methods')
export class ShippingMethod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'method_code', length: 50, unique: true })
  methodCode: string;

  @Column({ name: 'method_name', length: 200 })
  methodName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    name: 'carrier_type',
    type: 'enum',
    enum: ShippingCarrierType,
    default: ShippingCarrierType.INTERNAL,
  })
  carrierType: ShippingCarrierType;

  @Column({ name: 'carrier_code', length: 50, nullable: true })
  carrierCode: string;

  @Column({
    name: 'calculation_type',
    type: 'enum',
    enum: ShippingCalculationType,
    default: ShippingCalculationType.FLAT_RATE,
  })
  calculationType: ShippingCalculationType;

  @Column({
    name: 'base_rate',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  baseRate: number;

  @Column({
    name: 'rate_per_kg',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  ratePerKg: number;

  @Column({
    name: 'rate_per_item',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  ratePerItem: number;

  @Column({
    name: 'free_shipping_threshold',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  freeShippingThreshold: number;

  @Column({
    name: 'min_order_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  minOrderAmount: number;

  @Column({
    name: 'max_order_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  maxOrderAmount: number;

  @Column({
    name: 'max_weight_kg',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  maxWeightKg: number;

  @Column({ name: 'estimated_delivery_days_min', type: 'int', nullable: true })
  estimatedDeliveryDaysMin: number;

  @Column({ name: 'estimated_delivery_days_max', type: 'int', nullable: true })
  estimatedDeliveryDaysMax: number;

  @Column({ name: 'tracking_available', type: 'tinyint', default: 0 })
  trackingAvailable: boolean;

  @Column({ name: 'insurance_available', type: 'tinyint', default: 0 })
  insuranceAvailable: boolean;

  @Column({ name: 'is_active', type: 'tinyint', default: 1 })
  isActive: boolean;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Helper
  get estimatedDeliveryText(): string {
    if (this.estimatedDeliveryDaysMin && this.estimatedDeliveryDaysMax) {
      if (this.estimatedDeliveryDaysMin === this.estimatedDeliveryDaysMax) {
        return `${this.estimatedDeliveryDaysMin} days`;
      }
      return `${this.estimatedDeliveryDaysMin}-${this.estimatedDeliveryDaysMax} days`;
    }
    return 'Varies';
  }
}
