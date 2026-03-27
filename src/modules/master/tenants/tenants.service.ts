import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { Tenant } from '@entities/master/tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantFilterDto } from './dto/tenant-filter.dto';
import { PaginatedResult } from '@common/interfaces';
import { TenantStatus, SubscriptionStatus } from '@common/enums';
import { ConfigService } from '@nestjs/config';
import { Subscription } from 'rxjs';
import { TenantDatabase } from '@entities/master/tenant-database.entity';
import { TenantUser } from '@entities/master/tenant-user.entity';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant, 'master')
    private readonly tenantRepository: Repository<Tenant>,
    @InjectRepository(TenantDatabase, 'master')
    private readonly tenantDatabaseRepository: Repository<TenantDatabase>,
    @InjectRepository(TenantUser, 'master')
    private readonly tenantUserRepository: Repository<TenantUser>,
    @InjectRepository(Subscription, 'master')
    private readonly subscriptionRepository: Repository<Subscription>,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Create a new tenant with database and admin user
   */
  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    // Check if tenant code already exists
    const existingCode = await this.tenantRepository.findOne({
      where: { tenantCode: createTenantDto.tenantCode },
    });

    if (existingCode) {
      throw new ConflictException(
        `Tenant with code ${createTenantDto.tenantCode} already exists`,
      );
    }

    // Check if email already exists
    const existingEmail = await this.tenantRepository.findOne({
      where: { email: createTenantDto.email },
    });

    if (existingEmail) {
      throw new ConflictException(
        `Tenant with email ${createTenantDto.email} already exists`,
      );
    }

    // Generate database name
    const databaseName = `tenant_${createTenantDto.tenantCode.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

    // Create tenant
    const tenant = this.tenantRepository.create({
      id: uuidv4(),
      tenantCode: createTenantDto.tenantCode,
      companyName: createTenantDto.companyName,
      displayName: createTenantDto.displayName || createTenantDto.companyName,
      email: createTenantDto.email,
      phone: createTenantDto.phone,
      website: createTenantDto.website,
      addressLine1: createTenantDto.addressLine1,
      addressLine2: createTenantDto.addressLine2,
      city: createTenantDto.city,
      state: createTenantDto.state,
      country: createTenantDto.country || 'Bangladesh',
      postalCode: createTenantDto.postalCode,
      taxId: createTenantDto.taxId,
      industry: createTenantDto.industry,
      employeeCount: createTenantDto.employeeCount,
      timezone: createTenantDto.timezone || 'Asia/Kolkata',
      dateFormat: createTenantDto.dateFormat || 'DD/MM/YYYY',
      currency: createTenantDto.currency || 'INR',
      logoUrl: createTenantDto.logoUrl,
      status: TenantStatus.PENDING,
    } as DeepPartial<Tenant>);

    const savedTenant = await this.tenantRepository.save(tenant);

    // Create tenant database record
    const tenantDatabase = this.tenantDatabaseRepository.create({
      id: uuidv4(),
      tenantId: savedTenant.id,
      databaseName,
      host: this.configService.get('DB_HOST', 'localhost'),
      port: this.configService.get('DB_PORT', 3306),
      username: `tenant_${createTenantDto.tenantCode.toLowerCase()}`,
      isProvisioned: false,
      isActive: false,
    });

    await this.tenantDatabaseRepository.save(tenantDatabase);

    // Create admin user
    const passwordHash = await bcrypt.hash(createTenantDto.adminPassword, 10);

    const adminUser = this.tenantUserRepository.create({
      id: uuidv4(),
      tenantId: savedTenant.id,
      email: createTenantDto.adminEmail || createTenantDto.email,
      passwordHash,
      firstName: createTenantDto.adminFirstName || 'Admin',
      lastName: createTenantDto.adminLastName,
      isAdmin: true,
      isActive: true,
    });

    await this.tenantUserRepository.save(adminUser);

    // Create trial subscription if plan is provided
    if (createTenantDto.planId) {
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 14); // 14-day trial

      const subscription = this.subscriptionRepository.create({
        id: uuidv4(),
        tenantId: savedTenant.id,
        planId: createTenantDto.planId,
        status: SubscriptionStatus.TRIAL,
        startDate: new Date(),
        trialEndDate,
        currentPeriodStart: new Date(),
        currentPeriodEnd: trialEndDate,
      } as DeepPartial<Subscription>);

      await this.subscriptionRepository.save(subscription);
    }

    return this.findById(savedTenant.id);
  }

  /**
   * Provision tenant database
   */
  async provisionDatabase(tenantId: string): Promise<void> {
    const tenant = await this.findById(tenantId);
    const tenantDb = await this.tenantDatabaseRepository.findOne({
      where: { tenantId },
    });

    if (!tenantDb) {
      throw new NotFoundException('Tenant database configuration not found');
    }

    if (tenantDb.isProvisioned) {
      throw new BadRequestException('Database is already provisioned');
    }

    // Here you would typically:
    // 1. Create the database
    // 2. Run migrations
    // 3. Seed initial data
    // For now, we'll just update the status

    // In production, you'd execute SQL like:
    // CREATE DATABASE IF NOT EXISTS ${tenantDb.databaseName};
    // CREATE USER '${tenantDb.username}'@'%' IDENTIFIED BY '${generatedPassword}';
    // GRANT ALL PRIVILEGES ON ${tenantDb.databaseName}.* TO '${tenantDb.username}'@'%';

    tenantDb.isProvisioned = true;
    tenantDb.isActive = true;
    tenantDb.provisionedAt = new Date();
    await this.tenantDatabaseRepository.save(tenantDb);

    // Update tenant status
    tenant.status = TenantStatus.ACTIVE;
    tenant.activatedAt = new Date();
    await this.tenantRepository.save(tenant);
  }

  /**
   * Find all tenants with filters and pagination
   */
  async findAll(
    filterDto: TenantFilterDto,
  ): Promise<PaginatedResult<Tenant>> {
    const queryBuilder = this.tenantRepository
      .createQueryBuilder('tenant')
      .leftJoinAndSelect('tenant.database', 'database')
      .leftJoinAndSelect('tenant.subscription', 'subscription')
      .leftJoinAndSelect('subscription.plan', 'plan');

    // Apply filters
    if (filterDto.status) {
      queryBuilder.andWhere('tenant.status = :status', {
        status: filterDto.status,
      });
    }

    if (filterDto.industry) {
      queryBuilder.andWhere('tenant.industry = :industry', {
        industry: filterDto.industry,
      });
    }

    if (filterDto.country) {
      queryBuilder.andWhere('tenant.country = :country', {
        country: filterDto.country,
      });
    }

    // Apply search
    if (filterDto.search) {
      queryBuilder.andWhere(
        '(tenant.tenantCode LIKE :search OR tenant.companyName LIKE :search OR tenant.email LIKE :search)',
        { search: `%${filterDto.search}%` },
      );
    }

    // Apply sorting
    const sortBy = filterDto.sortBy || 'createdAt';
    const sortOrder =
      filterDto.sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    queryBuilder.orderBy(`tenant.${sortBy}`, sortOrder);

    // Get total count
    const total = await queryBuilder.getCount();

    // Apply pagination
    const page = filterDto.page || 1;
    const limit = filterDto.limit || 20;
    queryBuilder.skip((page - 1) * limit).take(limit);

    const data = await queryBuilder.getMany();

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    };
  }

  /**
   * Find tenant by ID
   */
  async findById(id: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({
      where: { id },
      relations: ['database', 'subscription', 'subscription.plan', 'users'],
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }

    return tenant;
  }

  /**
   * Find tenant by code
   */
  async findByCode(code: string): Promise<Tenant | null> {
    return this.tenantRepository.findOne({
      where: { tenantCode: code },
      relations: ['database', 'subscription'],
    });
  }

  /**
   * Find tenant by email
   */
  async findByEmail(email: string): Promise<Tenant | null> {
    return this.tenantRepository.findOne({
      where: { email },
    });
  }

  /**
   * Update tenant
   */
  async update(id: string, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    const tenant = await this.findById(id);

    // Check code uniqueness if being changed
    if (
      updateTenantDto.tenantCode &&
      updateTenantDto.tenantCode !== tenant.tenantCode
    ) {
      const existingCode = await this.tenantRepository.findOne({
        where: { tenantCode: updateTenantDto.tenantCode },
      });

      if (existingCode) {
        throw new ConflictException(
          `Tenant with code ${updateTenantDto.tenantCode} already exists`,
        );
      }
    }

    Object.assign(tenant, updateTenantDto);
    await this.tenantRepository.save(tenant);

    return this.findById(id);
  }

  /**
   * Activate tenant
   */
  async activate(id: string): Promise<Tenant> {
    const tenant = await this.findById(id);

    if (tenant.status === TenantStatus.ACTIVE) {
      throw new BadRequestException('Tenant is already active');
    }

    // Check if database is provisioned
    if (!tenant.database?.isProvisioned) {
      throw new BadRequestException(
        'Database must be provisioned before activation',
      );
    }

    tenant.status = TenantStatus.ACTIVE;
    tenant.activatedAt = new Date();
    await this.tenantRepository.save(tenant);

    return this.findById(id);
  }

  /**
   * Suspend tenant
   */
  async suspend(id: string, reason: string): Promise<Tenant> {
    const tenant = await this.findById(id);

    if (tenant.status === TenantStatus.SUSPENDED) {
      throw new BadRequestException('Tenant is already suspended');
    }

    tenant.status = TenantStatus.SUSPENDED;
    tenant.suspendedAt = new Date();
    tenant.suspendedReason = reason;
    await this.tenantRepository.save(tenant);

    // Deactivate database
    if (tenant.database) {
      tenant.database.isActive = false;
      await this.tenantDatabaseRepository.save(tenant.database);
    }

    return this.findById(id);
  }

  /**
   * Reactivate suspended tenant
   */
  async reactivate(id: string): Promise<Tenant> {
    const tenant = await this.findById(id);

    if (tenant.status !== TenantStatus.SUSPENDED) {
      throw new BadRequestException('Tenant is not suspended');
    }

    tenant.status = TenantStatus.ACTIVE;
    await this.tenantRepository.save(tenant);

    // Reactivate database
    if (tenant.database) {
      tenant.database.isActive = true;
      await this.tenantDatabaseRepository.save(tenant.database);
    }

    return this.findById(id);
  }

  /**
   * Delete tenant (soft delete)
   */
  async remove(id: string): Promise<void> {
    const tenant = await this.findById(id);

    tenant.status = TenantStatus.DELETED;
    tenant.deletedAt = new Date();
    await this.tenantRepository.save(tenant);

    // Deactivate database
    if (tenant.database) {
      tenant.database.isActive = false;
      await this.tenantDatabaseRepository.save(tenant.database);
    }
  }

  /**
   * Get tenant users
   */
  async getUsers(tenantId: string): Promise<TenantUser[]> {
    return this.tenantUserRepository.find({
      where: { tenantId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Add user to tenant
   */
  async addUser(
    tenantId: string,
    userData: {
      email: string;
      password: string;
      firstName: string;
      lastName?: string;
      isAdmin?: boolean;
    },
  ): Promise<TenantUser> {
    // Verify tenant exists
    await this.findById(tenantId);

    // Check if email already exists for this tenant
    const existingUser = await this.tenantUserRepository.findOne({
      where: { tenantId, email: userData.email },
    });

    if (existingUser) {
      throw new ConflictException(
        'User with this email already exists for this tenant',
      );
    }

    const passwordHash = await bcrypt.hash(userData.password, 10);

    const user = this.tenantUserRepository.create({
      id: uuidv4(),
      tenantId,
      email: userData.email,
      passwordHash,
      firstName: userData.firstName,
      lastName: userData.lastName,
      isAdmin: userData.isAdmin || false,
      isActive: true,
    });

    return this.tenantUserRepository.save(user);
  }

  /**
   * Get tenant statistics
   */
  async getStatistics(): Promise<any> {
    const total = await this.tenantRepository.count();
    const active = await this.tenantRepository.count({
      where: { status: TenantStatus.ACTIVE },
    });
    const suspended = await this.tenantRepository.count({
      where: { status: TenantStatus.SUSPENDED },
    });
    const pending = await this.tenantRepository.count({
      where: { status: TenantStatus.PENDING },
    });

    // Get tenants by industry
    const byIndustry = await this.tenantRepository
      .createQueryBuilder('tenant')
      .select('tenant.industry', 'industry')
      .addSelect('COUNT(*)', 'count')
      .where('tenant.industry IS NOT NULL')
      .groupBy('tenant.industry')
      .getRawMany();

    // Get recent signups
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSignups = await this.tenantRepository.count({
      where: {
        createdAt: thirtyDaysAgo as any, // Using 'any' to bypass type checking for date comparison
      },
    });

    return {
      total,
      active,
      suspended,
      pending,
      recentSignups,
      byIndustry,
    };
  }
}
