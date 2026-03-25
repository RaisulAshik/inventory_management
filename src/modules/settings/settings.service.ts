import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { TenantSetting, SettingCategory, SettingDataType } from '@entities/tenant';
import { UpsertSettingDto, BulkUpsertSettingDto } from './dto/update-setting.dto';
import { v4 as uuidv4 } from 'uuid';

// The 6 accounting keys the auto-accounting service expects
const ACCOUNTING_DEFAULTS: Array<{
  key: string;
  displayName: string;
  description: string;
}> = [
  {
    key: 'acc.default_ar_account',
    displayName: 'Default Accounts Receivable Account',
    description: 'Chart of Accounts ID used as Accounts Receivable when a sale is delivered',
  },
  {
    key: 'acc.default_revenue_account',
    displayName: 'Default Sales Revenue Account',
    description: 'Chart of Accounts ID used as Sales Revenue when a sale is delivered',
  },
  {
    key: 'acc.default_cogs_account',
    displayName: 'Default Cost of Goods Sold Account',
    description: 'Chart of Accounts ID used as COGS when an order is shipped',
  },
  {
    key: 'acc.default_inventory_account',
    displayName: 'Default Inventory Asset Account',
    description: 'Chart of Accounts ID used as Inventory asset (reduced on ship)',
  },
  {
    key: 'acc.default_bank_account',
    displayName: 'Default Bank / Cash Account',
    description: 'Chart of Accounts ID debited when a customer payment is received',
  },
  {
    key: 'acc.default_vat_account',
    displayName: 'Default VAT / GST Payable Account',
    description: 'Chart of Accounts ID credited for tax collected on sales (optional)',
  },
];

@Injectable()
export class SettingsService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  private async getRepo() {
    return this.tenantConnectionManager.getRepository(TenantSetting);
  }

  async findAll(category?: SettingCategory): Promise<TenantSetting[]> {
    const repo = await this.getRepo();
    const where: any = {};
    if (category) where.category = category;
    return repo.find({ where, order: { category: 'ASC', settingKey: 'ASC' } });
  }

  async findByKey(key: string): Promise<TenantSetting> {
    const repo = await this.getRepo();
    const setting = await repo.findOne({ where: { settingKey: key } });
    if (!setting) throw new NotFoundException(`Setting '${key}' not found`);
    return setting;
  }

  async upsert(
    key: string,
    dto: UpsertSettingDto,
    updatedBy: string,
  ): Promise<TenantSetting> {
    const repo = await this.getRepo();
    let setting = await repo.findOne({ where: { settingKey: key } });

    if (setting) {
      setting.settingValue = dto.value;
      setting.updatedBy = updatedBy;
      if (dto.category) setting.category = dto.category;
      if (dto.dataType) setting.dataType = dto.dataType;
      if (dto.displayName) setting.displayName = dto.displayName;
      if (dto.description) setting.description = dto.description;
    } else {
      setting = repo.create({
        id: uuidv4(),
        settingKey: key,
        settingValue: dto.value,
        category: dto.category ?? SettingCategory.GENERAL,
        dataType: dto.dataType ?? SettingDataType.STRING,
        displayName: dto.displayName ?? key,
        description: dto.description,
        updatedBy,
      });
    }

    return repo.save(setting);
  }

  async bulkUpsert(
    dto: BulkUpsertSettingDto,
    updatedBy: string,
  ): Promise<TenantSetting[]> {
    const results: TenantSetting[] = [];
    for (const [key, value] of Object.entries(dto.settings)) {
      const result = await this.upsert(
        key,
        { value, category: dto.category },
        updatedBy,
      );
      results.push(result);
    }
    return results;
  }

  async remove(key: string): Promise<void> {
    const repo = await this.getRepo();
    const setting = await repo.findOne({ where: { settingKey: key } });
    if (!setting) throw new NotFoundException(`Setting '${key}' not found`);
    if (setting.isSystem) {
      throw new Error(`System setting '${key}' cannot be deleted`);
    }
    await repo.remove(setting);
  }

  /**
   * Returns the 6 accounting setting keys with their current values.
   * Value will be null if not yet configured.
   */
  async getAccountingSettings(): Promise<
    Array<{ key: string; displayName: string; description: string; value: string | null; configured: boolean }>
  > {
    const repo = await this.getRepo();
    const rows = await repo.find({
      where: ACCOUNTING_DEFAULTS.map((d) => ({ settingKey: d.key })) as any,
    });
    const map = new Map(rows.map((r) => [r.settingKey, r.settingValue]));

    return ACCOUNTING_DEFAULTS.map((d) => ({
      key: d.key,
      displayName: d.displayName,
      description: d.description,
      value: map.get(d.key) ?? null,
      configured: map.has(d.key) && !!map.get(d.key),
    }));
  }
}
