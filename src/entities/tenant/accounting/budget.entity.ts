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
import { FiscalYear } from './fiscal-year.entity';
import { CostCenter } from './cost-center.entity';
import { BudgetLine } from './budget-line.entity';

export enum BudgetType {
  REVENUE = 'REVENUE',
  EXPENSE = 'EXPENSE',
  CAPITAL = 'CAPITAL',
  PROJECT = 'PROJECT',
}

export enum BudgetStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
}

@Entity('budgets')
export class Budget {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'budget_code', length: 50, unique: true })
  budgetCode: string;

  @Column({ name: 'budget_name', length: 200 })
  budgetName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    name: 'budget_type',
    type: 'enum',
    enum: BudgetType,
    default: BudgetType.EXPENSE,
  })
  budgetType: BudgetType;

  @Column({ name: 'fiscal_year_id' })
  fiscalYearId: string;

  @Column({ name: 'cost_center_id', nullable: true })
  costCenterId: string;

  @Column({
    type: 'enum',
    enum: BudgetStatus,
    default: BudgetStatus.DRAFT,
  })
  status: BudgetStatus;

  @Column({ length: 3, default: 'BDT' })
  currency: string;

  @Column({
    name: 'total_budget_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  totalBudgetAmount: number;

  @Column({
    name: 'allocated_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  allocatedAmount: number;

  @Column({
    name: 'utilized_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  utilizedAmount: number;

  @Column({
    name: 'committed_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  committedAmount: number;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Column({ name: 'allow_over_budget', type: 'tinyint', default: 0 })
  allowOverBudget: boolean;

  @Column({
    name: 'over_budget_tolerance_percentage',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
  })
  overBudgetTolerancePercentage: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'approved_by', nullable: true })
  approvedBy: string;

  @Column({ name: 'approved_at', type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => FiscalYear)
  @JoinColumn({ name: 'fiscal_year_id' })
  fiscalYear: FiscalYear;

  @ManyToOne(() => CostCenter)
  @JoinColumn({ name: 'cost_center_id' })
  costCenter: CostCenter;

  @OneToMany(() => BudgetLine, (line) => line.budget)
  lines: BudgetLine[];

  // Computed
  get availableAmount(): number {
    return this.totalBudgetAmount - this.utilizedAmount - this.committedAmount;
  }

  get utilizationPercentage(): number {
    return this.totalBudgetAmount > 0
      ? (this.utilizedAmount / this.totalBudgetAmount) * 100
      : 0;
  }

  get isOverBudget(): boolean {
    return this.utilizedAmount > this.totalBudgetAmount;
  }
}
