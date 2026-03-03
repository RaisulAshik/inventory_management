import { User } from '@entities/tenant/user/user.entity';
declare class RoleDto {
    id: string;
    roleCode: string;
    roleName: string;
}
export declare class UserResponseDto {
    id: string;
    email: string;
    firstName: string;
    lastName?: string;
    fullName: string;
    employeeCode?: string;
    phone?: string;
    avatarUrl?: string;
    isActive: boolean;
    isEmailVerified: boolean;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    roles?: RoleDto[];
    constructor(user: User);
}
export {};
