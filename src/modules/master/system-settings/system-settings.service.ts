import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { SystemSetting } from '@entities/master/system-setting.entity';

@Injectable()
export class SystemSettingsService {
  constructor(
    @InjectRepository(SystemSetting, 'master')
    private readonly settingRepository: Repository<SystemSetting>,
  ) {}

  /**
   * Get all settings
   */
  async findAll(category?: string): Promise<SystemSetting[]> {
    const where: any = {};
    if (category) {
      where.category = category;
    }

    return this.settingRepository.find({
      where,
      order: { category: 'ASC', settingKey: 'ASC' },
    });
  }

  /**
   * Get public settings
   */
  async findPublic(): Promise<SystemSetting[]> {
    return this.settingRepository.find({
      where: { isPublic: true },
      order: { category: 'ASC', settingKey: 'ASC' },
    });
  }

  /**
   * Get setting by key
   */
  async findByKey(key: string): Promise<SystemSetting | null> {
    return this.settingRepository.findOne({
      where: { settingKey: key },
    });
  }

  /**
   * Get typed setting value
   */
  async getValue<T>(key: string, defaultValue?: T): Promise<T> {
    const setting = await this.findByKey(key);
    if (!setting) {
      return defaultValue as T;
    }
    return setting.getValue<T>();
  }

  /**
   * Set setting value
   */
  async setValue(
    key: string,
    value: any,
    options?: {
      valueType?: string;
      category?: string;
      description?: string;
      isPublic?: boolean;
    },
  ): Promise<SystemSetting> {
    let setting = await this.findByKey(key);

    if (!setting) {
      // Create new setting
      setting = this.settingRepository.create({
        id: uuidv4(),
        settingKey: key,
        valueType: options?.valueType || typeof value,
        category: options?.category,
        description: options?.description,
        isPublic: options?.isPublic || false,
      });
    }

    if (!setting.isEditable) {
      throw new BadRequestException(`Setting ${key} is not editable`);
    }

    // Convert value to string
    if (typeof value === 'object') {
      setting.settingValue = JSON.stringify(value);
      setting.valueType = 'json';
    } else {
      setting.settingValue = String(value);
    }

    return this.settingRepository.save(setting);
  }

  /**
   * Delete setting
   */
  async remove(key: string): Promise<void> {
    const setting = await this.findByKey(key);
    if (!setting) {
      throw new NotFoundException(`Setting ${key} not found`);
    }

    if (!setting.isEditable) {
      throw new BadRequestException(`Setting ${key} cannot be deleted`);
    }

    await this.settingRepository.delete(setting.id);
  }

  /**
   * Get settings grouped by category
   */
  async findGroupedByCategory(): Promise<Record<string, SystemSetting[]>> {
    const settings = await this.findAll();

    return settings.reduce(
      (acc, setting) => {
        const category = setting.category || 'general';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(setting);
        return acc;
      },
      {} as Record<string, SystemSetting[]>,
    );
  }

  /**
   * Bulk update settings
   */
  async bulkUpdate(
    settings: { key: string; value: any }[],
  ): Promise<SystemSetting[]> {
    const results: SystemSetting[] = [];

    for (const item of settings) {
      const result = await this.setValue(item.key, item.value);
      results.push(result);
    }

    return results;
  }
}
