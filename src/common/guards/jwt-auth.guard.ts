import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '@common/decorators/public.decorator';
import { JwtPayload } from '@common/interfaces';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { createHash } from 'node:crypto';

@Injectable() // singleton — must NOT be request-scoped (breaks Passport user attachment)
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Step 1: Passport validates JWT signature + expiry, sets request.user
    const result = await (super.canActivate(context) as Promise<boolean>);
    if (!result) return false;

    // Step 2: Validate the token still has a live session in the DB.
    // Uses the static connection pool — no DI resolution needed, always correct.
    const request = context.switchToHttp().getRequest();
    if (!request.tenantDatabase) return true; // admin / master routes — skip

    // Admin tokens (issued by /admin/auth/login) don't create rows in user_sessions.
    // They carry the tenant context inside the JWT but bypass session validation.
    const user = request.user as JwtPayload;
    if (user?.isAdmin === true || user?.type === 'admin') {
      return true;
    }

    const authHeader: string | undefined = request.headers?.authorization;
    if (!authHeader?.startsWith('Bearer ')) return true;

    const token = authHeader.substring(7).trim(); // trim in case of stray whitespace
    const tokenHash = createHash('sha256').update(token).digest('hex');

    // Get the DataSource from the static pool (populated on first request to this tenant)
    const dataSource = TenantConnectionManager.getPooledDataSource(
      request.tenantDatabase,
    );

    if (!dataSource) {
      // Pool not yet populated for this tenant (e.g. the very first request
      // after a cold start). The JWT signature and expiry are already
      // validated above, so admit the request and let the service layer open
      // the connection. Note this briefly re-admits a logged-out token.
      this.logger.debug(
        `Session check skipped: no pooled connection yet for ${request.tenantDatabase}`,
      );
      return true;
    }

    try {
      // Use raw SQL to avoid any TypeORM metadata / cache edge-cases
      const rows: Array<{ id: string; expires_at: Date }> =
        await dataSource.query(
          'SELECT id, expires_at FROM user_sessions WHERE token_hash = ? LIMIT 1',
          [tokenHash],
        );

      if (!rows || rows.length === 0) {
        throw new UnauthorizedException(
          'Session has been invalidated. Please log in again.',
        );
      }

      const expiresAt = new Date(rows[0].expires_at);

      if (expiresAt < new Date()) {
        throw new UnauthorizedException(
          'Session has expired. Please log in again.',
        );
      }
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      // Unexpected DB error. Fail open rather than locking every user out of
      // the tenant on a transient fault; the JWT itself is already verified.
      this.logger.error(
        `Session check failed, admitting request: ${(err as Error).message}`,
      );
      return true;
    }

    return true;
  }

  handleRequest<TUser = JwtPayload>(
    err: Error | null,
    user: TUser | false,
  ): TUser {
    if (err || !user) {
      throw err ?? new UnauthorizedException('Invalid or expired token');
    }
    return user;
  }
}
