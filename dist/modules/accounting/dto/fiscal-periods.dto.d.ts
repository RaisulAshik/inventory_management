export declare class CreateFiscalPeriodDto {
    fiscalYearId: string;
    periodNumber: number;
    periodName: string;
    startDate: string;
    endDate: string;
}
declare const UpdateFiscalPeriodDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateFiscalPeriodDto>>;
export declare class UpdateFiscalPeriodDto extends UpdateFiscalPeriodDto_base {
}
export declare class QueryFiscalPeriodDto {
    fiscalYearId?: string;
    status?: string;
    page?: number;
    limit?: number;
}
export {};
