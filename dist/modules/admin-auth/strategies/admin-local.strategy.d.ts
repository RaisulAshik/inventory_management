import { Strategy } from 'passport-local';
import { TenantUser } from '../../../entities/master/tenant-user.entity';
import { AdminAuthService } from '../admin-auth.service';
declare const AdminLocalStrategy_base: new (...args: [] | [options: import("passport-local").IStrategyOptionsWithRequest] | [options: import("passport-local").IStrategyOptions]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class AdminLocalStrategy extends AdminLocalStrategy_base {
    private readonly adminAuthService;
    constructor(adminAuthService: AdminAuthService);
    validate(email: string, password: string): Promise<TenantUser>;
}
export {};
