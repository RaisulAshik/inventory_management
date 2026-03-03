import { Tenant } from './tenant.entity';
export declare class TenantDatabase {
    id: string;
    tenantId: string;
    databaseName: string;
    host: string;
    port: number;
    username: string;
    isProvisioned: boolean;
    isActive: boolean;
    provisionedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    tenant: Tenant;
}
