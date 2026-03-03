import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository, IsNull, DeepPartial } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { User } from '@entities/tenant/user/user.entity';
//import { Role } from '@entities/tenant/role/role.entity';
import { UserRole } from '@entities/tenant/user/user-role.entity';
import { Permission } from '@entities/tenant/role/permission.entity';
import { RolePermission } from '@entities/tenant/role/role-permission.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResult } from '@common/interfaces';
import { paginate } from '@common/utils/pagination.util';
import { InjectRepository } from '@nestjs/typeorm';
import { TenantUser } from '@/entities/master';

@Injectable()
export class UsersService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
    @InjectRepository(TenantUser, 'master')
    private readonly tenantUserRepository: Repository<TenantUser>,
  ) {}

  /**
   * Get user repository for current tenant
   */
  private async getUserRepository(): Promise<Repository<User>> {
    return this.tenantConnectionManager.getRepository(User);
  }

  /**
   * Create new user
   */
  async create(
    tenantId: any,
    createUserDto: CreateUserDto & { createdBy?: string } & {
      passwordHash?: string;
    },
  ): Promise<User> {
    const userRepo = await this.getUserRepository();

    // Check if email already exists
    const existingUser = await userRepo.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // Hash password if not already hashed
    let passwordHash = createUserDto.passwordHash;
    if (!passwordHash && createUserDto.password) {
      passwordHash = await bcrypt.hash(createUserDto.password, 10);
    }

    const user = userRepo.create({
      id: uuidv4(),
      email: createUserDto.email,
      passwordHash,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      employeeCode: createUserDto.employeeCode,
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

    //turn userRepo.save(user);
  }

  /**
   * Find all users with pagination
   */
  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<User>> {
    const userRepo = await this.getUserRepository();

    const queryBuilder = userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userRoles', 'userRoles')
      .leftJoinAndSelect('userRoles.role', 'role')
      .where('user.deletedAt IS NULL');

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

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User> {
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

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    const userRepo = await this.getUserRepository();

    return userRepo.findOne({
      where: { email },
      relations: ['userRoles', 'userRoles.role'],
    });
  }

  /**
   * Update user
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
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

    Object.assign(user, updateUserDto);
    return userRepo.save(user);
  }

  /**
   * Soft delete user
   */
  async remove(id: string): Promise<void> {
    const userRepo = await this.getUserRepository();
    const user = await this.findById(id);

    user.deletedAt = new Date();
    await userRepo.save(user);
  }

  /**
   * Hard delete user
   */
  async hardDelete(id: string): Promise<void> {
    const userRepo = await this.getUserRepository();
    await userRepo.delete(id);
  }

  /**
   * Get user roles
   */
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
   * Get user permissions
   */
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
   * Assign roles to user
   */
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

  /**
   * Update last login
   */
  async updateLastLogin(userId: string, ipAddress: string): Promise<void> {
    const userRepo = await this.getUserRepository();

    await userRepo.update(userId, {
      lastLoginAt: new Date(),
      lastLoginIp: ipAddress,
    });
  }

  /**
   * Increment failed login attempts
   */
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

  /**
   * Reset failed login attempts
   */
  async resetFailedLoginAttempts(userId: string): Promise<void> {
    const userRepo = await this.getUserRepository();
    const user = await this.findById(userId);

    user.failedLoginAttempts = 0;
    user.lockedUntil = null;

    await userRepo.save(user);
  }

  /**
   * Update password
   */
  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    const userRepo = await this.getUserRepository();

    await userRepo.update(userId, {
      passwordHash,
      passwordChangedAt: new Date(),
    });
  }

  /**
   * Activate user
   */
  async activate(id: string): Promise<User> {
    return this.update(id, { isActive: true } as UpdateUserDto);
  }

  /**
   * Deactivate user
   */
  async deactivate(id: string): Promise<User> {
    return this.update(id, { isActive: false } as UpdateUserDto);
  }

  /**
   * Count users
   */
  async count(): Promise<number> {
    const userRepo = await this.getUserRepository();
    return userRepo.count({ where: { deletedAt: IsNull() } });
  }
}
