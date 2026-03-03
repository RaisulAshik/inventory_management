import { UserRole } from './user-role.entity';
import { UserSession } from './user-session.entity';
export declare class User {
    id: string;
    employeeCode: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone: string;
    avatarUrl: string;
    isActive: boolean;
    isEmailVerified: boolean;
    emailVerifiedAt: Date;
    lastLoginAt: Date;
    lastLoginIp: string;
    passwordChangedAt: Date;
    failedLoginAttempts: number;
    lockedUntil: Date | null;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    userRoles: UserRole[];
    sessions: UserSession[];
    get fullName(): string;
    get isLocked(): boolean;
}
