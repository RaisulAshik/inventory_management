"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCustomerSupplierTables1700000000005 = void 0;
class CreateCustomerSupplierTables1700000000005 {
    name = 'CreateCustomerSupplierTables1700000000005';
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE \`customer_groups\` (
        \`id\` CHAR(36) NOT NULL,
        \`group_code\` VARCHAR(50) NOT NULL,
        \`group_name\` VARCHAR(100) NOT NULL,
        \`description\` TEXT NULL,
        \`discount_percentage\` DECIMAL(8, 4) DEFAULT 0,
        \`price_list_id\` CHAR(36) NULL,
        \`credit_limit\` DECIMAL(15, 4) NULL,
        \`payment_term_id\` CHAR(36) NULL,
        \`is_active\` TINYINT(1) DEFAULT 1,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_customer_group_code\` (\`group_code\`),
        CONSTRAINT \`fk_customer_group_price_list\` FOREIGN KEY (\`price_list_id\`) 
          REFERENCES \`price_lists\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT \`fk_customer_group_payment_term\` FOREIGN KEY (\`payment_term_id\`) 
          REFERENCES \`payment_terms\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`customers\` (
        \`id\` CHAR(36) NOT NULL,
        \`customer_code\` VARCHAR(50) NOT NULL,
        \`customer_name\` VARCHAR(300) NOT NULL,
        \`display_name\` VARCHAR(200) NULL,
        \`customer_type\` ENUM('INDIVIDUAL', 'BUSINESS', 'WHOLESALE', 'RETAIL') DEFAULT 'INDIVIDUAL',
        \`customer_group_id\` CHAR(36) NULL,
        \`email\` VARCHAR(255) NULL,
        \`phone\` VARCHAR(50) NULL,
        \`mobile\` VARCHAR(50) NULL,
        \`website\` VARCHAR(255) NULL,
        \`tax_id\` VARCHAR(50) NULL,
        \`pan_number\` VARCHAR(20) NULL,
        \`contact_person\` VARCHAR(200) NULL,
        \`price_list_id\` CHAR(36) NULL,
        \`payment_term_id\` CHAR(36) NULL,
        \`credit_limit\` DECIMAL(15, 4) DEFAULT 0,
        \`current_balance\` DECIMAL(15, 4) DEFAULT 0,
        \`is_credit_allowed\` TINYINT(1) DEFAULT 0,
        \`currency\` CHAR(3) DEFAULT 'INR',
        \`notes\` TEXT NULL,
        \`tags\` JSON NULL,
        \`custom_fields\` JSON NULL,
        \`is_active\` TINYINT(1) DEFAULT 1,
        \`created_by\` CHAR(36) NULL,
        \`updated_by\` CHAR(36) NULL,
        \`deleted_at\` DATETIME NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_customer_code\` (\`customer_code\`),
        INDEX \`idx_customer_type\` (\`customer_type\`),
        INDEX \`idx_customer_group\` (\`customer_group_id\`),
        INDEX \`idx_customer_active\` (\`is_active\`),
        INDEX \`idx_customer_email\` (\`email\`),
        INDEX \`idx_customer_phone\` (\`phone\`),
        CONSTRAINT \`fk_customer_group\` FOREIGN KEY (\`customer_group_id\`) 
          REFERENCES \`customer_groups\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT \`fk_customer_price_list\` FOREIGN KEY (\`price_list_id\`) 
          REFERENCES \`price_lists\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT \`fk_customer_payment_term\` FOREIGN KEY (\`payment_term_id\`) 
          REFERENCES \`payment_terms\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`customer_addresses\` (
        \`id\` CHAR(36) NOT NULL,
        \`customer_id\` CHAR(36) NOT NULL,
        \`address_type\` ENUM('BILLING', 'SHIPPING', 'BOTH') DEFAULT 'BOTH',
        \`address_label\` VARCHAR(100) NULL,
        \`contact_person\` VARCHAR(200) NULL,
        \`phone\` VARCHAR(50) NULL,
        \`address_line1\` VARCHAR(255) NOT NULL,
        \`address_line2\` VARCHAR(255) NULL,
        \`city\` VARCHAR(100) NOT NULL,
        \`state\` VARCHAR(100) NULL,
        \`country\` VARCHAR(100) DEFAULT 'BD',
        \`postal_code\` VARCHAR(20) NULL,
        \`landmark\` VARCHAR(255) NULL,
        \`latitude\` DECIMAL(10, 8) NULL,
        \`longitude\` DECIMAL(11, 8) NULL,
        \`is_default\` TINYINT(1) DEFAULT 0,
        \`is_active\` TINYINT(1) DEFAULT 1,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`idx_customer_address_customer\` (\`customer_id\`),
        INDEX \`idx_customer_address_type\` (\`address_type\`),
        CONSTRAINT \`fk_customer_address_customer\` FOREIGN KEY (\`customer_id\`) 
          REFERENCES \`customers\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`customer_credentials\` (
        \`id\` CHAR(36) NOT NULL,
        \`customer_id\` CHAR(36) NOT NULL,
        \`username\` VARCHAR(100) NOT NULL,
        \`password_hash\` VARCHAR(255) NOT NULL,
        \`is_active\` TINYINT(1) DEFAULT 1,
        \`email_verified\` TINYINT(1) DEFAULT 0,
        \`last_login_at\` DATETIME NULL,
        \`failed_login_attempts\` INT DEFAULT 0,
        \`locked_until\` DATETIME NULL,
        \`password_reset_token\` VARCHAR(255) NULL,
        \`password_reset_expires\` DATETIME NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_customer_credential_username\` (\`username\`),
        UNIQUE KEY \`uk_customer_credential_customer\` (\`customer_id\`),
        CONSTRAINT \`fk_customer_credential_customer\` FOREIGN KEY (\`customer_id\`) 
          REFERENCES \`customers\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`customer_dues\` (
        \`id\` CHAR(36) NOT NULL,
        \`customer_id\` CHAR(36) NOT NULL,
        \`sales_order_id\` CHAR(36) NULL,
        \`invoice_number\` VARCHAR(50) NULL,
        \`due_date\` DATE NOT NULL,
        \`original_amount\` DECIMAL(15, 4) NOT NULL,
        \`paid_amount\` DECIMAL(15, 4) DEFAULT 0,
        \`adjusted_amount\` DECIMAL(15, 4) DEFAULT 0,
        \`currency\` CHAR(3) DEFAULT 'INR',
        \`status\` ENUM('PENDING', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED', 'WRITTEN_OFF') DEFAULT 'PENDING',
        \`notes\` TEXT NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`idx_customer_due_customer\` (\`customer_id\`),
        INDEX \`idx_customer_due_status\` (\`status\`),
        INDEX \`idx_customer_due_date\` (\`due_date\`),
        CONSTRAINT \`fk_customer_due_customer\` FOREIGN KEY (\`customer_id\`) 
          REFERENCES \`customers\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`suppliers\` (
        \`id\` CHAR(36) NOT NULL,
        \`supplier_code\` VARCHAR(50) NOT NULL,
        \`supplier_name\` VARCHAR(300) NOT NULL,
        \`display_name\` VARCHAR(200) NULL,
        \`supplier_type\` VARCHAR(50) NULL,
        \`email\` VARCHAR(255) NULL,
        \`phone\` VARCHAR(50) NULL,
        \`mobile\` VARCHAR(50) NULL,
        \`fax\` VARCHAR(50) NULL,
        \`website\` VARCHAR(255) NULL,
        \`tax_id\` VARCHAR(50) NULL,
        \`pan_number\` VARCHAR(20) NULL,
        \`contact_person\` VARCHAR(200) NULL,
        \`payment_term_id\` CHAR(36) NULL,
        \`credit_limit\` DECIMAL(15, 4) DEFAULT 0,
        \`current_balance\` DECIMAL(15, 4) DEFAULT 0,
        \`currency\` CHAR(3) DEFAULT 'INR',
        \`lead_time_days\` INT DEFAULT 0,
        \`rating\` DECIMAL(3, 2) NULL,
        \`bank_name\` VARCHAR(200) NULL,
        \`bank_account_number\` VARCHAR(50) NULL,
        \`bank_ifsc_code\` VARCHAR(20) NULL,
        \`bank_branch\` VARCHAR(200) NULL,
        \`notes\` TEXT NULL,
        \`tags\` JSON NULL,
        \`custom_fields\` JSON NULL,
        \`is_active\` TINYINT(1) DEFAULT 1,
        \`created_by\` CHAR(36) NULL,
        \`updated_by\` CHAR(36) NULL,
        \`deleted_at\` DATETIME NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_supplier_code\` (\`supplier_code\`),
        INDEX \`idx_supplier_active\` (\`is_active\`),
        INDEX \`idx_supplier_email\` (\`email\`),
        CONSTRAINT \`fk_supplier_payment_term\` FOREIGN KEY (\`payment_term_id\`) 
          REFERENCES \`payment_terms\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`supplier_addresses\` (
        \`id\` CHAR(36) NOT NULL,
        \`supplier_id\` CHAR(36) NOT NULL,
        \`address_type\` ENUM('BILLING', 'SHIPPING', 'BOTH') DEFAULT 'BOTH',
        \`address_label\` VARCHAR(100) NULL,
        \`contact_person\` VARCHAR(200) NULL,
        \`phone\` VARCHAR(50) NULL,
        \`address_line1\` VARCHAR(255) NOT NULL,
        \`address_line2\` VARCHAR(255) NULL,
        \`city\` VARCHAR(100) NOT NULL,
        \`state\` VARCHAR(100) NULL,
        \`country\` VARCHAR(100) DEFAULT 'BD',
        \`postal_code\` VARCHAR(20) NULL,
        \`is_default\` TINYINT(1) DEFAULT 0,
        \`is_active\` TINYINT(1) DEFAULT 1,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`idx_supplier_address_supplier\` (\`supplier_id\`),
        CONSTRAINT \`fk_supplier_address_supplier\` FOREIGN KEY (\`supplier_id\`) 
          REFERENCES \`suppliers\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`supplier_contacts\` (
        \`id\` CHAR(36) NOT NULL,
        \`supplier_id\` CHAR(36) NOT NULL,
        \`contact_name\` VARCHAR(200) NOT NULL,
        \`designation\` VARCHAR(100) NULL,
        \`department\` VARCHAR(100) NULL,
        \`email\` VARCHAR(255) NULL,
        \`phone\` VARCHAR(50) NULL,
        \`mobile\` VARCHAR(50) NULL,
        \`is_primary\` TINYINT(1) DEFAULT 0,
        \`is_active\` TINYINT(1) DEFAULT 1,
        \`notes\` TEXT NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`idx_supplier_contact_supplier\` (\`supplier_id\`),
        CONSTRAINT \`fk_supplier_contact_supplier\` FOREIGN KEY (\`supplier_id\`) 
          REFERENCES \`suppliers\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`supplier_products\` (
        \`id\` CHAR(36) NOT NULL,
        \`supplier_id\` CHAR(36) NOT NULL,
        \`product_id\` CHAR(36) NOT NULL,
        \`variant_id\` CHAR(36) NULL,
        \`supplier_sku\` VARCHAR(100) NULL,
        \`supplier_product_name\` VARCHAR(300) NULL,
        \`unit_price\` DECIMAL(15, 4) NULL,
        \`min_order_quantity\` DECIMAL(15, 4) DEFAULT 1,
        \`lead_time_days\` INT NULL,
        \`is_preferred\` TINYINT(1) DEFAULT 0,
        \`is_active\` TINYINT(1) DEFAULT 1,
        \`notes\` TEXT NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_supplier_product\` (\`supplier_id\`, \`product_id\`, \`variant_id\`),
        INDEX \`idx_supplier_product_product\` (\`product_id\`),
        CONSTRAINT \`fk_supplier_product_supplier\` FOREIGN KEY (\`supplier_id\`) 
          REFERENCES \`suppliers\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`fk_supplier_product_product\` FOREIGN KEY (\`product_id\`) 
          REFERENCES \`products\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`supplier_dues\` (
        \`id\` CHAR(36) NOT NULL,
        \`supplier_id\` CHAR(36) NOT NULL,
        \`purchase_order_id\` CHAR(36) NULL,
        \`grn_id\` CHAR(36) NULL,
        \`invoice_number\` VARCHAR(50) NULL,
        \`due_date\` DATE NOT NULL,
        \`original_amount\` DECIMAL(15, 4) NOT NULL,
        \`paid_amount\` DECIMAL(15, 4) DEFAULT 0,
        \`adjusted_amount\` DECIMAL(15, 4) DEFAULT 0,
        \`currency\` CHAR(3) DEFAULT 'INR',
        \`status\` ENUM('PENDING', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED') DEFAULT 'PENDING',
        \`notes\` TEXT NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`idx_supplier_due_supplier\` (\`supplier_id\`),
        INDEX \`idx_supplier_due_status\` (\`status\`),
        INDEX \`idx_supplier_due_date\` (\`due_date\`),
        CONSTRAINT \`fk_supplier_due_supplier\` FOREIGN KEY (\`supplier_id\`) 
          REFERENCES \`suppliers\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS \`supplier_dues\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`supplier_products\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`supplier_contacts\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`supplier_addresses\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`suppliers\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`customer_dues\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`customer_credentials\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`customer_addresses\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`customers\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`customer_groups\``);
    }
}
exports.CreateCustomerSupplierTables1700000000005 = CreateCustomerSupplierTables1700000000005;
//# sourceMappingURL=1700000000005-CreateCustomerSupplierTables.js.map