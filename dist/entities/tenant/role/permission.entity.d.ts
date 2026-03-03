import { RolePermission } from './role-permission.entity';
export declare class Permission {
    id: string;
    module: string;
    permissionCode: string;
    permissionName: string;
    description: string;
    createdAt: Date;
    rolePermissions: RolePermission[];
}
