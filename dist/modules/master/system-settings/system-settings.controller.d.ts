import { SystemSettingsService } from './system-settings.service';
export declare class SystemSettingsController {
    private readonly settingsService;
    constructor(settingsService: SystemSettingsService);
    findAll(category?: string): Promise<{
        data: import("../../../entities/master").SystemSetting[];
    }>;
    findPublic(): Promise<{
        data: import("../../../entities/master").SystemSetting[];
    }>;
    findGrouped(): Promise<{
        data: Record<string, import("../../../entities/master").SystemSetting[]>;
    }>;
    findByKey(key: string): Promise<{
        data: import("../../../entities/master").SystemSetting | null;
    }>;
    setValue(body: {
        key: string;
        value: any;
        valueType?: string;
        category?: string;
        description?: string;
        isPublic?: boolean;
    }): Promise<import("../../../entities/master").SystemSetting>;
    bulkUpdate(body: {
        settings: {
            key: string;
            value: any;
        }[];
    }): Promise<{
        data: import("../../../entities/master").SystemSetting[];
    }>;
    remove(key: string): Promise<void>;
}
