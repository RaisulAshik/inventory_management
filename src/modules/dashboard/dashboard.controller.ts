import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
@ApiOperation({ summary: 'Get dashboard overview statistics' })
  @ApiResponse({ status: 200, description: 'Overview statistics retrieved' })
  async getOverviewStats() {
    return this.dashboardService.getOverviewStats();
  }

  @Get('sales-trend')
@ApiOperation({ summary: 'Get sales trend data' })
  @ApiQuery({
    name: 'period',
    enum: ['daily', 'weekly', 'monthly'],
    required: false,
  })
  @ApiQuery({ name: 'days', type: 'number', required: false })
  async getSalesTrend(
    @Query('period') period: 'daily' | 'weekly' | 'monthly' = 'daily',
    @Query('days') days: number = 30,
  ) {
    return this.dashboardService.getSalesTrend(period, days);
  }

  @Get('top-products')
@ApiOperation({ summary: 'Get top selling products' })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  async getTopSellingProducts(@Query('limit') limit: number = 10) {
    return this.dashboardService.getTopSellingProducts(limit);
  }

  @Get('top-customers')
@ApiOperation({ summary: 'Get top customers' })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  async getTopCustomers(@Query('limit') limit: number = 10) {
    return this.dashboardService.getTopCustomers(limit);
  }

  @Get('low-stock')
@ApiOperation({ summary: 'Get low stock products' })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  async getLowStockProducts(@Query('limit') limit: number = 20) {
    return this.dashboardService.getLowStockProducts(limit);
  }

  @Get('recent-orders')
@ApiOperation({ summary: 'Get recent orders' })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  async getRecentOrders(@Query('limit') limit: number = 10) {
    return this.dashboardService.getRecentOrders(limit);
  }

  @Get('pending-purchase-orders')
@ApiOperation({ summary: 'Get pending purchase orders' })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  async getPendingPurchaseOrders(@Query('limit') limit: number = 10) {
    return this.dashboardService.getPendingPurchaseOrders(limit);
  }

  @Get('stock-valuation')
@ApiOperation({ summary: 'Get stock valuation by warehouse' })
  async getStockValuationByWarehouse() {
    return this.dashboardService.getStockValuationByWarehouse();
  }

  @Get('receivables')
@ApiOperation({ summary: 'Get receivables aging summary' })
  async getReceivablesSummary() {
    return this.dashboardService.getReceivablesSummary();
  }

  @Get('payables')
@ApiOperation({ summary: 'Get payables aging summary' })
  async getPayablesSummary() {
    return this.dashboardService.getPayablesSummary();
  }
}
