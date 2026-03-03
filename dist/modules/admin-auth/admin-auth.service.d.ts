import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { TenantUser } from '../../entities/master/tenant-user.entity';
import { Tenant } from '../../entities/master/tenant.entity';
import { TenantDatabase } from '../../entities/master/tenant-database.entity';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminRegisterDto } from './dto/admin-register.dto';
import { ConfigService } from '@nestjs/config';
import { TenantProvisioningService } from './services/tenant-provisioning.service';
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
export declare class AdminAuthService {
    private readonly tenantUserRepository;
    private readonly tenantRepository;
    private readonly tenantDatabaseRepository;
    private readonly jwtService;
    private readonly configService;
    private readonly tenantProvisioningService;
    private readonly logger;
    constructor(tenantUserRepository: Repository<TenantUser>, tenantRepository: Repository<Tenant>, tenantDatabaseRepository: Repository<TenantDatabase>, jwtService: JwtService, configService: ConfigService, tenantProvisioningService: TenantProvisioningService);
    validateUser(email: string, password: string): Promise<TenantUser | null>;
    login(loginDto: AdminLoginDto): Promise<AdminLoginResponse>;
    generateTokens(user: TenantUser, tenant: Tenant, tenantDatabase: TenantDatabase): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    register(registerDto: AdminRegisterDto): Promise<AdminLoginResponse>;
    getProfile(userId: string): Promise<any>;
    getUserDetails(userId: string): Promise<any>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
    forgotPassword(email: string): Promise<void>;
    resetPassword(email: string, token: string, newPassword: string): Promise<void>;
}
