import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository, IsNull } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { TenantUser } from '@entities/master/tenant-user.entity';
import { UserRole } from '@entities/tenant/user/user-role.entity';
import { Role } from '@entities/tenant/role/role.entity';
import { Permission } from '@entities/tenant/role/permission.entity';
import { RolePermission } from '@entities/tenant/role/role-permission.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResult } from '@common/interfaces';
import { RoleWithPermissions } from '@common/interfaces';
import { paginate } from '@common/utils/pagination.util';

/**
 * Users live in the MASTER database (`tenant_users`), scoped to a tenant by
 * `tenantId`. Their roles and permissions live in that tenant's own database.
 *
 * The two sides therefore cannot be joined, and `user_roles.user_id` is a
 * plain value with no foreign key behind it. Every lookup here is two steps:
 * find the user in master, then resolve their roles in the tenant.
 *
 * Users are NOT employees. `hr_employees` is a separate HR record with no
 * relation to this table.
 */
@Injectable()
export class UsersService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
    @InjectRepository(TenantUser, 'master')
    private readonly tenantUserRepository: Repository<TenantUser>,
  ) {}

  /** Scopes every query to the tenant the request is for. */
  private currentTenantId(): string {
    const tenantId = this.tenantConnectionManager.getTenantId();
    if (!tenantId) {
      throw new BadRequestException('Tenant context is required');
    }
    return tenantId;
  }

  async create(
    tenantId: string,
    createUserDto: CreateUserDto & { createdBy?: string } & {
      passwordHash?: string;
    },
  ): Promise<TenantUser> {
    const email = createUserDto.email.toLowerCase();

    // `email` is globally unique on tenant_users, so this is not scoped to
    // the tenant: one address belongs to one user across the platform.
    const existingUser = await this.tenantUserRepository.findOne({
      where: { email },
      withDeleted: true,
    });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    let passwordHash = createUserDto.passwordHash;
    if (!passwordHash && createUserDto.password) {
      passwordHash = await bcrypt.hash(createUserDto.password, 10);
    }
    if (!passwordHash) {
      throw new BadRequestException('A password is required');
    }

    const user = this.tenantUserRepository.create({
      id: uuidv4(),
      tenantId: tenantId ?? this.currentTenantId(),
      email,
      passwordHash,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      employeeCode: createUserDto.employeeCode,
      phone: createUserDto.phone,
      isAdmin: false,
      isActive: true,
      isEmailVerified: false,
      createdBy: createUserDto.createdBy,
    });

    const savedUser = await this.tenantUserRepository.save(user);

    // Roles are granted in the tenant database, keyed by the master user id.
    if (createUserDto.roleIds?.length) {
      await this.assignRoles(
        savedUser.id,
        createUserDto.roleIds,
        createUserDto?.createdBy,
      );
    }

    return savedUser;
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<TenantUser>> {
    const queryBuilder = this.tenantUserRepository
      .createQueryBuilder('user')
      .where('user.tenantId = :tenantId', { tenantId: this.currentTenantId() });

    if (paginationDto.search) {
      queryBuilder.andWhere(
        '(user.firstName LIKE :search OR user.lastName LIKE :search OR user.email LIKE :search)',
        { search: `%${paginationDto.search}%` },
      );
    }

    if (!paginationDto.sortBy) {
      paginationDto.sortBy = 'createdAt';
    }

    return paginate(queryBuilder, paginationDto);
  }

  async findById(id: string): Promise<TenantUser> {
    const user = await this.tenantUserRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<TenantUser | null> {
    return this.tenantUserRepository.findOne({
      where: { email: email.toLowerCase() },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<TenantUser> {
    const user = await this.findById(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.tenantUserRepository.findOne({
        where: { email: updateUserDto.email.toLowerCase() },
      });

      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }
    }

    Object.assign(user, updateUserDto);
    return this.tenantUserRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    user.deletedAt = new Date();
    await this.tenantUserRepository.save(user);
  }

  async hardDelete(id: string): Promise<void> {
    await this.tenantUserRepository.delete(id);
  }

  // ── Roles and permissions (tenant database) ──────────────────────────────

  async getUserRoles(userId: string): Promise<string[]> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const userRoleRepo = dataSource.getRepository(UserRole);

    const userRoles = await userRoleRepo.find({
      where: { userId },
      relations: ['role'],
    });

    return userRoles.map((ur) => ur.role.roleCode);
  }

  /**
   * Roles held by several users at once, each with its permission codes.
   *
   * Batched deliberately: the employee list needs this for a whole page, and
   * doing it per row would be a query per employee.
   */
  async getRolesForUsers(
    userIds: string[],
  ): Promise<Map<string, RoleWithPermissions[]>> {
    const byUser = new Map<string, RoleWithPermissions[]>();
    if (userIds.length === 0) return byUser;

    const dataSource = await this.tenantConnectionManager.getDataSource();

    const rows = await dataSource
      .createQueryBuilder()
      .select('ur.user_id', 'userId')
      .addSelect('r.id', 'roleId')
      .addSelect('r.role_code', 'roleCode')
      .addSelect('r.role_name', 'roleName')
      .addSelect('p.permission_code', 'permissionCode')
      .from(UserRole, 'ur')
      .innerJoin(Role, 'r', 'r.id = ur.role_id')
      .leftJoin(RolePermission, 'rp', 'rp.role_id = r.id')
      .leftJoin(Permission, 'p', 'p.id = rp.permission_id')
      .where('ur.user_id IN (:...userIds)', { userIds })
      .orderBy('r.role_name', 'ASC')
      .getRawMany<{
        userId: string;
        roleId: string;
        roleCode: string;
        roleName: string;
        permissionCode: string | null;
      }>();

    // One row per (user, role, permission); fold back into nested roles.
    for (const row of rows) {
      const roles = byUser.get(row.userId) ?? [];
      if (!byUser.has(row.userId)) byUser.set(row.userId, roles);

      let role = roles.find((r) => r.id === row.roleId);
      if (!role) {
        role = {
          id: row.roleId,
          roleCode: row.roleCode,
          roleName: row.roleName,
          permissions: [],
        };
        roles.push(role);
      }
      if (
        row.permissionCode &&
        !role.permissions.includes(row.permissionCode)
      ) {
        role.permissions.push(row.permissionCode);
      }
    }

    return byUser;
  }

  /** The roles of one user, each with its permission codes. */
  async getUserRolesDetailed(userId: string): Promise<RoleWithPermissions[]> {
    const byUser = await this.getRolesForUsers([userId]);
    return byUser.get(userId) ?? [];
  }

  /**
   * Master users for a set of email addresses, within the current tenant.
   *
   * Employees and users are unrelated records, so email is the only handle
   * the two have in common. Used to show a person's roles on the employee
   * list; it resolves nothing and creates no link.
   */
  async findByEmails(emails: string[]): Promise<TenantUser[]> {
    const wanted = emails.filter(Boolean).map((e) => e.toLowerCase());
    if (wanted.length === 0) return [];

    return this.tenantUserRepository
      .createQueryBuilder('user')
      .where('user.tenantId = :tenantId', { tenantId: this.currentTenantId() })
      .andWhere('user.email IN (:...wanted)', { wanted })
      .getMany();
  }

  async getUserPermissions(userId: string): Promise<string[]> {
    const dataSource = await this.tenantConnectionManager.getDataSource();

    const permissions = await dataSource
      .createQueryBuilder()
      .select('DISTINCT p.permission_code', 'permissionCode')
      .from(Permission, 'p')
      .innerJoin(RolePermission, 'rp', 'rp.permission_id = p.id')
      .innerJoin(UserRole, 'ur', 'ur.role_id = rp.role_id')
      .where('ur.user_id = :userId', { userId })
      .getRawMany();

    return permissions.map((p) => p.permissionCode);
  }

  async assignRoles(
    userId: string,
    roleIds: string[],
    assignedBy?: string,
  ): Promise<void> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const userRoleRepo = dataSource.getRepository(UserRole);

    // Remove existing roles
    await userRoleRepo.delete({ userId });

    // Add new roles
    const userRoles = roleIds.map((roleId) =>
      userRoleRepo.create({
        id: uuidv4(),
        userId,
        roleId,
        assignedBy,
      }),
    );

    await userRoleRepo.save(userRoles);
  }

  // ── Sign-in bookkeeping ──────────────────────────────────────────────────

  async updateLastLogin(userId: string, ipAddress: string): Promise<void> {
    await this.tenantUserRepository.update(userId, {
      lastLoginAt: new Date(),
      lastLoginIp: ipAddress,
    });
  }

  async incrementFailedLoginAttempts(userId: string): Promise<void> {
    const user = await this.findById(userId);

    user.failedLoginAttempts += 1;

    // Lock account after 5 failed attempts for 30 minutes
    if (user.failedLoginAttempts >= 5) {
      user.lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
    }

    await this.tenantUserRepository.save(user);
  }

  async resetFailedLoginAttempts(userId: string): Promise<void> {
    const user = await this.findById(userId);

    user.failedLoginAttempts = 0;
    user.lockedUntil = null;

    await this.tenantUserRepository.save(user);
  }

  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await this.tenantUserRepository.update(userId, {
      passwordHash,
      passwordChangedAt: new Date(),
    });
  }

  async activate(id: string): Promise<TenantUser> {
    return this.update(id, { isActive: true } as UpdateUserDto);
  }

  async deactivate(id: string): Promise<TenantUser> {
    return this.update(id, { isActive: false } as UpdateUserDto);
  }

  async count(): Promise<number> {
    return this.tenantUserRepository.count({
      where: { tenantId: this.currentTenantId(), deletedAt: IsNull() },
    });
  }
}
