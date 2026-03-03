// src/modules/admin-auth/admin-auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AdminAuthService } from './admin-auth.service';
import { AdminJwtPayload } from './admin-auth.service';
import { CurrentAdmin } from './decorators/current-admin.decorator';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminRegisterDto } from './dto/admin-register.dto';
import { AdminChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { AdminRefreshTokenDto } from './dto/refresh-token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AdminJwtAuthGuard } from './guards/admin-jwt-auth.guard';
import { Public } from '@/common/decorators';

@ApiTags('Admin Authentication')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin login' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIs...',
        refreshToken: 'eyJhbGciOiJIUzI1NiIs...',
        user: {
          id: 'uuid',
          email: 'admin@example.com',
          firstName: 'John',
          lastName: 'Doe',
          isAdmin: true,
        },
        tenant: {
          id: 'uuid',
          tenantCode: 'ACME',
          companyName: 'Acme Corp',
          status: 'ACTIVE',
          database: 'erp_tenant_acme',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: AdminLoginDto) {
    return this.adminAuthService.login(loginDto);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register new tenant with admin user' })
  @ApiResponse({
    status: 201,
    description: 'Registration successful',
  })
  @ApiResponse({
    status: 409,
    description: 'Tenant code or email already exists',
  })
  async register(@Body() registerDto: AdminRegisterDto) {
    return this.adminAuthService.register(registerDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshToken(@Body() refreshTokenDto: AdminRefreshTokenDto) {
    return this.adminAuthService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Get('profile')
  @UseGuards(AdminJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get admin profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@CurrentAdmin() admin: AdminJwtPayload) {
    return this.adminAuthService.getProfile(admin.sub);
  }

  @Get('user-details')
  @UseGuards(AdminJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get admin user details' })
  @ApiResponse({
    status: 200,
    description: 'User details retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserDetails(@CurrentAdmin() admin: AdminJwtPayload) {
    return this.adminAuthService.getUserDetails(admin.sub);
  }

  @Post('change-password')
  @UseGuards(AdminJwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid current password' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async changePassword(
    @CurrentAdmin() admin: AdminJwtPayload,
    @Body() changePasswordDto: AdminChangePasswordDto,
  ) {
    await this.adminAuthService.changePassword(
      admin.sub,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
    return { message: 'Password changed successfully' };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({
    status: 200,
    description: 'Reset email sent if account exists',
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.adminAuthService.forgotPassword(forgotPasswordDto.email);
    return {
      message:
        'If your email is registered, you will receive a password reset link',
    };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.adminAuthService.resetPassword(
      resetPasswordDto.email,
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
    return { message: 'Password has been reset successfully' };
  }

  //   @Post('logout')
  //   @UseGuards(AdminJwtAuthGuard)
  //   @ApiBearerAuth()
  //   @HttpCode(HttpStatus.OK)
  //   @ApiOperation({ summary: 'Logout' })
  //   @ApiResponse({ status: 200, description: 'Logged out successfully' })
  //   async logout(@CurrentUser() user: JwtPayload, @Req() req: Request) {
  //     // In a production app, you might want to:
  //     // 1. Add the token to a blacklist
  //     // 2. Clear refresh tokens from DB
  //     // const token: any = req.headers.authorization?.replace('Bearer ', '');
  //     // return this.authService.logout(user.sub, token);
  //     return { message: 'Logged out successfully' };
  //   }
}
