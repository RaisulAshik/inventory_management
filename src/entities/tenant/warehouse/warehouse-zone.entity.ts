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
import { ZoneType } from '@common/enums';
import { Warehouse } from './warehouse.entity';
import { WarehouseLocation } from './warehouse-location.entity';

@Entity('warehouse_zones')
export class WarehouseZone {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'warehouse_id' })
  warehouseId!: string;

  @Column({ name: 'zone_code', length: 50 })
  zoneCode!: string;

  @Column({ name: 'zone_name', length: 200 })
  zoneName!: string;

  @Column({
    name: 'zone_type',
    type: 'enum',
    enum: ZoneType,
    default: ZoneType.STORAGE,
  })
  zoneType!: ZoneType;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({
    name: 'temperature_min',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  temperatureMin!: number;

  @Column({
    name: 'temperature_max',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  temperatureMax!: number;

  @Column({ name: 'is_active', type: 'tinyint', default: 1 })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // Relations
  @ManyToOne(() => Warehouse, (warehouse) => warehouse.zones, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse!: Warehouse;

  @OneToMany(() => WarehouseLocation, (location) => location.zone)
  locations!: WarehouseLocation[];
}
