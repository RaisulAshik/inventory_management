import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PaymentMethodType {
  CASH = 'CASH',
  CARD = 'CARD',
  UPI = 'UPI',
  NET_BANKING = 'NET_BANKING',
  WALLET = 'WALLET',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CHEQUE = 'CHEQUE',
  COD = 'COD',
  CREDIT = 'CREDIT',
  EMI = 'EMI',
  GIFT_CARD = 'GIFT_CARD',
  STORE_CREDIT = 'STORE_CREDIT',
  OTHER = 'OTHER',
}

@Entity('payment_methods')
export class PaymentMethod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'method_code', length: 50, unique: true })
  methodCode: string;

  @Column({ name: 'method_name', length: 200 })
  methodName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    name: 'method_type',
    type: 'enum',
    enum: PaymentMethodType,
  })
  methodType: PaymentMethodType;

  @Column({ name: 'gateway_code', length: 50, nullable: true })
  gatewayCode: string;

  @Column({ name: 'gateway_config', type: 'json', nullable: true })
  gatewayConfig: Record<string, any>;

  @Column({
    name: 'processing_fee_type',
    type: 'enum',
    enum: ['PERCENTAGE', 'FIXED', 'NONE'],
    default: 'NONE',
  })
  processingFeeType: 'PERCENTAGE' | 'FIXED' | 'NONE';

  @Column({
    name: 'processing_fee_value',
    type: 'decimal',
    precision: 10,
    scale: 4,
    default: 0,
  })
  processingFeeValue: number;

  @Column({
    name: 'min_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  minAmount: number;

  @Column({
    name: 'max_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  maxAmount: number;

  @Column({ name: 'is_available_pos', type: 'tinyint', default: 1 })
  isAvailablePos: boolean;

  @Column({ name: 'is_available_ecommerce', type: 'tinyint', default: 1 })
  isAvailableEcommerce: boolean;

  @Column({ name: 'requires_reference', type: 'tinyint', default: 0 })
  requiresReference: boolean;

  @Column({ name: 'is_active', type: 'tinyint', default: 1 })
  isActive: boolean;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @Column({ name: 'icon_url', length: 500, nullable: true })
  iconUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Helper
  calculateProcessingFee(amount: number): number {
    switch (this.processingFeeType) {
      case 'PERCENTAGE':
        return amount * (this.processingFeeValue / 100);
      case 'FIXED':
        return this.processingFeeValue;
      default:
        return 0;
    }
  }
}
