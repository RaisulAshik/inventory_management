import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository, IsNull, DeepPartial } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { Employee } from '@entities/tenant/hr/employee.entity';
import { UserRole } from '@entities/tenant/user/user-role.entity';
import { Permission } from '@entities/tenant/role/permission.entity';
import { RolePermission } from '@entities/tenant/role/role-permission.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResult } from '@common/interfaces';
import { paginate } from '@common/utils/pagination.util';
import { getNextSequence } from '@common/utils/sequence.util';
import { InjectRepository } from '@nestjs/typeorm';
import { TenantUser } from '@/entities/master';

/**
 * Identity operations over `hr_employees`.
 *
 * Employees and users are one record. This service is the login-facing view of
 * a person (credentials, roles, lockout); EmployeesService is the HR-facing
 * view (department, salary, attendance). Both read and write the same rows.
 */
@Injectable()
export class UsersService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
    @InjectRepository(TenantUser, 'master')
    private readonly tenantUserRepository: Repository<TenantUser>,
  ) {}

  private async getUserRepository(): Promise<Repository<Employee>> {
    return this.tenantConnectionManager.getRepository(Employee);
  }

  /**
   * Create a person who can sign in.
   *
   * `employeeCode` is generated when the caller does not supply one, because
   * it is a required unique column on hr_employees.
   */
  async create(
    tenantId: any,
    createUserDto: CreateUserDto & { createdBy?: string } & {
      passwordHash?: string;
    },
  ): Promise<Employee> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const userRepo = dataSource.getRepository(Employee);

    const existingUser = await userRepo.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    let passwordHash = createUserDto.passwordHash;
    if (!passwordHash && createUserDto.password) {
      passwordHash = await bcrypt.hash(createUserDto.password, 10);
    }

    const employeeCode =
      createUserDto.employeeCode ??
      (await getNextSequence(dataSource, 'EMPLOYEE'));

    const user = userRepo.create({
      id: uuidv4(),
      email: createUserDto.email,
      passwordHash,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      employeeCode,
      phone: createUserDto.phone,
      isActive: true,
      // DO NOT include roleIds here
    });

    const savedUser = await userRepo.save(user);

    const tenantUser = this.tenantUserRepository.create({
      tenantId: tenantId,
      email: createUserDto.email.toLowerCase(),
      passwordHash,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      phone: createUserDto.phone,
      isAdmin: false,
      isActive: true,
      emailVerified: false,
    } as DeepPartial<TenantUser>);

    await this.tenantUserRepository.save(tenantUser);

    // Now handle roles separately using your existing method
    if (createUserDto.roleIds?.length) {
      await this.assignRoles(
        savedUser.id,
        createUserDto.roleIds,
        createUserDto?.createdBy,
      );
    }

    return savedUser;
  }

  /**
   * Find all users with pagination.
   *
   * Only people with credentials are listed: an hr_employees row without an
   * email is a payroll-only record, not a user of the system.
   */
  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<Employee>> {
    const userRepo = await this.getUserRepository();

    const queryBuilder = userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userRoles', 'userRoles')
      .leftJoinAndSelect('userRoles.role', 'role')
      .where('user.deletedAt IS NULL')
      .andWhere('user.email IS NOT NULL');

    // Apply search
    if (paginationDto.search) {
      queryBuilder.andWhere(
        '(user.firstName LIKE :search OR user.lastName LIKE :search OR user.email LIKE :search)',
        { search: `%${paginationDto.search}%` },
      );
    }

    // Default sorting
    if (!paginationDto.sortBy) {
      paginationDto.sortBy = 'createdAt';
    }

    return paginate(queryBuilder, paginationDto);
  }

  async findById(id: string): Promise<Employee> {
    const userRepo = await this.getUserRepository();

    const user = await userRepo.findOne({
      where: { id },
      relations: ['userRoles', 'userRoles.role'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<Employee | null> {
    const userRepo = await this.getUserRepository();

    return userRepo.findOne({
      where: { email },
      relations: ['userRoles', 'userRoles.role'],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<Employee> {
    const userRepo = await this.getUserRepository();

    const user = await this.findById(id);

    // Check if email is being changed and already exists
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await userRepo.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }
    }

    // `avatarUrl` is the identity-side name for hr_employees.profile_photo_url.
    const { avatarUrl, ...rest } = updateUserDto;
    Object.assign(user, rest);
    if (avatarUrl !== undefined) {
      user.profilePhotoUrl = avatarUrl;
    }

    return userRepo.save(user);
  }

  async remove(id: string): Promise<void> {
    const userRepo = await this.getUserRepository();
    const user = await this.findById(id);

    user.deletedAt = new Date();
    await userRepo.save(user);
  }

  async hardDelete(id: string): Promise<void> {
    const userRepo = await this.getUserRepository();
    await userRepo.delete(id);
  }

  async getUserRoles(userId: string): Promise<string[]> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const userRoleRepo = dataSource.getRepository(UserRole);

    const userRoles = await userRoleRepo.find({
      where: { userId },
      relations: ['role'],
    });

    return userRoles.map((ur) => ur.role.roleCode);
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

  async updateLastLogin(userId: string, ipAddress: string): Promise<void> {
    const userRepo = await this.getUserRepository();

    await userRepo.update(userId, {
      lastLoginAt: new Date(),
      lastLoginIp: ipAddress,
    });
  }

  async incrementFailedLoginAttempts(userId: string): Promise<void> {
    const userRepo = await this.getUserRepository();
    const user = await this.findById(userId);

    user.failedLoginAttempts += 1;

    // Lock account after 5 failed attempts for 30 minutes
    if (user.failedLoginAttempts >= 5) {
      user.lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
    }

    await userRepo.save(user);
  }

  async resetFailedLoginAttempts(userId: string): Promise<void> {
    const userRepo = await this.getUserRepository();
    const user = await this.findById(userId);

    user.failedLoginAttempts = 0;
    user.lockedUntil = null;

    await userRepo.save(user);
  }

  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    const userRepo = await this.getUserRepository();

    await userRepo.update(userId, {
      passwordHash,
      passwordChangedAt: new Date(),
    });
  }

  async activate(id: string): Promise<Employee> {
    return this.update(id, { isActive: true } as UpdateUserDto);
  }

  async deactivate(id: string): Promise<Employee> {
    return this.update(id, { isActive: false } as UpdateUserDto);
  }

  async count(): Promise<number> {
    const userRepo = await this.getUserRepository();
    return userRepo.count({ where: { deletedAt: IsNull() } });
  }
}
