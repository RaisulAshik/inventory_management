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
import { Department } from './department.entity';

@Entity('hr_designations')
export class Designation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'designation_code', length: 50, unique: true })
  designationCode: string;

  @Column({ length: 200 })
  name: string;

  @Column({ name: 'department_id', nullable: true })
  departmentId: string;

  @Column({ type: 'text', nullable: true })
  description: string;

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

  @ManyToOne(() => Department, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @OneToMany('Employee', 'designation')
  employees: any[];
}
