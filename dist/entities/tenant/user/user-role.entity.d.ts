import { User } from './user.entity';
import { Role } from '../role/role.entity';
export declare class UserRole {
    id: string;
    userId: string;
    roleId: string;
    assignedBy: string;
    assignedAt: Date;
    user: User;
    role: Role;
}
