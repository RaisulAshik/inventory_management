import { MigrationInterface, QueryRunner } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

export class SeedTenantData1700000000008 implements MigrationInterface {
  name = 'SeedTenantData1700000000008';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // =====================================================
    // SEED SEQUENCES
    // =====================================================
    await queryRunner.query(`
      INSERT INTO \`sequences\` (\`id\`, \`sequence_type\`, \`prefix\`, \`current_value\`, \`number_length\`, \`include_year\`, \`separator\`, \`reset_period\`)
      VALUES
        ('${uuidv4()}', 'SALES_ORDER', 'SO', 0, 6, 1, '-', 'YEARLY'),
        ('${uuidv4()}', 'PURCHASE_ORDER', 'PO', 0, 6, 1, '-', 'YEARLY'),
        ('${uuidv4()}', 'GRN', 'GRN', 0, 6, 1, '-', 'YEARLY'),
        ('${uuidv4()}', 'SALES_RETURN', 'SR', 0, 6, 1, '-', 'YEARLY'),
        ('${uuidv4()}', 'PURCHASE_RETURN', 'PR', 0, 6, 1, '-', 'YEARLY'),
        ('${uuidv4()}', 'PAYMENT', 'PAY', 0, 6, 1, '-', 'YEARLY'),
        ('${uuidv4()}', 'STOCK_TRANSFER', 'ST', 0, 6, 1, '-', 'YEARLY'),
        ('${uuidv4()}', 'STOCK_ADJUSTMENT', 'ADJ', 0, 6, 1, '-', 'YEARLY'),
        ('${uuidv4()}', 'STOCK_MOVEMENT', 'MOV', 0, 8, 0, '', 'NEVER'),
        ('${uuidv4()}', 'CUSTOMER', 'CUST', 0, 5, 0, '', 'NEVER'),
        ('${uuidv4()}', 'SUPPLIER', 'SUPP', 0, 5, 0, '', 'NEVER'),
        ('${uuidv4()}', 'PRODUCT', 'PRD', 0, 6, 0, '', 'NEVER')
    `);

    // =====================================================
    // SEED ROLES
    // =====================================================
    const adminRoleId = uuidv4();
    const managerRoleId = uuidv4();
    const salesRoleId = uuidv4();
    const purchaseRoleId = uuidv4();
    const warehouseRoleId = uuidv4();

    await queryRunner.query(`
      INSERT INTO \`roles\` (\`id\`, \`role_code\`, \`role_name\`, \`description\`, \`is_system\`, \`is_active\`)
      VALUES
        ('${adminRoleId}', 'ADMIN', 'Administrator', 'Full system access', 1, 1),
        ('${managerRoleId}', 'MANAGER', 'Manager', 'Management level access', 1, 1),
        ('${salesRoleId}', 'SALES', 'Sales User', 'Sales and customer management', 1, 1),
        ('${purchaseRoleId}', 'PURCHASE', 'Purchase User', 'Purchase and supplier management', 1, 1),
        ('${warehouseRoleId}', 'WAREHOUSE', 'Warehouse User', 'Inventory and warehouse management', 1, 1)
    `);

