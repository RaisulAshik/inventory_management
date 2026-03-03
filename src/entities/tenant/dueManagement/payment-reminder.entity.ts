import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CustomerDue } from './customer-due.entity';
import { Customer } from '../eCommerce/customer.entity';
import { User } from '../user/user.entity';

export enum ReminderType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PHONE_CALL = 'PHONE_CALL',
  LETTER = 'LETTER',
  WHATSAPP = 'WHATSAPP',
  IN_PERSON = 'IN_PERSON',
}

export enum ReminderStatus {
  SCHEDULED = 'SCHEDULED',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

@Entity('payment_reminders')
export class PaymentReminder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'customer_id' })
  customerId: string;

  @Column({ name: 'customer_due_id', nullable: true })
  customerDueId: string;

  @Column({
    name: 'reminder_type',
    type: 'enum',
    enum: ReminderType,
  })
  reminderType: ReminderType;

  @Column({
    type: 'enum',
    enum: ReminderStatus,
    default: ReminderStatus.SCHEDULED,
  })
  status: ReminderStatus;

  @Column({ name: 'reminder_date', type: 'date' })
  reminderDate: Date;

  @Column({ name: 'scheduled_time', type: 'time', nullable: true })
  scheduledTime: string;

  @Column({ name: 'sent_at', type: 'timestamp', nullable: true })
  sentAt: Date;

  @Column({ type: 'text', nullable: true })
  subject: string;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ name: 'recipient_email', length: 255, nullable: true })
  recipientEmail: string;

  @Column({ name: 'recipient_phone', length: 50, nullable: true })
  recipientPhone: string;

  @Column({
    name: 'overdue_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  overdueAmount: number;

  @Column({ name: 'overdue_days', type: 'int', nullable: true })
  overdueDays: number;

  @Column({ name: 'reminder_level', type: 'int', default: 1 })
  reminderLevel: number;

  @Column({ name: 'response_received', type: 'tinyint', default: 0 })
  responseReceived: boolean;

  @Column({ name: 'response_date', type: 'date', nullable: true })
  responseDate: Date;

  @Column({ name: 'response_notes', type: 'text', nullable: true })
  responseNotes: string;

  @Column({ name: 'promise_to_pay_date', type: 'date', nullable: true })
  promiseToPayDate: Date;

  @Column({
    name: 'promised_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  promisedAmount: number;

  @Column({ name: 'follow_up_required', type: 'tinyint', default: 0 })
  followUpRequired: boolean;

  @Column({ name: 'follow_up_date', type: 'date', nullable: true })
  followUpDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'sent_by', nullable: true })
  sentBy: string;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => CustomerDue)
  @JoinColumn({ name: 'customer_due_id' })
  customerDue: CustomerDue;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sent_by' })
  sentByUser: User;
}
