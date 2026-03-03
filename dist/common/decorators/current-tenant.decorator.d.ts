export interface TenantInfo {
    tenantId: string;
    tenantCode?: string;
    tenantDatabase: string;
}
export declare const CurrentTenant: (...dataOrPipes: (import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | keyof TenantInfo | undefined)[]) => ParameterDecorator;
