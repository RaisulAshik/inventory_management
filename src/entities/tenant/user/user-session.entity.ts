import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
/**
 * A live sign-in session, held in the tenant the user signed in to.
 *
 * As with user_roles, `userId` references `tenant_users.id` in the MASTER
 * database, so there is no foreign key and no relation to load.
 */
@Entity('user_sessions')
export class UserSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** A master `tenant_users.id`. Not enforceable by a foreign key. */
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

  // Helper
  get isExpired(): boolean {
    return this.expiresAt < new Date();
  }
}
