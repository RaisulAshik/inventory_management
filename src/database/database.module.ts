import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TenantConnectionManager } from './tenant-connection.manager';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [TenantConnectionManager],
  exports: [TenantConnectionManager],
})
export class DatabaseModule {}
