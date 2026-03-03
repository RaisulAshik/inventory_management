import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('system_settings')
@Index(['settingKey'], { unique: true })
@Index(['category'])
export class SystemSetting {
  @PrimaryColumn('char', { length: 36 })
  id: string;

  @Column('varchar', { name: 'setting_key', length: 100 })
  settingKey: string;

  @Column('text', { name: 'setting_value', nullable: true })
  settingValue: string;

  @Column('varchar', { name: 'value_type', length: 20, default: 'string' })
  valueType: string; // string, number, boolean, json

  @Column('varchar', { length: 100, nullable: true })
  category: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('boolean', { name: 'is_public', default: false })
  isPublic: boolean;

  @Column('boolean', { name: 'is_editable', default: true })
  isEditable: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Helper to get typed value
  getValue<T>(): T {
    if (this.settingValue === null) return null as T;

    switch (this.valueType) {
      case 'number':
        return Number(this.settingValue) as T;
      case 'boolean':
        return (this.settingValue === 'true' || this.settingValue === '1') as T;
      case 'json':
        return JSON.parse(this.settingValue) as T;
      default:
        return this.settingValue as T;
    }
  }
}