    // =====================================================
    // SEED PERMISSIONS
    // =====================================================
    const permissions = [
      // Dashboard
      { code: 'dashboard.view', name: 'View Dashboard', module: 'dashboard' },

      // Products
      { code: 'products.read', name: 'View Products', module: 'products' },
      { code: 'products.create', name: 'Create Products', module: 'products' },
      { code: 'products.update', name: 'Update Products', module: 'products' },
      { code: 'products.delete', name: 'Delete Products', module: 'products' },

      // Categories
      {
        code: 'categories.read',
        name: 'View Categories',
        module: 'categories',
      },
      {
        code: 'categories.create',
        name: 'Create Categories',
        module: 'categories',
      },
      {
        code: 'categories.update',
        name: 'Update Categories',
        module: 'categories',
      },
      {
        code: 'categories.delete',
        name: 'Delete Categories',
        module: 'categories',
      },

      // Customers
      { code: 'customers.read', name: 'View Customers', module: 'customers' },
      {
        code: 'customers.create',
        name: 'Create Customers',
        module: 'customers',
      },
      {
        code: 'customers.update',
        name: 'Update Customers',
        module: 'customers',
      },
      {
        code: 'customers.delete',
        name: 'Delete Customers',
        module: 'customers',
      },

      // Suppliers
      { code: 'suppliers.read', name: 'View Suppliers', module: 'suppliers' },
      {
        code: 'suppliers.create',
        name: 'Create Suppliers',
        module: 'suppliers',
      },
      {
        code: 'suppliers.update',
        name: 'Update Suppliers',
        module: 'suppliers',
      },
      {
        code: 'suppliers.delete',
        name: 'Delete Suppliers',
        module: 'suppliers',
      },

      // Sales Orders
      {
        code: 'sales_orders.read',
        name: 'View Sales Orders',
        module: 'sales_orders',
      },
      {
        code: 'sales_orders.create',
        name: 'Create Sales Orders',
        module: 'sales_orders',
      },
      {
        code: 'sales_orders.update',
        name: 'Update Sales Orders',
        module: 'sales_orders',
      },
      {
        code: 'sales_orders.delete',
        name: 'Delete Sales Orders',
        module: 'sales_orders',
      },
      {
        code: 'sales_orders.approve',
        name: 'Approve Sales Orders',
        module: 'sales_orders',
      },

      // Purchase Orders
      {
        code: 'purchase_orders.read',
        name: 'View Purchase Orders',
        module: 'purchase_orders',
      },
      {
        code: 'purchase_orders.create',
        name: 'Create Purchase Orders',
        module: 'purchase_orders',
      },
      {
        code: 'purchase_orders.update',
        name: 'Update Purchase Orders',
        module: 'purchase_orders',
      },
      {
        code: 'purchase_orders.delete',
        name: 'Delete Purchase Orders',
        module: 'purchase_orders',
      },
      {
        code: 'purchase_orders.approve',
        name: 'Approve Purchase Orders',
        module: 'purchase_orders',
      },

      // Inventory
      { code: 'inventory.read', name: 'View Inventory', module: 'inventory' },
      {
        code: 'inventory.adjust',
        name: 'Adjust Inventory',
        module: 'inventory',
      },
      {
        code: 'inventory.transfer',
        name: 'Transfer Inventory',
        module: 'inventory',
      },

      // Warehouses
      {
        code: 'warehouses.read',
        name: 'View Warehouses',
        module: 'warehouses',
      },
      {
        code: 'warehouses.create',
        name: 'Create Warehouses',
        module: 'warehouses',
      },
      {
        code: 'warehouses.update',
        name: 'Update Warehouses',
        module: 'warehouses',
      },
      {
        code: 'warehouses.delete',
        name: 'Delete Warehouses',
        module: 'warehouses',
      },

      // Reports
      { code: 'reports.view', name: 'View Reports', module: 'reports' },
      { code: 'reports.export', name: 'Export Reports', module: 'reports' },

      // Settings
      { code: 'settings.read', name: 'View Settings', module: 'settings' },
      { code: 'settings.update', name: 'Update Settings', module: 'settings' },

      // Users
      { code: 'users.read', name: 'View Users', module: 'users' },
      { code: 'users.create', name: 'Create Users', module: 'users' },
      { code: 'users.update', name: 'Update Users', module: 'users' },
      { code: 'users.delete', name: 'Delete Users', module: 'users' },
    ];

    for (const perm of permissions) {
      await queryRunner.query(`
        INSERT INTO \`permissions\` (\`id\`, \`permission_code\`, \`permission_name\`, \`module\`)
        VALUES ('${uuidv4()}', '${perm.code}', '${perm.name}', '${perm.module}')
      `);
    }

    // =====================================================
    // SEED UNITS OF MEASURE
    // =====================================================
    const pcsUomId = uuidv4();

