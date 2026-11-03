import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adds `sales_orders.customer_po_number`: the customer's own purchase order
 * number, printed under the order number on the sales order.
 *
 * TenantSchemaBootstrap applies the same change on startup, so on a running
 * system this has usually happened already; the guard makes it a no-op then.
 */
export class AddSalesOrderCustomerPoNumber1700000000016 implements MigrationInterface {
  name = 'AddSalesOrderCustomerPoNumber1700000000016';

  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasTable('sales_orders'))) return;
    if (await queryRunner.hasColumn('sales_orders', 'customer_po_number')) {
      return;
    }
    await queryRunner.query(
      'ALTER TABLE `sales_orders` ADD COLUMN `customer_po_number` VARCHAR(100) NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasColumn('sales_orders', 'customer_po_number')) {
      await queryRunner.query(
        'ALTER TABLE `sales_orders` DROP COLUMN `customer_po_number`',
      );
    }
  }
}
