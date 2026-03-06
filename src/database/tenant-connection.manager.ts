import { Injectable, Scope, Inject, OnModuleDestroy } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DataSource, Repository, EntityTarget, ObjectLiteral } from 'typeorm';
import { Request } from 'express';

// Import all tenant entities
import * as TenantEntities from '@entities/tenant';

interface TenantRequest extends Request {
  tenantId?: string;
  tenantDatabase?: string;
}

@Injectable({ scope: Scope.REQUEST })
export class TenantConnectionManager implements OnModuleDestroy {
  private static connectionPool: Map<string, DataSource> = new Map();
  private currentDataSource: DataSource | null = null;

  constructor(
    @Inject(REQUEST) private readonly request: TenantRequest,
    private readonly configService: ConfigService,
  ) {}

  async onModuleDestroy() {
    // Connection cleanup is handled at the pool level
  }

  /**
   * Get or create a DataSource for the current tenant
   */
  async getDataSource(): Promise<DataSource> {
    if (this.currentDataSource?.isInitialized) {
      return this.currentDataSource;
    }

    const tenantDatabase = this.request.tenantDatabase;

    if (!tenantDatabase) {
      throw new Error('Tenant database not set in request context');
    }

    // Check if connection exists in pool
    if (TenantConnectionManager.connectionPool.has(tenantDatabase)) {
      const existingConnection =
        TenantConnectionManager.connectionPool.get(tenantDatabase);
      if (existingConnection?.isInitialized) {
        this.currentDataSource = existingConnection;
        return existingConnection;
      }
    }

    // Create new connection
    const dataSource = new DataSource({
      type: 'mysql',
      host: this.configService.get<string>('TENANT_DB_HOST', 'localhost'),
      port: this.configService.get<number>('TENANT_DB_PORT', 3306),
      username: this.configService.get<string>('TENANT_DB_USERNAME', 'root'),
      password: this.configService.get<string>('TENANT_DB_PASSWORD', ''),
      database: tenantDatabase,
      entities: Object.values(TenantEntities).filter(
        (entity) => typeof entity === 'function',
      ),
      synchronize: false, // Never sync in production
      logging: this.configService.get<string>('NODE_ENV') === 'development',
      timezone: '+06.00',
      charset: 'utf8mb4',
      extra: {
        connectionLimit: 5,
      },
    });

    await dataSource.initialize();

    // Store in pool
    TenantConnectionManager.connectionPool.set(tenantDatabase, dataSource);
    this.currentDataSource = dataSource;

    return dataSource;
  }

  /**
   * Get a repository for an entity
   */
  async getRepository<T extends ObjectLiteral>(
    entity: EntityTarget<T>,
  ): Promise<Repository<T>> {
    const dataSource = await this.getDataSource();
    return dataSource.getRepository<T>(entity);
  }

  /**
   * Get the current tenant ID
   */
  getTenantId(): string | undefined {
    return this.request.tenantId;
  }

  /**
   * Get the current tenant database name
   */
  getTenantDatabase(): string | undefined {
    return this.request.tenantDatabase;
  }

  /**
   * Close a specific tenant connection
   */
  static async closeConnection(databaseName: string): Promise<void> {
    const connection = TenantConnectionManager.connectionPool.get(databaseName);
    if (connection?.isInitialized) {
      await connection.destroy();
      TenantConnectionManager.connectionPool.delete(databaseName);
    }
  }

  /**
   * Close all tenant connections
   */
  static async closeAllConnections(): Promise<void> {
    for (const [, connection] of TenantConnectionManager.connectionPool) {
      if (connection.isInitialized) {
        await connection.destroy();
      }
    }
    TenantConnectionManager.connectionPool.clear();
  }

  /**
   * Get connection pool statistics
   */
  static getPoolStats(): { totalConnections: number; databases: string[] } {
    return {
      totalConnections: TenantConnectionManager.connectionPool.size,
      databases: Array.from(TenantConnectionManager.connectionPool.keys()),
    };
  }
}
