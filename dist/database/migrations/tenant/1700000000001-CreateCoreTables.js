"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCoreTables1700000000001 = void 0;
class CreateCoreTables1700000000001 {
    name = 'CreateCoreTables1700000000001';
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE \`sequences\` (
        \`id\` CHAR(36) NOT NULL,
        \`sequence_type\` VARCHAR(50) NOT NULL,
        \`prefix\` VARCHAR(20) NULL,
        \`current_value\` BIGINT NOT NULL DEFAULT 0,
        \`number_length\` INT NOT NULL DEFAULT 6,
        \`include_year\` TINYINT(1) DEFAULT 1,
        \`include_month\` TINYINT(1) DEFAULT 0,
        \`separator\` VARCHAR(5) DEFAULT '-',
        \`reset_period\` ENUM('DAILY', 'MONTHLY', 'YEARLY', 'NEVER') DEFAULT 'YEARLY',
        \`last_reset_date\` DATE NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_sequence_type\` (\`sequence_type\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`users\` (
        \`id\` CHAR(36) NOT NULL,
        \`employee_code\` VARCHAR(50) NULL,
        \`email\` VARCHAR(255) NOT NULL,
        \`password_hash\` VARCHAR(255) NOT NULL,
        \`first_name\` VARCHAR(100) NOT NULL,
        \`last_name\` VARCHAR(100) NULL,
        \`display_name\` VARCHAR(200) NULL,
        \`phone\` VARCHAR(50) NULL,
        \`mobile\` VARCHAR(50) NULL,
        \`avatar_url\` VARCHAR(500) NULL,
        \`department\` VARCHAR(100) NULL,
        \`designation\` VARCHAR(100) NULL,
        \`date_of_joining\` DATE NULL,
        \`is_active\` TINYINT(1) DEFAULT 1,
        \`email_verified\` TINYINT(1) DEFAULT 0,
        \`email_verified_at\` DATETIME NULL,
        \`last_login_at\` DATETIME NULL,
        \`last_login_ip\` VARCHAR(45) NULL,
        \`failed_login_attempts\` INT DEFAULT 0,
        \`locked_until\` DATETIME NULL,
        \`password_changed_at\` DATETIME NULL,
        \`must_change_password\` TINYINT(1) DEFAULT 0,
        \`password_reset_token\` VARCHAR(255) NULL,
        \`password_reset_expires\` DATETIME NULL,
        \`preferences\` JSON NULL,
        \`created_by\` CHAR(36) NULL,
        \`updated_by\` CHAR(36) NULL,
        \`deleted_at\` DATETIME NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_user_email\` (\`email\`),
        UNIQUE KEY \`uk_employee_code\` (\`employee_code\`),
        INDEX \`idx_user_active\` (\`is_active\`),
        INDEX \`idx_user_deleted\` (\`deleted_at\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`roles\` (
        \`id\` CHAR(36) NOT NULL,
        \`role_code\` VARCHAR(50) NOT NULL,
        \`role_name\` VARCHAR(100) NOT NULL,
        \`description\` TEXT NULL,
        \`is_system\` TINYINT(1) DEFAULT 0,
        \`is_active\` TINYINT(1) DEFAULT 1,
        \`created_by\` CHAR(36) NULL,
        \`updated_by\` CHAR(36) NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_role_code\` (\`role_code\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`permissions\` (
        \`id\` CHAR(36) NOT NULL,
        \`permission_code\` VARCHAR(100) NOT NULL,
        \`permission_name\` VARCHAR(200) NOT NULL,
        \`module\` VARCHAR(50) NOT NULL,
        \`description\` TEXT NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_permission_code\` (\`permission_code\`),
        INDEX \`idx_permission_module\` (\`module\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`user_roles\` (
        \`id\` CHAR(36) NOT NULL,
        \`user_id\` CHAR(36) NOT NULL,
        \`role_id\` CHAR(36) NOT NULL,
        \`assigned_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`assigned_by\` CHAR(36) NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_user_role\` (\`user_id\`, \`role_id\`),
        CONSTRAINT \`fk_user_role_user\` FOREIGN KEY (\`user_id\`) 
          REFERENCES \`users\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`fk_user_role_role\` FOREIGN KEY (\`role_id\`) 
          REFERENCES \`roles\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`role_permissions\` (
        \`id\` CHAR(36) NOT NULL,
        \`role_id\` CHAR(36) NOT NULL,
        \`permission_id\` CHAR(36) NOT NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_role_permission\` (\`role_id\`, \`permission_id\`),
        CONSTRAINT \`fk_role_permission_role\` FOREIGN KEY (\`role_id\`) 
          REFERENCES \`roles\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`fk_role_permission_permission\` FOREIGN KEY (\`permission_id\`) 
          REFERENCES \`permissions\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`company_settings\` (
        \`id\` CHAR(36) NOT NULL,
        \`setting_key\` VARCHAR(100) NOT NULL,
        \`setting_value\` TEXT NULL,
        \`value_type\` VARCHAR(20) DEFAULT 'string',
        \`category\` VARCHAR(100) NULL,
        \`description\` TEXT NULL,
        \`is_editable\` TINYINT(1) DEFAULT 1,
        \`updated_by\` CHAR(36) NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_company_setting_key\` (\`setting_key\`),
        INDEX \`idx_company_setting_category\` (\`category\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`audit_logs\` (
        \`id\` CHAR(36) NOT NULL,
        \`user_id\` CHAR(36) NULL,
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
        INDEX \`idx_audit_entity\` (\`entity_type\`, \`entity_id\`),
        INDEX \`idx_audit_created\` (\`created_at\`),
        INDEX \`idx_audit_action\` (\`action\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS \`audit_logs\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`company_settings\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`role_permissions\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`user_roles\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`permissions\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`roles\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`users\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`sequences\``);
    }
}
exports.CreateCoreTables1700000000001 = CreateCoreTables1700000000001;
//# sourceMappingURL=1700000000001-CreateCoreTables.js.map