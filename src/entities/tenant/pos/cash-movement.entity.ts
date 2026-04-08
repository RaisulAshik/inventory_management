import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PosSession } from './pos-session.entity';
import { Store } from './store.entity';
import { User } from '../user/user.entity';

export enum CashMovementType {
  CASH_IN = 'CASH_IN',
  CASH_OUT = 'CASH_OUT',
  PETTY_CASH = 'PETTY_CASH',
  FLOAT = 'FLOAT',
  BANK_DEPOSIT = 'BANK_DEPOSIT',
  BANK_WITHDRAWAL = 'BANK_WITHDRAWAL',
  EXPENSE = 'EXPENSE',
  REFUND = 'REFUND',
  ADJUSTMENT = 'ADJUSTMENT',
}

export enum CashMovementStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

@Entity('cash_movements')
export class CashMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'movement_number', length: 50, unique: true })
  movementNumber: string;

  @Column({ name: 'session_id', nullable: true })
  sessionId: string;

  @Column({ name: 'store_id' })
  storeId: string;

  @Column({
    name: 'movement_type',
    type: 'enum',
    enum: CashMovementType,
  })
  movementType: CashMovementType;

  @Column({ name: 'movement_date', type: 'timestamp' })
  movementDate: Date;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  amount: number;

  @Column({ length: 3, default: 'BDT' })
  currency: string;

  @Column({
    type: 'enum',
    enum: CashMovementStatus,
    default: CashMovementStatus.APPROVED,
  })
  status: CashMovementStatus;

  @Column({ type: 'text' })
  reason: string;

  @Column({ name: 'reference_number', length: 100, nullable: true })
  referenceNumber: string;

  @Column({ name: 'reference_type', length: 50, nullable: true })
  referenceType: string;

  @Column({ name: 'reference_id', nullable: true })
  referenceId: string;

  @Column({ name: 'expense_category', length: 100, nullable: true })
  expenseCategory: string;

  @Column({ name: 'received_from', length: 200, nullable: true })
  receivedFrom: string;

  @Column({ name: 'paid_to', length: 200, nullable: true })
  paidTo: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'approved_by', nullable: true })
  approvedBy: string;

  @Column({ name: 'approved_at', type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ name: 'created_by' })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => PosSession)
  @JoinColumn({ name: 'session_id' })
  session: PosSession;

  @ManyToOne(() => Store)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdByUser: User;

  // Helper
  get isInflow(): boolean {
    return [
      CashMovementType.CASH_IN,
      CashMovementType.FLOAT,
      CashMovementType.BANK_WITHDRAWAL,
    ].includes(this.movementType);
  }

  get isOutflow(): boolean {
    return [
      CashMovementType.CASH_OUT,
      CashMovementType.BANK_DEPOSIT,
      CashMovementType.EXPENSE,
      CashMovementType.PETTY_CASH,
      CashMovementType.REFUND,
    ].includes(this.movementType);
  }
}
