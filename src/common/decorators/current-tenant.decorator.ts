import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export interface TenantInfo {
  tenantId: string;
  tenantCode?: string;
  tenantDatabase: string;
}
export const CurrentTenant = createParamDecorator(
  (data: keyof TenantInfo | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const tenantInfo: TenantInfo = {
      tenantId: request.tenantId,
      tenantCode: request.tenantCode,
      tenantDatabase: request.tenantDatabase,
    };
    if (data) {
      return tenantInfo?.[data];
    }

    return tenantInfo;
  },
);
