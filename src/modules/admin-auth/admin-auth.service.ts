// src/modules/admin-auth/admin-auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { TenantUser } from '../../entities/master/tenant-user.entity';
import { Tenant } from '../../entities/master/tenant.entity';
import { TenantDatabase } from '../../entities/master/tenant-database.entity';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminRegisterDto } from './dto/admin-register.dto';
import { ConfigService } from '@nestjs/config';
import { TenantProvisioningService } from './services/tenant-provisioning.service';
import { TenantStatus } from '@/common/enums';

export interface AdminJwtPayload {
  sub: string;
  email: string;
  tenantId: string;
  tenantCode: string;
  tenantDatabase: string;
  isAdmin: boolean;
  type: 'admin';
}

export interface AdminLoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isAdmin: boolean;
  };
  tenant: {
    id: string;
    tenantCode: string;
    companyName: string;
    status: string;
    database: string;
  };
}

@Injectable()
export class AdminAuthService {
  private readonly logger = new Logger(AdminAuthService.name);

  constructor(
    @InjectRepository(TenantUser, 'master')
    private readonly tenantUserRepository: Repository<TenantUser>,
    @InjectRepository(Tenant, 'master')
    private readonly tenantRepository: Repository<Tenant>,
    @InjectRepository(TenantDatabase, 'master')
    private readonly tenantDatabaseRepository: Repository<TenantDatabase>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tenantProvisioningService: TenantProvisioningService,
  ) {}

  /**
   * Validate admin user credentials
   */
  async validateUser(
    email: string,
    password: string,
  ): Promise<TenantUser | null> {
    const user = await this.tenantUserRepository.findOne({
      where: { email: email.toLowerCase() },
      relations: ['tenant'],
    });

    if (!user) {
      return null;
    }

    // Check if account is locked
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      throw new UnauthorizedException(
        `Account is locked. Please try again after ${user.lockedUntil.toLocaleString()}`,
      );
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      // Increment failed login attempts
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

      // Lock account after 5 failed attempts for 15 minutes
      if (user.failedLoginAttempts >= 5) {
        user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
      }

      await this.tenantUserRepository.save(user);
      return null;
    }

    // Reset failed attempts on successful login
    if (user.failedLoginAttempts > 0) {
      user.failedLoginAttempts = 0;
      user.lockedUntil = null;
      await this.tenantUserRepository.save(user);
    }

