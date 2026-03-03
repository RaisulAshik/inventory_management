import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@common/decorators/public.decorator';

const MASTER_ROUTES_PREFIX = 'master';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Check if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const path = request.route?.path || request.url || '';

    // Skip tenant check for master routes
    if (path.includes(MASTER_ROUTES_PREFIX)) {
      return true;
    }

    // Skip tenant check for auth routes
    if (path.includes('/auth/')) {
      return true;
    }

    // Require tenant for all other routes
    const tenantContext = request.tenantContext;

    if (
      !tenantContext ||
      !tenantContext.tenantId ||
      !tenantContext.tenantDatabase
    ) {
      throw new BadRequestException(
        'Tenant context is required. Please provide X-Tenant-ID header or use a valid tenant token.',
      );
    }

    // Also set the flat properties for backward compatibility
    // request.tenantId = tenantContext.tenantId;
    // request.tenantCode = tenantContext.tenantCode;
    // request.tenantDatabase = tenantContext.tenantDatabase;

    return true;
  }
}
