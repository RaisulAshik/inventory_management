import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Employee } from '../hr/employee.entity';
import { Role } from '../role/role.entity';

/**
 * Links a person to a role.
 *
 * The table and its `user_id` column keep their original names, but since the
 * users/employees merge that column holds an `hr_employees` id. Renaming it
 * would mean rewriting raw SQL across the codebase for no functional gain.
 */
@Entity('user_roles')
export class UserRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** An `hr_employees.id`, despite the column name. */
  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'role_id' })
  roleId: string;

  @Column({ name: 'assigned_by', nullable: true })
  assignedBy: string;

  @CreateDateColumn({ name: 'assigned_at' })
  assignedAt: Date;

  // Relations
  @ManyToOne(() => Employee, (employee) => employee.userRoles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  employee: Employee;

  @ManyToOne(() => Role, (role) => role.userRoles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
