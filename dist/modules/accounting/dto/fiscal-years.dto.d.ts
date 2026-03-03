export declare class CreateFiscalYearDto {
    yearCode: string;
    yearName: string;
    startDate: string;
    endDate: string;
    isCurrent?: boolean;
}
declare const UpdateFiscalYearDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateFiscalYearDto>>;
export declare class UpdateFiscalYearDto extends UpdateFiscalYearDto_base {
}
export declare class CloseFiscalYearDto {
    retainedEarningsAccountId?: string;
}
export declare class QueryFiscalYearDto {
    status?: string;
    isCurrent?: boolean;
    page?: number;
    limit?: number;
}
export {};
