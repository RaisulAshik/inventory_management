import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { CustomerAddress } from './customer-address.entity';
import { SalesOrder } from './sales-order.entity';
import { CustomerGroup } from './customer-group.entity';
import { PriceList } from '../inventory/price-list.entity';

export enum CustomerType {
  INDIVIDUAL = 'INDIVIDUAL',
  BUSINESS = 'BUSINESS',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'customer_code', length: 50, unique: true })
  customerCode: string;

  @Column({
    name: 'customer_type',
    type: 'enum',
    enum: CustomerType,
    default: CustomerType.INDIVIDUAL,
  })
  customerType: CustomerType;

  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', length: 100, nullable: true })
  lastName: string;

  @Column({ name: 'company_name', length: 200, nullable: true })
  companyName: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ length: 50, nullable: true })
  phone: string;

  @Column({ length: 50, nullable: true })
  mobile: string;

  @Column({ length: 50, nullable: true })
  panNumber: string;

  @Column({ length: 50, nullable: true })
  paymentTermsDays: string;

  @Column({ length: 50, nullable: true })
  currency: string;

  @Column({ name: 'tax_id', length: 100, nullable: true })
  taxId: string;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  gender: Gender;

  @Column({ name: 'customer_group_id', nullable: true })
  customerGroupId: string;

  @Column({ name: 'price_list_id', nullable: true })
  priceListId: string;

  @Column({ name: 'default_payment_terms_days', type: 'int', nullable: true })
  defaultPaymentTermsDays: number;

  @Column({
    name: 'credit_limit',
    type: 'decimal',
    precision: 18,
    scale: 2,
    default: 0,
  })
  creditLimit: number;

  @Column({
    name: 'total_purchases',
    type: 'decimal',
    precision: 18,
    scale: 2,
    default: 0,
  })
  totalPurchases: number;

  @Column({
    name: 'current_balance',
    type: 'decimal',
    precision: 18,
    scale: 2,
    default: 0,
  })
  currentBalance: number;

  @Column({ name: 'loyalty_points', type: 'int', default: 0 })
  loyaltyPoints: number;

  @Column({ name: 'total_orders', type: 'int', default: 0 })
  totalOrders: number;

  @Column({
    name: 'total_spent',
    type: 'decimal',
    precision: 18,
    scale: 2,
    default: 0,
  })
  totalSpent: number;

  @Column({ name: 'last_order_date', type: 'timestamp', nullable: true })
  lastOrderDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'is_active', type: 'tinyint', default: 1 })
  isActive: boolean;

  @Column({ name: 'is_verified', type: 'tinyint', default: 0 })
  isVerified: boolean;

  @Column({ name: 'accepts_marketing', type: 'tinyint', default: 0 })
  acceptsMarketing: boolean;

  @Column({ length: 50, nullable: true })
  source: string;

  @Column({ name: 'referral_code', length: 50, nullable: true })
  referralCode: string;

  @Column({ name: 'referred_by', nullable: true })
  referredBy: string;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  // Relations
  @ManyToOne(() => CustomerGroup)
  @JoinColumn({ name: 'customer_group_id' })
  customerGroup: CustomerGroup;

  @ManyToOne(() => PriceList)
  @JoinColumn({ name: 'price_list_id' })
  priceList: PriceList;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'referred_by' })
  referrer: Customer;

  @OneToMany(() => CustomerAddress, (address) => address.customer)
  addresses: CustomerAddress[];

  @OneToMany(() => SalesOrder, (order) => order.customer)
  orders: SalesOrder[];

  // Computed
  get fullName(): string {
    return `${this.firstName} ${this.lastName || ''}`.trim();
  }

  get displayName(): string {
    return this.customerType === CustomerType.BUSINESS
      ? this.companyName || this.fullName
      : this.fullName;
  }
}
