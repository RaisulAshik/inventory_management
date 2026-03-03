import { ImportTemplate } from './import-template.entity';
export declare enum ColumnDataType {
    STRING = "STRING",
    NUMBER = "NUMBER",
    DECIMAL = "DECIMAL",
    DATE = "DATE",
    DATETIME = "DATETIME",
    BOOLEAN = "BOOLEAN",
    EMAIL = "EMAIL",
    PHONE = "PHONE",
    URL = "URL"
}
export declare enum ColumnMappingType {
    DIRECT = "DIRECT",
    LOOKUP = "LOOKUP",
    TRANSFORM = "TRANSFORM",
    CONSTANT = "CONSTANT",
    FORMULA = "FORMULA"
}
export declare class ImportTemplateColumn {
    id: string;
    templateId: string;
    columnOrder: number;
    sourceColumnName: string;
    sourceColumnIndex: number;
    targetFieldName: string;
    displayName: string;
    dataType: ColumnDataType;
    mappingType: ColumnMappingType;
    isRequired: boolean;
    isUnique: boolean;
    defaultValue: string;
    lookupEntity: string;
    lookupField: string;
    lookupReturnField: string;
    transformExpression: string;
    validationRules: Record<string, any>;
    allowedValues: string[];
    minLength: number;
    maxLength: number;
    minValue: number;
    maxValue: number;
    regexPattern: string;
    description: string;
    sampleValue: string;
    createdAt: Date;
    updatedAt: Date;
    template: ImportTemplate;
}
