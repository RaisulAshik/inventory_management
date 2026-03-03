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
import { PosSession } from './pos-session.entity';
import { Customer } from '../eCommerce/customer.entity';
import { SalesOrder } from '../eCommerce/sales-order.entity';
import { Store } from './store.entity';
import { PosTerminal } from './pos-terminal.entity';
import { User } from '../user/user.entity';
import { PosTransactionItem } from './pos-transaction-item.entity';
import { PosTransactionPayment } from './pos-transaction-payment.entity';

export enum PosTransactionType {
  SALE = 'SALE',
  RETURN = 'RETURN',
  EXCHANGE = 'EXCHANGE',
  VOID = 'VOID',
}

export enum PosTransactionStatus {
  COMPLETED = 'COMPLETED',
  VOIDED = 'VOIDED',
  HELD = 'HELD',
  PENDING = 'PENDING',
}

@Entity('pos_transactions')
export class PosTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'transaction_number', length: 50, unique: true })
  transactionNumber: string;

  @Column({ name: 'session_id' })
  sessionId: string;

  @Column({ name: 'store_id' })
  storeId: string;

  @Column({ name: 'terminal_id' })
  terminalId: string;

  @Column({ name: 'sales_order_id', nullable: true })
  salesOrderId: string;

  @Column({
    name: 'transaction_type',
    type: 'enum',
    enum: PosTransactionType,
    default: PosTransactionType.SALE,
  })
  transactionType: PosTransactionType;

  @Column({ name: 'customer_id', nullable: true })
  customerId: string;

  @Column({ name: 'customer_name', length: 200, nullable: true })
  customerName: string;

  @Column({ name: 'customer_phone', length: 50, nullable: true })
  customerPhone: string;

  @Column({ name: 'transaction_date', type: 'timestamp' })
  transactionDate: Date;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  subtotal: number;

  @Column({
    name: 'discount_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  discountAmount: number;

  @Column({
    name: 'tax_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  taxAmount: number;

  @Column({
    name: 'total_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  totalAmount: number;

  @Column({
    name: 'paid_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  paidAmount: number;

  @Column({
    name: 'change_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  changeAmount: number;

  @Column({
    type: 'enum',
    enum: PosTransactionStatus,
    default: PosTransactionStatus.COMPLETED,
  })
  status: PosTransactionStatus;

  @Column({ name: 'void_reason', type: 'text', nullable: true })
  voidReason: string;

  @Column({ name: 'voided_by', nullable: true })
  voidedBy: string;

  @Column({ name: 'voided_at', type: 'timestamp', nullable: true })
  voidedAt: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'cashier_id' })
  cashierId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => PosSession, (session) => session.transactions)
  @JoinColumn({ name: 'session_id' })
  session: PosSession;

  @ManyToOne(() => Store)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @ManyToOne(() => PosTerminal)
  @JoinColumn({ name: 'terminal_id' })
  terminal: PosTerminal;

  @ManyToOne(() => SalesOrder)
  @JoinColumn({ name: 'sales_order_id' })
  salesOrder: SalesOrder;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'cashier_id' })
  cashier: User;

  @OneToMany(() => PosTransactionItem, (item) => item.transaction)
  items: PosTransactionItem[];

  @OneToMany(() => PosTransactionPayment, (payment) => payment.transaction)
  payments: PosTransactionPayment[];
}
