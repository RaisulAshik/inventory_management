import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AdminJwtPayload } from '../admin-auth.service';
declare const AdminJwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class AdminJwtStrategy extends AdminJwtStrategy_base {
    private readonly configService;
    constructor(configService: ConfigService);
    validate(payload: AdminJwtPayload): AdminJwtPayload;
}
export {};
