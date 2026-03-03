import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { PlanFeature } from './plan-feature.entity';
import { Subscription } from './subscription.entity';

@Entity('subscription_plans')
export class SubscriptionPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'plan_code', length: 50, unique: true })
  planCode: string;

  @Column({ name: 'plan_name', length: 100 })
  planName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    name: 'monthly_price',
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
  })
  monthlyPrice: number;

  @Column({
    name: 'yearly_price',
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
  })
  yearlyPrice: number;

  @Column({ name: 'max_users', type: 'int', default: 1 })
  maxUsers: number;

  @Column({ name: 'max_warehouses', type: 'int', default: 1 })
  maxWarehouses: number;

  @Column({ name: 'max_stores', type: 'int', default: 1 })
  maxStores: number;

  @Column({ name: 'max_products', type: 'int', nullable: true })
  maxProducts: number;

  @Column({ name: 'max_orders_per_month', type: 'int', nullable: true })
  maxOrdersPerMonth: number;

  @Column({ name: 'storage_limit_gb', type: 'int', default: 5 })
  storageLimitGb: number;

  @Column({ name: 'is_active', type: 'tinyint', default: 1 })
  isActive: boolean;

  @Column({ name: 'trial_days', type: 'int', default: 14 })
  trialDays: number;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => PlanFeature, (feature) => feature.plan)
  features: PlanFeature[];

  @OneToMany(() => Subscription, (subscription) => subscription.plan)
  subscriptions: Subscription[];
}
