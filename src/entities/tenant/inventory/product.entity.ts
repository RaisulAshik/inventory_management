import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ProductType } from '@common/enums';
import { ProductCategory } from './product-category.entity';
import { Brand } from './brand.entity';
import { UnitOfMeasure } from './unit-of-measure.entity';
import { TaxCategory } from './tax-category.entity';
import { ProductVariant } from './product-variant.entity';
import { ProductImage } from './product-image.entity';
import { InventoryStock } from '../warehouse/inventory-stock.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  sku: string;

  @Column({ length: 100, unique: true, nullable: true })
  barcode: string;

  @Column({ name: 'product_name', length: 300 })
  productName: string;

  @Column({ name: 'short_name', length: 100, nullable: true })
  shortName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'category_id', nullable: true })
  categoryId: string;

  @Column({ name: 'brand_id', nullable: true })
  brandId: string;

  @Column({ name: 'base_uom_id' })
  baseUomId: string;

  @Column({ name: 'secondary_uom_id', nullable: true })
  secondaryUomId: string;

  @Column({
    name: 'uom_conversion_factor',
    type: 'decimal',
    precision: 18,
    scale: 8,
    nullable: true,
  })
  uomConversionFactor: number;

  @Column({
    name: 'product_type',
    type: 'enum',
    enum: ProductType,
    default: ProductType.GOODS,
  })
  productType: ProductType;

  @Column({ name: 'is_stockable', type: 'tinyint', default: 1 })
  isStockable: boolean;

  @Column({ name: 'is_purchasable', type: 'tinyint', default: 1 })
  isPurchasable: boolean;

  @Column({ name: 'is_sellable', type: 'tinyint', default: 1 })
  isSellable: boolean;

  @Column({ name: 'is_active', type: 'tinyint', default: 1 })
  isActive: boolean;

  @Column({ name: 'track_serial', type: 'tinyint', default: 0 })
  trackSerial: boolean;

  @Column({ name: 'track_batch', type: 'tinyint', default: 0 })
  trackBatch: boolean;

  @Column({ name: 'track_expiry', type: 'tinyint', default: 0 })
  trackExpiry: boolean;

  @Column({ name: 'shelf_life_days', type: 'int', nullable: true })
  shelfLifeDays: number;

  @Column({ name: 'hsn_code', length: 20, nullable: true })
  hsnCode: string;

  @Column({ name: 'tax_category_id' })
  taxCategoryId: string;

  @Column({
    name: 'cost_price',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  costPrice: number;

  @Column({
    name: 'selling_price',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  sellingPrice: number;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  mrp: number;

  @Column({
    name: 'minimum_price',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  minimumPrice: number;

  @Column({
    name: 'wholesale_price',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  wholesalePrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  weight: number;

  @Column({ name: 'weight_unit', length: 20, nullable: true })
  weightUnit: string;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  length: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  width: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  height: number;

  @Column({ name: 'dimension_unit', length: 20, nullable: true })
  dimensionUnit: string;

  @Column({
    name: 'reorder_level',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  reorderLevel: number;

  @Column({
    name: 'reorder_quantity',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  reorderQuantity: number;

  @Column({
    name: 'minimum_order_quantity',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 1,
  })
  minimumOrderQuantity: number;

  @Column({
    name: 'maximum_order_quantity',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  maximumOrderQuantity: number;

  @Column({ name: 'lead_time_days', type: 'int', nullable: true })
  leadTimeDays: number;

  @Column({ name: 'warranty_months', type: 'int', nullable: true })
  warrantyMonths: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  // Relations
  @ManyToOne(() => ProductCategory, (category) => category.products, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category: ProductCategory;

  @ManyToOne(() => Brand, (brand) => brand.products, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @ManyToOne(() => UnitOfMeasure, (uom) => uom.products)
  @JoinColumn({ name: 'base_uom_id' })
  baseUom: UnitOfMeasure;

  @ManyToOne(() => UnitOfMeasure)
  @JoinColumn({ name: 'secondary_uom_id' })
  secondaryUom: UnitOfMeasure;

  @ManyToOne(() => TaxCategory, (taxCategory) => taxCategory.products)
  @JoinColumn({ name: 'tax_category_id' })
  taxCategory: TaxCategory;

  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants: ProductVariant[];

  @OneToMany(() => ProductImage, (image) => image.product)
  images: ProductImage[];

  @OneToMany(() => InventoryStock, (stock) => stock.product)
  inventoryStocks: InventoryStock[];
}
