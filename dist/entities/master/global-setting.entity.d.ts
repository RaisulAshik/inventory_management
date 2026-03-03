export declare enum SettingType {
    STRING = "STRING",
    NUMBER = "NUMBER",
    BOOLEAN = "BOOLEAN",
    JSON = "JSON"
}
export declare class GlobalSetting {
    id: string;
    settingKey: string;
    settingValue: string | null;
    settingType: SettingType;
    description: string | null;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
    getValue<T>(): T | null;
}
