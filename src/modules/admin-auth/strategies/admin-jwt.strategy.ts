// src/modules/admin-auth/strategies/admin-jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AdminJwtPayload } from '../admin-auth.service';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(private readonly configService: ConfigService) {
    const secret = configService.get<string>('jwt.secret');
    if (!secret) {
      throw new Error('JWT secret is not configured');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: AdminJwtPayload): AdminJwtPayload {
    // Ensure this is an admin token
    if (payload.type !== 'admin') {
      throw new UnauthorizedException('Invalid token type');
    }

    if (!payload.sub || !payload.email || !payload.tenantId) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return payload;
  }
}
