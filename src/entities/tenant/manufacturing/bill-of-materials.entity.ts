import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { BOMStatus } from '@common/enums';
import { BomItem } from './bom-item.entity';
import { ProductVariant } from '../inventory/product-variant.entity';
import { Product } from '../inventory/product.entity';
import { UnitOfMeasure } from '../inventory/unit-of-measure.entity';
import { BomOperation } from './bom-operation.entity';

@Entity('bill_of_materials')
export class BillOfMaterials {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'bom_code', length: 50 })
  bomCode: string;

  @Column({ name: 'bom_name', length: 200 })
  bomName: string;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'variant_id', nullable: true })
  variantId: string;

  @Column({ type: 'int', default: 1 })
  version: number;

  @Column({
    type: 'enum',
    enum: BOMStatus,
    default: BOMStatus.DRAFT,
  })
  status: BOMStatus;

  @Column({ name: 'effective_from', type: 'date', nullable: true })
  effectiveFrom: Date;

  @Column({ name: 'effective_to', type: 'date', nullable: true })
  effectiveTo: Date;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 1,
  })
  quantity: number;

  @Column({ name: 'uom_id' })
  uomId: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    name: 'total_material_cost',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  totalMaterialCost: number;

  @Column({
    name: 'total_operation_cost',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  totalOperationCost: number;

  @Column({
    name: 'total_cost',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  totalCost: number;

  @Column({
    name: 'scrap_percentage',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
  })
  scrapPercentage: number;

  @Column({ name: 'is_default', type: 'tinyint', default: 0 })
  isDefault: boolean;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @Column({ name: 'approved_by', nullable: true })
  approvedBy: string;

  @Column({ name: 'approved_at', type: 'timestamp', nullable: true })
  approvedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => ProductVariant)
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;

  @ManyToOne(() => UnitOfMeasure)
  @JoinColumn({ name: 'uom_id' })
  uom: UnitOfMeasure;

  @OneToMany(() => BomItem, (item) => item.bom)
  items: BomItem[];

  @OneToMany(() => BomOperation, (operation) => operation.bom)
  operations: BomOperation[];

  // Computed
  get unitCost(): number {
    return this.quantity > 0 ? this.totalCost / this.quantity : 0;
  }
}
