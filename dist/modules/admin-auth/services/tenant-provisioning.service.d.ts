import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
export declare class TenantProvisioningService {
    private readonly masterDataSource;
    private readonly configService;
    private readonly logger;
    constructor(masterDataSource: DataSource, configService: ConfigService);
    private generateUUID;
    createTenantDatabase(databaseName: string): Promise<void>;
    runTenantMigrations(databaseName: string): Promise<void>;
    private createTenantTables;
    private seedTenantData;
    dropTenantDatabase(databaseName: string): Promise<void>;
    provisionTenant(databaseName: string): Promise<void>;
}
