import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ResetPeriod {
  NEVER = 'NEVER',
  YEARLY = 'YEARLY',
  MONTHLY = 'MONTHLY',
  DAILY = 'DAILY',
}

@Entity('sequence_numbers')
export class SequenceNumber {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'sequence_type', length: 50, unique: true })
  sequenceType: string;

  @Column({ length: 20, nullable: true })
  prefix: string;

  @Column({ length: 20, nullable: true })
  suffix: string;

  @Column({ name: 'current_number', type: 'bigint', default: 0 })
  currentNumber: number;

  @Column({ name: 'padding_length', type: 'int', default: 6 })
  paddingLength: number;

  @Column({
    name: 'reset_period',
    type: 'enum',
    enum: ResetPeriod,
    default: ResetPeriod.NEVER,
  })
  resetPeriod: ResetPeriod;

  @Column({ name: 'last_reset_at', type: 'date', nullable: true })
  lastResetAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
