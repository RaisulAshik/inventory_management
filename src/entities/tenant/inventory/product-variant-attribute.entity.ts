import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductVariant } from './product-variant.entity';
import { ProductAttribute } from './product-attribute.entity';
import { ProductAttributeValue } from './product-attribute-value.entity';

@Entity('product_variant_attributes')
export class ProductVariantAttribute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'variant_id' })
  variantId: string;

  @Column({ name: 'attribute_id' })
  attributeId: string;

  @Column({ name: 'attribute_value_id', nullable: true })
  attributeValueId: string;

  @Column({ name: 'custom_value', length: 500, nullable: true })
  customValue: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => ProductVariant, (variant) => variant.attributes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;

  @ManyToOne(() => ProductAttribute)
  @JoinColumn({ name: 'attribute_id' })
  attribute: ProductAttribute;

  @ManyToOne(() => ProductAttributeValue)
  @JoinColumn({ name: 'attribute_value_id' })
  attributeValue: ProductAttributeValue;

  // Helper
  get displayValue(): string {
    return this.attributeValue?.valueLabel || this.customValue || '';
  }
}
