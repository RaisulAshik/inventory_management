import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { TenantStatus } from '@common/enums';
//import { TenantBillingInfo } from './tenant-billing-info.entity';
import { TenantDatabase } from './tenant-database.entity';
import { TenantUser } from './tenant-user.entity';
import { Subscription } from './subscription.entity';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_code', length: 50, unique: true })
  tenantCode: string;

  @Column({ name: 'company_name', length: 200 })
  companyName: string;

  @Column({ name: 'legal_name', length: 200, nullable: true })
  legalName: string;

  @Column({ name: 'tax_id', length: 100, nullable: true })
  taxId: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 50, nullable: true })
  phone: string;

  @Column({ length: 255, nullable: true })
  website: string;

  @Column({ name: 'logo_url', length: 500, nullable: true })
  logoUrl: string;

  @Column({ name: 'address_line1', length: 255, nullable: true })
  addressLine1: string;

  @Column({ name: 'address_line2', length: 255, nullable: true })
  addressLine2: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ length: 100, nullable: true })
  state: string;

  @Column({ length: 100, default: 'Bangladesh' })
  country: string;

  @Column({ name: 'postal_code', length: 20, nullable: true })
  postalCode: string;

  @Column({ type: 'text', nullable: true })
  industry: string;

  @Column({ length: 100, default: 'Asia/Kolkata' })
  timezone: string;

  @Column({ name: 'default_currency', length: 3, default: 'INR' })
  defaultCurrency: string;

  @Column({ name: 'date_format', length: 20, default: 'DD/MM/YYYY' })
  dateFormat: string;

  @Column({ name: 'fiscal_year_start_month', type: 'tinyint', default: 4 })
  fiscalYearStartMonth: number;

  @Column({ name: 'employee_count', type: 'int', default: 0 })
  employeeCount: number;

  @Column({
    type: 'enum',
    enum: TenantStatus,
    default: TenantStatus.PENDING,
  })
  status: TenantStatus;

  @Column({ name: 'activated_at', type: 'timestamp', nullable: true })
  activatedAt: Date;

  @Column({ name: 'suspended_at', type: 'timestamp', nullable: true })
  suspendedAt: Date;

  @Column({ name: 'suspended_reason', type: 'text', nullable: true })
  suspendedReason: string;

  @Column({ name: 'terminated_at', type: 'timestamp', nullable: true })
  terminatedAt: Date;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToOne(() => TenantDatabase, (database) => database.tenant)
  database: TenantDatabase;

  // @OneToOne(() => TenantBillingInfo, (billing) => billing.tenant)
  // billingInfo: TenantBillingInfo;

  @OneToMany(() => Subscription, (subscription) => subscription.tenant)
  subscriptions: Subscription[];

  @OneToMany(() => TenantUser, (user) => user.tenant)
  users: TenantUser[];
}
