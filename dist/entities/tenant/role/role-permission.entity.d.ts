import { Role } from './role.entity';
import { Permission } from './permission.entity';
export declare class RolePermission {
    id: string;
    roleId: string;
    permissionId: string;
    createdAt: Date;
    role: Role;
    permission: Permission;
}
