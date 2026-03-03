import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getOverviewStats(): Promise<any>;
    getSalesTrend(period?: 'daily' | 'weekly' | 'monthly', days?: number): Promise<any[]>;
    getTopSellingProducts(limit?: number): Promise<any[]>;
    getTopCustomers(limit?: number): Promise<any[]>;
    getLowStockProducts(limit?: number): Promise<any[]>;
    getRecentOrders(limit?: number): Promise<any[]>;
    getPendingPurchaseOrders(limit?: number): Promise<any[]>;
    getStockValuationByWarehouse(): Promise<any[]>;
    getReceivablesSummary(): Promise<any>;
    getPayablesSummary(): Promise<any>;
}
