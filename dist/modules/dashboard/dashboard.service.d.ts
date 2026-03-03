import { TenantConnectionManager } from '@database/tenant-connection.manager';
export declare class DashboardService {
    private readonly tenantConnectionManager;
    constructor(tenantConnectionManager: TenantConnectionManager);
    getOverviewStats(): Promise<any>;
    getSalesTrend(period: 'daily' | 'weekly' | 'monthly', days?: number): Promise<any[]>;
    getTopSellingProducts(limit?: number): Promise<any[]>;
    getTopCustomers(limit?: number): Promise<any[]>;
    getLowStockProducts(limit?: number): Promise<any[]>;
    getRecentOrders(limit?: number): Promise<any[]>;
    getPendingPurchaseOrders(limit?: number): Promise<any[]>;
    getStockValuationByWarehouse(): Promise<any[]>;
    getReceivablesSummary(): Promise<any>;
    getPayablesSummary(): Promise<any>;
}
