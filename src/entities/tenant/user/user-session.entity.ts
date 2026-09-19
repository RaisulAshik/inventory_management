import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Employee } from '../hr/employee.entity';

/**
 * A live sign-in session.
 *
 * As with user_roles, the table and its `user_id` column keep their names but
 * that column now holds an `hr_employees` id. JwtAuthGuard queries this table
 * by raw SQL, so the names are intentionally left stable.
 */
@Entity('user_sessions')
export class UserSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** An `hr_employees.id`, despite the column name. */
  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'token_hash', length: 255 })
  tokenHash: string;

  @Column({ name: 'refresh_token_hash', length: 255, nullable: true })
  refreshTokenHash: string;

  @Column({ name: 'device_type', length: 50, nullable: true })
  deviceType: string;

  @Column({ name: 'device_name', length: 200, nullable: true })
  deviceName: string;

  @Column({ length: 100, nullable: true })
  browser: string;

  @Column({ length: 100, nullable: true })
  os: string;

  @Column({ name: 'ip_address', length: 45, nullable: true })
  ipAddress: string;

  @Column({ length: 200, nullable: true })
  location: string;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;

  @Column({ name: 'refresh_expires_at', type: 'timestamp', nullable: true })
  refreshExpiresAt: Date;

  @Column({ name: 'last_activity_at', type: 'timestamp' })
  lastActivityAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => Employee, (employee) => employee.sessions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  employee: Employee;

  // Helper
  get isExpired(): boolean {
    return this.expiresAt < new Date();
  }
}
