import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { WarehouseType } from '@common/enums';
import { WarehouseZone } from './warehouse-zone.entity';
import { WarehouseLocation } from './warehouse-location.entity';
import { InventoryStock } from './inventory-stock.entity';

@Entity('warehouses')
export class Warehouse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'warehouse_code', length: 50, unique: true })
  warehouseCode: string;

  @Column({ name: 'warehouse_name', length: 200 })
  warehouseName: string;

  @Column({
    name: 'warehouse_type',
    type: 'enum',
    enum: WarehouseType,
    default: WarehouseType.MAIN,
  })
  warehouseType: WarehouseType;

  @Column({ name: 'address_line1', length: 255, nullable: true })
  addressLine1: string;

  @Column({ name: 'address_line2', length: 255, nullable: true })
  addressLine2: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ length: 100, nullable: true })
  state: string;

  @Column({ length: 100, nullable: true })
  country: string;

  @Column({ name: 'postal_code', length: 20, nullable: true })
  postalCode: string;

  @Column({ name: 'contact_person', length: 100, nullable: true })
  contactPerson: string;

  @Column({ length: 50, nullable: true })
  phone: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({
    name: 'total_area_sqft',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  totalAreaSqft: number;

  @Column({
    name: 'usable_area_sqft',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  usableAreaSqft: number;

  @Column({ name: 'is_active', type: 'tinyint', default: 1 })
  isActive: boolean;

  @Column({ name: 'is_default', type: 'tinyint', default: 0 })
  isDefault: boolean;

  @Column({ name: 'allow_negative_stock', type: 'tinyint', default: 0 })
  allowNegativeStock: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => WarehouseZone, (zone) => zone.warehouse)
  zones: WarehouseZone[];

  @OneToMany(() => WarehouseLocation, (location) => location.warehouse)
  locations: WarehouseLocation[];

  @OneToMany(() => InventoryStock, (stock) => stock.warehouse)
  inventoryStocks: InventoryStock[];
}
