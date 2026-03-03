import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { Product } from '../inventory/product.entity';
import { ProductVariant } from '../inventory/product-variant.entity';

@Entity('inventory_stock')
export class InventoryStock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'variant_id', nullable: true })
  variantId: string;

  @Column({ name: 'warehouse_id' })
  warehouseId: string;

  @Column({
    name: 'quantity_on_hand',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  quantityOnHand: number;

  @Column({
    name: 'quantity_reserved',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  quantityReserved: number;

  @Column({
    name: 'quantity_incoming',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  quantityIncoming: number;

  @Column({
    name: 'quantity_outgoing',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  quantityOutgoing: number;

  @Column({ name: 'last_stock_date', type: 'timestamp', nullable: true })
  lastStockDate: Date;

  @Column({ name: 'last_count_date', type: 'timestamp', nullable: true })
  lastCountDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Product, (product) => product.inventoryStocks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => ProductVariant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.inventoryStocks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  // Computed property
  get quantityAvailable(): number {
    return this.quantityOnHand - this.quantityReserved;
  }
}
