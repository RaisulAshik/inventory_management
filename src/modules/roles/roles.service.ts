import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { Role } from '@entities/tenant/role/role.entity';
import { Permission } from '@entities/tenant/role/permission.entity';
import { RolePermission } from '@entities/tenant/role/role-permission.entity';
import { UserRole } from '@entities/tenant/user/user-role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';

@Injectable()
export class RolesService {
  constructor(private readonly tenantConnectionManager: TenantConnectionManager) {}

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
    if (existing) throw new ConflictException(`Role code '${dto.roleCode}' already exists`);
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
    if (role.isSystem) throw new BadRequestException('System roles cannot be deleted');
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const inUse = await dataSource.getRepository(UserRole).count({ where: { roleId: id } });
    if (inUse > 0) throw new BadRequestException(`Role is assigned to ${inUse} user(s) and cannot be deleted`);
    await dataSource.getRepository(Role).remove(role);
  }

  async assignPermissions(id: string, dto: AssignPermissionsDto): Promise<Role> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    await this.findOneRole(id);

    // Validate all permission IDs exist
    if (dto.permissionIds.length > 0) {
      const found = await dataSource.getRepository(Permission)
        .createQueryBuilder('p')
        .where('p.id IN (:...ids)', { ids: dto.permissionIds })
        .getCount();
      if (found !== dto.permissionIds.length) {
        throw new BadRequestException('One or more permission IDs are invalid');
      }
    }

    const rpRepo = dataSource.getRepository(RolePermission);
    // Replace all permissions for this role
    await rpRepo.delete({ roleId: id });
    if (dto.permissionIds.length > 0) {
      const entries = dto.permissionIds.map((permissionId) =>
        rpRepo.create({ roleId: id, permissionId }),
      );
      await rpRepo.save(entries);
    }
    return this.findOneRole(id);
  }

  // ── Permissions catalogue ──────────────────────────────────────────────

  async findAllPermissions(): Promise<Record<string, Permission[]>> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const perms = await dataSource.getRepository(Permission).find({ order: { module: 'ASC', permissionName: 'ASC' } });
    return perms.reduce<Record<string, Permission[]>>((acc, p) => {
      (acc[p.module] ??= []).push(p);
      return acc;
    }, {});
  }
}
