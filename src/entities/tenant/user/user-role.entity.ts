import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from '../role/role.entity';

/**
 * Grants a role to a user, within this tenant.
 *
 * `userId` references `tenant_users.id` in the MASTER database, so there is
 * no foreign key and no relation to load — the two tables live in different
 * databases. Roles are per tenant; the user they are granted to is not.
 */
@Entity('user_roles')
export class UserRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** A master `tenant_users.id`. Not enforceable by a foreign key. */
  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'role_id' })
  roleId: string;

  @Column({ name: 'assigned_by', nullable: true })
  assignedBy: string;

  @CreateDateColumn({ name: 'assigned_at' })
  assignedAt: Date;

  // Relations
  @ManyToOne(() => Role, (role) => role.userRoles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
