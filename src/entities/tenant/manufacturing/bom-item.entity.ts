import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { BillOfMaterials } from './bill-of-materials.entity';

import { Product } from '../inventory/product.entity';

import { ProductVariant } from '../inventory/product-variant.entity';

import { UnitOfMeasure } from '../inventory/unit-of-measure.entity';

export enum BomItemType {
  RAW_MATERIAL = 'RAW_MATERIAL',

  SEMI_FINISHED = 'SEMI_FINISHED',

  SUB_ASSEMBLY = 'SUB_ASSEMBLY',

  PACKAGING = 'PACKAGING',

  CONSUMABLE = 'CONSUMABLE',
}

@Entity('bom_items')
export class BomItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'bom_id' })
  bomId: string;

  @Column({
    name: 'item_type',

    type: 'enum',

    enum: BomItemType,

    default: BomItemType.RAW_MATERIAL,
  })
  itemType: BomItemType;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'variant_id', nullable: true })
  variantId: string;

  @Column({
    type: 'decimal',

    precision: 18,

    scale: 6,
  })
  quantity: number;

  @Column({ name: 'uom_id' })
  uomId: string;

  @Column({
    name: 'unit_cost',

    type: 'decimal',

    precision: 18,

    scale: 4,

    nullable: true,
  })
  unitCost: number;

  @Column({
    name: 'total_cost',

    type: 'decimal',

    precision: 18,

    scale: 4,

    nullable: true,
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

  @Column({ name: 'is_critical', type: 'tinyint', default: 0 })
  isCritical: boolean;

  @Column({ name: 'substitute_product_id', nullable: true })
  substituteProductId: string;

  @Column({ type: 'int', default: 0 })
  sequence: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations

  @ManyToOne(() => BillOfMaterials, (bom) => bom.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bom_id' })
  bom: BillOfMaterials;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => ProductVariant)
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;

  @ManyToOne(() => UnitOfMeasure)
  @JoinColumn({ name: 'uom_id' })
  uom: UnitOfMeasure;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'substitute_product_id' })
  substituteProduct: Product;
}
