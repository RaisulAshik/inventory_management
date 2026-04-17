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

    const poolStatus = dataSource ? 'HIT' : 'MISS';
    this.logger.warn(
      `[SESSION-CHECK] ${request.method} ${request.url} | db=${request.tenantDatabase} | hash=${tokenHash.substring(0, 8)}… | pool=${poolStatus}`,
    );

    if (!dataSource) {
      // Pool not yet populated for this tenant (e.g. very first request after cold start).
      // JWT signature is already validated above — fail open so the service layer
      // establishes the connection normally.
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
        // Extra diagnostic: how many sessions exist at all right now?
        const [{ cnt }] = await dataSource.query(
          'SELECT COUNT(*) AS cnt FROM user_sessions',
        );
        this.logger.warn(
          `[SESSION-CHECK] NOT FOUND | url=${request.url} | hash=${tokenHash} | totalSessions=${cnt}`,
        );

        throw new UnauthorizedException(
          'Session has been invalidated. Please log in again.',
        );
      }

      const expiresAt = new Date(rows[0].expires_at);
      this.logger.warn(
        `[SESSION-CHECK] ${request.method} ${request.url} | found id=${rows[0].id} expires=${expiresAt.toISOString()}`,
      );

      if (expiresAt < new Date()) {
        throw new UnauthorizedException(
          'Session has expired. Please log in again.',
        );
      }
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      // Unexpected DB error — fail open to avoid locking users out on transient errors
      this.logger.error(
        `[SESSION-CHECK] DB error (failing open): ${(err as Error).message}`,
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
