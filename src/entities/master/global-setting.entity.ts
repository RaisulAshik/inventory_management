import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SettingType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  JSON = 'JSON',
}

@Entity('global_settings')
export class GlobalSetting {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'setting_key', length: 100, unique: true })
  settingKey!: string;

  @Column({ name: 'setting_value', type: 'text', nullable: true })
  settingValue!: string | null;

  @Column({
    name: 'setting_type',
    type: 'enum',
    enum: SettingType,
    default: SettingType.STRING,
  })
  settingType!: SettingType;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ name: 'is_public', type: 'tinyint', default: 0 })
  isPublic!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // Helper method to get typed value
  getValue<T>(): T | null {
    if (!this.settingValue) return null;
    switch (this.settingType) {
      case SettingType.NUMBER:
        return parseFloat(this.settingValue) as unknown as T;
      case SettingType.BOOLEAN:
        return (this.settingValue === 'true') as unknown as T;
      case SettingType.JSON:
        return JSON.parse(this.settingValue) as T;
      default:
        return this.settingValue as unknown as T;
    }
  }
}
