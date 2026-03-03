import { Tenant } from './tenant.entity';
export declare class TenantUser {
    id: string;
    tenantId: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    failedLoginAttempts: number;
    isAdmin: boolean;
    lastLoginAt: Date | null;
    lockedUntil: Date | null;
    isActive: boolean;
    passwordResetToken: string;
    passwordResetExpires: Date;
    createdAt: Date;
    updatedAt: Date;
    tenant: Tenant;
}
