import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { Role } from '@entities/tenant/role/role.entity';
import { Permission } from '@entities/tenant/role/permission.entity';
import { RolePermission } from '@entities/tenant/role/role-permission.entity';
import { UserRole } from '@entities/tenant/user/user-role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PERMISSION_CODES } from '@common/constants/permissions';

/** A catalogue permission, flagged with whether the application enforces it. */
export type PermissionView = Permission & { isSystem: boolean };

@Injectable()
export class RolesService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  async findAllRoles(): Promise<Role[]> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    return dataSource.getRepository(Role).find({
      relations: ['rolePermissions', 'rolePermissions.permission'],
      order: { roleName: 'ASC' },
    });
  }

  async findOneRole(id: string): Promise<Role> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const role = await dataSource.getRepository(Role).findOne({
      where: { id },
      relations: ['rolePermissions', 'rolePermissions.permission'],
    });
    if (!role) throw new NotFoundException(`Role ${id} not found`);
    return role;
  }

  async createRole(dto: CreateRoleDto): Promise<Role> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const repo = dataSource.getRepository(Role);
    const existing = await repo.findOne({ where: { roleCode: dto.roleCode } });
    if (existing)
      throw new ConflictException(`Role code '${dto.roleCode}' already exists`);
    const role = repo.create({ ...dto, isSystem: false });
    return repo.save(role);
  }

  async updateRole(id: string, dto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOneRole(id);
    if (role.isSystem && dto.roleCode && dto.roleCode !== role.roleCode) {
      throw new BadRequestException('Cannot change the code of a system role');
    }
    Object.assign(role, dto);
    const dataSource = await this.tenantConnectionManager.getDataSource();
    await dataSource.getRepository(Role).save(role);
    return this.findOneRole(id);
  }

  async deleteRole(id: string): Promise<void> {
    const role = await this.findOneRole(id);
    if (role.isSystem)
      throw new BadRequestException('System roles cannot be deleted');
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const inUse = await dataSource
      .getRepository(UserRole)
      .count({ where: { roleId: id } });
    if (inUse > 0)
      throw new BadRequestException(
        `Role is assigned to ${inUse} user(s) and cannot be deleted`,
      );
    await dataSource.getRepository(Role).remove(role);
  }

  async assignPermissions(
    id: string,
    dto: AssignPermissionsDto,
  ): Promise<Role> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    await this.findOneRole(id);

    // De-duplicated up front. The unique key on (role_id, permission_id)
    // would reject the whole batch on a repeat, and counting the raw list
    // against the number of rows found would report a duplicated id as an
    // invalid one.
    const permissionIds = [...new Set(dto.permissionIds)];

    if (permissionIds.length > 0) {
      const found = await dataSource
        .getRepository(Permission)
        .createQueryBuilder('p')
        .where('p.id IN (:...ids)', { ids: permissionIds })
        .getCount();
      if (found !== permissionIds.length) {
        throw new BadRequestException('One or more permission IDs are invalid');
      }
    }

    // Replace all permissions for this role, in one transaction: this is a
    // delete followed by an insert, and a failure between the two would
    // otherwise leave the role holding nothing at all.
    await dataSource.transaction(async (manager) => {
      const rpRepo = manager.getRepository(RolePermission);
      await rpRepo.delete({ roleId: id });

      if (permissionIds.length > 0) {
        await rpRepo.save(
          permissionIds.map((permissionId) =>
            rpRepo.create({ roleId: id, permissionId }),
          ),
        );
      }
    });

    return this.findOneRole(id);
  }

  // ── Permissions catalogue ──────────────────────────────────────────────

  /**
   * Whether a permission is one the application ships and enforces.
   *
   * Derived from the static catalogue rather than a column, so no schema
   * change is needed and the answer cannot drift: a code is a system code
   * exactly when the application knows about it.
   */
  private isSystemPermission(code: string): boolean {
    return PERMISSION_CODES.has(code);
  }

  async findAllPermissions(): Promise<Record<string, PermissionView[]>> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const perms = await dataSource
      .getRepository(Permission)
      .find({ order: { module: 'ASC', permissionName: 'ASC' } });

    return perms.reduce<Record<string, PermissionView[]>>((acc, p) => {
      (acc[p.module] ??= []).push({
        ...p,
        isSystem: this.isSystemPermission(p.permissionCode),
      });
      return acc;
    }, {});
  }

  /**
   * Add a permission of your own.
   *
   * Understand what this does and does not do. A permission only restricts
   * something if a route is guarded by it, and routes are guarded in code —
   * so a code created here is NOT enforced by the API. It is useful for the
   * client: it appears in the user's permission list at login, so the front
   * end can show or hide features with it. It cannot protect an endpoint.
   *
   * To gate an endpoint, the code has to be added to
   * src/common/constants/permissions.ts and used in a @Permissions()
   * decorator, which the startup check then verifies.
   */
  async createPermission(dto: CreatePermissionDto): Promise<PermissionView> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const repo = dataSource.getRepository(Permission);

    const code = dto.permissionCode.trim();

    if (this.isSystemPermission(code)) {
      throw new ConflictException(
        `'${code}' is a built-in permission and already exists`,
      );
    }

    const existing = await repo.findOne({ where: { permissionCode: code } });
    if (existing) {
      throw new ConflictException(`Permission '${code}' already exists`);
    }

    const saved = await repo.save(
      repo.create({
        permissionCode: code,
        permissionName: dto.permissionName,
        module: dto.module,
        description: dto.description,
      }),
    );

    return { ...saved, isSystem: false };
  }

  async updatePermission(
    id: string,
    dto: UpdatePermissionDto,
  ): Promise<PermissionView> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const repo = dataSource.getRepository(Permission);

    const permission = await repo.findOne({ where: { id } });
    if (!permission) throw new NotFoundException(`Permission ${id} not found`);

    // Built-in permissions are owned by the application. Renaming one here
    // would be undone the next time the catalogue sync migration runs, and
    // changing its code would break every route guarded by it.
    if (this.isSystemPermission(permission.permissionCode)) {
      throw new BadRequestException(
        `'${permission.permissionCode}' is a built-in permission and cannot be edited`,
      );
    }

    // The code is the identity other records point at; only the labelling
    // is editable. Delete and recreate to change a code.
    permission.permissionName = dto.permissionName ?? permission.permissionName;
    permission.module = dto.module ?? permission.module;
    permission.description = dto.description ?? permission.description;

    const saved = await repo.save(permission);
    return { ...saved, isSystem: false };
  }

  async deletePermission(id: string): Promise<void> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const repo = dataSource.getRepository(Permission);

    const permission = await repo.findOne({ where: { id } });
    if (!permission) throw new NotFoundException(`Permission ${id} not found`);

    if (this.isSystemPermission(permission.permissionCode)) {
      throw new BadRequestException(
        `'${permission.permissionCode}' is a built-in permission and cannot be deleted`,
      );
    }

    // role_permissions cascades on delete, so any grants of this permission
    // go with it.
    await repo.remove(permission);
  }
}
