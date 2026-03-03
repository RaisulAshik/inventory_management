import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Budget } from './budget.entity';
import { ChartOfAccounts } from './chart-of-accounts.entity';
import { FiscalPeriod } from './fiscal-period.entity';

@Entity('budget_lines')
export class BudgetLine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'budget_id' })
  budgetId: string;

  @Column({ name: 'account_id' })
  accountId: string;

  @Column({ name: 'fiscal_period_id', nullable: true })
  fiscalPeriodId: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    name: 'budget_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  budgetAmount: number;

  @Column({
    name: 'revised_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  revisedAmount: number;

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

  @Column({
    name: 'january_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  januaryAmount: number;

  @Column({
    name: 'february_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  februaryAmount: number;

  @Column({
    name: 'march_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  marchAmount: number;

  @Column({
    name: 'april_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  aprilAmount: number;

  @Column({
    name: 'may_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  mayAmount: number;

  @Column({
    name: 'june_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  juneAmount: number;

  @Column({
    name: 'july_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  julyAmount: number;

  @Column({
    name: 'august_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  augustAmount: number;

  @Column({
    name: 'september_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  septemberAmount: number;

  @Column({
    name: 'october_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  octoberAmount: number;

  @Column({
    name: 'november_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  novemberAmount: number;

  @Column({
    name: 'december_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  decemberAmount: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Budget, (budget) => budget.lines, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'budget_id' })
  budget: Budget;

  @ManyToOne(() => ChartOfAccounts)
  @JoinColumn({ name: 'account_id' })
  account: ChartOfAccounts;

  @ManyToOne(() => FiscalPeriod)
  @JoinColumn({ name: 'fiscal_period_id' })
  fiscalPeriod: FiscalPeriod;

  // Computed
  get effectiveBudgetAmount(): number {
    return this.revisedAmount !== null ? this.revisedAmount : this.budgetAmount;
  }

  get availableAmount(): number {
    return (
      this.effectiveBudgetAmount - this.utilizedAmount - this.committedAmount
    );
  }

  get variance(): number {
    return this.effectiveBudgetAmount - this.utilizedAmount;
  }

  get variancePercentage(): number {
    return this.effectiveBudgetAmount > 0
      ? (this.variance / this.effectiveBudgetAmount) * 100
      : 0;
  }
}
