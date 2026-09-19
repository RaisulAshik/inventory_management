// src/common/guards/permissions.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '@common/decorators/permissions.decorator';
import { IS_PUBLIC_KEY } from '@common/decorators/public.decorator';
import { JwtPayload } from '@common/interfaces';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Check if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Get required permissions for this route
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no permissions required, allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      throw new ForbiddenException('Access denied: Authentication required');
    }

    const user: JwtPayload & {
      isAdmin?: boolean;
      type?: string;
      permissions?: string[];
    } = {
      sub: request.user.sub,
      email: request.user.email,
      tenantId: request.user.tenantId,
      roles: request.user.roles ?? [],
      permissions: request.user.permissions ?? [],
      // The admin flag comes from the validated JWT (JwtStrategy and
      // AdminJwtStrategy both preserve it on request.user). It must NOT be read
      // from request.tenantContext: TenantMiddleware skips /master routes
      // entirely, so tenantContext is undefined there and admins were being
      // rejected on their own control-plane endpoints.
      isAdmin: request.user.isAdmin,
      type: request.user.type,
    };

    // =====================================================
    // ADMIN USER BYPASS
    // Admin users (from admin auth) have full access
    // =====================================================
    if (user.isAdmin === true || user.type === 'admin') {
      return true;
    }

    // =====================================================
    // PERMISSION CHECK FOR REGULAR USERS
    // =====================================================
    if (!user.permissions || user.permissions.length === 0) {
      throw new ForbiddenException('Access denied: No permissions assigned');
    }

    // Check if user has ALL required permissions
    const hasAllPermissions = requiredPermissions.every((permission) =>
      user.permissions.includes(permission),
    );

    if (!hasAllPermissions) {
      const missingPermissions = requiredPermissions.filter(
        (p) => !user.permissions.includes(p),
      );
      throw new ForbiddenException(
        `Access denied: Missing permissions: ${missingPermissions.join(', ')}`,
      );
    }

    return true;
  }
}
