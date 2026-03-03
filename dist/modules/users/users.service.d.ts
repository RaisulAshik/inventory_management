import { Repository } from 'typeorm';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { User } from '@entities/tenant/user/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResult } from '@common/interfaces';
import { TenantUser } from '@/entities/master';
export declare class UsersService {
    private readonly tenantConnectionManager;
    private readonly tenantUserRepository;
    constructor(tenantConnectionManager: TenantConnectionManager, tenantUserRepository: Repository<TenantUser>);
    private getUserRepository;
    create(tenantId: any, createUserDto: CreateUserDto & {
        createdBy?: string;
    } & {
        passwordHash?: string;
    }): Promise<User>;
    findAll(paginationDto: PaginationDto): Promise<PaginatedResult<User>>;
    findById(id: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<void>;
    hardDelete(id: string): Promise<void>;
    getUserRoles(userId: string): Promise<string[]>;
    getUserPermissions(userId: string): Promise<string[]>;
    assignRoles(userId: string, roleIds: string[], assignedBy?: string): Promise<void>;
    updateLastLogin(userId: string, ipAddress: string): Promise<void>;
    incrementFailedLoginAttempts(userId: string): Promise<void>;
    resetFailedLoginAttempts(userId: string): Promise<void>;
    updatePassword(userId: string, passwordHash: string): Promise<void>;
    activate(id: string): Promise<User>;
    deactivate(id: string): Promise<User>;
    count(): Promise<number>;
}
