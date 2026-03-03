export declare class CreateCostCenterDto {
    costCenterCode: string;
    costCenterName: string;
    parentId?: string;
    description?: string;
    managerId?: string;
    budget?: number;
    isActive?: boolean;
}
declare const UpdateCostCenterDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateCostCenterDto>>;
export declare class UpdateCostCenterDto extends UpdateCostCenterDto_base {
}
export declare class QueryCostCenterDto {
    parentId?: string;
    isActive?: boolean;
    search?: string;
    page?: number;
    limit?: number;
}
export {};
