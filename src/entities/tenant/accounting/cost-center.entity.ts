import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('cost_centers')
export class CostCenter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'cost_center_code', length: 50, unique: true })
  costCenterCode: string;

  @Column({ name: 'cost_center_name', length: 200 })
  costCenterName: string;

  @Column({ name: 'parent_id', nullable: true })
  parentId: string;

  @Column({ type: 'int', default: 0 })
  level: number;

  @Column({ length: 500, nullable: true })
  path: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'manager_id', nullable: true })
  managerId: string;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
    nullable: true,
  })
  budget: number;

  @Column({ name: 'is_active', type: 'tinyint', default: 1 })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => CostCenter, (cc) => cc.children)
  @JoinColumn({ name: 'parent_id' })
  parent: CostCenter;

  @OneToMany(() => CostCenter, (cc) => cc.parent)
  children: CostCenter[];
}
