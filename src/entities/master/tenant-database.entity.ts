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

@Entity('tenant_databases')
export class TenantDatabase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Column({ name: 'database_name', length: 100, unique: true })
  databaseName: string;

  @Column({ length: 255, default: 'localhost' })
  host: string;

  @Column({ type: 'int', default: 3306 })
  port: number;

  @Column({ length: 100, nullable: true })
  username: string;

  @Column({ name: 'is_provisioned', type: 'boolean', default: false })
  isProvisioned: boolean;

  @Column({ name: 'is_active', type: 'boolean', default: false })
  isActive: boolean;

  @Column({ name: 'provisioned_at', type: 'timestamp', nullable: true })
  provisionedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToOne(() => Tenant, (tenant) => tenant.database, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
