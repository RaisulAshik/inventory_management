import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from '@database/database.module';
import { TenantUser } from '@/entities/master';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantMiddleware } from '@/common/middleware/tenant.middleware';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([TenantUser], 'master')],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
