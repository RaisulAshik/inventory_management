import { ImportJob } from './import-job.entity';
export declare enum ImportErrorType {
    VALIDATION = "VALIDATION",
    DATA_TYPE = "DATA_TYPE",
    REQUIRED_FIELD = "REQUIRED_FIELD",
    DUPLICATE = "DUPLICATE",
    REFERENCE_NOT_FOUND = "REFERENCE_NOT_FOUND",
    FORMAT = "FORMAT",
    BUSINESS_RULE = "BUSINESS_RULE",
    SYSTEM = "SYSTEM"
}
export declare enum ImportErrorSeverity {
    WARNING = "WARNING",
    ERROR = "ERROR",
    CRITICAL = "CRITICAL"
}
export declare class ImportJobError {
    id: string;
    importJobId: string;
    rowNumber: number;
    columnName: string;
    columnIndex: number;
    errorType: ImportErrorType;
    severity: ImportErrorSeverity;
    errorCode: string;
    errorMessage: string;
    fieldValue: string;
    expectedValue: string;
    rowData: Record<string, any>;
    isResolved: boolean;
    resolutionNotes: string;
    createdAt: Date;
    importJob: ImportJob;
}
