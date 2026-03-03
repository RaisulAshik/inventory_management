import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { SubscriptionPlan } from './subscription-plan.entity';

@Entity('plan_features')
@Index(['planId', 'featureCode'], { unique: true })
export class PlanFeature {
  @PrimaryColumn('char', { length: 36 })
  id: string;

  @Column('char', { name: 'plan_id', length: 36 })
  planId: string;

  @Column('varchar', { name: 'feature_code', length: 100 })
  featureCode: string;

  @Column('varchar', { name: 'feature_name', length: 200 })
  featureName: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('boolean', { name: 'is_enabled', default: true })
  isEnabled: boolean;

  @Column('varchar', { name: 'limit_value', length: 100, nullable: true })
  limitValue: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => SubscriptionPlan, (plan) => plan.features, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'plan_id' })
  plan: SubscriptionPlan;
}
