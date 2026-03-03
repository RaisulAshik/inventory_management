import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Tenant } from './tenant.entity';

@Entity('tenant_billing_info')
export class TenantBillingInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', unique: true })
  tenantId: string;

  @Column({ name: 'billing_name', length: 200 })
  billingName: string;

  @Column({ name: 'billing_email', length: 255 })
  billingEmail: string;

  @Column({ name: 'billing_phone', length: 50, nullable: true })
  billingPhone: string;

  @Column({ name: 'billing_address_line1', length: 255, nullable: true })
  billingAddressLine1: string;

  @Column({ name: 'billing_address_line2', length: 255, nullable: true })
  billingAddressLine2: string;

  @Column({ name: 'billing_city', length: 100, nullable: true })
  billingCity: string;

  @Column({ name: 'billing_state', length: 100, nullable: true })
  billingState: string;

  @Column({ name: 'billing_country', length: 100, nullable: true })
  billingCountry: string;

  @Column({ name: 'billing_postal_code', length: 20, nullable: true })
  billingPostalCode: string;

  @Column({ name: 'tax_id', length: 100, nullable: true })
  taxId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  // @OneToOne(() => Tenant, (tenant) => tenant.billingInfo, {
  //   onDelete: 'CASCADE',
  // })
  // @JoinColumn({ name: 'tenant_id' })
  // tenant: Tenant;
}
