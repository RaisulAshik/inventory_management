export declare enum SettingDataType {
    STRING = "STRING",
    NUMBER = "NUMBER",
    BOOLEAN = "BOOLEAN",
    JSON = "JSON",
    DATE = "DATE"
}
export declare enum SettingCategory {
    GENERAL = "GENERAL",
    INVENTORY = "INVENTORY",
    SALES = "SALES",
    PURCHASE = "PURCHASE",
    ACCOUNTING = "ACCOUNTING",
    POS = "POS",
    ECOMMERCE = "ECOMMERCE",
    MANUFACTURING = "MANUFACTURING",
    NOTIFICATION = "NOTIFICATION",
    INTEGRATION = "INTEGRATION"
}
export declare class TenantSetting {
    id: string;
    category: SettingCategory;
    settingKey: string;
    settingValue: string;
    dataType: SettingDataType;
    displayName: string;
    description: string;
    defaultValue: string;
    isSystem: boolean;
    isEncrypted: boolean;
    validationRules: Record<string, any>;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
    getValue<T>(): T;
    setValue(value: any): void;
}
