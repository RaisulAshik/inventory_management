import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { SubscriptionPlan } from './subscription-plan.entity';
import { BillingHistory } from './billing-history.entity';
import { Tenant } from './tenant.entity';
import { BillingCycle, SubscriptionStatus } from '@common/enums';

@Entity('subscriptions')
@Index(['tenantId'], { unique: true })
@Index(['status'])
@Index(['currentPeriodEnd'])
export class Subscription {
  @PrimaryColumn('char', { length: 36 })
  id: string;

  @Column('char', { name: 'tenant_id', length: 36 })
  tenantId: string;

  @Column('char', { name: 'plan_id', length: 36 })
  planId: string;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.TRIAL,
  })
  status: SubscriptionStatus;

  @Column('date', { name: 'start_date' })
  startDate: Date;

  @Column('date', { name: 'trial_end_date', nullable: true })
  trialEndDate: Date;

  @Column('date', { name: 'current_period_start' })
  currentPeriodStart: Date;

  @Column('date', { name: 'current_period_end' })
  currentPeriodEnd: Date;

  @Column('int', { default: 1 })
  quantity: number;

  @Column('decimal', { name: 'unit_price', precision: 15, scale: 2 })
  unitPrice: number;

  @Column('char', { length: 3, default: 'BDT' })
  currency: string;

  @Column({
    type: 'enum',
    enum: BillingCycle,
    name: 'billing_cycle',
    default: BillingCycle.MONTHLY,
  })
  billingCycle: BillingCycle;

  @Column('boolean', { name: 'auto_renew', default: true })
  autoRenew: boolean;

  @Column('boolean', { name: 'cancel_at_period_end', default: false })
  cancelAtPeriodEnd: boolean;

  @Column('datetime', { name: 'cancelled_at', nullable: true })
  cancelledAt: Date;

  @Column('varchar', {
    name: 'cancellation_reason',
    length: 500,
    nullable: true,
  })
  cancellationReason: string;

  // Payment info
  @Column('varchar', { name: 'payment_method', length: 50, nullable: true })
  paymentMethod: string;

  @Column('varchar', { name: 'payment_reference', length: 255, nullable: true })
  paymentReference: string;

  @Column('datetime', { name: 'last_payment_at', nullable: true })
  lastPaymentAt: Date;

  @Column('datetime', { name: 'next_billing_at', nullable: true })
  nextBillingAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToOne(() => Tenant, (tenant) => tenant.subscriptions)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @ManyToOne(() => SubscriptionPlan, (plan) => plan.subscriptions)
  @JoinColumn({ name: 'plan_id' })
  plan: SubscriptionPlan;

  @OneToMany(() => BillingHistory, (billing) => billing.subscription)
  billingHistory: BillingHistory[];

  // Computed
  get totalPrice(): number {
    return Number(this.unitPrice) * this.quantity;
  }

  get isTrialing(): boolean {
    return this.status === SubscriptionStatus.TRIAL;
  }

  get isActive(): boolean {
    return [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIAL].includes(
      this.status,
    );
  }

  get daysRemaining(): number {
    const endDate = this.trialEndDate || this.currentPeriodEnd;
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }
}
