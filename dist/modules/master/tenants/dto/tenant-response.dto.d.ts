import { Tenant } from '@entities/master/tenant.entity';
import { TenantStatus } from '@common/enums';
declare class TenantDatabaseDto {
    databaseName: string;
    isProvisioned: boolean;
    isActive: boolean;
    provisionedAt: Date;
    host: string;
    port: number;
}
declare class SubscriptionDto {
    id: string;
    status: string;
    planName?: string;
    startDate?: Date;
    trialEndDate?: Date;
    currentPeriodEnd?: Date;
}
export declare class TenantResponseDto {
    id: string;
    tenantCode: string;
    companyName: string;
    displayName: string;
    email: string;
    phone?: string;
    website?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    taxId?: string;
    industry?: string;
    employeeCount?: number;
    timezone: string;
    dateFormat: string;
    currency: string;
    logoUrl?: string;
    status: TenantStatus;
    activatedAt?: Date;
    suspendedAt?: Date;
    suspensionReason?: string;
    database?: TenantDatabaseDto;
    subscription?: SubscriptionDto;
    createdAt: Date;
    updatedAt: Date;
    userCount: number;
    constructor(tenant: Tenant);
}
export {};
