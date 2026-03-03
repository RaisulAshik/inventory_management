import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum QualityParameterType {
  NUMERIC = 'NUMERIC',
  BOOLEAN = 'BOOLEAN',
  TEXT = 'TEXT',
  RANGE = 'RANGE',
  OPTIONS = 'OPTIONS',
}

@Entity('quality_parameters')
export class QualityParameter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'parameter_code', length: 50, unique: true })
  parameterCode: string;

  @Column({ name: 'parameter_name', length: 200 })
  parameterName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    name: 'parameter_type',
    type: 'enum',
    enum: QualityParameterType,
    default: QualityParameterType.NUMERIC,
  })
  parameterType: QualityParameterType;

  @Column({ name: 'unit_of_measure', length: 50, nullable: true })
  unitOfMeasure: string;

  @Column({
    name: 'min_value',
    type: 'decimal',
    precision: 18,
    scale: 6,
    nullable: true,
  })
  minValue: number;

  @Column({
    name: 'max_value',
    type: 'decimal',
    precision: 18,
    scale: 6,
    nullable: true,
  })
  maxValue: number;

  @Column({
    name: 'target_value',
    type: 'decimal',
    precision: 18,
    scale: 6,
    nullable: true,
  })
  targetValue: number;

  @Column({ name: 'allowed_options', type: 'json', nullable: true })
  allowedOptions: string[];

  @Column({ name: 'is_critical', type: 'tinyint', default: 0 })
  isCritical: boolean;

  @Column({ name: 'is_active', type: 'tinyint', default: 1 })
  isActive: boolean;

  @Column({ name: 'inspection_method', type: 'text', nullable: true })
  inspectionMethod: string;

  @Column({ name: 'sampling_instructions', type: 'text', nullable: true })
  samplingInstructions: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Helper
  isValueWithinLimits(value: number): boolean {
    if (
      this.parameterType !== QualityParameterType.NUMERIC &&
      this.parameterType !== QualityParameterType.RANGE
    ) {
      return true;
    }

    const meetsMin = this.minValue === null || value >= this.minValue;
    const meetsMax = this.maxValue === null || value <= this.maxValue;

    return meetsMin && meetsMax;
  }
}