    await queryRunner.query(`
      INSERT INTO \`units_of_measure\` (\`id\`, \`uom_code\`, \`uom_name\`, \`uom_type\`, \`symbol\`, \`decimal_places\`, \`is_base_unit\`, \`conversion_factor\`, \`is_active\`)
      VALUES
        ('${pcsUomId}', 'PCS', 'Pieces', 'UNIT', 'pcs', 0, 1, 1, 1),
        ('${uuidv4()}', 'BOX', 'Box', 'PACK', 'box', 0, 0, 1, 1),
        ('${uuidv4()}', 'CTN', 'Carton', 'PACK', 'ctn', 0, 0, 1, 1),
        ('${uuidv4()}', 'DOZ', 'Dozen', 'PACK', 'doz', 0, 0, 12, 1),
        ('${uuidv4()}', 'KG', 'Kilogram', 'WEIGHT', 'kg', 3, 1, 1, 1),
        ('${uuidv4()}', 'GM', 'Gram', 'WEIGHT', 'g', 0, 0, 0.001, 1),
        ('${uuidv4()}', 'LTR', 'Litre', 'VOLUME', 'L', 3, 1, 1, 1),
        ('${uuidv4()}', 'ML', 'Millilitre', 'VOLUME', 'ml', 0, 0, 0.001, 1),
        ('${uuidv4()}', 'MTR', 'Metre', 'LENGTH', 'm', 2, 1, 1, 1),
        ('${uuidv4()}', 'CM', 'Centimetre', 'LENGTH', 'cm', 0, 0, 0.01, 1)
    `);

    // =====================================================
    // SEED TAX CATEGORIES
    // =====================================================
    const gstCategoryId = uuidv4();
    const exemptCategoryId = uuidv4();

    await queryRunner.query(`
      INSERT INTO \`tax_categories\` (\`id\`, \`tax_category_code\`, \`tax_category_name\`, \`description\`, \`is_active\`)
      VALUES
        ('${gstCategoryId}', 'GST', 'Goods and Services Tax', 'Standard GST applicable items', 1),
        ('${exemptCategoryId}', 'EXEMPT', 'Tax Exempt', 'Items exempt from tax', 1)
    `);

    // =====================================================
    // SEED TAX RATES
    // =====================================================
    await queryRunner.query(`
      INSERT INTO \`tax_rates\` (\`id\`, \`tax_category_id\`, \`tax_name\`, \`tax_code\`, \`rate\`, \`is_active\`)
      VALUES
        ('${uuidv4()}', '${gstCategoryId}', 'GST 5%', 'GST5', 5.0000, 1),
        ('${uuidv4()}', '${gstCategoryId}', 'GST 12%', 'GST12', 12.0000, 1),
        ('${uuidv4()}', '${gstCategoryId}', 'GST 18%', 'GST18', 18.0000, 1),
        ('${uuidv4()}', '${gstCategoryId}', 'GST 28%', 'GST28', 28.0000, 1),
        ('${uuidv4()}', '${exemptCategoryId}', 'Zero Tax', 'ZERO', 0.0000, 1)
    `);

    // =====================================================
    // SEED PAYMENT METHODS
    // =====================================================
    await queryRunner.query(`
      INSERT INTO \`payment_methods\` (\`id\`, \`method_code\`, \`method_name\`, \`method_type\`, \`is_active\`, \`display_order\`)
      VALUES
        ('${uuidv4()}', 'CASH', 'Cash', 'CASH', 1, 1),
        ('${uuidv4()}', 'CARD', 'Credit/Debit Card', 'CARD', 1, 2),
        ('${uuidv4()}', 'UPI', 'UPI Payment', 'UPI', 1, 3),
        ('${uuidv4()}', 'NETBANKING', 'Net Banking', 'NET_BANKING', 1, 4),
        ('${uuidv4()}', 'BANK_TRANSFER', 'Bank Transfer', 'BANK_TRANSFER', 1, 5),
        ('${uuidv4()}', 'CHEQUE', 'Cheque', 'CHEQUE', 1, 6),
        ('${uuidv4()}', 'CREDIT', 'Credit', 'CREDIT', 1, 7)
    `);

