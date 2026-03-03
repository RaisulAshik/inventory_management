import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Customer } from './customer.entity';

@Entity('customer_credentials')
export class CustomerCredentials {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'customer_id', unique: true })
  customerId: string;

  @Column({ name: 'password_hash', length: 255 })
  passwordHash: string;

  @Column({ name: 'password_changed_at', type: 'timestamp', nullable: true })
  passwordChangedAt: Date;

  @Column({ name: 'email_verified', type: 'tinyint', default: 0 })
  emailVerified: boolean;

  @Column({ name: 'email_verification_token', length: 255, nullable: true })
  emailVerificationToken: string;

  @Column({
    name: 'email_verification_expires',
    type: 'timestamp',
    nullable: true,
  })
  emailVerificationExpires: Date;

  @Column({ name: 'password_reset_token', length: 255, nullable: true })
  passwordResetToken: string;

  @Column({ name: 'password_reset_expires', type: 'timestamp', nullable: true })
  passwordResetExpires: Date;

  @Column({ name: 'failed_login_attempts', type: 'int', default: 0 })
  failedLoginAttempts: number;

  @Column({ name: 'locked_until', type: 'timestamp', nullable: true })
  lockedUntil: Date;

  @Column({ name: 'last_login_at', type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  @Column({ name: 'last_login_ip', length: 45, nullable: true })
  lastLoginIp: string;

  @Column({ name: 'two_factor_enabled', type: 'tinyint', default: 0 })
  twoFactorEnabled: boolean;

  @Column({ name: 'two_factor_secret', length: 255, nullable: true })
  twoFactorSecret: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToOne(() => Customer, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  // Helper
  get isLocked(): boolean {
    return this.lockedUntil && this.lockedUntil > new Date();
  }
}
