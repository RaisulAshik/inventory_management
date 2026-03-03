import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@modules/users/users.service';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { User } from '@entities/tenant/user/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private readonly jwtService;
    private readonly configService;
    private readonly usersService;
    private readonly tenantConnectionManager;
    constructor(jwtService: JwtService, configService: ConfigService, usersService: UsersService, tenantConnectionManager: TenantConnectionManager);
    validateUser(email: string, password: string): Promise<User | null>;
    login(loginDto: LoginDto, ipAddress: string, userAgent: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            fullName: string;
            roles: string[];
            permissions: string[];
        };
        tokens: {
            accessToken: string;
            refreshToken: string;
            expiresIn: number;
        };
    }>;
    register(tenantId: any, registerDto: RegisterDto): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    }>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
        tokens: {
            accessToken: string;
            refreshToken: string;
            expiresIn: number;
        };
    }>;
    logout(userId: string, accessToken: string): Promise<{
        message: string;
    }>;
    logoutAll(userId: string): Promise<{
        message: string;
    }>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    private generateTokens;
    private createSession;
    private hashToken;
    private getTokenExpirationMs;
    private parseDeviceType;
    private parseBrowser;
    private parseOS;
}