    return user;
  }

  /**
   * Admin login - authenticates against Master DB
   */
  async login(loginDto: AdminLoginDto): Promise<AdminLoginResponse> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Your account has been deactivated');
    }

    // Check if tenant exists and is active
    const tenant = await this.tenantRepository.findOne({
      where: { id: user.tenantId },
    });

    if (!tenant) {
      throw new UnauthorizedException('Tenant not found');
    }

    if (
      tenant.status !== TenantStatus.ACTIVE &&
      tenant.status !== TenantStatus.PENDING
    ) {
      throw new UnauthorizedException(
        `Tenant account is ${tenant.status.toLowerCase()}. Please contact support.`,
      );
    }

    // Get tenant database info
    const tenantDatabase = await this.tenantDatabaseRepository.findOne({
      where: { tenantId: tenant.id },
    });

    if (!tenantDatabase) {
      throw new UnauthorizedException(
        'Tenant database configuration not found',
      );
    }

    if (!tenantDatabase.isProvisioned || !tenantDatabase.isActive) {
      throw new UnauthorizedException(
        'Tenant database is not ready. Please contact support.',
      );
    }

    // Update last login
    user.lastLoginAt = new Date();
    await this.tenantUserRepository.save(user);

    // Generate tokens
    const tokens = await this.generateTokens(user, tenant, tenantDatabase);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin,
      },
      tenant: {
        id: tenant.id,
        tenantCode: tenant.tenantCode,
        companyName: tenant.companyName,
        status: tenant.status,
        database: tenantDatabase.databaseName,
      },
    };
  }

  /**
   * Generate access and refresh tokens
   */
  async generateTokens(
    user: TenantUser,
    tenant: Tenant,
    tenantDatabase: TenantDatabase,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: AdminJwtPayload = {
      sub: user.id,
      email: user.email,
      tenantId: tenant.id,
      tenantCode: tenant.tenantCode,
      tenantDatabase: tenantDatabase.databaseName,
      isAdmin: user.isAdmin,
      type: 'admin',
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get<any>('jwt.expiresIn', '1h'),
      }),
      this.jwtService.signAsync(
        { ...payload, tokenType: 'refresh' },
        {
          expiresIn: this.configService.get<any>('jwt.refreshExpiresIn', '7d'),
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  /**
   * Refresh access token
   */
  async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = await this.jwtService.verifyAsync<
        AdminJwtPayload & { tokenType?: string }
      >(refreshToken);

      if (payload.tokenType !== 'refresh') {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.tenantUserRepository.findOne({
        where: { id: payload.sub },
        relations: ['tenant'],
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or inactive');
      }

      const tenant = await this.tenantRepository.findOne({
        where: { id: payload.tenantId },
      });

      const tenantDatabase = await this.tenantDatabaseRepository.findOne({
        where: { tenantId: payload.tenantId },
      });

      if (!tenant || !tenantDatabase) {
        throw new UnauthorizedException('Tenant not found');
      }

      return this.generateTokens(user, tenant, tenantDatabase);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  /**
   * Register new tenant with admin user
   * This creates:
   * 1. Tenant record
   * 2. Tenant database record
   * 3. Actual MySQL database
   * 4. All tenant tables
   * 5. Seed data
   * 6. Admin user
   */
  async register(registerDto: AdminRegisterDto): Promise<AdminLoginResponse> {
    this.logger.log(
      `Starting tenant registration for: ${registerDto.tenantCode}`,
    );

    // Check if tenant code already exists
    const existingTenant = await this.tenantRepository.findOne({
      where: { tenantCode: registerDto.tenantCode.toUpperCase() },
    });

    if (existingTenant) {
      throw new ConflictException('Tenant code already exists');
    }

    // Check if email already exists
    const existingUser = await this.tenantUserRepository.findOne({
      where: { email: registerDto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Generate database name
    const databaseName = `erp_tenant_${registerDto.tenantCode.toLowerCase()}`;

    try {
      // Step 1: Create tenant record
      this.logger.log('Creating tenant record...');
      const tenant = this.tenantRepository.create({
        tenantCode: registerDto.tenantCode.toUpperCase(),
        companyName: registerDto.companyName,
        email: registerDto.email.toLowerCase(),
        phone: registerDto.phone,
        industry: registerDto.industry,
        country: registerDto.country || 'India',
        timezone: registerDto.timezone || 'Asia/Kolkata',
        currency: registerDto.currency || 'INR',
        status: 'PENDING',
      } as DeepPartial<Tenant>);

      const savedTenant = await this.tenantRepository.save(tenant);
      this.logger.log(`Tenant created with ID: ${savedTenant.id}`);

      // Step 2: Create tenant database record
      this.logger.log('Creating tenant database record...');
      const tenantDatabase = this.tenantDatabaseRepository.create({
        tenantId: savedTenant.id,
        databaseName,
        host: this.configService.get<string>('masterDb.host', 'localhost'),
        port: this.configService.get<number>('masterDb.port', 3306),
        username: this.configService.get<string>('masterDb.username', 'root'),
        isProvisioned: false,
        isActive: false,
      });

      const savedTenantDatabase =
        await this.tenantDatabaseRepository.save(tenantDatabase);
      this.logger.log(`Tenant database record created: ${databaseName}`);

      // Step 3: Create actual database and run migrations
      this.logger.log('Provisioning tenant database...');
      await this.tenantProvisioningService.provisionTenant(databaseName);

      // Step 4: Update tenant database record as provisioned
      savedTenantDatabase.isProvisioned = true;
      savedTenantDatabase.isActive = true;
      savedTenantDatabase.provisionedAt = new Date();
      await this.tenantDatabaseRepository.save(savedTenantDatabase);
      this.logger.log('Tenant database provisioned and activated');

      // Step 5: Create admin user
      this.logger.log('Creating admin user...');
      const passwordHash = await bcrypt.hash(registerDto.password, 10);

      const user = this.tenantUserRepository.create({
        tenantId: savedTenant.id,
        email: registerDto.email.toLowerCase(),
        passwordHash,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        phone: registerDto.phone,
        isAdmin: true,
        isActive: true,
        emailVerified: false,
      } as DeepPartial<TenantUser>);

      const savedUser = await this.tenantUserRepository.save(user);
      this.logger.log(`Admin user created: ${savedUser.email}`);

      // Step 6: Activate tenant
      savedTenant.status = TenantStatus.ACTIVE;
      savedTenant.activatedAt = new Date();
      await this.tenantRepository.save(savedTenant);
      this.logger.log('Tenant activated');

      // Step 7: Generate tokens and return response
      const tokens = await this.generateTokens(
        savedUser,
        savedTenant,
        savedTenantDatabase,
      );

      this.logger.log(
        `Tenant registration completed: ${registerDto.tenantCode}`,
      );

      return {
        ...tokens,
        user: {
          id: savedUser.id,
          email: savedUser.email,
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          isAdmin: savedUser.isAdmin,
        },
        tenant: {
          id: savedTenant.id,
          tenantCode: savedTenant.tenantCode,
          companyName: savedTenant.companyName,
          status: savedTenant.status,
          database: savedTenantDatabase.databaseName,
        },
      };
    } catch (error: any) {
      this.logger.error(
        `Tenant registration failed: ${error.message}`,
        error.stack,
      );

      // Cleanup on failure - try to remove the database if it was created
      try {
        await this.tenantProvisioningService.dropTenantDatabase(databaseName);
      } catch (cleanupError: any) {
        this.logger.warn(`Cleanup failed: ${cleanupError.message}`);
      }

      // Remove tenant and database records
      await this.tenantDatabaseRepository.delete({ databaseName });
      await this.tenantRepository.delete({
        tenantCode: registerDto.tenantCode.toUpperCase(),
      });

      throw error;
    }
  }

  /**
   * Get admin profile
   */
  async getProfile(userId: string): Promise<any> {
    const user = await this.tenantUserRepository.findOne({
      where: { id: userId },
      relations: ['tenant'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const tenantDatabase = await this.tenantDatabaseRepository.findOne({
      where: { tenantId: user.tenantId },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        //phone: user.phone,
        isAdmin: user.isAdmin,
        //emailVerified: user.emailVerified,
        lastLoginAt: user.lastLoginAt,
      },
      tenant: {
        id: user.tenant.id,
        tenantCode: user.tenant.tenantCode,
        companyName: user.tenant.companyName,
        email: user.tenant.email,
        status: user.tenant.status,
        database: tenantDatabase?.databaseName,
      },
    };
  }
  async getUserDetails(userId: string): Promise<any> {
    const user = await this.tenantUserRepository.findOne({
      where: { id: userId },
      relations: ['tenant'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const tenantDatabase = await this.tenantDatabaseRepository.findOne({
      where: { tenantId: user.tenantId },
    });

    return {
      lastSelectedCompany: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          //phone: user.phone,
          isAdmin: user.isAdmin,
          //emailVerified: user.emailVerified,
          lastLoginAt: user.lastLoginAt,
        },
        tenant: {
          id: user.tenant.id,
          tenantCode: user.tenant.tenantCode,
          companyName: user.tenant.companyName,
          email: user.tenant.email,
          status: user.tenant.status,
          database: tenantDatabase?.databaseName,
        },
      },
    };
  }

  /**
   * Change password
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.tenantUserRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await this.tenantUserRepository.save(user);
  }

  /**
   * Forgot password
   */
  async forgotPassword(email: string): Promise<void> {
    const user = await this.tenantUserRepository.findOne({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return; // Don't reveal if email exists
    }

    const resetToken = await bcrypt.hash(Date.now().toString(), 10);
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await this.tenantUserRepository.save(user);

    // TODO: Send email with reset link
    this.logger.log(`Password reset requested for: ${email}`);
  }

  /**
   * Reset password
   */
  async resetPassword(
    email: string,
    token: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.tenantUserRepository.findOne({
      where: { email: email.toLowerCase() },
    });

    if (!user || !user.passwordResetToken || !user.passwordResetExpires) {
      throw new BadRequestException('Invalid reset request');
    }

    if (new Date() > user.passwordResetExpires) {
      throw new BadRequestException('Password reset token has expired');
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    //user.passwordResetToken = null;
    // user.passwordResetExpires = null;
    user.failedLoginAttempts = 0;
    user.lockedUntil = null;
    await this.tenantUserRepository.save(user);
  }
}
