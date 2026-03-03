import { AdminAuthService } from './admin-auth.service';
import { AdminJwtPayload } from './admin-auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminRegisterDto } from './dto/admin-register.dto';
import { AdminChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { AdminRefreshTokenDto } from './dto/refresh-token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AdminAuthController {
    private readonly adminAuthService;
    constructor(adminAuthService: AdminAuthService);
    login(loginDto: AdminLoginDto): Promise<import("./admin-auth.service").AdminLoginResponse>;
    register(registerDto: AdminRegisterDto): Promise<import("./admin-auth.service").AdminLoginResponse>;
    refreshToken(refreshTokenDto: AdminRefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getProfile(admin: AdminJwtPayload): Promise<any>;
    getUserDetails(admin: AdminJwtPayload): Promise<any>;
    changePassword(admin: AdminJwtPayload, changePasswordDto: AdminChangePasswordDto): Promise<{
        message: string;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
