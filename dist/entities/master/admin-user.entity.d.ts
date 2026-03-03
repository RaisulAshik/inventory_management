export declare enum AdminRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    SUPPORT = "SUPPORT",
    BILLING = "BILLING"
}
export declare class AdminUser {
    id: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: AdminRole;
    isActive: boolean;
    lastLoginAt: Date;
    lastLoginIp: string;
    passwordChangedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    get fullName(): string;
}
