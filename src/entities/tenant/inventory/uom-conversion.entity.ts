import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { UnitOfMeasure } from './unit-of-measure.entity';

@Entity('uom_conversions')
@Unique(['fromUomId', 'toUomId'])
@Index(['fromUomId'])
@Index(['toUomId'])
export class UomConversion {
  @PrimaryColumn('char', { length: 36 })
  id: string;

  @Column('char', { name: 'from_uom_id', length: 36 })
  fromUomId: string;

  @Column('char', { name: 'to_uom_id', length: 36 })
  toUomId: string;

  /**
   * Conversion factor: 1 fromUom = conversionFactor toUom
   * Example: 1 Box = 12 Pieces, conversionFactor = 12
   */
  @Column('decimal', { name: 'conversion_factor', precision: 18, scale: 8 })
  conversionFactor: number;

  /**
   * Whether this is a bidirectional conversion
   * If true, reverse conversion is automatically calculated
   */
  @Column('boolean', { name: 'is_bidirectional', default: true })
  isBidirectional: boolean;

  /**
   * Optional: Product-specific conversion (null means global conversion)
   * Some products might have different conversion factors
   */
  @Column('char', { name: 'product_id', length: 36, nullable: true })
  productId: string;

  @Column('boolean', { name: 'is_active', default: true })
  isActive: boolean;

  @Column('text', { nullable: true })
  description: string;

  @Column('char', { name: 'created_by', length: 36, nullable: true })
  createdBy: string;

  @Column('char', { name: 'updated_by', length: 36, nullable: true })
  updatedBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => UnitOfMeasure, (uom) => uom.conversionsFrom, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'from_uom_id' })
  fromUom: UnitOfMeasure;

  @ManyToOne(() => UnitOfMeasure, (uom) => uom.conversionsTo, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'to_uom_id' })
  toUom: UnitOfMeasure;

  // Computed properties
  /**
   * Get reverse conversion factor (toUom -> fromUom)
   */
  get reverseConversionFactor(): number {
    return 1 / Number(this.conversionFactor);
  }

  /**
   * Convert quantity from source to target UoM
   */
  convert(quantity: number): number {
    return quantity * Number(this.conversionFactor);
  }

  /**
   * Convert quantity from target to source UoM (reverse conversion)
   */
  reverseConvert(quantity: number): number {
    return quantity / Number(this.conversionFactor);
  }

  /**
   * Get display string for conversion
   * Example: "1 Box = 12 Pieces"
   */
  get displayString(): string {
    const fromName = this.fromUom?.uomName || 'Unit';
    const toName = this.toUom?.uomName || 'Unit';
    return `1 ${fromName} = ${this.conversionFactor} ${toName}`;
  }
}
