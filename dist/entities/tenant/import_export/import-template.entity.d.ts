import { ImportTemplateColumn } from './import-template-column.entity';
export declare enum ImportEntityType {
    PRODUCTS = "PRODUCTS",
    CUSTOMERS = "CUSTOMERS",
    SUPPLIERS = "SUPPLIERS",
    INVENTORY_STOCK = "INVENTORY_STOCK",
    PRICE_LIST = "PRICE_LIST",
    SALES_ORDERS = "SALES_ORDERS",
    PURCHASE_ORDERS = "PURCHASE_ORDERS",
    CHART_OF_ACCOUNTS = "CHART_OF_ACCOUNTS",
    JOURNAL_ENTRIES = "JOURNAL_ENTRIES",
    OPENING_BALANCES = "OPENING_BALANCES",
    CATEGORIES = "CATEGORIES",
    BRANDS = "BRANDS",
    WAREHOUSES = "WAREHOUSES",
    LOCATIONS = "LOCATIONS"
}
export declare class ImportTemplate {
    id: string;
    templateCode: string;
    templateName: string;
    description: string;
    entityType: ImportEntityType;
    fileFormat: 'XLSX' | 'CSV' | 'TSV';
    hasHeaderRow: boolean;
    headerRowNumber: number;
    dataStartRow: number;
    sheetName: string;
    dateFormat: string;
    numberFormat: string;
    delimiter: string;
    textQualifier: string;
    encoding: string;
    sampleFileUrl: string;
    isSystem: boolean;
    isActive: boolean;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    columns: ImportTemplateColumn[];
}
