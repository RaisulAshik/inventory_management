import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from '@modules/users/users.service';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { User } from '@entities/tenant/user/user.entity';
import { UserSession } from '@entities/tenant/user/user-session.entity';
import { JwtPayload } from '@common/interfaces';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  /**
   * Validate user credentials
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return null;
    }

    // Check if account is locked
    if (user.isLocked) {
      throw new UnauthorizedException(
        'Account is temporarily locked. Please try again later.',
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      // Increment failed login attempts
      await this.usersService.incrementFailedLoginAttempts(user.id);
      return null;
    }

    // Reset failed login attempts on successful login
    if (user.failedLoginAttempts > 0) {
      await this.usersService.resetFailedLoginAttempts(user.id);
    }

    return user;
  }

  /**
   * Login user
   */
  async login(loginDto: LoginDto, ipAddress: string, userAgent: string) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is disabled');
    }

    // Get user roles and permissions
    const roles = await this.usersService.getUserRoles(user.id);
    const permissions = await this.usersService.getUserPermissions(user.id);

    // Generate tokens
    const tokens = await this.generateTokens(user, roles, permissions);
    console.log(roles, 'user roles');
    // Create session
    await this.createSession(
      user.id,
      tokens.accessToken,
      tokens.refreshToken,
      ipAddress,
      userAgent,
    );

    // Update last login
    await this.usersService.updateLastLogin(user.id, ipAddress);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        roles,
        permissions,
      },
      tokens,
    };
  }

  /**
   * Register new user
   */
  async register(tenantId: any, registerDto: RegisterDto) {
    // Check if email already exists
    const existingUser = await this.usersService.findByEmail(registerDto.email);

    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    // Hash password
    const saltRounds = this.configService.get('BCRYPT_SALT_ROUNDS', 10);
    const passwordHash = await bcrypt.hash(registerDto.password, saltRounds);

    // Create user
    const user = await this.usersService.create(tenantId, {
      ...registerDto,
      passwordHash,
    });

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;

    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('jwt.secret'),
      });

      // Check if session exists
      const dataSource = await this.tenantConnectionManager.getDataSource();
      const sessionRepo = dataSource.getRepository(UserSession);

      const refreshTokenHash = await this.hashToken(refreshToken);
      const session = await sessionRepo.findOne({
        where: {
          userId: payload.sub,
          refreshTokenHash,
        },
      });

      if (!session || session.refreshExpiresAt < new Date()) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      // Get user
      const user = await this.usersService.findById(payload.sub);

      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or inactive');
      }

      // Get roles and permissions
      const roles = await this.usersService.getUserRoles(user.id);
      const permissions = await this.usersService.getUserPermissions(user.id);

      // Generate new tokens
      const tokens = await this.generateTokens(user, roles, permissions);

      // Update session
      session.tokenHash = await this.hashToken(tokens.accessToken);
      session.refreshTokenHash = await this.hashToken(tokens.refreshToken);
      session.expiresAt = new Date(
        Date.now() + this.getTokenExpirationMs('access'),
      );
      session.refreshExpiresAt = new Date(
        Date.now() + this.getTokenExpirationMs('refresh'),
      );
      session.lastActivityAt = new Date();

      await sessionRepo.save(session);

      return { tokens };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  /**
   * Logout user
   */
  async logout(userId: string, accessToken: string) {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const sessionRepo = dataSource.getRepository(UserSession);

    const tokenHash = await this.hashToken(accessToken);

    await sessionRepo.delete({
      userId,
      tokenHash,
    });

    return { message: 'Logged out successfully' };
  }

  /**
   * Logout from all devices
   */
  async logoutAll(userId: string) {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const sessionRepo = dataSource.getRepository(UserSession);

    await sessionRepo.delete({ userId });

    return { message: 'Logged out from all devices' };
  }

  /**
   * Change password
   */
  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.passwordHash,
    );

    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const saltRounds = this.configService.get('BCRYPT_SALT_ROUNDS', 10);
    const newPasswordHash = await bcrypt.hash(
      changePasswordDto.newPassword,
      saltRounds,
    );

    // Update password
    await this.usersService.updatePassword(userId, newPasswordHash);

    // Logout from all devices
    await this.logoutAll(userId);

    return { message: 'Password changed successfully. Please login again.' };
  }

  /**
   * Generate access and refresh tokens
   */
  private async generateTokens(
    user: User,
    roles: string[],
    permissions: string[],
  ) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      tenantId: '', // Will be set from request
      roles,
      permissions,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: await this.configService.get('jwt.accessExpiration'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: await this.configService.get('jwt.refreshExpiration'),
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: this.getTokenExpirationMs('access'),
    };
  }

  /**
   * Create user session
   */
  private async createSession(
    userId: string,
    accessToken: string,
    refreshToken: string,
    ipAddress: string,
    userAgent: string,
  ) {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const sessionRepo = dataSource.getRepository(UserSession);

    const session = sessionRepo.create({
      id: uuidv4(),
      userId,
      tokenHash: await this.hashToken(accessToken),
      refreshTokenHash: await this.hashToken(refreshToken),
      ipAddress,
      deviceType: this.parseDeviceType(userAgent),
      browser: this.parseBrowser(userAgent),
      os: this.parseOS(userAgent),
      expiresAt: new Date(Date.now() + this.getTokenExpirationMs('access')),
      refreshExpiresAt: new Date(
        Date.now() + this.getTokenExpirationMs('refresh'),
      ),
      lastActivityAt: new Date(),
    });

    await sessionRepo.save(session);
  }

  /**
   * Hash token for storage
   */
  private async hashToken(token: string): Promise<string> {
    const crypto = await import('crypto');
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Get token expiration in milliseconds
   */
  private getTokenExpirationMs(type: 'access' | 'refresh'): number {
    const expiration = this.configService.get(
      type === 'access' ? 'jwt.accessExpiration' : 'jwt.refreshExpiration',
    );

    // Parse expiration string (e.g., '15m', '7d')
    const match = expiration.match(/^(\d+)([smhd])$/);
    if (!match) return 900000; // Default 15 minutes

    const value = parseInt(match[1], 10);
    const unit = match[2];

    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return value * (multipliers[unit] || 60000);
  }

  /**
   * Parse device type from user agent
   */
  private parseDeviceType(userAgent: string): string {
    if (/mobile/i.test(userAgent)) return 'MOBILE';
    if (/tablet/i.test(userAgent)) return 'TABLET';
    return 'DESKTOP';
  }

  /**
   * Parse browser from user agent
   */
  private parseBrowser(userAgent: string): string {
    if (/chrome/i.test(userAgent)) return 'Chrome';
    if (/firefox/i.test(userAgent)) return 'Firefox';
    if (/safari/i.test(userAgent)) return 'Safari';
    if (/edge/i.test(userAgent)) return 'Edge';
    return 'Unknown';
  }

  /**
   * Parse OS from user agent
   */
  private parseOS(userAgent: string): string {
    if (/windows/i.test(userAgent)) return 'Windows';
    if (/mac/i.test(userAgent)) return 'macOS';
    if (/linux/i.test(userAgent)) return 'Linux';
    if (/android/i.test(userAgent)) return 'Android';
    if (/ios/i.test(userAgent)) return 'iOS';
    return 'Unknown';
  }
}
