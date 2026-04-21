import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('hr_departments')
export class Department {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'department_code', length: 50, unique: true })
  departmentCode: string;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'parent_id', nullable: true })
  parentId: string;

  @Column({ name: 'manager_id', nullable: true })
  managerId: string;

  @Column({ name: 'is_active', type: 'tinyint', default: 1 })
  isActive: boolean;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;

  // Self-referential hierarchy
  @ManyToOne(() => Department, (d) => d.children, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'parent_id' })
  parent: Department;

  @OneToMany(() => Department, (d) => d.parent)
  children: Department[];

  // Relations to other entities (declared as lazy to avoid circular)
  @OneToMany('Designation', 'department')
  designations: any[];

  @OneToMany('Employee', 'department')
  employees: any[];
}
