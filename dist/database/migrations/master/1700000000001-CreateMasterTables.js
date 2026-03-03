"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMasterTables1700000000001 = void 0;
class CreateMasterTables1700000000001 {
    name = 'CreateMasterTables1700000000001';
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE \`tenants\` (
        \`id\` CHAR(36) NOT NULL,
        \`tenant_code\` VARCHAR(50) NOT NULL,
        \`company_name\` VARCHAR(300) NOT NULL,
        \`display_name\` VARCHAR(200) NULL,
        \`email\` VARCHAR(255) NOT NULL,
        \`phone\` VARCHAR(50) NULL,
        \`website\` VARCHAR(255) NULL,
        \`address_line1\` VARCHAR(255) NULL,
        \`address_line2\` VARCHAR(255) NULL,
        \`city\` VARCHAR(100) NULL,
        \`state\` VARCHAR(100) NULL,
        \`country\` VARCHAR(100) DEFAULT 'BD',
        \`postal_code\` VARCHAR(20) NULL,
        \`tax_id\` VARCHAR(50) NULL,
        \`industry\` VARCHAR(100) NULL,
        \`employee_count\` INT NULL,
        \`timezone\` VARCHAR(50) DEFAULT 'Asia/Kolkata',
        \`date_format\` VARCHAR(20) DEFAULT 'DD/MM/YYYY',
        \`currency\` CHAR(3) DEFAULT 'INR',
        \`logo_url\` VARCHAR(500) NULL,
        \`status\` ENUM('PENDING', 'ACTIVE', 'SUSPENDED', 'INACTIVE', 'DELETED') DEFAULT 'PENDING',
        \`activated_at\` DATETIME NULL,
        \`suspended_at\` DATETIME NULL,
        \`suspension_reason\` VARCHAR(500) NULL,
        \`deleted_at\` DATETIME NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_tenant_code\` (\`tenant_code\`),
        UNIQUE KEY \`uk_tenant_email\` (\`email\`),
        INDEX \`idx_tenant_status\` (\`status\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`tenant_databases\` (
        \`id\` CHAR(36) NOT NULL,
        \`tenant_id\` CHAR(36) NOT NULL,
        \`database_name\` VARCHAR(100) NOT NULL,
        \`host\` VARCHAR(255) DEFAULT 'localhost',
        \`port\` INT DEFAULT 3306,
        \`username\` VARCHAR(100) NULL,
        \`password_encrypted\` VARCHAR(500) NULL,
        \`is_provisioned\` TINYINT(1) DEFAULT 0,
        \`is_active\` TINYINT(1) DEFAULT 0,
        \`provisioned_at\` DATETIME NULL,
        \`last_backup_at\` DATETIME NULL,
        \`storage_used_bytes\` BIGINT DEFAULT 0,
        \`connection_string\` TEXT NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_tenant_database\` (\`tenant_id\`),
        UNIQUE KEY \`uk_database_name\` (\`database_name\`),
        CONSTRAINT \`fk_tenant_db_tenant\` FOREIGN KEY (\`tenant_id\`) 
          REFERENCES \`tenants\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`tenant_users\` (
        \`id\` CHAR(36) NOT NULL,
        \`tenant_id\` CHAR(36) NOT NULL,
        \`email\` VARCHAR(255) NOT NULL,
        \`password_hash\` VARCHAR(255) NOT NULL,
        \`first_name\` VARCHAR(100) NOT NULL,
        \`last_name\` VARCHAR(100) NULL,
        \`phone\` VARCHAR(50) NULL,
        \`is_admin\` TINYINT(1) DEFAULT 0,
        \`is_active\` TINYINT(1) DEFAULT 1,
        \`email_verified\` TINYINT(1) DEFAULT 0,
        \`email_verified_at\` DATETIME NULL,
        \`last_login_at\` DATETIME NULL,
        \`last_login_ip\` VARCHAR(45) NULL,
        \`failed_login_attempts\` INT DEFAULT 0,
        \`locked_until\` DATETIME NULL,
        \`password_reset_token\` VARCHAR(255) NULL,
        \`password_reset_expires\` DATETIME NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_tenant_user_email\` (\`tenant_id\`, \`email\`),
        INDEX \`idx_tenant_user_email\` (\`email\`),
        CONSTRAINT \`fk_tenant_user_tenant\` FOREIGN KEY (\`tenant_id\`) 
          REFERENCES \`tenants\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`subscription_plans\` (
        \`id\` CHAR(36) NOT NULL,
        \`plan_code\` VARCHAR(50) NOT NULL,
        \`plan_name\` VARCHAR(200) NOT NULL,
        \`description\` TEXT NULL,
        \`price\` DECIMAL(15, 2) NOT NULL,
        \`currency\` CHAR(3) DEFAULT 'INR',
        \`billing_cycle\` ENUM('MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'ANNUAL') DEFAULT 'MONTHLY',
        \`trial_days\` INT DEFAULT 0,
        \`max_users\` INT NULL,
        \`max_warehouses\` INT NULL,
        \`max_products\` INT NULL,
        \`max_orders\` INT NULL,
        \`storage_gb\` DECIMAL(10, 2) NULL,
        \`is_active\` TINYINT(1) DEFAULT 1,
        \`display_order\` INT DEFAULT 0,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_plan_code\` (\`plan_code\`),
        INDEX \`idx_plan_active\` (\`is_active\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`plan_features\` (
        \`id\` CHAR(36) NOT NULL,
        \`plan_id\` CHAR(36) NOT NULL,
        \`feature_code\` VARCHAR(100) NOT NULL,
        \`feature_name\` VARCHAR(200) NOT NULL,
        \`description\` TEXT NULL,
        \`is_enabled\` TINYINT(1) DEFAULT 1,
        \`limit_value\` VARCHAR(100) NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_plan_feature\` (\`plan_id\`, \`feature_code\`),
        CONSTRAINT \`fk_plan_feature_plan\` FOREIGN KEY (\`plan_id\`) 
          REFERENCES \`subscription_plans\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`subscriptions\` (
        \`id\` CHAR(36) NOT NULL,
        \`tenant_id\` CHAR(36) NOT NULL,
        \`plan_id\` CHAR(36) NOT NULL,
        \`status\` ENUM('TRIAL', 'ACTIVE', 'PAST_DUE', 'SUSPENDED', 'CANCELLED', 'EXPIRED') DEFAULT 'TRIAL',
        \`start_date\` DATE NOT NULL,
        \`trial_end_date\` DATE NULL,
        \`current_period_start\` DATE NOT NULL,
        \`current_period_end\` DATE NOT NULL,
        \`quantity\` INT DEFAULT 1,
        \`unit_price\` DECIMAL(15, 2) NOT NULL,
        \`currency\` CHAR(3) DEFAULT 'INR',
        \`billing_cycle\` ENUM('MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'ANNUAL') DEFAULT 'MONTHLY',
        \`auto_renew\` TINYINT(1) DEFAULT 1,
        \`cancel_at_period_end\` TINYINT(1) DEFAULT 0,
        \`cancelled_at\` DATETIME NULL,
        \`cancellation_reason\` VARCHAR(500) NULL,
        \`payment_method\` VARCHAR(50) NULL,
        \`payment_reference\` VARCHAR(255) NULL,
        \`last_payment_at\` DATETIME NULL,
        \`next_billing_at\` DATETIME NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_subscription_tenant\` (\`tenant_id\`),
        INDEX \`idx_subscription_status\` (\`status\`),
        INDEX \`idx_subscription_period_end\` (\`current_period_end\`),
        CONSTRAINT \`fk_subscription_tenant\` FOREIGN KEY (\`tenant_id\`) 
          REFERENCES \`tenants\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`fk_subscription_plan\` FOREIGN KEY (\`plan_id\`) 
          REFERENCES \`subscription_plans\` (\`id\`) ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`billing_history\` (
        \`id\` CHAR(36) NOT NULL,
        \`tenant_id\` CHAR(36) NOT NULL,
        \`subscription_id\` CHAR(36) NULL,
        \`invoice_number\` VARCHAR(50) NOT NULL,
        \`amount\` DECIMAL(15, 2) NOT NULL,
        \`tax_amount\` DECIMAL(15, 2) DEFAULT 0,
        \`total_amount\` DECIMAL(15, 2) NOT NULL,
        \`currency\` CHAR(3) DEFAULT 'INR',
        \`status\` ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED', 'CANCELLED') DEFAULT 'PENDING',
        \`description\` TEXT NULL,
        \`period_start\` DATE NULL,
        \`period_end\` DATE NULL,
        \`invoice_date\` DATE NOT NULL,
        \`due_date\` DATE NOT NULL,
        \`paid_date\` DATE NULL,
        \`payment_method\` VARCHAR(50) NULL,
        \`payment_reference\` VARCHAR(255) NULL,
        \`transaction_id\` VARCHAR(255) NULL,
        \`payment_gateway_response\` TEXT NULL,
        \`refund_amount\` DECIMAL(15, 2) NULL,
        \`refund_date\` DATE NULL,
        \`refund_reason\` VARCHAR(500) NULL,
        \`invoice_url\` VARCHAR(500) NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_invoice_number\` (\`invoice_number\`),
        INDEX \`idx_billing_tenant_date\` (\`tenant_id\`, \`invoice_date\`),
        INDEX \`idx_billing_status\` (\`status\`),
        CONSTRAINT \`fk_billing_tenant\` FOREIGN KEY (\`tenant_id\`) 
          REFERENCES \`tenants\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`fk_billing_subscription\` FOREIGN KEY (\`subscription_id\`) 
          REFERENCES \`subscriptions\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`system_settings\` (
        \`id\` CHAR(36) NOT NULL,
        \`setting_key\` VARCHAR(100) NOT NULL,
        \`setting_value\` TEXT NULL,
        \`value_type\` VARCHAR(20) DEFAULT 'string',
        \`category\` VARCHAR(100) NULL,
        \`description\` TEXT NULL,
        \`is_public\` TINYINT(1) DEFAULT 0,
        \`is_editable\` TINYINT(1) DEFAULT 1,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_setting_key\` (\`setting_key\`),
        INDEX \`idx_setting_category\` (\`category\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`master_audit_logs\` (
        \`id\` CHAR(36) NOT NULL,
        \`user_id\` CHAR(36) NULL,
        \`tenant_id\` CHAR(36) NULL,
        \`action\` VARCHAR(50) NOT NULL,
        \`entity_type\` VARCHAR(100) NOT NULL,
        \`entity_id\` CHAR(36) NULL,
        \`old_values\` JSON NULL,
        \`new_values\` JSON NULL,
        \`ip_address\` VARCHAR(45) NULL,
        \`user_agent\` VARCHAR(500) NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`idx_audit_user\` (\`user_id\`),
        INDEX \`idx_audit_tenant\` (\`tenant_id\`),
        INDEX \`idx_audit_entity\` (\`entity_type\`, \`entity_id\`),
        INDEX \`idx_audit_created\` (\`created_at\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS \`master_audit_logs\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`system_settings\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`billing_history\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`subscriptions\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`plan_features\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`subscription_plans\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`tenant_users\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`tenant_databases\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`tenants\``);
    }
}
exports.CreateMasterTables1700000000001 = CreateMasterTables1700000000001;
//# sourceMappingURL=1700000000001-CreateMasterTables.js.map