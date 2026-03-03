import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Supplier } from './supplier.entity';
import { Product } from './product.entity';
import { ProductVariant } from './product-variant.entity';
import { UnitOfMeasure } from './unit-of-measure.entity';

@Entity('supplier_products')
export class SupplierProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'supplier_id' })
  supplierId: string;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'variant_id', nullable: true })
  variantId: string;

  @Column({ name: 'supplier_sku', length: 100, nullable: true })
  supplierSku: string;

  @Column({ name: 'supplier_product_name', length: 300, nullable: true })
  supplierProductName: string;

  @Column({ name: 'purchase_uom_id', nullable: true })
  purchaseUomId: string;

  @Column({
    name: 'conversion_factor',
    type: 'decimal',
    precision: 18,
    scale: 8,
    default: 1,
  })
  conversionFactor: number;

  @Column({
    name: 'unit_price',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  unitPrice: number;

  @Column({ length: 3, default: 'INR' })
  currency: string;

  @Column({
    name: 'min_order_quantity',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  minOrderQuantity: number;

  @Column({
    name: 'pack_size',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  packSize: number;

  @Column({ name: 'lead_time_days', type: 'int', nullable: true })
  leadTimeDays: number;

  @Column({ name: 'is_preferred', type: 'tinyint', default: 0 })
  isPreferred: boolean;

  @Column({ name: 'is_active', type: 'tinyint', default: 1 })
  isActive: boolean;

  @Column({ name: 'last_purchase_date', type: 'date', nullable: true })
  lastPurchaseDate: Date;

  @Column({
    name: 'last_purchase_price',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  lastPurchasePrice: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Supplier, (supplier) => supplier.supplierProducts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => ProductVariant)
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;

  @ManyToOne(() => UnitOfMeasure)
  @JoinColumn({ name: 'purchase_uom_id' })
  purchaseUom: UnitOfMeasure;
}
