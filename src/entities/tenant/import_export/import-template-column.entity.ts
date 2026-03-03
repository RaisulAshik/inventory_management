import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ImportTemplate } from './import-template.entity';

export enum ColumnDataType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  DECIMAL = 'DECIMAL',
  DATE = 'DATE',
  DATETIME = 'DATETIME',
  BOOLEAN = 'BOOLEAN',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  URL = 'URL',
}

export enum ColumnMappingType {
  DIRECT = 'DIRECT',
  LOOKUP = 'LOOKUP',
  TRANSFORM = 'TRANSFORM',
  CONSTANT = 'CONSTANT',
  FORMULA = 'FORMULA',
}

@Entity('import_template_columns')
export class ImportTemplateColumn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'template_id' })
  templateId: string;

  @Column({ name: 'column_order', type: 'int' })
  columnOrder: number;

  @Column({ name: 'source_column_name', length: 200 })
  sourceColumnName: string;

  @Column({ name: 'source_column_index', type: 'int', nullable: true })
  sourceColumnIndex: number;

  @Column({ name: 'target_field_name', length: 200 })
  targetFieldName: string;

  @Column({ name: 'display_name', length: 200 })
  displayName: string;

  @Column({
    name: 'data_type',
    type: 'enum',
    enum: ColumnDataType,
    default: ColumnDataType.STRING,
  })
  dataType: ColumnDataType;

  @Column({
    name: 'mapping_type',
    type: 'enum',
    enum: ColumnMappingType,
    default: ColumnMappingType.DIRECT,
  })
  mappingType: ColumnMappingType;

  @Column({ name: 'is_required', type: 'tinyint', default: 0 })
  isRequired: boolean;

  @Column({ name: 'is_unique', type: 'tinyint', default: 0 })
  isUnique: boolean;

  @Column({ name: 'default_value', length: 500, nullable: true })
  defaultValue: string;

  @Column({ name: 'lookup_entity', length: 100, nullable: true })
  lookupEntity: string;

  @Column({ name: 'lookup_field', length: 100, nullable: true })
  lookupField: string;

  @Column({ name: 'lookup_return_field', length: 100, nullable: true })
  lookupReturnField: string;

  @Column({ name: 'transform_expression', type: 'text', nullable: true })
  transformExpression: string;

  @Column({ name: 'validation_rules', type: 'json', nullable: true })
  validationRules: Record<string, any>;

  @Column({ name: 'allowed_values', type: 'json', nullable: true })
  allowedValues: string[];

  @Column({ name: 'min_length', type: 'int', nullable: true })
  minLength: number;

  @Column({ name: 'max_length', type: 'int', nullable: true })
  maxLength: number;

  @Column({
    name: 'min_value',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  minValue: number;

  @Column({
    name: 'max_value',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  maxValue: number;

  @Column({ name: 'regex_pattern', length: 500, nullable: true })
  regexPattern: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'sample_value', length: 500, nullable: true })
  sampleValue: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => ImportTemplate, (template) => template.columns, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'template_id' })
  template: ImportTemplate;
}