    // =====================================================
    // SEED PAYMENT TERMS
    // =====================================================
    await queryRunner.query(`
      INSERT INTO \`payment_terms\` (\`id\`, \`term_code\`, \`term_name\`, \`description\`, \`due_days\`, \`is_active\`)
      VALUES
        ('${uuidv4()}', 'IMMEDIATE', 'Due Immediately', 'Payment due on receipt', 0, 1),
        ('${uuidv4()}', 'NET7', 'Net 7', 'Payment due in 7 days', 7, 1),
        ('${uuidv4()}', 'NET15', 'Net 15', 'Payment due in 15 days', 15, 1),
        ('${uuidv4()}', 'NET30', 'Net 30', 'Payment due in 30 days', 30, 1),
        ('${uuidv4()}', 'NET45', 'Net 45', 'Payment due in 45 days', 45, 1),
        ('${uuidv4()}', 'NET60', 'Net 60', 'Payment due in 60 days', 60, 1)
    `);

    // =====================================================
    // SEED COMPANY SETTINGS
    // =====================================================
    await queryRunner.query(`
      INSERT INTO \`company_settings\` (\`id\`, \`setting_key\`, \`setting_value\`, \`value_type\`, \`category\`, \`description\`, \`is_editable\`)
      VALUES
        ('${uuidv4()}', 'company.name', '', 'string', 'company', 'Company name', 1),
        ('${uuidv4()}', 'company.address', '', 'string', 'company', 'Company address', 1),
        ('${uuidv4()}', 'company.phone', '', 'string', 'company', 'Company phone', 1),
        ('${uuidv4()}', 'company.email', '', 'string', 'company', 'Company email', 1),
        ('${uuidv4()}', 'company.tax_id', '', 'string', 'company', 'Company tax ID (GSTIN)', 1),
        ('${uuidv4()}', 'company.logo_url', '', 'string', 'company', 'Company logo URL', 1),
        ('${uuidv4()}', 'inventory.allow_negative_stock', 'false', 'boolean', 'inventory', 'Allow negative stock levels', 1),
        ('${uuidv4()}', 'inventory.default_warehouse', '', 'string', 'inventory', 'Default warehouse ID', 1),
        ('${uuidv4()}', 'inventory.low_stock_threshold', '10', 'number', 'inventory', 'Low stock alert threshold', 1),
        ('${uuidv4()}', 'sales.default_price_list', '', 'string', 'sales', 'Default sales price list ID', 1),
        ('${uuidv4()}', 'sales.default_payment_term', '', 'string', 'sales', 'Default payment term ID', 1),
        ('${uuidv4()}', 'sales.require_approval', 'false', 'boolean', 'sales', 'Require approval for sales orders', 1),
        ('${uuidv4()}', 'purchase.default_payment_term', '', 'string', 'purchase', 'Default payment term ID', 1),
        ('${uuidv4()}', 'purchase.require_approval', 'true', 'boolean', 'purchase', 'Require approval for purchase orders', 1),
        ('${uuidv4()}', 'invoice.prefix', 'INV', 'string', 'invoice', 'Invoice number prefix', 1),
        ('${uuidv4()}', 'invoice.footer_text', '', 'string', 'invoice', 'Invoice footer text', 1)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM \`company_settings\``);
    await queryRunner.query(`DELETE FROM \`payment_terms\``);
    await queryRunner.query(`DELETE FROM \`payment_methods\``);
    await queryRunner.query(`DELETE FROM \`tax_rates\``);
    await queryRunner.query(`DELETE FROM \`tax_categories\``);
    await queryRunner.query(`DELETE FROM \`units_of_measure\``);
    await queryRunner.query(`DELETE FROM \`permissions\``);
    await queryRunner.query(`DELETE FROM \`roles\``);
    await queryRunner.query(`DELETE FROM \`sequences\``);
  }
}
