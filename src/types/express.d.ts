import { Tenant } from '@entities/master';
import { JwtPayload } from '@common/interfaces';

declare global {
  namespace Express {
    interface Request {
      tenant?: Tenant;
      user?: JwtPayload;
    }
  }
}
