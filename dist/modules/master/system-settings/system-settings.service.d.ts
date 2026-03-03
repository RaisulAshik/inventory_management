import { Repository } from 'typeorm';
import { SystemSetting } from '@entities/master/system-setting.entity';
export declare class SystemSettingsService {
    private readonly settingRepository;
    constructor(settingRepository: Repository<SystemSetting>);
    findAll(category?: string): Promise<SystemSetting[]>;
    findPublic(): Promise<SystemSetting[]>;
    findByKey(key: string): Promise<SystemSetting | null>;
    getValue<T>(key: string, defaultValue?: T): Promise<T>;
    setValue(key: string, value: any, options?: {
        valueType?: string;
        category?: string;
        description?: string;
        isPublic?: boolean;
    }): Promise<SystemSetting>;
    remove(key: string): Promise<void>;
    findGroupedByCategory(): Promise<Record<string, SystemSetting[]>>;
    bulkUpdate(settings: {
        key: string;
        value: any;
    }[]): Promise<SystemSetting[]>;
}
