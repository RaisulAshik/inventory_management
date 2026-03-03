import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Customer } from './customer.entity';

export enum AddressType {
  BILLING = 'BILLING',
  SHIPPING = 'SHIPPING',
  BOTH = 'BOTH',
}

@Entity('customer_addresses')
export class CustomerAddress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'address_label', length: 100, nullable: true })
  addressLabel: string;

  @Column({ name: 'customer_id' })
  customerId: string;

  @Column({
    name: 'address_type',
    type: 'enum',
    enum: AddressType,
    default: AddressType.BOTH,
  })
  addressType: AddressType;

  @Column({ name: 'is_default', type: 'tinyint', default: 0 })
  isDefault: boolean;

  @Column({ name: 'contact_name', length: 200, nullable: true })
  contactName: string;

  @Column({ name: 'contact_phone', length: 50, nullable: true })
  contactPhone: string;

  @Column({ name: 'address_line1', length: 255 })
  addressLine1: string;

  @Column({ name: 'address_line2', length: 255, nullable: true })
  addressLine2: string;

  @Column({ length: 200, nullable: true })
  landmark: string;

  @Column({ length: 100 })
  city: string;

  @Column({ length: 100 })
  state: string;

  @Column({ length: 100, default: 'Bangladesh' })
  country: string;

  @Column({ name: 'postal_code', length: 20 })
  postalCode: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Customer, (customer) => customer.addresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  // Helper
  get formattedAddress(): string {
    const parts = [
      this.addressLine1,
      this.addressLine2,
      this.landmark,
      this.city,
      this.state,
      this.postalCode,
      this.country,
    ].filter(Boolean);
    return parts.join(', ');
  }
}
