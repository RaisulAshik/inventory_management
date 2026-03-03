"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSalesTables1700000000006 = void 0;
class CreateSalesTables1700000000006 {
    name = 'CreateSalesTables1700000000006';
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE \`sales_orders\` (
        \`id\` CHAR(36) NOT NULL,
        \`order_number\` VARCHAR(50) NOT NULL,
        \`customer_id\` CHAR(36) NOT NULL,
        \`warehouse_id\` CHAR(36) NOT NULL,
        \`order_date\` DATE NOT NULL,
        \`expected_delivery_date\` DATE NULL,
        \`delivery_date\` DATE NULL,
        \`status\` ENUM('DRAFT', 'PENDING', 'CONFIRMED', 'PROCESSING', 'READY_TO_SHIP', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'RETURNED', 'ON_HOLD') DEFAULT 'DRAFT',
        \`billing_address_id\` CHAR(36) NULL,
        \`shipping_address_id\` CHAR(36) NULL,
        \`price_list_id\` CHAR(36) NULL,
        \`currency\` CHAR(3) DEFAULT 'INR',
        \`exchange_rate\` DECIMAL(15, 6) DEFAULT 1,
        \`subtotal\` DECIMAL(15, 4) DEFAULT 0,
        \`discount_percentage\` DECIMAL(8, 4) DEFAULT 0,
        \`discount_amount\` DECIMAL(15, 4) DEFAULT 0,
        \`tax_amount\` DECIMAL(15, 4) DEFAULT 0,
        \`shipping_amount\` DECIMAL(15, 4) DEFAULT 0,
        \`other_charges\` DECIMAL(15, 4) DEFAULT 0,
        \`total_amount\` DECIMAL(15, 4) DEFAULT 0,
        \`paid_amount\` DECIMAL(15, 4) DEFAULT 0,
        \`payment_status\` ENUM('PENDING', 'PARTIAL', 'PAID', 'REFUNDED') DEFAULT 'PENDING',
        \`payment_term_id\` CHAR(36) NULL,
        \`due_date\` DATE NULL,
        \`shipping_method\` VARCHAR(100) NULL,
        \`tracking_number\` VARCHAR(200) NULL,
        \`customer_reference\` VARCHAR(100) NULL,
        \`internal_notes\` TEXT NULL,
        \`customer_notes\` TEXT NULL,
        \`tags\` JSON NULL,
        \`confirmed_by\` CHAR(36) NULL,
        \`confirmed_at\` DATETIME NULL,
        \`shipped_by\` CHAR(36) NULL,
        \`shipped_at\` DATETIME NULL,
        \`delivered_at\` DATETIME NULL,
        \`completed_at\` DATETIME NULL,
        \`cancelled_at\` DATETIME NULL,
        \`cancellation_reason\` VARCHAR(500) NULL,
        \`created_by\` CHAR(36) NULL,
        \`updated_by\` CHAR(36) NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_order_number\` (\`order_number\`),
        INDEX \`idx_order_customer\` (\`customer_id\`),
        INDEX \`idx_order_warehouse\` (\`warehouse_id\`),
        INDEX \`idx_order_status\` (\`status\`),
        INDEX \`idx_order_date\` (\`order_date\`),
        INDEX \`idx_order_payment_status\` (\`payment_status\`),
        CONSTRAINT \`fk_order_customer\` FOREIGN KEY (\`customer_id\`) 
          REFERENCES \`customers\` (\`id\`) ON UPDATE CASCADE,
        CONSTRAINT \`fk_order_warehouse\` FOREIGN KEY (\`warehouse_id\`) 
          REFERENCES \`warehouses\` (\`id\`) ON UPDATE CASCADE,
        CONSTRAINT \`fk_order_billing_address\` FOREIGN KEY (\`billing_address_id\`) 
          REFERENCES \`customer_addresses\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT \`fk_order_shipping_address\` FOREIGN KEY (\`shipping_address_id\`) 
          REFERENCES \`customer_addresses\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT \`fk_order_price_list\` FOREIGN KEY (\`price_list_id\`) 
          REFERENCES \`price_lists\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT \`fk_order_payment_term\` FOREIGN KEY (\`payment_term_id\`) 
          REFERENCES \`payment_terms\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`sales_order_items\` (
        \`id\` CHAR(36) NOT NULL,
        \`order_id\` CHAR(36) NOT NULL,
        \`product_id\` CHAR(36) NOT NULL,
        \`variant_id\` CHAR(36) NULL,
        \`product_name\` VARCHAR(300) NOT NULL,
        \`sku\` VARCHAR(100) NOT NULL,
        \`quantity\` DECIMAL(15, 4) NOT NULL,
        \`shipped_quantity\` DECIMAL(15, 4) DEFAULT 0,
        \`delivered_quantity\` DECIMAL(15, 4) DEFAULT 0,
        \`returned_quantity\` DECIMAL(15, 4) DEFAULT 0,
        \`uom_id\` CHAR(36) NULL,
        \`unit_price\` DECIMAL(15, 4) NOT NULL,
        \`discount_percentage\` DECIMAL(8, 4) DEFAULT 0,
        \`discount_amount\` DECIMAL(15, 4) DEFAULT 0,
        \`tax_percentage\` DECIMAL(8, 4) DEFAULT 0,
        \`tax_amount\` DECIMAL(15, 4) DEFAULT 0,
        \`line_total\` DECIMAL(15, 4) NOT NULL,
        \`cost_price\` DECIMAL(15, 4) NULL,
        \`location_id\` CHAR(36) NULL,
        \`batch_id\` CHAR(36) NULL,
        \`serial_numbers\` JSON NULL,
        \`notes\` TEXT NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`idx_order_item_order\` (\`order_id\`),
        INDEX \`idx_order_item_product\` (\`product_id\`),
        CONSTRAINT \`fk_order_item_order\` FOREIGN KEY (\`order_id\`) 
          REFERENCES \`sales_orders\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`fk_order_item_product\` FOREIGN KEY (\`product_id\`) 
          REFERENCES \`products\` (\`id\`) ON UPDATE CASCADE,
        CONSTRAINT \`fk_order_item_variant\` FOREIGN KEY (\`variant_id\`) 
          REFERENCES \`product_variants\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT \`fk_order_item_uom\` FOREIGN KEY (\`uom_id\`) 
          REFERENCES \`units_of_measure\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`sales_order_payments\` (
        \`id\` CHAR(36) NOT NULL,
        \`order_id\` CHAR(36) NOT NULL,
        \`payment_number\` VARCHAR(50) NOT NULL,
        \`payment_date\` DATE NOT NULL,
        \`payment_method_id\` CHAR(36) NULL,
        \`amount\` DECIMAL(15, 4) NOT NULL,
        \`currency\` CHAR(3) DEFAULT 'INR',
        \`exchange_rate\` DECIMAL(15, 6) DEFAULT 1,
        \`status\` ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED', 'PARTIALLY_REFUNDED') DEFAULT 'PENDING',
        \`transaction_reference\` VARCHAR(200) NULL,
        \`gateway_response\` JSON NULL,
        \`refunded_amount\` DECIMAL(15, 4) DEFAULT 0,
        \`refund_date\` DATE NULL,
        \`refund_reason\` VARCHAR(500) NULL,
        \`notes\` TEXT NULL,
        \`received_by\` CHAR(36) NULL,
        \`created_by\` CHAR(36) NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_payment_number\` (\`payment_number\`),
        INDEX \`idx_payment_order\` (\`order_id\`),
        INDEX \`idx_payment_status\` (\`status\`),
        INDEX \`idx_payment_date\` (\`payment_date\`),
        CONSTRAINT \`fk_payment_order\` FOREIGN KEY (\`order_id\`) 
          REFERENCES \`sales_orders\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`fk_payment_method\` FOREIGN KEY (\`payment_method_id\`) 
          REFERENCES \`payment_methods\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`sales_returns\` (
        \`id\` CHAR(36) NOT NULL,
        \`return_number\` VARCHAR(50) NOT NULL,
        \`sales_order_id\` CHAR(36) NOT NULL,
        \`customer_id\` CHAR(36) NOT NULL,
        \`warehouse_id\` CHAR(36) NOT NULL,
        \`return_date\` DATE NOT NULL,
        \`status\` ENUM('PENDING', 'APPROVED', 'REJECTED', 'RECEIVED', 'PROCESSING', 'REFUNDED', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
        \`return_type\` ENUM('REFUND', 'EXCHANGE', 'CREDIT_NOTE', 'REPLACEMENT') DEFAULT 'REFUND',
        \`reason\` VARCHAR(500) NOT NULL,
        \`reason_details\` TEXT NULL,
        \`currency\` CHAR(3) DEFAULT 'INR',
        \`subtotal\` DECIMAL(15, 4) DEFAULT 0,
        \`tax_amount\` DECIMAL(15, 4) DEFAULT 0,
        \`refund_amount\` DECIMAL(15, 4) DEFAULT 0,
        \`restocking_fee\` DECIMAL(15, 4) DEFAULT 0,
        \`total_amount\` DECIMAL(15, 4) DEFAULT 0,
        \`refund_method\` VARCHAR(50) NULL,
        \`refund_reference\` VARCHAR(200) NULL,
        \`refunded_at\` DATETIME NULL,
        \`credit_note_number\` VARCHAR(50) NULL,
        \`approved_by\` CHAR(36) NULL,
        \`approved_at\` DATETIME NULL,
        \`received_by\` CHAR(36) NULL,
        \`received_at\` DATETIME NULL,
        \`rejection_reason\` VARCHAR(500) NULL,
        \`internal_notes\` TEXT NULL,
        \`customer_notes\` TEXT NULL,
        \`created_by\` CHAR(36) NULL,
        \`updated_by\` CHAR(36) NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_return_number\` (\`return_number\`),
        INDEX \`idx_return_order\` (\`sales_order_id\`),
        INDEX \`idx_return_customer\` (\`customer_id\`),
        INDEX \`idx_return_status\` (\`status\`),
        INDEX \`idx_return_date\` (\`return_date\`),
        CONSTRAINT \`fk_return_order\` FOREIGN KEY (\`sales_order_id\`) 
          REFERENCES \`sales_orders\` (\`id\`) ON UPDATE CASCADE,
        CONSTRAINT \`fk_return_customer\` FOREIGN KEY (\`customer_id\`) 
          REFERENCES \`customers\` (\`id\`) ON UPDATE CASCADE,
        CONSTRAINT \`fk_return_warehouse\` FOREIGN KEY (\`warehouse_id\`) 
          REFERENCES \`warehouses\` (\`id\`) ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`sales_return_items\` (
        \`id\` CHAR(36) NOT NULL,
        \`return_id\` CHAR(36) NOT NULL,
        \`order_item_id\` CHAR(36) NULL,
        \`product_id\` CHAR(36) NOT NULL,
        \`variant_id\` CHAR(36) NULL,
        \`quantity\` DECIMAL(15, 4) NOT NULL,
        \`received_quantity\` DECIMAL(15, 4) DEFAULT 0,
        \`uom_id\` CHAR(36) NULL,
        \`unit_price\` DECIMAL(15, 4) NOT NULL,
        \`tax_amount\` DECIMAL(15, 4) DEFAULT 0,
        \`line_total\` DECIMAL(15, 4) NOT NULL,
        \`reason\` VARCHAR(500) NULL,
        \`condition\` ENUM('NEW', 'GOOD', 'DAMAGED', 'DEFECTIVE', 'EXPIRED') DEFAULT 'GOOD',
        \`location_id\` CHAR(36) NULL,
        \`batch_id\` CHAR(36) NULL,
        \`serial_numbers\` JSON NULL,
        \`notes\` TEXT NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`idx_return_item_return\` (\`return_id\`),
        INDEX \`idx_return_item_product\` (\`product_id\`),
        CONSTRAINT \`fk_return_item_return\` FOREIGN KEY (\`return_id\`) 
          REFERENCES \`sales_returns\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`fk_return_item_product\` FOREIGN KEY (\`product_id\`) 
          REFERENCES \`products\` (\`id\`) ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS \`sales_return_items\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`sales_returns\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`sales_order_payments\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`sales_order_items\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`sales_orders\``);
    }
}
exports.CreateSalesTables1700000000006 = CreateSalesTables1700000000006;
//# sourceMappingURL=1700000000006-CreateSalesTables.js.map