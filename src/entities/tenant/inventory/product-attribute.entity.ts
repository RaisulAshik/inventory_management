import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProductAttributeValue } from './product-attribute-value.entity';

export enum AttributeType {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  SELECT = 'SELECT',
  MULTI_SELECT = 'MULTI_SELECT',
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
  COLOR = 'COLOR',
}

@Entity('product_attributes')
export class ProductAttribute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'attribute_code', length: 50, unique: true })
  attributeCode: string;

  @Column({ name: 'attribute_name', length: 100 })
  attributeName: string;

  @Column({
    name: 'attribute_type',
    type: 'enum',
    enum: AttributeType,
    default: AttributeType.TEXT,
  })
  attributeType: AttributeType;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'is_required', type: 'tinyint', default: 0 })
  isRequired: boolean;

  @Column({ name: 'is_filterable', type: 'tinyint', default: 0 })
  isFilterable: boolean;

  @Column({ name: 'is_searchable', type: 'tinyint', default: 0 })
  isSearchable: boolean;

  @Column({ name: 'is_visible_on_front', type: 'tinyint', default: 1 })
  isVisibleOnFront: boolean;

  @Column({ name: 'is_used_for_variants', type: 'tinyint', default: 0 })
  isUsedForVariants: boolean;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @Column({ name: 'validation_rules', type: 'json', nullable: true })
  validationRules: Record<string, any>;

  @Column({ name: 'is_active', type: 'tinyint', default: 1 })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => ProductAttributeValue, (value) => value.attribute)
  values: ProductAttributeValue[];
}
