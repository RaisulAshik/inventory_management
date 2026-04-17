// src/common/middleware/tenant.middleware.ts
import {
  Injectable,
  NestMiddleware,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TenantStatus } from '@common/enums';
import { Tenant } from '@entities/master/tenant.entity';
import { TenantDatabase } from '@entities/master/tenant-database.entity';

export interface TenantContext {
  tenantId: string;
  tenantCode: string;
  tenantDatabase: string;
}

// Extend Express Request
declare module 'express' {
  interface Request {
    tenantContext?: TenantContext;
    tenantId?: string;
    tenantCode?: string;
    tenantDatabase?: string;
  }
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TenantMiddleware.name);

  constructor(
    @InjectRepository(Tenant, 'master')
    private readonly tenantRepository: Repository<Tenant>,
    @InjectRepository(TenantDatabase, 'master')
    private readonly tenantDatabaseRepository: Repository<TenantDatabase>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // 1. Skip paths that don't require tenancy
    if (this.shouldSkip(req.path)) {
      this.logger.debug(`Skipping tenant middleware for: ${req.path}`);
      return next();
    }

    // 2. Try to get tenant context from JWT first (for authenticated requests)
    let tenantContext = this.getTenantFromJwt(req);

    // 3. If not in JWT, try other sources
    if (!tenantContext) {
      const tenantIdentifier = this.getIdentifier(req);

      if (!tenantIdentifier) {
        throw new BadRequestException(
          'Tenant identifier is required. Provide X-Tenant-ID header or use a valid authentication token.',
        );
      }

      // Validate Tenant against Master Database
      tenantContext = await this.validateAndGetTenantContext(tenantIdentifier);
    }

    // 4. Set Tenant Context on the Request
    req.tenantContext = tenantContext;

    // Also set flat properties for backward compatibility
    req.tenantId = tenantContext.tenantId;
    req.tenantCode = tenantContext.tenantCode;
    req.tenantDatabase = tenantContext.tenantDatabase;

    this.logger.debug(
      `Tenant context set: ${tenantContext.tenantCode} -> ${tenantContext.tenantDatabase}`,
    );
    next();
  }

  /**
   * Try to extract tenant info from JWT token
   */
  public getTenantFromJwt(req: Request): TenantContext | null {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    try {
      const token = authHeader.substring(7);
      const secret = this.configService.get<string>('jwt.secret');
      const payload = this.jwtService.verify(token, { secret });

      this.logger.debug(`JWT Payload: ${JSON.stringify(payload)}`);

      // Check if token contains complete tenant info (admin tokens)
      if (payload.tenantId && payload.tenantCode && payload.tenantDatabase) {
        // return {
        //   tenantId: payload.tenantId,
        //   tenantCode: payload.tenantCode,
        //   tenantDatabase: payload.tenantDatabase,
        // };
        return payload;
      }

      // If only tenantId or tenantCode is present, we need to look up the rest
      if (payload.tenantId || payload.tenantCode) {
        // Return the identifier to be looked up
        return null; // Will trigger database lookup
      }

      return null;
    } catch (error: any) {
      this.logger.debug(`JWT verification failed: ${error.message}`);
      return null;
    }
  }

  /**
   * Get tenant identifier from various sources
   */
  private getIdentifier(req: Request): string | null {
    // Priority 1: X-Tenant-ID Header
    const headerId = req.headers['x-tenant-id'] as string;
    if (headerId) {
      this.logger.debug(`Tenant ID from header: ${headerId}`);
      return headerId;
    }

    // Priority 2: JWT Token (just the identifier, not full context)
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const secret = this.configService.get<string>('jwt.secret');
        const payload = this.jwtService.verify(token, { secret });

        if (payload.tenantCode) return payload.tenantCode;
        if (payload.tenantId) return payload.tenantId;
      } catch (e) {
        // Ignore - will be handled by auth guard
      }
    }

    // Priority 3: Subdomain
    const host = req.headers.host || '';
    const parts = host.split('.');
    if (parts.length >= 3 && parts[0] !== 'www' && parts[0] !== 'api') {
      this.logger.debug(`Tenant from subdomain: ${parts[0]}`);
      return parts[0];
    }

    // Priority 4: Query Param (for testing)
    const queryTenant = req.query.tenantId as string;
    if (queryTenant) {
      this.logger.debug(`Tenant from query: ${queryTenant}`);
      return queryTenant;
    }

    return null;
  }

  /**
   * Validate tenant against master database and get full context
   */
  private async validateAndGetTenantContext(
    identifier: string,
  ): Promise<TenantContext> {
    // Find tenant by ID or code
    const tenant = await this.tenantRepository.findOne({
      where: [{ id: identifier }, { tenantCode: identifier.toUpperCase() }],
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant not found: ${identifier}`);
    }

    if (tenant.status !== TenantStatus.ACTIVE) {
      throw new BadRequestException(
        `Tenant account is ${tenant.status.toLowerCase()}. Please contact support.`,
      );
    }

    // Get database info
    const tenantDatabase = await this.tenantDatabaseRepository.findOne({
      where: { tenantId: tenant.id },
    });

    if (!tenantDatabase) {
      throw new BadRequestException(
        'Tenant database configuration not found. Please contact support.',
      );
    }

    if (!tenantDatabase.isProvisioned || !tenantDatabase.isActive) {
      throw new BadRequestException(
        'Tenant database is not ready. Please contact support.',
      );
    }

    return {
      tenantId: tenant.id,
      tenantCode: tenant.tenantCode,
      tenantDatabase: tenantDatabase.databaseName,
    };
  }

  /**
   * Check if path should skip tenant middleware
   */
  private shouldSkip(path: string): boolean {
    const skipPaths = [
      '/api/v1/admin/auth', // Admin authentication
      '/admin/auth', // Admin authentication (without prefix)
      '/v1/admin', // Admin routes
      '/api/v1/master', // Master module routes
      '/master', // Master routes
      // NOTE: /auth/* paths are NOT skipped — they need tenant DB context.
      // JWT guard skips them via @Public() decorator.
      '/health', // Health check
      '/docs', // Swagger
      '/api-json', // Swagger JSON
    ];

    return skipPaths.some((p) => path.startsWith(p) || path.includes(p));
  }
}
