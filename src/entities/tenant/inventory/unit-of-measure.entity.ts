import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UomType } from '@common/enums';
import { Product } from './product.entity';
import { UomConversion } from './uom-conversion.entity';

@Entity('units_of_measure')
export class UnitOfMeasure {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'uom_code', length: 20, unique: true })
  uomCode: string;

  @Column({ name: 'uom_name', length: 100 })
  uomName: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'symbol', length: 20, nullable: true })
  symbol: string;

  @Column({
    name: 'uom_type',
    type: 'enum',
    enum: UomType,
    default: UomType.COUNT,
  })
  uomType: UomType;

  @Column({ name: 'decimal_places', type: 'tinyint', default: 0 })
  decimalPlaces: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => Product, (product) => product.baseUom)
  products: Product[];

  @OneToMany(() => UomConversion, (conversion) => conversion.fromUom)
  conversionsFrom: UomConversion[];

  @OneToMany(() => UomConversion, (conversion) => conversion.toUom)
  conversionsTo: UomConversion[];

  // Helper methods
  formatQuantity(quantity: number): string {
    return quantity.toFixed(this.decimalPlaces);
  }

  get displayName(): string {
    return this.symbol ? `${this.uomName} (${this.symbol})` : this.uomName;
  }
}
