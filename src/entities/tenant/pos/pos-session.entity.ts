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
import { Store } from './store.entity';
import { PosTerminal } from './pos-terminal.entity';
import { User } from '../user/user.entity';
import { PosTransaction } from './pos-transaction.entity';

export enum PosSessionStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  SUSPENDED = 'SUSPENDED',
}

@Entity('pos_sessions')
export class PosSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'session_number', length: 50, unique: true })
  sessionNumber: string;

  @Column({ name: 'store_id' })
  storeId: string;

  @Column({ name: 'terminal_id' })
  terminalId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({
    type: 'enum',
    enum: PosSessionStatus,
    default: PosSessionStatus.OPEN,
  })
  status: PosSessionStatus;

  @Column({ name: 'opening_time', type: 'timestamp' })
  openingTime: Date;

  @Column({ name: 'closing_time', type: 'timestamp', nullable: true })
  closingTime: Date;

  @Column({
    name: 'opening_cash',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  openingCash: number;

  @Column({
    name: 'closing_cash',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  closingCash: number;

  @Column({
    name: 'expected_cash',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  expectedCash: number;

  @Column({
    name: 'cash_difference',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  cashDifference: number;

  @Column({
    name: 'total_sales',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  totalSales: number;

  @Column({
    name: 'total_returns',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  totalReturns: number;

  @Column({ name: 'total_transactions', type: 'int', default: 0 })
  totalTransactions: number;

  @Column({
    name: 'cash_sales',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  cashSales: number;

  @Column({
    name: 'card_sales',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  cardSales: number;

  @Column({
    name: 'upi_sales',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  upiSales: number;

  @Column({
    name: 'other_sales',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  otherSales: number;

  @Column({
    name: 'cash_in',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  cashIn: number;

  @Column({
    name: 'cash_out',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  cashOut: number;

  @Column({ name: 'opening_notes', type: 'text', nullable: true })
  openingNotes: string;

  @Column({ name: 'closing_notes', type: 'text', nullable: true })
  closingNotes: string;

  @Column({ name: 'closed_by', nullable: true })
  closedBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Store)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @ManyToOne(() => PosTerminal)
  @JoinColumn({ name: 'terminal_id' })
  terminal: PosTerminal;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => PosTransaction, (transaction) => transaction.session)
  transactions: PosTransaction[];

  // Helper
  get isOpen(): boolean {
    return this.status === PosSessionStatus.OPEN;
  }

  get netSales(): number {
    return this.totalSales - this.totalReturns;
  }
}
