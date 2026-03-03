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
import { Product } from './product.entity';
import { ProductVariantAttribute } from './product-variant-attribute.entity';

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'variant_sku', length: 100, unique: true })
  variantSku: string;

  @Column({
    name: 'variant_barcode',
    length: 100,
    unique: true,
    nullable: true,
  })
  variantBarcode: string;

  @Column({ name: 'variant_name', length: 300 })
  variantName: string;

  @Column({
    name: 'cost_price',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  costPrice: number;

  @Column({
    name: 'selling_price',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  sellingPrice: number;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  mrp: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  weight: number;

  @Column({ name: 'image_url', length: 500, nullable: true })
  imageUrl: string;

  @Column({ name: 'is_active', type: 'tinyint', default: 1 })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @OneToMany(() => ProductVariantAttribute, (attr) => attr.variant)
  attributes: ProductVariantAttribute[];
}
