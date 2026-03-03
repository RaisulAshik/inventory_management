import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Tenant } from '@entities/master/tenant.entity';
import { TenantDatabase } from '@entities/master/tenant-database.entity';
export interface TenantContext {
    tenantId: string;
    tenantCode: string;
    tenantDatabase: string;
}
declare module 'express' {
    interface Request {
        tenantContext?: TenantContext;
        tenantId?: string;
        tenantCode?: string;
        tenantDatabase?: string;
    }
}
export declare class TenantMiddleware implements NestMiddleware {
    private readonly tenantRepository;
    private readonly tenantDatabaseRepository;
    private readonly jwtService;
    private readonly configService;
    private readonly logger;
    constructor(tenantRepository: Repository<Tenant>, tenantDatabaseRepository: Repository<TenantDatabase>, jwtService: JwtService, configService: ConfigService);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
    getTenantFromJwt(req: Request): TenantContext | null;
    private getIdentifier;
    private validateAndGetTenantContext;
    private shouldSkip;
}
