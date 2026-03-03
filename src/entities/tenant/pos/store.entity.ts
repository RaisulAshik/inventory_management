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
import { Warehouse } from '../warehouse/warehouse.entity';
import { User } from '../user/user.entity';
import { PosTerminal } from './pos-terminal.entity';
import { PriceList } from '../inventory/price-list.entity';

export enum StoreType {
  RETAIL = 'RETAIL',
  OUTLET = 'OUTLET',
  FRANCHISE = 'FRANCHISE',
  POPUP = 'POPUP',
  KIOSK = 'KIOSK',
}

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'store_code', length: 50, unique: true })
  storeCode: string;

  @Column({ name: 'store_name', length: 200 })
  storeName: string;

  @Column({
    name: 'store_type',
    type: 'enum',
    enum: StoreType,
    default: StoreType.RETAIL,
  })
  storeType: StoreType;

  @Column({ name: 'warehouse_id' })
  warehouseId: string;

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

  @Column({ length: 50, nullable: true })
  phone: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ name: 'manager_id', nullable: true })
  managerId: string;

  @Column({ name: 'opening_time', type: 'time', nullable: true })
  openingTime: string;

  @Column({ name: 'closing_time', type: 'time', nullable: true })
  closingTime: string;

  @Column({ length: 100, default: 'Asia/Kolkata' })
  timezone: string;

  @Column({ name: 'tax_id', length: 100, nullable: true })
  taxId: string;

  @Column({ name: 'default_price_list_id', nullable: true })
  defaultPriceListId: string;

  @Column({ name: 'receipt_header', type: 'text', nullable: true })
  receiptHeader: string;

  @Column({ name: 'receipt_footer', type: 'text', nullable: true })
  receiptFooter: string;

  @Column({ name: 'is_active', type: 'tinyint', default: 1 })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'manager_id' })
  manager: User;

  @ManyToOne(() => PriceList)
  @JoinColumn({ name: 'default_price_list_id' })
  defaultPriceList: PriceList;

  @OneToMany(() => PosTerminal, (terminal) => terminal.store)
  terminals: PosTerminal[];
}
