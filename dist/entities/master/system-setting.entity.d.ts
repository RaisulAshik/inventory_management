export declare class SystemSetting {
    id: string;
    settingKey: string;
    settingValue: string;
    valueType: string;
    category: string;
    description: string;
    isPublic: boolean;
    isEditable: boolean;
    createdAt: Date;
    updatedAt: Date;
    getValue<T>(): T;
}
