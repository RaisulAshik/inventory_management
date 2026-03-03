import { Request } from 'express';
import { AuthService } from './auth.service';
import { JwtPayload } from '@common/interfaces';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto, req: Request): Promise<{
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
    register(req: any, registerDto: RegisterDto): Promise<{
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
    logout(user: JwtPayload, req: Request): Promise<{
        message: string;
    }>;
    logoutAll(user: JwtPayload): Promise<{
        message: string;
    }>;
    changePassword(user: JwtPayload, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
