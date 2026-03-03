"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePricingTables1700000000004 = void 0;
class CreatePricingTables1700000000004 {
    name = 'CreatePricingTables1700000000004';
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE \`price_lists\` (
        \`id\` CHAR(36) NOT NULL,
        \`price_list_code\` VARCHAR(50) NOT NULL,
        \`price_list_name\` VARCHAR(200) NOT NULL,
        \`description\` TEXT NULL,
        \`currency\` CHAR(3) DEFAULT 'INR',
        \`price_type\` ENUM('SALES', 'PURCHASE', 'BOTH') DEFAULT 'SALES',
        \`is_tax_inclusive\` TINYINT(1) DEFAULT 0,
        \`valid_from\` DATE NULL,
        \`valid_to\` DATE NULL,
        \`priority\` INT DEFAULT 0,
        \`is_default\` TINYINT(1) DEFAULT 0,
        \`is_active\` TINYINT(1) DEFAULT 1,
        \`min_order_value\` DECIMAL(15, 4) NULL,
        \`applicable_to\` ENUM('ALL', 'CUSTOMER_GROUP', 'SPECIFIC_CUSTOMERS') DEFAULT 'ALL',
        \`customer_group_id\` CHAR(36) NULL,
        \`created_by\` CHAR(36) NULL,
        \`updated_by\` CHAR(36) NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_price_list_code\` (\`price_list_code\`),
        INDEX \`idx_price_list_active\` (\`is_active\`),
        INDEX \`idx_price_list_type\` (\`price_type\`),
        INDEX \`idx_price_list_validity\` (\`valid_from\`, \`valid_to\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`price_list_items\` (
        \`id\` CHAR(36) NOT NULL,
        \`price_list_id\` CHAR(36) NOT NULL,
        \`product_id\` CHAR(36) NOT NULL,
        \`variant_id\` CHAR(36) NULL,
        \`uom_id\` CHAR(36) NULL,
        \`price\` DECIMAL(15, 4) NOT NULL,
        \`min_quantity\` DECIMAL(15, 4) DEFAULT 1,
        \`discount_percentage\` DECIMAL(8, 4) DEFAULT 0,
        \`discount_amount\` DECIMAL(15, 4) DEFAULT 0,
        \`valid_from\` DATE NULL,
        \`valid_to\` DATE NULL,
        \`is_active\` TINYINT(1) DEFAULT 1,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_price_list_item\` (\`price_list_id\`, \`product_id\`, \`variant_id\`, \`uom_id\`, \`min_quantity\`),
        INDEX \`idx_price_list_item_product\` (\`product_id\`),
        CONSTRAINT \`fk_price_list_item_list\` FOREIGN KEY (\`price_list_id\`) 
          REFERENCES \`price_lists\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`fk_price_list_item_product\` FOREIGN KEY (\`product_id\`) 
          REFERENCES \`products\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`fk_price_list_item_variant\` FOREIGN KEY (\`variant_id\`) 
          REFERENCES \`product_variants\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`fk_price_list_item_uom\` FOREIGN KEY (\`uom_id\`) 
          REFERENCES \`units_of_measure\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`quantity_breaks\` (
        \`id\` CHAR(36) NOT NULL,
        \`price_list_item_id\` CHAR(36) NOT NULL,
        \`min_quantity\` DECIMAL(15, 4) NOT NULL,
        \`max_quantity\` DECIMAL(15, 4) NULL,
        \`price\` DECIMAL(15, 4) NOT NULL,
        \`discount_percentage\` DECIMAL(8, 4) DEFAULT 0,
        \`is_active\` TINYINT(1) DEFAULT 1,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`idx_quantity_break_item\` (\`price_list_item_id\`),
        CONSTRAINT \`fk_quantity_break_item\` FOREIGN KEY (\`price_list_item_id\`) 
          REFERENCES \`price_list_items\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`payment_methods\` (
        \`id\` CHAR(36) NOT NULL,
        \`method_code\` VARCHAR(50) NOT NULL,
        \`method_name\` VARCHAR(100) NOT NULL,
        \`method_type\` ENUM('CASH', 'CARD', 'UPI', 'NET_BANKING', 'WALLET', 'BANK_TRANSFER', 'CHEQUE', 'COD', 'CREDIT', 'EMI', 'GIFT_CARD', 'STORE_CREDIT', 'OTHER') DEFAULT 'CASH',
        \`description\` TEXT NULL,
        \`is_active\` TINYINT(1) DEFAULT 1,
        \`display_order\` INT DEFAULT 0,
        \`icon_url\` VARCHAR(500) NULL,
        \`gateway_config\` JSON NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_payment_method_code\` (\`method_code\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`payment_terms\` (
        \`id\` CHAR(36) NOT NULL,
        \`term_code\` VARCHAR(50) NOT NULL,
        \`term_name\` VARCHAR(100) NOT NULL,
        \`description\` TEXT NULL,
        \`due_days\` INT NOT NULL DEFAULT 0,
        \`discount_days\` INT NULL,
        \`discount_percentage\` DECIMAL(8, 4) NULL,
        \`is_active\` TINYINT(1) DEFAULT 1,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_payment_term_code\` (\`term_code\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS \`payment_terms\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`payment_methods\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`quantity_breaks\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`price_list_items\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`price_lists\``);
    }
}
exports.CreatePricingTables1700000000004 = CreatePricingTables1700000000004;
//# sourceMappingURL=1700000000004-CreatePricingTables.js.map