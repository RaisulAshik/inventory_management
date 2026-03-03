import { Customer } from './customer.entity';
export declare class CustomerCredentials {
    id: string;
    customerId: string;
    passwordHash: string;
    passwordChangedAt: Date;
    emailVerified: boolean;
    emailVerificationToken: string;
    emailVerificationExpires: Date;
    passwordResetToken: string;
    passwordResetExpires: Date;
    failedLoginAttempts: number;
    lockedUntil: Date;
    lastLoginAt: Date;
    lastLoginIp: string;
    twoFactorEnabled: boolean;
    twoFactorSecret: string;
    createdAt: Date;
    updatedAt: Date;
    customer: Customer;
    get isLocked(): boolean;
}
