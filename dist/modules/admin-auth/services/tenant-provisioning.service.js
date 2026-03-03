"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var TenantProvisioningService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantProvisioningService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
let TenantProvisioningService = TenantProvisioningService_1 = class TenantProvisioningService {
    masterDataSource;
    configService;
    logger = new common_1.Logger(TenantProvisioningService_1.name);
    constructor(masterDataSource, configService) {
        this.masterDataSource = masterDataSource;
        this.configService = configService;
    }
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
    async createTenantDatabase(databaseName) {
        this.logger.log(`Creating tenant database: ${databaseName}`);
        const queryRunner = this.masterDataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            await queryRunner.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\` 
         CHARACTER SET utf8mb4 
         COLLATE utf8mb4_unicode_ci`);
            this.logger.log(`Database ${databaseName} created successfully`);
        }
        catch (error) {
            this.logger.error(`Failed to create database ${databaseName}:`, error);
            throw new common_1.InternalServerErrorException(`Failed to create tenant database: ${error.message}`);
        }
        finally {
            await queryRunner.release();
        }
    }
    async runTenantMigrations(databaseName) {
        this.logger.log(`Running migrations on database: ${databaseName}`);
        const tenantDataSource = new typeorm_1.DataSource({
            type: 'mysql',
            host: this.configService.get('masterDb.host', 'localhost'),
            port: this.configService.get('masterDb.port', 3306),
            username: this.configService.get('masterDb.username', 'root'),
            password: this.configService.get('masterDb.password', ''),
            database: databaseName,
            synchronize: false,
            logging: true,
        });
        try {
            await tenantDataSource.initialize();
            await this.createTenantTables(tenantDataSource);
            await this.seedTenantData(tenantDataSource);
            this.logger.log(`Migrations completed for database: ${databaseName}`);
        }
        catch (error) {
            this.logger.error(`Migration failed for ${databaseName}:`, error);
            throw new common_1.InternalServerErrorException(`Failed to run migrations: ${error.message}`);
        }
        finally {
            if (tenantDataSource.isInitialized) {
                await tenantDataSource.destroy();
            }
        }
    }
    async createTenantTables(dataSource) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`sequences\` (
          \`id\` CHAR(36) NOT NULL,
          \`sequence_type\` VARCHAR(50) NOT NULL,
          \`prefix\` VARCHAR(20) NULL,
          \`current_value\` BIGINT NOT NULL DEFAULT 0,
          \`number_length\` INT NOT NULL DEFAULT 6,
          \`include_year\` TINYINT(1) DEFAULT 1,
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
        CREATE TABLE IF NOT EXISTS \`users\` (
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
          \`is_active\` TINYINT(1) DEFAULT 1,
          \`email_verified\` TINYINT(1) DEFAULT 0,
          \`last_login_at\` DATETIME NULL,
          \`failed_login_attempts\` INT DEFAULT 0,
          \`locked_until\` DATETIME NULL,
          \`must_change_password\` TINYINT(1) DEFAULT 0,
          \`password_reset_token\` VARCHAR(255) NULL,
          \`password_reset_expires\` DATETIME NULL,
          \`preferences\` JSON NULL,
          \`created_by\` CHAR(36) NULL,
          \`deleted_at\` DATETIME NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_user_email\` (\`email\`),
          INDEX \`idx_user_active\` (\`is_active\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
            await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`roles\` (
          \`id\` CHAR(36) NOT NULL,
          \`role_code\` VARCHAR(50) NOT NULL,
          \`role_name\` VARCHAR(100) NOT NULL,
          \`description\` TEXT NULL,
          \`is_system\` TINYINT(1) DEFAULT 0,
          \`is_active\` TINYINT(1) DEFAULT 1,
          \`created_by\` CHAR(36) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_role_code\` (\`role_code\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
            await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`permissions\` (
          \`id\` CHAR(36) NOT NULL,
          \`permission_code\` VARCHAR(100) NOT NULL,
          \`permission_name\` VARCHAR(200) NOT NULL,
          \`module\` VARCHAR(50) NOT NULL,
          \`description\` TEXT NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_permission_code\` (\`permission_code\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
            await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`user_roles\` (
          \`id\` CHAR(36) NOT NULL,
          \`user_id\` CHAR(36) NOT NULL,
          \`role_id\` CHAR(36) NOT NULL,
          \`assigned_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_user_role\` (\`user_id\`, \`role_id\`),
          CONSTRAINT \`fk_user_role_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_user_role_role\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\` (\`id\`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
            await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`role_permissions\` (
          \`id\` CHAR(36) NOT NULL,
          \`role_id\` CHAR(36) NOT NULL,
          \`permission_id\` CHAR(36) NOT NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_role_permission\` (\`role_id\`, \`permission_id\`),
          CONSTRAINT \`fk_role_perm_role\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_role_perm_perm\` FOREIGN KEY (\`permission_id\`) REFERENCES \`permissions\` (\`id\`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
            await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`company_settings\` (
          \`id\` CHAR(36) NOT NULL,
          \`setting_key\` VARCHAR(100) NOT NULL,
          \`setting_value\` TEXT NULL,
          \`value_type\` VARCHAR(20) DEFAULT 'string',
          \`category\` VARCHAR(100) NULL,
          \`description\` TEXT NULL,
          \`is_editable\` TINYINT(1) DEFAULT 1,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_company_setting_key\` (\`setting_key\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
            await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`audit_logs\` (
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
          INDEX \`idx_audit_entity\` (\`entity_type\`, \`entity_id\`),
          INDEX \`idx_audit_created\` (\`created_at\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
            await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`categories\` (
          \`id\` CHAR(36) NOT NULL,
          \`category_code\` VARCHAR(50) NOT NULL,
          \`category_name\` VARCHAR(200) NOT NULL,
          \`slug\` VARCHAR(250) NULL,
          \`description\` TEXT NULL,
          \`parent_id\` CHAR(36) NULL,
          \`level\` INT DEFAULT 0,
          \`path\` VARCHAR(500) NULL,
          \`image_url\` VARCHAR(500) NULL,
          \`is_active\` TINYINT(1) DEFAULT 1,
          \`display_order\` INT DEFAULT 0,
          \`created_by\` CHAR(36) NULL,
          \`deleted_at\` DATETIME NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_category_code\` (\`category_code\`),
          INDEX \`idx_category_parent\` (\`parent_id\`),
          INDEX \`idx_category_active\` (\`is_active\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
            await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`brands\` (
          \`id\` CHAR(36) NOT NULL,
          \`brand_code\` VARCHAR(50) NOT NULL,
          \`brand_name\` VARCHAR(200) NOT NULL,
          \`slug\` VARCHAR(250) NULL,
          \`description\` TEXT NULL,
          \`logo_url\` VARCHAR(500) NULL,
          \`website\` VARCHAR(255) NULL,
          \`is_active\` TINYINT(1) DEFAULT 1,
          \`created_by\` CHAR(36) NULL,
          \`deleted_at\` DATETIME NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_brand_code\` (\`brand_code\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
            await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`units_of_measure\` (
          \`id\` CHAR(36) NOT NULL,
          \`uom_code\` VARCHAR(20) NOT NULL,
          \`uom_name\` VARCHAR(100) NOT NULL,
          \`uom_type\` ENUM('UNIT', 'WEIGHT', 'VOLUME', 'LENGTH', 'AREA', 'TIME', 'PACK') DEFAULT 'UNIT',
          \`symbol\` VARCHAR(20) NULL,
          \`decimal_places\` INT DEFAULT 2,
          \`is_base_unit\` TINYINT(1) DEFAULT 0,
          \`base_uom_id\` CHAR(36) NULL,
          \`conversion_factor\` DECIMAL(18, 8) DEFAULT 1,
          \`is_active\` TINYINT(1) DEFAULT 1,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_uom_code\` (\`uom_code\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
            await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`tax_categories\` (
          \`id\` CHAR(36) NOT NULL,
          \`tax_code\` VARCHAR(50) NOT NULL,
          \`tax_name\` VARCHAR(100) NOT NULL,
          \`description\` TEXT NULL,
          \`is_active\` TINYINT(1) DEFAULT 1,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_tax_code\` (\`tax_code\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
            await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`tax_rates\` (
          \`id\` CHAR(36) NOT NULL,
          \`tax_category_id\` CHAR(36) NOT NULL,
          \`tax_name\` VARCHAR(100) NOT NULL,
          \`tax_code\` VARCHAR(50) NOT NULL,
          \`rate\` DECIMAL(8, 4) NOT NULL,
          \`is_compound\` TINYINT(1) DEFAULT 0,
          \`is_inclusive\` TINYINT(1) DEFAULT 0,
          \`effective_from\` DATE NULL,
          \`effective_to\` DATE NULL,
          \`is_active\` TINYINT(1) DEFAULT 1,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_tax_rate_code\` (\`tax_code\`),
          CONSTRAINT \`fk_tax_rate_category\` FOREIGN KEY (\`tax_category_id\`) REFERENCES \`tax_categories\` (\`id\`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
            await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`products\` (
          \`id\` CHAR(36) NOT NULL,
          \`sku\` VARCHAR(100) NOT NULL,
          \`product_name\` VARCHAR(300) NOT NULL,
          \`slug\` VARCHAR(350) NULL,
          \`description\` TEXT NULL,
          \`short_description\` VARCHAR(500) NULL,
          \`product_type\` ENUM('GOODS', 'SERVICE', 'COMBO', 'DIGITAL', 'RAW_MATERIAL', 'SEMI_FINISHED', 'FINISHED') DEFAULT 'GOODS',
          \`category_id\` CHAR(36) NULL,
          \`brand_id\` CHAR(36) NULL,
          \`base_uom_id\` CHAR(36) NOT NULL,
          \`purchase_uom_id\` CHAR(36) NULL,
          \`sales_uom_id\` CHAR(36) NULL,
          \`tax_category_id\` CHAR(36) NULL,
          \`hsn_code\` VARCHAR(20) NULL,
          \`barcode\` VARCHAR(100) NULL,
          \`cost_price\` DECIMAL(15, 4) DEFAULT 0,
          \`selling_price\` DECIMAL(15, 4) DEFAULT 0,
          \`mrp\` DECIMAL(15, 4) NULL,
          \`min_selling_price\` DECIMAL(15, 4) NULL,
          \`weight\` DECIMAL(10, 4) NULL,
          \`is_stockable\` TINYINT(1) DEFAULT 1,
          \`is_purchasable\` TINYINT(1) DEFAULT 1,
          \`is_sellable\` TINYINT(1) DEFAULT 1,
          \`track_batch\` TINYINT(1) DEFAULT 0,
          \`track_serial\` TINYINT(1) DEFAULT 0,
          \`has_variants\` TINYINT(1) DEFAULT 0,
          \`reorder_level\` DECIMAL(15, 4) DEFAULT 0,
          \`reorder_quantity\` DECIMAL(15, 4) DEFAULT 0,
          \`lead_time_days\` INT DEFAULT 0,
          \`image_url\` VARCHAR(500) NULL,
          \`is_active\` TINYINT(1) DEFAULT 1,
          \`tags\` JSON NULL,
          \`custom_fields\` JSON NULL,
          \`created_by\` CHAR(36) NULL,
          \`deleted_at\` DATETIME NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_product_sku\` (\`sku\`),
          INDEX \`idx_product_category\` (\`category_id\`),
          INDEX \`idx_product_brand\` (\`brand_id\`),
          INDEX \`idx_product_active\` (\`is_active\`),
          INDEX \`idx_product_barcode\` (\`barcode\`),
          CONSTRAINT \`fk_product_category\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\` (\`id\`) ON DELETE SET NULL,
          CONSTRAINT \`fk_product_brand\` FOREIGN KEY (\`brand_id\`) REFERENCES \`brands\` (\`id\`) ON DELETE SET NULL,
          CONSTRAINT \`fk_product_base_uom\` FOREIGN KEY (\`base_uom_id\`) REFERENCES \`units_of_measure\` (\`id\`),
          CONSTRAINT \`fk_product_tax_cat\` FOREIGN KEY (\`tax_category_id\`) REFERENCES \`tax_categories\` (\`id\`) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
            await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`product_variants\` (
          \`id\` CHAR(36) NOT NULL,
          \`product_id\` CHAR(36) NOT NULL,
          \`variant_sku\` VARCHAR(100) NOT NULL,
          \`variant_name\` VARCHAR(300) NOT NULL,
          \`barcode\` VARCHAR(100) NULL,
          \`cost_price\` DECIMAL(15, 4) NULL,
          \`selling_price\` DECIMAL(15, 4) NULL,
          \`mrp\` DECIMAL(15, 4) NULL,
          \`weight\` DECIMAL(10, 4) NULL,
          \`image_url\` VARCHAR(500) NULL,
          \`attributes\` JSON NULL,
          \`is_active\` TINYINT(1) DEFAULT 1,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_variant_sku\` (\`variant_sku\`),
          INDEX \`idx_variant_product\` (\`product_id\`),
          CONSTRAINT \`fk_variant_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
            await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`warehouses\` (
          \`id\` CHAR(36) NOT NULL,
          \`warehouse_code\` VARCHAR(50) NOT NULL,
          \`warehouse_name\` VARCHAR(200) NOT NULL,
          \`warehouse_type\` ENUM('MAIN', 'DISTRIBUTION', 'RETAIL', 'VIRTUAL', 'TRANSIT', 'QUARANTINE', 'RETURNS') DEFAULT 'MAIN',
          \`address_line1\` VARCHAR(255) NULL,
          \`address_line2\` VARCHAR(255) NULL,
          \`city\` VARCHAR(100) NULL,
          \`state\` VARCHAR(100) NULL,
          \`country\` VARCHAR(100) DEFAULT 'India',
          \`postal_code\` VARCHAR(20) NULL,
          \`phone\` VARCHAR(50) NULL,
          \`email\` VARCHAR(255) NULL,
          \`manager_id\` CHAR(36) NULL,
          \`is_active\` TINYINT(1) DEFAULT 1,
          \`is_default\` TINYINT(1) DEFAULT 0,
          \`allow_negative_stock\` TINYINT(1) DEFAULT 0,
          \`created_by\` CHAR(36) NULL,
          \`deleted_at\` DATETIME NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_warehouse_code\` (\`warehouse_code\`),
          INDEX \`idx_warehouse_active\` (\`is_active\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
            await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`inventory_stock\` (
          \`id\` CHAR(36) NOT NULL,
          \`product_id\` CHAR(36) NOT NULL,
          \`variant_id\` CHAR(36) NULL,
          \`warehouse_id\` CHAR(36) NOT NULL,
          \`location_id\` CHAR(36) NULL,
          \`quantity_on_hand\` DECIMAL(15, 4) NOT NULL DEFAULT 0,
          \`quantity_reserved\` DECIMAL(15, 4) NOT NULL DEFAULT 0,
          \`quantity_incoming\` DECIMAL(15, 4) NOT NULL DEFAULT 0,
          \`quantity_outgoing\` DECIMAL(15, 4) NOT NULL DEFAULT 0,
          \`average_cost\` DECIMAL(15, 4) NULL,
          \`last_cost\` DECIMAL(15, 4) NULL,
          \`last_stock_date\` DATETIME NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_stock_product_wh\` (\`product_id\`, \`warehouse_id\`, \`variant_id\`, \`location_id\`),
          CONSTRAINT \`fk_stock_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_stock_warehouse\` FOREIGN KEY (\`warehouse_id\`) REFERENCES \`warehouses\` (\`id\`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
            await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`payment_terms\` (
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
            await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`payment_methods\` (
          \`id\` CHAR(36) NOT NULL,
          \`method_code\` VARCHAR(50) NOT NULL,
          \`method_name\` VARCHAR(100) NOT NULL,
          \`method_type\` ENUM('CASH', 'CARD', 'UPI', 'NET_BANKING', 'WALLET', 'BANK_TRANSFER', 'CHEQUE', 'COD', 'CREDIT', 'EMI', 'GIFT_CARD', 'STORE_CREDIT', 'OTHER') DEFAULT 'CASH',
          \`description\` TEXT NULL,
          \`is_active\` TINYINT(1) DEFAULT 1,
          \`display_order\` INT DEFAULT 0,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_payment_method_code\` (\`method_code\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
            await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`customer_groups\` (
          \`id\` CHAR(36) NOT NULL,
          \`group_code\` VARCHAR(50) NOT NULL,
          \`group_name\` VARCHAR(100) NOT NULL,
          \`description\` TEXT NULL,
          \`discount_percentage\` DECIMAL(8, 4) DEFAULT 0,
          \`credit_limit\` DECIMAL(15, 4) NULL,
          \`is_active\` TINYINT(1) DEFAULT 1,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_customer_group_code\` (\`group_code\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
            await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`customers\` (
          \`id\` CHAR(36) NOT NULL,
          \`customer_code\` VARCHAR(50) NOT NULL,
          \`customer_name\` VARCHAR(300) NOT NULL,
          \`display_name\` VARCHAR(200) NULL,
          \`customer_type\` ENUM('INDIVIDUAL', 'BUSINESS', 'WHOLESALE', 'RETAIL') DEFAULT 'INDIVIDUAL',
          \`customer_group_id\` CHAR(36) NULL,
          \`email\` VARCHAR(255) NULL,
          \`phone\` VARCHAR(50) NULL,
          \`mobile\` VARCHAR(50) NULL,
          \`tax_id\` VARCHAR(50) NULL,
          \`credit_limit\` DECIMAL(15, 4) DEFAULT 0,
          \`current_balance\` DECIMAL(15, 4) DEFAULT 0,
          \`is_credit_allowed\` TINYINT(1) DEFAULT 0,
          \`currency\` CHAR(3) DEFAULT 'INR',
          \`notes\` TEXT NULL,
          \`is_active\` TINYINT(1) DEFAULT 1,
          \`created_by\` CHAR(36) NULL,
          \`deleted_at\` DATETIME NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_customer_code\` (\`customer_code\`),
          INDEX \`idx_customer_active\` (\`is_active\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
            await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`suppliers\` (
          \`id\` CHAR(36) NOT NULL,
          \`supplier_code\` VARCHAR(50) NOT NULL,
          \`supplier_name\` VARCHAR(300) NOT NULL,
          \`display_name\` VARCHAR(200) NULL,
          \`email\` VARCHAR(255) NULL,
          \`phone\` VARCHAR(50) NULL,
          \`mobile\` VARCHAR(50) NULL,
          \`tax_id\` VARCHAR(50) NULL,
          \`credit_limit\` DECIMAL(15, 4) DEFAULT 0,
          \`current_balance\` DECIMAL(15, 4) DEFAULT 0,
          \`currency\` CHAR(3) DEFAULT 'INR',
          \`lead_time_days\` INT DEFAULT 0,
          \`notes\` TEXT NULL,
          \`is_active\` TINYINT(1) DEFAULT 1,
          \`created_by\` CHAR(36) NULL,
          \`deleted_at\` DATETIME NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_supplier_code\` (\`supplier_code\`),
          INDEX \`idx_supplier_active\` (\`is_active\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
            await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`sales_orders\` (
          \`id\` CHAR(36) NOT NULL,
          \`order_number\` VARCHAR(50) NOT NULL,
          \`customer_id\` CHAR(36) NOT NULL,
          \`warehouse_id\` CHAR(36) NOT NULL,
          \`order_date\` DATE NOT NULL,
          \`expected_delivery_date\` DATE NULL,
          \`status\` ENUM('DRAFT', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED') DEFAULT 'DRAFT',
          \`currency\` CHAR(3) DEFAULT 'INR',
          \`subtotal\` DECIMAL(15, 4) DEFAULT 0,
          \`discount_amount\` DECIMAL(15, 4) DEFAULT 0,
          \`tax_amount\` DECIMAL(15, 4) DEFAULT 0,
          \`total_amount\` DECIMAL(15, 4) DEFAULT 0,
          \`paid_amount\` DECIMAL(15, 4) DEFAULT 0,
          \`payment_status\` ENUM('PENDING', 'PARTIAL', 'PAID', 'REFUNDED') DEFAULT 'PENDING',
          \`notes\` TEXT NULL,
          \`created_by\` CHAR(36) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_order_number\` (\`order_number\`),
          INDEX \`idx_order_customer\` (\`customer_id\`),
          INDEX \`idx_order_status\` (\`status\`),
          CONSTRAINT \`fk_order_customer\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\` (\`id\`),
          CONSTRAINT \`fk_order_warehouse\` FOREIGN KEY (\`warehouse_id\`) REFERENCES \`warehouses\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
            await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`sales_order_items\` (
          \`id\` CHAR(36) NOT NULL,
          \`order_id\` CHAR(36) NOT NULL,
          \`product_id\` CHAR(36) NOT NULL,
          \`variant_id\` CHAR(36) NULL,
          \`product_name\` VARCHAR(300) NOT NULL,
          \`sku\` VARCHAR(100) NOT NULL,
          \`quantity\` DECIMAL(15, 4) NOT NULL,
          \`unit_price\` DECIMAL(15, 4) NOT NULL,
          \`discount_amount\` DECIMAL(15, 4) DEFAULT 0,
          \`tax_amount\` DECIMAL(15, 4) DEFAULT 0,
          \`line_total\` DECIMAL(15, 4) NOT NULL,
          \`notes\` TEXT NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_order_item_order\` (\`order_id\`),
          CONSTRAINT \`fk_order_item_order\` FOREIGN KEY (\`order_id\`) REFERENCES \`sales_orders\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_order_item_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
            await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`quotations\` (
          \`id\` CHAR(36) NOT NULL,
          \`quotation_number\` VARCHAR(50) NOT NULL,
          \`customer_id\` CHAR(36) NOT NULL,
          \`warehouse_id\` CHAR(36) NOT NULL,
          \`quotation_date\` DATE NOT NULL,
          \`valid_until\` DATE NULL,
          \`status\` ENUM('DRAFT','SENT','ACCEPTED','REJECTED','EXPIRED','CONVERTED','CANCELLED') DEFAULT 'DRAFT',
          \`currency\` CHAR(3) DEFAULT 'INR',
          \`subtotal\` DECIMAL(15,4) DEFAULT 0,
          \`discount_type\` ENUM('PERCENTAGE','FIXED') DEFAULT 'FIXED',
          \`discount_value\` DECIMAL(15,4) DEFAULT 0,
          \`discount_amount\` DECIMAL(15,4) DEFAULT 0,
          \`tax_amount\` DECIMAL(15,4) DEFAULT 0,
          \`shipping_amount\` DECIMAL(15,4) DEFAULT 0,
          \`total_amount\` DECIMAL(15,4) DEFAULT 0,
          \`billing_address_id\` CHAR(36) NULL,
          \`shipping_address_id\` CHAR(36) NULL,
          \`reference_number\` VARCHAR(100) NULL,
          \`sales_person_id\` CHAR(36) NULL,
          \`payment_terms_id\` CHAR(36) NULL,
          \`sales_order_id\` CHAR(36) NULL,
          \`sales_order_number\` VARCHAR(50) NULL,
          \`notes\` TEXT NULL,
          \`internal_notes\` TEXT NULL,
          \`terms_and_conditions\` TEXT NULL,
          \`rejection_reason\` TEXT NULL,
          \`created_by\` CHAR(36) NULL,
          \`updated_by\` CHAR(36) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`idx_quotation_number\` (\`quotation_number\`),
          INDEX \`idx_quotation_customer\` (\`customer_id\`),
          INDEX \`idx_quotation_status\` (\`status\`),
          INDEX \`idx_quotation_date\` (\`quotation_date\`),
          CONSTRAINT \`fk_quotation_customer\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\` (\`id\`),
          CONSTRAINT \`fk_quotation_warehouse\` FOREIGN KEY (\`warehouse_id\`) REFERENCES \`warehouses\` (\`id\`),
          CONSTRAINT \`fk_quotation_salesperson\` FOREIGN KEY (\`sales_person_id\`) REFERENCES \`users\` (\`id\`) ON DELETE SET NULL,
          CONSTRAINT \`fk_quotation_createdby\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\` (\`id\`) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
            await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`quotation_items\` (
          \`id\` CHAR(36) NOT NULL,
          \`quotation_id\` CHAR(36) NOT NULL,
          \`product_id\` CHAR(36) NOT NULL,
          \`variant_id\` CHAR(36) NULL,
          \`product_name\` VARCHAR(300) NOT NULL,
          \`sku\` VARCHAR(100) NOT NULL,
          \`quantity\` DECIMAL(15,4) NOT NULL,
          \`unit_price\` DECIMAL(15,4) NOT NULL,
          \`discount_type\` ENUM('PERCENTAGE','FIXED') DEFAULT 'FIXED',
          \`discount_value\` DECIMAL(15,4) DEFAULT 0,
          \`discount_amount\` DECIMAL(15,4) DEFAULT 0,
          \`tax_rate\` DECIMAL(8,4) DEFAULT 0,
          \`tax_amount\` DECIMAL(15,4) DEFAULT 0,
          \`line_total\` DECIMAL(15,4) NOT NULL,
          \`notes\` TEXT NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_qi_quotation\` (\`quotation_id\`),
          CONSTRAINT \`fk_qi_quotation\` FOREIGN KEY (\`quotation_id\`) REFERENCES \`quotations\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_qi_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
            await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`purchase_orders\` (
          \`id\` CHAR(36) NOT NULL,
          \`po_number\` VARCHAR(50) NOT NULL,
          \`supplier_id\` CHAR(36) NOT NULL,
          \`warehouse_id\` CHAR(36) NOT NULL,
          \`order_date\` DATE NOT NULL,
          \`expected_delivery_date\` DATE NULL,
          \`status\` ENUM('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'SENT', 'PARTIALLY_RECEIVED', 'RECEIVED', 'COMPLETED', 'CANCELLED') DEFAULT 'DRAFT',
          \`currency\` CHAR(3) DEFAULT 'INR',
          \`subtotal\` DECIMAL(15, 4) DEFAULT 0,
          \`discount_amount\` DECIMAL(15, 4) DEFAULT 0,
          \`tax_amount\` DECIMAL(15, 4) DEFAULT 0,
          \`total_amount\` DECIMAL(15, 4) DEFAULT 0,
          \`paid_amount\` DECIMAL(15, 4) DEFAULT 0,
          \`payment_status\` ENUM('PENDING', 'PARTIAL', 'PAID') DEFAULT 'PENDING',
          \`notes\` TEXT NULL,
          \`created_by\` CHAR(36) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_po_number\` (\`po_number\`),
          INDEX \`idx_po_supplier\` (\`supplier_id\`),
          INDEX \`idx_po_status\` (\`status\`),
          CONSTRAINT \`fk_po_supplier\` FOREIGN KEY (\`supplier_id\`) REFERENCES \`suppliers\` (\`id\`),
          CONSTRAINT \`fk_po_warehouse\` FOREIGN KEY (\`warehouse_id\`) REFERENCES \`warehouses\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
            await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`purchase_order_items\` (
          \`id\` CHAR(36) NOT NULL,
          \`purchase_order_id\` CHAR(36) NOT NULL,
          \`product_id\` CHAR(36) NOT NULL,
          \`variant_id\` CHAR(36) NULL,
          \`product_name\` VARCHAR(300) NOT NULL,
          \`sku\` VARCHAR(100) NOT NULL,
          \`quantity\` DECIMAL(15, 4) NOT NULL,
          \`received_quantity\` DECIMAL(15, 4) DEFAULT 0,
          \`unit_price\` DECIMAL(15, 4) NOT NULL,
          \`discount_amount\` DECIMAL(15, 4) DEFAULT 0,
          \`tax_amount\` DECIMAL(15, 4) DEFAULT 0,
          \`line_total\` DECIMAL(15, 4) NOT NULL,
          \`notes\` TEXT NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_po_item_order\` (\`purchase_order_id\`),
          CONSTRAINT \`fk_po_item_order\` FOREIGN KEY (\`purchase_order_id\`) REFERENCES \`purchase_orders\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_po_item_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
            this.logger.log('All tenant tables created successfully');
        }
        finally {
            await queryRunner.release();
        }
    }
    async seedTenantData(dataSource) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            const sequences = [
                { type: 'SALES_ORDER', prefix: 'SO' },
                { type: 'PURCHASE_ORDER', prefix: 'PO' },
                { type: 'CUSTOMER', prefix: 'CUST' },
                { type: 'SUPPLIER', prefix: 'SUPP' },
                { type: 'PRODUCT', prefix: 'PRD' },
            ];
            for (const seq of sequences) {
                await queryRunner.query(`
          INSERT INTO sequences (id, sequence_type, prefix, current_value, number_length)
          VALUES (UUID(), '${seq.type}', '${seq.prefix}', 0, 6)
        `);
            }
            const adminRoleId = this.generateUUID();
            const managerRoleId = this.generateUUID();
            const salesRoleId = this.generateUUID();
            const purchaseRoleId = this.generateUUID();
            const warehouseRoleId = this.generateUUID();
            await queryRunner.query(`
        INSERT INTO roles (id, role_code, role_name, description, is_system, is_active)
        VALUES 
          ('${adminRoleId}', 'ADMIN', 'Administrator', 'Full system access', 1, 1),
          ('${managerRoleId}', 'MANAGER', 'Manager', 'Management level access', 1, 1),
          ('${salesRoleId}', 'SALES', 'Sales User', 'Sales operations', 1, 1),
          ('${purchaseRoleId}', 'PURCHASE', 'Purchase User', 'Purchase operations', 1, 1),
          ('${warehouseRoleId}', 'WAREHOUSE', 'Warehouse User', 'Warehouse operations', 1, 1)
      `);
            const permissions = [
                { code: 'dashboard.view', name: 'View Dashboard', module: 'dashboard' },
                {
                    code: 'dashboard.analytics',
                    name: 'View Analytics',
                    module: 'dashboard',
                },
                { code: 'users.read', name: 'View Users', module: 'users' },
                { code: 'users.create', name: 'Create Users', module: 'users' },
                { code: 'users.update', name: 'Update Users', module: 'users' },
                { code: 'users.delete', name: 'Delete Users', module: 'users' },
                { code: 'roles.read', name: 'View Roles', module: 'roles' },
                { code: 'roles.create', name: 'Create Roles', module: 'roles' },
                { code: 'roles.update', name: 'Update Roles', module: 'roles' },
                { code: 'roles.delete', name: 'Delete Roles', module: 'roles' },
                { code: 'roles.assign', name: 'Assign Roles', module: 'roles' },
                { code: 'products.read', name: 'View Products', module: 'products' },
                {
                    code: 'products.create',
                    name: 'Create Products',
                    module: 'products',
                },
                {
                    code: 'products.update',
                    name: 'Update Products',
                    module: 'products',
                },
                {
                    code: 'products.delete',
                    name: 'Delete Products',
                    module: 'products',
                },
                {
                    code: 'products.import',
                    name: 'Import Products',
                    module: 'products',
                },
                {
                    code: 'products.export',
                    name: 'Export Products',
                    module: 'products',
                },
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
                { code: 'brands.read', name: 'View Brands', module: 'brands' },
                { code: 'brands.create', name: 'Create Brands', module: 'brands' },
                { code: 'brands.update', name: 'Update Brands', module: 'brands' },
                { code: 'brands.delete', name: 'Delete Brands', module: 'brands' },
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
                {
                    code: 'customers.import',
                    name: 'Import Customers',
                    module: 'customers',
                },
                {
                    code: 'customers.export',
                    name: 'Export Customers',
                    module: 'customers',
                },
                {
                    code: 'customer_groups.read',
                    name: 'View Customer Groups',
                    module: 'customer_groups',
                },
                {
                    code: 'customer_groups.create',
                    name: 'Create Customer Groups',
                    module: 'customer_groups',
                },
                {
                    code: 'customer_groups.update',
                    name: 'Update Customer Groups',
                    module: 'customer_groups',
                },
                {
                    code: 'customer_groups.delete',
                    name: 'Delete Customer Groups',
                    module: 'customer_groups',
                },
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
                {
                    code: 'suppliers.import',
                    name: 'Import Suppliers',
                    module: 'suppliers',
                },
                {
                    code: 'suppliers.export',
                    name: 'Export Suppliers',
                    module: 'suppliers',
                },
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
                    code: 'sales_orders.confirm',
                    name: 'Confirm Sales Orders',
                    module: 'sales_orders',
                },
                {
                    code: 'sales_orders.cancel',
                    name: 'Cancel Sales Orders',
                    module: 'sales_orders',
                },
                {
                    code: 'sales_orders.ship',
                    name: 'Ship Sales Orders',
                    module: 'sales_orders',
                },
                {
                    code: 'sales_orders.deliver',
                    name: 'Deliver Sales Orders',
                    module: 'sales_orders',
                },
                {
                    code: 'sales_returns.read',
                    name: 'View Sales Returns',
                    module: 'sales_returns',
                },
                {
                    code: 'sales_returns.create',
                    name: 'Create Sales Returns',
                    module: 'sales_returns',
                },
                {
                    code: 'sales_returns.update',
                    name: 'Update Sales Returns',
                    module: 'sales_returns',
                },
                {
                    code: 'sales_returns.approve',
                    name: 'Approve Sales Returns',
                    module: 'sales_returns',
                },
                {
                    code: 'sales_returns.reject',
                    name: 'Reject Sales Returns',
                    module: 'sales_returns',
                },
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
                {
                    code: 'purchase_orders.reject',
                    name: 'Reject Purchase Orders',
                    module: 'purchase_orders',
                },
                {
                    code: 'purchase_orders.send',
                    name: 'Send Purchase Orders',
                    module: 'purchase_orders',
                },
                {
                    code: 'purchase_orders.receive',
                    name: 'Receive Purchase Orders',
                    module: 'purchase_orders',
                },
                { code: 'grn.read', name: 'View GRN', module: 'grn' },
                { code: 'grn.create', name: 'Create GRN', module: 'grn' },
                { code: 'grn.update', name: 'Update GRN', module: 'grn' },
                { code: 'grn.approve', name: 'Approve GRN', module: 'grn' },
                {
                    code: 'purchase_returns.read',
                    name: 'View Purchase Returns',
                    module: 'purchase_returns',
                },
                {
                    code: 'purchase_returns.create',
                    name: 'Create Purchase Returns',
                    module: 'purchase_returns',
                },
                {
                    code: 'purchase_returns.update',
                    name: 'Update Purchase Returns',
                    module: 'purchase_returns',
                },
                {
                    code: 'purchase_returns.approve',
                    name: 'Approve Purchase Returns',
                    module: 'purchase_returns',
                },
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
                {
                    code: 'inventory.count',
                    name: 'Count Inventory',
                    module: 'inventory',
                },
                {
                    code: 'stock_adjustments.read',
                    name: 'View Stock Adjustments',
                    module: 'stock_adjustments',
                },
                {
                    code: 'stock_adjustments.create',
                    name: 'Create Stock Adjustments',
                    module: 'stock_adjustments',
                },
                {
                    code: 'stock_adjustments.approve',
                    name: 'Approve Stock Adjustments',
                    module: 'stock_adjustments',
                },
                {
                    code: 'stock_transfers.read',
                    name: 'View Stock Transfers',
                    module: 'stock_transfers',
                },
                {
                    code: 'stock_transfers.create',
                    name: 'Create Stock Transfers',
                    module: 'stock_transfers',
                },
                {
                    code: 'stock_transfers.approve',
                    name: 'Approve Stock Transfers',
                    module: 'stock_transfers',
                },
                {
                    code: 'stock_transfers.ship',
                    name: 'Ship Stock Transfers',
                    module: 'stock_transfers',
                },
                {
                    code: 'stock_transfers.receive',
                    name: 'Receive Stock Transfers',
                    module: 'stock_transfers',
                },
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
                {
                    code: 'warehouse_locations.read',
                    name: 'View Warehouse Locations',
                    module: 'warehouse_locations',
                },
                {
                    code: 'warehouse_locations.create',
                    name: 'Create Warehouse Locations',
                    module: 'warehouse_locations',
                },
                {
                    code: 'warehouse_locations.update',
                    name: 'Update Warehouse Locations',
                    module: 'warehouse_locations',
                },
                {
                    code: 'warehouse_locations.delete',
                    name: 'Delete Warehouse Locations',
                    module: 'warehouse_locations',
                },
                {
                    code: 'price_lists.read',
                    name: 'View Price Lists',
                    module: 'price_lists',
                },
                {
                    code: 'price_lists.create',
                    name: 'Create Price Lists',
                    module: 'price_lists',
                },
                {
                    code: 'price_lists.update',
                    name: 'Update Price Lists',
                    module: 'price_lists',
                },
                {
                    code: 'price_lists.delete',
                    name: 'Delete Price Lists',
                    module: 'price_lists',
                },
                { code: 'tax.read', name: 'View Tax Settings', module: 'tax' },
                { code: 'tax.create', name: 'Create Tax Rates', module: 'tax' },
                { code: 'tax.update', name: 'Update Tax Rates', module: 'tax' },
                { code: 'tax.delete', name: 'Delete Tax Rates', module: 'tax' },
                { code: 'payments.read', name: 'View Payments', module: 'payments' },
                {
                    code: 'payments.create',
                    name: 'Create Payments',
                    module: 'payments',
                },
                {
                    code: 'payments.refund',
                    name: 'Refund Payments',
                    module: 'payments',
                },
                {
                    code: 'reports.sales',
                    name: 'View Sales Reports',
                    module: 'reports',
                },
                {
                    code: 'reports.purchase',
                    name: 'View Purchase Reports',
                    module: 'reports',
                },
                {
                    code: 'reports.inventory',
                    name: 'View Inventory Reports',
                    module: 'reports',
                },
                {
                    code: 'reports.financial',
                    name: 'View Financial Reports',
                    module: 'reports',
                },
                { code: 'reports.export', name: 'Export Reports', module: 'reports' },
                { code: 'settings.read', name: 'View Settings', module: 'settings' },
                {
                    code: 'settings.update',
                    name: 'Update Settings',
                    module: 'settings',
                },
                {
                    code: 'settings.company',
                    name: 'Manage Company Settings',
                    module: 'settings',
                },
                {
                    code: 'audit_logs.read',
                    name: 'View Audit Logs',
                    module: 'audit_logs',
                },
            ];
            for (const perm of permissions) {
                await queryRunner.query(`
          INSERT INTO permissions (id, permission_code, permission_name, module, description)
          VALUES ('${this.generateUUID()}', '${perm.code}', '${perm.name}', '${perm.module}', '${perm.name}')
        `);
            }
            this.logger.log(`Seeded ${permissions.length} permissions`);
            const allPermissions = await queryRunner.query(`SELECT id FROM permissions`);
            for (const perm of allPermissions) {
                await queryRunner.query(`
          INSERT INTO role_permissions (id, role_id, permission_id)
          VALUES ('${this.generateUUID()}', '${adminRoleId}', '${perm.id}')
        `);
            }
            this.logger.log('Assigned all permissions to Admin role');
            const managerPermissions = [
                'dashboard.view',
                'dashboard.analytics',
                'users.read',
                'products.read',
                'products.create',
                'products.update',
                'categories.read',
                'categories.create',
                'categories.update',
                'brands.read',
                'brands.create',
                'brands.update',
                'customers.read',
                'customers.create',
                'customers.update',
                'suppliers.read',
                'suppliers.create',
                'suppliers.update',
                'sales_orders.read',
                'sales_orders.create',
                'sales_orders.update',
                'sales_orders.confirm',
                'sales_orders.cancel',
                'purchase_orders.read',
                'purchase_orders.create',
                'purchase_orders.update',
                'purchase_orders.approve',
                'inventory.read',
                'inventory.adjust',
                'inventory.transfer',
                'warehouses.read',
                'reports.sales',
                'reports.purchase',
                'reports.inventory',
                'settings.read',
            ];
            for (const permCode of managerPermissions) {
                const perm = await queryRunner.query(`SELECT id FROM permissions WHERE permission_code = '${permCode}'`);
                if (perm.length > 0) {
                    await queryRunner.query(`
            INSERT INTO role_permissions (id, role_id, permission_id)
            VALUES ('${this.generateUUID()}', '${managerRoleId}', '${perm[0].id}')
          `);
                }
            }
            const salesPermissions = [
                'dashboard.view',
                'products.read',
                'categories.read',
                'brands.read',
                'customers.read',
                'customers.create',
                'customers.update',
                'sales_orders.read',
                'sales_orders.create',
                'sales_orders.update',
                'sales_orders.confirm',
                'sales_returns.read',
                'sales_returns.create',
                'inventory.read',
                'payments.read',
                'payments.create',
                'reports.sales',
            ];
            for (const permCode of salesPermissions) {
                const perm = await queryRunner.query(`SELECT id FROM permissions WHERE permission_code = '${permCode}'`);
                if (perm.length > 0) {
                    await queryRunner.query(`
            INSERT INTO role_permissions (id, role_id, permission_id)
            VALUES ('${this.generateUUID()}', '${salesRoleId}', '${perm[0].id}')
          `);
                }
            }
            const purchasePermissions = [
                'dashboard.view',
                'products.read',
                'categories.read',
                'brands.read',
                'suppliers.read',
                'suppliers.create',
                'suppliers.update',
                'purchase_orders.read',
                'purchase_orders.create',
                'purchase_orders.update',
                'purchase_orders.send',
                'grn.read',
                'grn.create',
                'purchase_returns.read',
                'purchase_returns.create',
                'inventory.read',
                'reports.purchase',
            ];
            for (const permCode of purchasePermissions) {
                const perm = await queryRunner.query(`SELECT id FROM permissions WHERE permission_code = '${permCode}'`);
                if (perm.length > 0) {
                    await queryRunner.query(`
            INSERT INTO role_permissions (id, role_id, permission_id)
            VALUES ('${this.generateUUID()}', '${purchaseRoleId}', '${perm[0].id}')
          `);
                }
            }
            const warehousePermissions = [
                'dashboard.view',
                'products.read',
                'inventory.read',
                'inventory.adjust',
                'inventory.transfer',
                'inventory.count',
                'stock_adjustments.read',
                'stock_adjustments.create',
                'stock_transfers.read',
                'stock_transfers.create',
                'stock_transfers.ship',
                'stock_transfers.receive',
                'warehouses.read',
                'warehouse_locations.read',
                'warehouse_locations.create',
                'warehouse_locations.update',
                'grn.read',
                'grn.create',
                'reports.inventory',
            ];
            for (const permCode of warehousePermissions) {
                const perm = await queryRunner.query(`SELECT id FROM permissions WHERE permission_code = '${permCode}'`);
                if (perm.length > 0) {
                    await queryRunner.query(`
            INSERT INTO role_permissions (id, role_id, permission_id)
            VALUES ('${this.generateUUID()}', '${warehouseRoleId}', '${perm[0].id}')
          `);
                }
            }
            this.logger.log('Assigned permissions to all roles');
            await queryRunner.query(`
        INSERT INTO units_of_measure (id, uom_code, uom_name, uom_type, symbol, decimal_places, is_base_unit, is_active)
        VALUES 
          (UUID(), 'PCS', 'Pieces', 'UNIT', 'pcs', 0, 1, 1),
          (UUID(), 'BOX', 'Box', 'PACK', 'box', 0, 0, 1),
          (UUID(), 'KG', 'Kilogram', 'WEIGHT', 'kg', 3, 1, 1),
          (UUID(), 'GM', 'Gram', 'WEIGHT', 'g', 0, 0, 1),
          (UUID(), 'LTR', 'Litre', 'VOLUME', 'L', 3, 1, 1)
      `);
            await queryRunner.query(`
        INSERT INTO tax_categories (id, tax_code, tax_name, description, is_active)
        VALUES 
          (UUID(), 'GST', 'Goods and Services Tax', 'Standard GST', 1),
          (UUID(), 'EXEMPT', 'Tax Exempt', 'Exempt from tax', 1)
      `);
            await queryRunner.query(`
        INSERT INTO payment_methods (id, method_code, method_name, method_type, is_active, display_order)
        VALUES 
          (UUID(), 'CASH', 'Cash', 'CASH', 1, 1),
          (UUID(), 'CARD', 'Card', 'CARD', 1, 2),
          (UUID(), 'UPI', 'UPI', 'UPI', 1, 3),
          (UUID(), 'BANK', 'Bank Transfer', 'BANK_TRANSFER', 1, 4)
      `);
            await queryRunner.query(`
        INSERT INTO payment_terms (id, term_code, term_name, due_days, is_active)
        VALUES 
          (UUID(), 'IMMEDIATE', 'Due Immediately', 0, 1),
          (UUID(), 'NET15', 'Net 15', 15, 1),
          (UUID(), 'NET30', 'Net 30', 30, 1)
      `);
            this.logger.log('Tenant seed data inserted successfully');
        }
        finally {
            await queryRunner.release();
        }
    }
    async dropTenantDatabase(databaseName) {
        this.logger.warn(`Dropping tenant database: ${databaseName}`);
        const queryRunner = this.masterDataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            await queryRunner.query(`DROP DATABASE IF EXISTS \`${databaseName}\``);
            this.logger.log(`Database ${databaseName} dropped successfully`);
        }
        catch (error) {
            this.logger.error(`Failed to drop database ${databaseName}:`, error);
            throw new common_1.InternalServerErrorException(`Failed to drop tenant database: ${error.message}`);
        }
        finally {
            await queryRunner.release();
        }
    }
    async provisionTenant(databaseName) {
        this.logger.log(`Starting full provisioning for: ${databaseName}`);
        await this.createTenantDatabase(databaseName);
        await this.runTenantMigrations(databaseName);
        this.logger.log(`Tenant ${databaseName} provisioned successfully`);
    }
};
exports.TenantProvisioningService = TenantProvisioningService;
exports.TenantProvisioningService = TenantProvisioningService = TenantProvisioningService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectDataSource)('master')),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        config_1.ConfigService])
], TenantProvisioningService);
//# sourceMappingURL=tenant-provisioning.service.js.map