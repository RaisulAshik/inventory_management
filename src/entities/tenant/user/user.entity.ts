import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

/**
 * The tenant's copy of a login.
 *
 * The master `tenant_users` row is authoritative — authentication reads it,
 * and the JWT carries its id. This row mirrors it under the SAME id, so the
 * tenant database can resolve `user_roles.user_id` (and any older tenant's
 * `fk_user_role_user` foreign key is satisfied).
 *
 * Written only by UsersService, which keeps it in step with master. Do not
 * write it anywhere else.
 */
@Entity('users')
export class User {
  /** Equal to the master `tenant_users.id`. Never generated here. */
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string;

  // `type` is explicit on every `| null` column: decorator metadata records a
  // union as `Object`, which TypeORM cannot map to a MySQL type.
  @Column({
    name: 'employee_code',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  employeeCode: string | null;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ name: 'password_hash', length: 255 })
  passwordHash: string;

  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100, nullable: true })
  lastName: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone: string | null;

  @Column({ name: 'is_active', type: 'tinyint', default: 1 })
  isActive: boolean;

  @Column({ name: 'created_by', type: 'char', length: 36, nullable: true })
  createdBy: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}
