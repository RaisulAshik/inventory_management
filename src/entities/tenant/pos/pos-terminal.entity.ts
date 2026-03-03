import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Store } from './store.entity';

export enum TerminalType {
  DESKTOP = 'DESKTOP',
  TABLET = 'TABLET',
  MOBILE = 'MOBILE',
  SELF_SERVICE = 'SELF_SERVICE',
}

@Entity('pos_terminals')
export class PosTerminal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'terminal_code', length: 50, unique: true })
  terminalCode: string;

  @Column({ name: 'terminal_name', length: 200 })
  terminalName: string;

  @Column({ name: 'store_id' })
  storeId: string;

  @Column({
    name: 'terminal_type',
    type: 'enum',
    enum: TerminalType,
    default: TerminalType.DESKTOP,
  })
  terminalType: TerminalType;

  @Column({ name: 'device_id', length: 200, nullable: true })
  deviceId: string;

  @Column({ name: 'ip_address', length: 45, nullable: true })
  ipAddress: string;

  @Column({ name: 'is_active', type: 'tinyint', default: 1 })
  isActive: boolean;

  @Column({ name: 'last_sync_at', type: 'timestamp', nullable: true })
  lastSyncAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Store, (store) => store.terminals, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'store_id' })
  store: Store;
}
