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
import { LocationType, LocationStatus } from '@common/enums';
import { Warehouse } from './warehouse.entity';
import { WarehouseZone } from './warehouse-zone.entity';
import { LocationInventory } from './location-inventory.entity';

@Entity('warehouse_locations')
export class WarehouseLocation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'warehouse_id' })
  warehouseId: string;

  @Column({ name: 'zone_id', nullable: true })
  zoneId: string;

  @Column({ name: 'location_code', length: 50 })
  locationCode: string;

  @Column({ name: 'location_name', length: 200, nullable: true })
  locationName: string;

  @Column({ length: 20, nullable: true })
  aisle: string;

  @Column({ length: 20, nullable: true })
  rack: string;

  @Column({ length: 20, nullable: true })
  shelf: string;

  @Column({ length: 20, nullable: true })
  bin: string;

  @Column({
    name: 'location_type',
    type: 'enum',
    enum: LocationType,
    default: LocationType.BULk,
  })
  locationType: LocationType;

  @Column({ length: 100, nullable: true })
  barcode: string;

  @Column({
    name: 'max_weight_kg',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  maxWeightKg: number;

  @Column({
    name: 'max_volume_cbm',
    type: 'decimal',
    precision: 10,
    scale: 4,
    nullable: true,
  })
  maxVolumeCbm: number;

  @Column({ name: 'max_units', type: 'int', nullable: true })
  maxUnits: number;

  @Column({
    name: 'current_weight_kg',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  currentWeightKg: number;

  @Column({
    name: 'current_volume_cbm',
    type: 'decimal',
    precision: 10,
    scale: 4,
    default: 0,
  })
  currentVolumeCbm: number;

  @Column({ name: 'current_units', type: 'int', default: 0 })
  currentUnits: number;

  @Column({
    type: 'enum',
    enum: LocationStatus,
    default: LocationStatus.AVAILABLE,
  })
  status: LocationStatus;

  @Column({ name: 'is_active', type: 'tinyint', default: 1 })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Warehouse, (warehouse) => warehouse.locations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @ManyToOne(() => WarehouseZone, (zone) => zone.locations, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'zone_id' })
  zone: WarehouseZone;

  @OneToMany(() => LocationInventory, (inv) => inv.location)
  inventory: LocationInventory[];

  // Helper: Full location path
  get fullPath(): string {
    return [this.aisle, this.rack, this.shelf, this.bin]
      .filter(Boolean)
      .join('-');
  }
}
