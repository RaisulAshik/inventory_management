import { MigrationInterface, QueryRunner } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import {
  PERMISSIONS,
  ROLE_PERMISSIONS,
} from '../../../common/constants/permissions';

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
    // SEED PERMISSIONS AND ROLE GRANTS
    // The catalogue lives in src/common/constants/permissions.ts, shared
    // with the tenant provisioning service so the two cannot drift.
    // =====================================================
    const permissionIds = new Map<string, string>();

    for (const perm of PERMISSIONS) {
      const id = uuidv4();
      permissionIds.set(perm.code, id);
      await queryRunner.query(
        `INSERT INTO \`permissions\` (\`id\`, \`permission_code\`, \`permission_name\`, \`module\`)
         VALUES (?, ?, ?, ?)`,
        [id, perm.code, perm.name, perm.module],
      );
    }

    // ADMIN receives the full catalogue.
    for (const permissionId of permissionIds.values()) {
      await queryRunner.query(
        `INSERT INTO \`role_permissions\` (\`id\`, \`role_id\`, \`permission_id\`)
         VALUES (?, ?, ?)`,
        [uuidv4(), adminRoleId, permissionId],
      );
    }

    // The other system roles receive their default grants.
    const systemRoleIds: Record<string, string> = {
      MANAGER: managerRoleId,
      SALES: salesRoleId,
      PURCHASE: purchaseRoleId,
      WAREHOUSE: warehouseRoleId,
    };

    for (const [roleCode, codes] of Object.entries(ROLE_PERMISSIONS)) {
      const roleId = systemRoleIds[roleCode];
      if (!roleId) continue;

      for (const code of codes) {
        const permissionId = permissionIds.get(code);
        if (!permissionId) continue;
        await queryRunner.query(
          `INSERT INTO \`role_permissions\` (\`id\`, \`role_id\`, \`permission_id\`)
           VALUES (?, ?, ?)`,
          [uuidv4(), roleId, permissionId],
        );
      }
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
    await queryRunner.query(`DELETE FROM \`role_permissions\``);
    await queryRunner.query(`DELETE FROM \`permissions\``);
    await queryRunner.query(`DELETE FROM \`roles\``);
    await queryRunner.query(`DELETE FROM \`sequences\``);
  }
}
