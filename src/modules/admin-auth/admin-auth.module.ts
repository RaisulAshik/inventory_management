// src/modules/admin-auth/admin-auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TenantUser } from '../../entities/master/tenant-user.entity';
import { Tenant } from '../../entities/master/tenant.entity';
import { TenantDatabase } from '../../entities/master/tenant-database.entity';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';
import { AdminJwtStrategy } from './strategies/admin-jwt.strategy';
import { AdminLocalStrategy } from './strategies/admin-local.strategy';
import { TenantProvisioningService } from './services/tenant-provisioning.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'admin-jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get('jwt.expiresIn', '1h'),
        },
      }),
    }),
    // Use the master database connection for admin auth
    TypeOrmModule.forFeature([TenantUser, Tenant, TenantDatabase], 'master'),
  ],
  controllers: [AdminAuthController],
  providers: [
    AdminAuthService,
    AdminJwtStrategy,
    AdminLocalStrategy,
    TenantProvisioningService,
  ],
  exports: [AdminAuthService, TenantProvisioningService],
})
export class AdminAuthModule {}
