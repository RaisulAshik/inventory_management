// src/modules/admin-auth/decorators/current-admin.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AdminJwtPayload } from '../admin-auth.service';

export const CurrentAdmin = createParamDecorator(
  (data: keyof AdminJwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as AdminJwtPayload;

    if (data) {
      return user?.[data];
    }

    return user;
  },
);
