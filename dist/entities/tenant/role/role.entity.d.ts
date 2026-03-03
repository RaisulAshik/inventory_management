import { RolePermission } from './role-permission.entity';
import { UserRole } from '../user/user-role.entity';
export declare class Role {
    id: string;
    roleCode: string;
    roleName: string;
    description: string;
    isSystem: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    rolePermissions: RolePermission[];
    userRoles: UserRole[];
}
