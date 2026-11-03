import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository, IsNull, EntityManager } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { TenantUser } from '@entities/master/tenant-user.entity';
import { User } from '@entities/tenant/user/user.entity';
import { UserRole } from '@entities/tenant/user/user-role.entity';
import { Role } from '@entities/tenant/role/role.entity';
import { Employee } from '@entities/tenant/hr/employee.entity';
import { Permission } from '@entities/tenant/role/permission.entity';
import { RolePermission } from '@entities/tenant/role/role-permission.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResult } from '@common/interfaces';
import { RoleWithPermissions } from '@common/interfaces';
import { paginate } from '@common/utils/pagination.util';
import { getNextSequence } from '@common/utils/sequence.util';
import { EmploymentStatus } from '@common/enums';

/**
 * Users live in the MASTER database (`tenant_users`), scoped to a tenant by
 * `tenantId`, and are the authority for sign-in. Each is mirrored into the
 * tenant's own `users` table under the same id; roles and permissions live in
 * the tenant database alongside it.
 *
 * Master and tenant cannot be joined, so every lookup here is two steps:
 * find the user in master, then resolve their roles in the tenant. Every
 * write to a master user goes through this service so the tenant copy
 * follows it.
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

  /**
   * Create a login, and the employee record that must accompany it.
   *
   * Every user is an employee: a login is something a person holds, not a
   * separate kind of record. `skipEmployee` is for EmployeesService, which
   * creates the employee first and calls this to add their access — without
   * it that path would produce two employees for one person.
   */
  async create(
    tenantId: string,
    createUserDto: CreateUserDto & { createdBy?: string } & {
      passwordHash?: string;
    },
    options: { skipEmployee?: boolean } = {},
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

    // Fetched before the first write: if the tenant is unreachable, nothing
    // has been created yet to undo.
    const dataSource = await this.tenantConnectionManager.getDataSource();

    // Both records carry the same code, so it is minted once, here.
    let employeeCode = createUserDto.employeeCode;
    if (!options.skipEmployee && !employeeCode) {
      employeeCode = await getNextSequence(dataSource, 'EMPLOYEE');
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
      employeeCode,
      phone: createUserDto.phone,
      isAdmin: false,
      isActive: true,
      isEmailVerified: false,
      createdBy: createUserDto.createdBy,
    });

    if (createUserDto.roleIds?.length) {
      await this.assertRolesExist(createUserDto.roleIds);
    }

    const savedUser = await this.tenantUserRepository.save(user);

    // The tenant copy and its role grants go in together, keyed by the master
    // id. Master and tenant are different databases, so if the tenant side
    // fails the master row is removed again rather than left as a login with
    // no tenant record and no roles.
    try {
      await dataSource.transaction(async (manager) => {
        await this.syncTenantUser(savedUser, manager);
        if (!options.skipEmployee) {
          await this.createEmployeeFor(savedUser, employeeCode!, manager);
        }
        if (createUserDto.roleIds?.length) {
          await this.assignRoles(
            savedUser.id,
            createUserDto.roleIds,
            createUserDto.createdBy,
            manager,
          );
        }
      });
    } catch (error) {
      await this.tenantUserRepository.delete(savedUser.id);
      throw error;
    }

    return savedUser;
  }

  /**
   * The HR record that every login must have.
   *
   * Written in the same transaction as the tenant user copy, so a person
   * can never end up with a login and no employee record. `hireDate` is
   * today — the only date available when a login is the starting point —
   * and HR can correct it along with the rest of the detail afterwards.
   */
  private async createEmployeeFor(
    user: TenantUser,
    employeeCode: string,
    manager: EntityManager,
  ): Promise<void> {
    const repo = manager.getRepository(Employee);
    const existing = await repo.findOne({ where: { userId: user.id } });
    if (existing) return;

    await repo.save(
      repo.create({
        employeeCode,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userId: user.id,
        phone: user.phone,
        hireDate: new Date(),
        employmentStatus: EmploymentStatus.ACTIVE,
        createdBy: user.createdBy,
      }),
    );
  }

  /**
   * Write the tenant `users` copy of a master user, under the same id.
   *
   * An upsert, so it serves create and every later change alike. Master is
   * authoritative; this only ever copies from it.
   */
  private async syncTenantUser(
    user: TenantUser,
    manager?: EntityManager,
  ): Promise<void> {
    const repo = manager
      ? manager.getRepository(User)
      : await this.tenantConnectionManager.getRepository(User);

    await repo.upsert(
      {
        id: user.id,
        employeeCode: user.employeeCode ?? null,
        email: user.email,
        passwordHash: user.passwordHash,
        firstName: user.firstName,
        lastName: user.lastName ?? null,
        phone: user.phone ?? null,
        isActive: user.isActive,
        createdBy: user.createdBy ?? null,
        deletedAt: user.deletedAt ?? null,
      },
      ['id'],
    );
  }

  /** Rejects unknown role ids before anything is written. */
  private async assertRolesExist(roleIds: string[]): Promise<void> {
    const ids = [...new Set(roleIds)];
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const found = await dataSource
      .getRepository(Role)
      .createQueryBuilder('r')
      .where('r.id IN (:...ids)', { ids })
      .getCount();
    if (found !== ids.length) {
      throw new BadRequestException('One or more role IDs are invalid');
    }
  }

  /**
   * A page of users, each carrying the id of their employee record.
   *
   * Every user is an employee, and people are managed on the HR screens, so
   * `employeeId` is what lets a row there link to the record it belongs to.
   * It is null only for a user whose employee record has not been created
   * yet — migration 017 backfills those.
   */
  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<TenantUser & { employeeId?: string | null }>> {
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

    const page = await paginate(queryBuilder, paginationDto);

    // One extra query for the page, not one per row.
    const ids = page.data.map((u) => u.id);
    if (ids.length === 0) return page;

    const dataSource = await this.tenantConnectionManager.getDataSource();
    const rows: Array<{ id: string; userId: string }> = await dataSource
      .getRepository(Employee)
      .createQueryBuilder('e')
      .select(['e.id AS id', 'e.user_id AS userId'])
      .where('e.user_id IN (:...ids)', { ids })
      .andWhere('e.deleted_at IS NULL')
      .getRawMany();

    const employeeByUser = new Map(rows.map((r) => [r.userId, r.id]));
    for (const user of page.data) {
      (user as TenantUser & { employeeId?: string | null }).employeeId =
        employeeByUser.get(user.id) ?? null;
    }

    return page;
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
    const saved = await this.tenantUserRepository.save(user);
    await this.syncTenantUser(saved);
    return saved;
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    user.deletedAt = new Date();
    await this.tenantUserRepository.save(user);
    await this.syncTenantUser(user);
  }

  async hardDelete(id: string): Promise<void> {
    await this.tenantUserRepository.delete(id);
    const dataSource = await this.tenantConnectionManager.getDataSource();
    await dataSource.transaction(async (manager) => {
      await manager.getRepository(UserRole).delete({ userId: id });
      await manager.getRepository(User).delete(id);
    });
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
   * Master users for a set of ids, within the current tenant.
   *
   * Employees reference their login by id, so this is how the employee
   * list resolves whose access is active. It replaced a lookup by email,
   * which was the old implicit link between the two records.
   */
  async findByIds(ids: string[]): Promise<TenantUser[]> {
    const wanted = ids.filter(Boolean);
    if (wanted.length === 0) return [];

    return this.tenantUserRepository
      .createQueryBuilder('user')
      .where('user.tenantId = :tenantId', { tenantId: this.currentTenantId() })
      .andWhere('user.id IN (:...wanted)', { wanted })
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

  /**
   * Replace a user's roles. A delete followed by an insert, so it runs in a
   * transaction — the caller's, when one is passed.
   */
  async assignRoles(
    userId: string,
    roleIds: string[],
    assignedBy?: string,
    manager?: EntityManager,
  ): Promise<void> {
    const apply = async (m: EntityManager) => {
      const userRoleRepo = m.getRepository(UserRole);
      await userRoleRepo.delete({ userId });

      const userRoles = [...new Set(roleIds)].map((roleId) =>
        userRoleRepo.create({
          id: uuidv4(),
          userId,
          roleId,
          assignedBy,
        }),
      );
      if (userRoles.length) await userRoleRepo.save(userRoles);
    };

    if (manager) return apply(manager);

    // Called on its own, the user may predate the tenant copy; write it first
    // so the grants have a tenant row to belong to.
    const user = await this.findById(userId);
    const dataSource = await this.tenantConnectionManager.getDataSource();
    await dataSource.transaction(async (m) => {
      await this.syncTenantUser(user, m);
      await apply(m);
    });
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
    await this.syncTenantUser(await this.findById(userId));
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
