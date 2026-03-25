import { Injectable } from '@nestjs/common';
import { TenantConnectionManager } from '@database/tenant-connection.manager';

@Injectable()
export class DashboardService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  /**
   * Get overall dashboard statistics
   */
  async getOverviewStats(): Promise<any> {
    const dataSource = await this.tenantConnectionManager.getDataSource();

    // Today's date range
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));

    // This month's date range
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    // Sales stats
    const salesStats = await dataSource.query(
      `
      SELECT 
        COUNT(*) as totalOrders,
        SUM(total_amount) as totalRevenue,
        SUM(paid_amount) as totalCollected,
        AVG(total_amount) as avgOrderValue
      FROM sales_orders
      WHERE status NOT IN ('CANCELLED', 'DRAFT')
        AND order_date BETWEEN ? AND ?
    `,
      [startOfMonth, endOfMonth],
    );

    // Today's sales
    const todaySales = await dataSource.query(
      `
      SELECT 
        COUNT(*) as orderCount,
        COALESCE(SUM(total_amount), 0) as totalAmount
      FROM sales_orders
      WHERE status NOT IN ('CANCELLED', 'DRAFT')
        AND order_date BETWEEN ? AND ?
    `,
      [startOfToday, endOfToday],
    );

    // Purchase stats
    const purchaseStats = await dataSource.query(
      `
      SELECT 
        COUNT(*) as totalPOs,
        SUM(total_amount) as totalPurchases
      FROM purchase_orders
      WHERE status NOT IN ('CANCELLED', 'DRAFT')
        AND order_date BETWEEN ? AND ?
    `,
      [startOfMonth, endOfMonth],
    );

    // Customer count
    const customerCount = await dataSource.query(`
      SELECT COUNT(*) as count 
      FROM customers 
      WHERE deleted_at IS NULL AND is_active = 1
    `);

    // Product count
    const productCount = await dataSource.query(`
      SELECT COUNT(*) as count 
      FROM products 
      WHERE deleted_at IS NULL AND is_active = 1
    `);

    // Low stock count
    const lowStockCount = await dataSource.query(`
      SELECT COUNT(DISTINCT s.product_id) as count
      FROM inventory_stock s
      INNER JOIN products p ON s.product_id = p.id
      WHERE s.quantity_on_hand <= COALESCE(p.reorder_level, 0)
        AND p.is_stockable = 1
        AND p.deleted_at IS NULL
    `);

    // Pending orders
    const pendingOrders = await dataSource.query(`
      SELECT COUNT(*) as count 
      FROM sales_orders 
      WHERE status IN ('PENDING', 'CONFIRMED', 'PROCESSING')
    `);

    // Overdue payments
    const overduePayments = await dataSource.query(`
      SELECT 
        COUNT(*) as count,
        COALESCE(SUM(original_amount - paid_amount - adjusted_amount), 0) as totalOverdue
      FROM customer_dues
      WHERE status IN ('PENDING', 'PARTIALLY_PAID', 'OVERDUE')
        AND due_date < CURDATE()
    `);

    return {
      sales: {
        todayOrders: parseInt(todaySales[0]?.orderCount) || 0,
        todayRevenue: parseFloat(todaySales[0]?.totalAmount) || 0,
        monthOrders: parseInt(salesStats[0]?.totalOrders) || 0,
        monthRevenue: parseFloat(salesStats[0]?.totalRevenue) || 0,
        avgOrderValue: parseFloat(salesStats[0]?.avgOrderValue) || 0,
      },
      purchases: {
        monthPOs: parseInt(purchaseStats[0]?.totalPOs) || 0,
        monthPurchases: parseFloat(purchaseStats[0]?.totalPurchases) || 0,
      },
      inventory: {
        totalProducts: parseInt(productCount[0]?.count) || 0,
        lowStockCount: parseInt(lowStockCount[0]?.count) || 0,
      },
      customers: {
        totalCustomers: parseInt(customerCount[0]?.count) || 0,
      },
      pendingOrders: parseInt(pendingOrders[0]?.count) || 0,
      overduePayments: {
        count: parseInt(overduePayments[0]?.count) || 0,
        amount: parseFloat(overduePayments[0]?.totalOverdue) || 0,
      },
    };
  }

  /**
   * Get sales trend data
   */
  async getSalesTrend(
    period: 'daily' | 'weekly' | 'monthly',
    days: number = 30,
  ): Promise<any[]> {
    const dataSource = await this.tenantConnectionManager.getDataSource();

    let groupBy: string;
    let dateFormat: string;

    switch (period) {
      case 'daily':
        groupBy = "DATE_FORMAT(order_date, '%Y-%m-%d')";
        dateFormat = '%Y-%m-%d';
        break;
      case 'weekly':
        groupBy = "DATE_FORMAT(order_date, '%Y-%u')";
        dateFormat = '%Y-%u';
        break;
      case 'monthly':
        groupBy = "DATE_FORMAT(order_date, '%Y-%m')";
        dateFormat = '%Y-%m';
        break;
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const result = await dataSource.query(
      `
      SELECT
        DATE_FORMAT(order_date, '${dateFormat}') as period,
        COUNT(*) as orderCount,
        SUM(total_amount) as revenue,
        SUM(paid_amount) as collected
      FROM sales_orders
      WHERE status NOT IN ('CANCELLED', 'DRAFT')
        AND order_date >= ?
      GROUP BY DATE_FORMAT(order_date, '${dateFormat}')
      ORDER BY period ASC
    `,
      [startDate],
    );

    return result.map((row: any) => ({
      period: row.period,
      orderCount: parseInt(row.orderCount),
      revenue: parseFloat(row.revenue) || 0,
      collected: parseFloat(row.collected) || 0,
    }));
  }

  /**
   * Get top selling products
   */
  async getTopSellingProducts(limit: number = 10): Promise<any[]> {
    const dataSource = await this.tenantConnectionManager.getDataSource();

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const result = await dataSource.query(
      `
      SELECT 
        p.id,
        p.product_name as productName,
        p.sku,
        SUM(soi.quantity_ordered) as quantitySold,
        SUM(soi.line_total) as revenue,
        COUNT(DISTINCT so.id) as orderCount
      FROM sales_order_items soi
      INNER JOIN sales_orders so ON soi.sales_order_id = so.id
      INNER JOIN products p ON soi.product_id = p.id
      WHERE so.status NOT IN ('CANCELLED', 'DRAFT')
        AND so.order_date >= ?
      GROUP BY p.id, p.product_name, p.sku
      ORDER BY quantitySold DESC
      LIMIT ?
    `,
      [startOfMonth, limit],
    );

    return result.map((row: any) => ({
      id: row.id,
      productName: row.productName,
      sku: row.sku,
      quantitySold: parseFloat(row.quantitySold) || 0,
      revenue: parseFloat(row.revenue) || 0,
      orderCount: parseInt(row.orderCount),
    }));
  }

  /**
   * Get top customers
   */
  async getTopCustomers(limit: number = 10): Promise<any[]> {
    const dataSource = await this.tenantConnectionManager.getDataSource();

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const result = await dataSource.query(
      `
      SELECT 
        c.id,
        c.customer_code as customerCode,
        CONCAT(c.first_name, ' ', COALESCE(c.last_name, '')) as customerName,
        c.company_name as companyName,
        COUNT(so.id) as orderCount,
        SUM(so.total_amount) as totalPurchases
      FROM customers c
      INNER JOIN sales_orders so ON c.id = so.customer_id
      WHERE so.status NOT IN ('CANCELLED', 'DRAFT')
        AND so.order_date >= ?
      GROUP BY c.id, c.customer_code, c.first_name, c.last_name, c.company_name
      ORDER BY totalPurchases DESC
      LIMIT ?
    `,
      [startOfMonth, limit],
    );

    return result.map((row: any) => ({
      id: row.id,
      customerCode: row.customerCode,
      customerName: row.customerName?.trim(),
      companyName: row.companyName,
      orderCount: parseInt(row.orderCount),
      totalPurchases: parseFloat(row.totalPurchases) || 0,
    }));
  }

  /**
   * Get low stock products
   */
  async getLowStockProducts(limit: number = 20): Promise<any[]> {
    const dataSource = await this.tenantConnectionManager.getDataSource();

    const result = await dataSource.query(
      `
      SELECT 
        p.id,
        p.product_name as productName,
        p.sku,
        s.quantity_on_hand as quantityOnHand,
        s.quantity_reserved as quantityReserved,
        (s.quantity_on_hand - s.quantity_reserved) as availableQuantity,
        p.reorder_level as reorderLevel,
        p.reorder_quantity as reorderQuantity,
        w.warehouse_name as warehouseName
      FROM inventory_stock s
      INNER JOIN products p ON s.product_id = p.id
      INNER JOIN warehouses w ON s.warehouse_id = w.id
      WHERE s.quantity_on_hand <= COALESCE(p.reorder_level, 0)
        AND p.is_stockable = 1
        AND p.deleted_at IS NULL
      ORDER BY (s.quantity_on_hand - s.quantity_reserved) ASC
      LIMIT ?
    `,
      [limit],
    );

    return result.map((row: any) => ({
      id: row.id,
      productName: row.productName,
      sku: row.sku,
      quantityOnHand: parseFloat(row.quantityOnHand) || 0,
      quantityReserved: parseFloat(row.quantityReserved) || 0,
      availableQuantity: parseFloat(row.availableQuantity) || 0,
      reorderLevel: parseFloat(row.reorderLevel) || 0,
      reorderQuantity: parseFloat(row.reorderQuantity) || 0,
      warehouseName: row.warehouseName,
    }));
  }

  /**
   * Get recent orders
   */
  async getRecentOrders(limit: number = 10): Promise<any[]> {
    const dataSource = await this.tenantConnectionManager.getDataSource();

    const result = await dataSource.query(
      `
      SELECT 
        so.id,
        so.order_number as orderNumber,
        so.order_date as orderDate,
        so.status,
        so.total_amount as totalAmount,
        so.paid_amount as paidAmount,
        CONCAT(c.first_name, ' ', COALESCE(c.last_name, '')) as customerName,
        c.company_name as companyName
      FROM sales_orders so
      INNER JOIN customers c ON so.customer_id = c.id
      ORDER BY so.created_at DESC
      LIMIT ?
    `,
      [limit],
    );

    return result.map((row: any) => ({
      id: row.id,
      orderNumber: row.orderNumber,
      orderDate: row.orderDate,
      status: row.status,
      totalAmount: parseFloat(row.totalAmount) || 0,
      paidAmount: parseFloat(row.paidAmount) || 0,
      customerName: row.customerName?.trim() || row.companyName,
    }));
  }

  /**
   * Get pending purchase orders
   */
  async getPendingPurchaseOrders(limit: number = 10): Promise<any[]> {
    const dataSource = await this.tenantConnectionManager.getDataSource();

    const result = await dataSource.query(
      `
      SELECT 
        po.id,
        po.po_number as poNumber,
        po.order_date as orderDate,
        po.expected_date as expectedDeliveryDate,
        po.status,
        po.total_amount as totalAmount,
        s.company_name as supplierName
      FROM purchase_orders po
      INNER JOIN suppliers s ON po.supplier_id = s.id
      WHERE po.status IN ('SENT', 'ACKNOWLEDGED', 'PARTIALLY_RECEIVED')
      ORDER BY po.expected_date ASC
      LIMIT ?
    `,
      [limit],
    );

    return result.map((row: any) => ({
      id: row.id,
      poNumber: row.poNumber,
      orderDate: row.orderDate,
      expectedDeliveryDate: row.expectedDeliveryDate,
      status: row.status,
      totalAmount: parseFloat(row.totalAmount) || 0,
      supplierName: row.supplierName,
      isOverdue:
        row.expectedDeliveryDate &&
        new Date(row.expectedDeliveryDate) < new Date(),
    }));
  }

  /**
   * Get stock valuation by warehouse
   */
  async getStockValuationByWarehouse(): Promise<any[]> {
    const dataSource = await this.tenantConnectionManager.getDataSource();

    const result = await dataSource.query(`
      SELECT 
        w.id,
        w.warehouse_name as warehouseName,
        COUNT(DISTINCT s.product_id) as productCount,
        SUM(s.quantity_on_hand) as totalQuantity,
        SUM(s.quantity_on_hand * COALESCE(p.cost_price, 0)) as totalValue
      FROM inventory_stock s
      INNER JOIN warehouses w ON s.warehouse_id = w.id
      INNER JOIN products p ON s.product_id = p.id
      WHERE w.is_active = 1
      GROUP BY w.id, w.warehouse_name
      ORDER BY totalValue DESC
    `);

    return result.map((row: any) => ({
      id: row.id,
      warehouseName: row.warehouseName,
      productCount: parseInt(row.productCount),
      totalQuantity: parseFloat(row.totalQuantity) || 0,
      totalValue: parseFloat(row.totalValue) || 0,
    }));
  }

  /**
   * Get receivables summary
   */
  async getReceivablesSummary(): Promise<any> {
    const dataSource = await this.tenantConnectionManager.getDataSource();

    const result = await dataSource.query(`
      SELECT 
        SUM(CASE WHEN due_date >= CURDATE() THEN original_amount - paid_amount - adjusted_amount ELSE 0 END) as current,
        SUM(CASE WHEN due_date < CURDATE() AND due_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN original_amount - paid_amount - adjusted_amount ELSE 0 END) as overdue30,
        SUM(CASE WHEN due_date < DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND due_date >= DATE_SUB(CURDATE(), INTERVAL 60 DAY) THEN original_amount - paid_amount - adjusted_amount ELSE 0 END) as overdue60,
        SUM(CASE WHEN due_date < DATE_SUB(CURDATE(), INTERVAL 60 DAY) AND due_date >= DATE_SUB(CURDATE(), INTERVAL 90 DAY) THEN original_amount - paid_amount - adjusted_amount ELSE 0 END) as overdue90,
        SUM(CASE WHEN due_date < DATE_SUB(CURDATE(), INTERVAL 90 DAY) THEN original_amount - paid_amount - adjusted_amount ELSE 0 END) as overdue90Plus
      FROM customer_dues
      WHERE status IN ('PENDING', 'PARTIALLY_PAID', 'OVERDUE')
    `);

    return {
      current: parseFloat(result[0]?.current) || 0,
      overdue30: parseFloat(result[0]?.overdue30) || 0,
      overdue60: parseFloat(result[0]?.overdue60) || 0,
      overdue90: parseFloat(result[0]?.overdue90) || 0,
      overdue90Plus: parseFloat(result[0]?.overdue90Plus) || 0,
      total:
        (parseFloat(result[0]?.current) || 0) +
        (parseFloat(result[0]?.overdue30) || 0) +
        (parseFloat(result[0]?.overdue60) || 0) +
        (parseFloat(result[0]?.overdue90) || 0) +
        (parseFloat(result[0]?.overdue90Plus) || 0),
    };
  }

  /**
   * Get payables summary
   */
  async getPayablesSummary(): Promise<any> {
    const dataSource = await this.tenantConnectionManager.getDataSource();

    const result = await dataSource.query(`
      SELECT 
        SUM(CASE WHEN due_date >= CURDATE() THEN original_amount - paid_amount - adjusted_amount ELSE 0 END) as current,
        SUM(CASE WHEN due_date < CURDATE() AND due_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN original_amount - paid_amount - adjusted_amount ELSE 0 END) as overdue30,
        SUM(CASE WHEN due_date < DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND due_date >= DATE_SUB(CURDATE(), INTERVAL 60 DAY) THEN original_amount - paid_amount - adjusted_amount ELSE 0 END) as overdue60,
        SUM(CASE WHEN due_date < DATE_SUB(CURDATE(), INTERVAL 60 DAY) AND due_date >= DATE_SUB(CURDATE(), INTERVAL 90 DAY) THEN original_amount - paid_amount - adjusted_amount ELSE 0 END) as overdue90,
        SUM(CASE WHEN due_date < DATE_SUB(CURDATE(), INTERVAL 90 DAY) THEN original_amount - paid_amount - adjusted_amount ELSE 0 END) as overdue90Plus
      FROM supplier_dues
      WHERE status IN ('PENDING', 'PARTIALLY_PAID', 'OVERDUE')
    `);

    return {
      current: parseFloat(result[0]?.current) || 0,
      overdue30: parseFloat(result[0]?.overdue30) || 0,
      overdue60: parseFloat(result[0]?.overdue60) || 0,
      overdue90: parseFloat(result[0]?.overdue90) || 0,
      overdue90Plus: parseFloat(result[0]?.overdue90Plus) || 0,
      total:
        (parseFloat(result[0]?.current) || 0) +
        (parseFloat(result[0]?.overdue30) || 0) +
        (parseFloat(result[0]?.overdue60) || 0) +
        (parseFloat(result[0]?.overdue90) || 0) +
        (parseFloat(result[0]?.overdue90Plus) || 0),
    };
  }
}
