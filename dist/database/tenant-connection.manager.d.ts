import { OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource, Repository, EntityTarget, ObjectLiteral } from 'typeorm';
import { Request } from 'express';
interface TenantRequest extends Request {
    tenantId?: string;
    tenantDatabase?: string;
}
export declare class TenantConnectionManager implements OnModuleDestroy {
    private readonly request;
    private readonly configService;
    private static connectionPool;
    private currentDataSource;
    constructor(request: TenantRequest, configService: ConfigService);
    onModuleDestroy(): Promise<void>;
    getDataSource(): Promise<DataSource>;
    getRepository<T extends ObjectLiteral>(entity: EntityTarget<T>): Promise<Repository<T>>;
    getTenantId(): string | undefined;
    getTenantDatabase(): string | undefined;
    static closeConnection(databaseName: string): Promise<void>;
    static closeAllConnections(): Promise<void>;
    static getPoolStats(): {
        totalConnections: number;
        databases: string[];
    };
}
export {};
