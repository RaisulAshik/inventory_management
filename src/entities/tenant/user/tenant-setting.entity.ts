import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SettingDataType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  JSON = 'JSON',
  DATE = 'DATE',
}

export enum SettingCategory {
  GENERAL = 'GENERAL',
  INVENTORY = 'INVENTORY',
  SALES = 'SALES',
  PURCHASE = 'PURCHASE',
  ACCOUNTING = 'ACCOUNTING',
  POS = 'POS',
  ECOMMERCE = 'ECOMMERCE',
  MANUFACTURING = 'MANUFACTURING',
  NOTIFICATION = 'NOTIFICATION',
  INTEGRATION = 'INTEGRATION',
}

@Entity('tenant_settings')
export class TenantSetting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: SettingCategory,
    default: SettingCategory.GENERAL,
  })
  category: SettingCategory;

  @Column({ name: 'setting_key', length: 100, unique: true })
  settingKey: string;

  @Column({ name: 'setting_value', type: 'text', nullable: true })
  settingValue: string;

  @Column({
    name: 'data_type',
    type: 'enum',
    enum: SettingDataType,
    default: SettingDataType.STRING,
  })
  dataType: SettingDataType;

  @Column({ name: 'display_name', length: 200 })
  displayName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'default_value', type: 'text', nullable: true })
  defaultValue: string;

  @Column({ name: 'is_system', type: 'tinyint', default: 0 })
  isSystem: boolean;

  @Column({ name: 'is_encrypted', type: 'tinyint', default: 0 })
  isEncrypted: boolean;

  @Column({ name: 'validation_rules', type: 'json', nullable: true })
  validationRules: Record<string, any>;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Helper methods
  getValue<T>(): T {
    if (!this.settingValue) {
      return this.defaultValue as unknown as T;
    }

    switch (this.dataType) {
      case SettingDataType.NUMBER:
        return parseFloat(this.settingValue) as unknown as T;
      case SettingDataType.BOOLEAN:
        return (this.settingValue === 'true' ||
          this.settingValue === '1') as unknown as T;
      case SettingDataType.JSON:
        return JSON.parse(this.settingValue) as T;
      case SettingDataType.DATE:
        return new Date(this.settingValue) as unknown as T;
      default:
        return this.settingValue as unknown as T;
    }
  }

  setValue(value: any): void {
    switch (this.dataType) {
      case SettingDataType.JSON:
        this.settingValue = JSON.stringify(value);
        break;
      case SettingDataType.DATE:
        this.settingValue = value instanceof Date ? value.toISOString() : value;
        break;
      default:
        this.settingValue = String(value);
    }
  }
}
