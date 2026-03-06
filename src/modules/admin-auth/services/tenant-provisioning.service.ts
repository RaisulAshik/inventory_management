// src/modules/admin-auth/services/tenant-provisioning.service.ts
import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource, QueryRunner } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class TenantProvisioningService {
  private readonly logger = new Logger(TenantProvisioningService.name);

  constructor(
    @InjectDataSource('master')
    private readonly masterDataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Generate a UUID v4
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  }

  /**
   * Create a new tenant database
   * @param databaseName - Name of the database to create
   */
  async createTenantDatabase(databaseName: string): Promise<void> {
    this.logger.log(`Creating tenant database: ${databaseName}`);

    const queryRunner = this.masterDataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      // Create the database
      await queryRunner.query(
        `CREATE DATABASE IF NOT EXISTS \`${databaseName}\`
         CHARACTER SET utf8mb4
         COLLATE utf8mb4_unicode_ci`,
      );

      this.logger.log(`Database ${databaseName} created successfully`);
    } catch (error: any) {
      this.logger.error(`Failed to create database ${databaseName}:`, error);
      throw new InternalServerErrorException(
        `Failed to create tenant database: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Run migrations on a tenant database
   * @param databaseName - Name of the tenant database
   */
  async runTenantMigrations(databaseName: string): Promise<void> {
    this.logger.log(`Running migrations on database: ${databaseName}`);

    // Create a new data source for the tenant database
    const tenantDataSource = new DataSource({
      type: 'mysql',
      host: this.configService.get<string>('masterDb.host', 'localhost'),
      port: this.configService.get<number>('masterDb.port', 3306),
      username: this.configService.get<string>('masterDb.username', 'root'),
      password: this.configService.get<string>('masterDb.password', ''),
      database: databaseName,
      synchronize: false,
      logging: true,
    });

    try {
      await tenantDataSource.initialize();

      // Run all tenant table creation queries
      await this.createTenantTables(tenantDataSource);

      // Seed default data
      await this.seedTenantData(tenantDataSource);

      this.logger.log(`Migrations completed for database: ${databaseName}`);
    } catch (error: any) {
      this.logger.error(`Migration failed for ${databaseName}:`, error);
      throw new InternalServerErrorException(
        `Failed to run migrations: ${error.message}`,
      );
    } finally {
      if (tenantDataSource.isInitialized) {
        await tenantDataSource.destroy();
      }
    }
  }

  /**
   * Create all tenant tables
   */
  private async createTenantTables(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      // =====================================================
      // CORE TABLES
      // =====================================================

      // sequence_numbers (entity: SequenceNumber -> 'sequence_numbers')
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`sequence_numbers\` (
          \`id\` CHAR(36) NOT NULL,
          \`sequence_type\` VARCHAR(50) NOT NULL,
          \`prefix\` VARCHAR(20) NULL,
          \`suffix\` VARCHAR(20) NULL,
          \`current_number\` BIGINT NOT NULL DEFAULT 0,
          \`padding_length\` INT NOT NULL DEFAULT 6,
          \`reset_period\` ENUM('NEVER', 'YEARLY', 'MONTHLY', 'DAILY') DEFAULT 'NEVER',
          \`last_reset_at\` DATE NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_sequence_type\` (\`sequence_type\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // users (entity: User -> 'users')
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`users\` (
          \`id\` CHAR(36) NOT NULL,
          \`employee_code\` VARCHAR(50) NULL,
          \`email\` VARCHAR(255) NOT NULL,
          \`password_hash\` VARCHAR(255) NOT NULL,
          \`first_name\` VARCHAR(100) NOT NULL,
          \`last_name\` VARCHAR(100) NULL,
          \`phone\` VARCHAR(50) NULL,
          \`avatar_url\` VARCHAR(500) NULL,
          \`is_active\` TINYINT(1) DEFAULT 1,
          \`is_email_verified\` TINYINT(1) DEFAULT 0,
          \`email_verified_at\` TIMESTAMP NULL,
          \`last_login_at\` TIMESTAMP NULL,
          \`last_login_ip\` VARCHAR(45) NULL,
          \`password_changed_at\` TIMESTAMP NULL,
          \`failed_login_attempts\` INT DEFAULT 0,
          \`locked_until\` TIMESTAMP NULL,
          \`created_by\` CHAR(36) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          \`deleted_at\` DATETIME(6) NULL,
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_user_email\` (\`email\`),
          UNIQUE KEY \`uk_employee_code\` (\`employee_code\`),
          INDEX \`idx_user_active\` (\`is_active\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // user_sessions (entity: UserSession -> 'user_sessions')
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`user_sessions\` (
          \`id\` CHAR(36) NOT NULL,
          \`user_id\` CHAR(36) NOT NULL,
          \`token_hash\` VARCHAR(255) NOT NULL,
          \`refresh_token_hash\` VARCHAR(255) NULL,
          \`device_type\` VARCHAR(50) NULL,
          \`device_name\` VARCHAR(200) NULL,
          \`browser\` VARCHAR(100) NULL,
          \`os\` VARCHAR(100) NULL,
          \`ip_address\` VARCHAR(45) NULL,
          \`location\` VARCHAR(200) NULL,
          \`expires_at\` TIMESTAMP NOT NULL,
          \`refresh_expires_at\` TIMESTAMP NULL,
          \`last_activity_at\` TIMESTAMP NOT NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_session_user\` (\`user_id\`),
          CONSTRAINT \`fk_session_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // roles (entity: Role -> 'roles')
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`roles\` (
          \`id\` CHAR(36) NOT NULL,
          \`role_code\` VARCHAR(50) NOT NULL,
          \`role_name\` VARCHAR(100) NOT NULL,
          \`description\` TEXT NULL,
          \`is_system\` TINYINT(1) DEFAULT 0,
          \`is_active\` TINYINT(1) DEFAULT 1,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_role_code\` (\`role_code\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // permissions (entity: Permission -> 'permissions')
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

      // user_roles (entity: UserRole -> 'user_roles')
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`user_roles\` (
          \`id\` CHAR(36) NOT NULL,
          \`user_id\` CHAR(36) NOT NULL,
          \`role_id\` CHAR(36) NOT NULL,
          \`assigned_by\` CHAR(36) NULL,
          \`assigned_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_user_role\` (\`user_id\`, \`role_id\`),
          CONSTRAINT \`fk_user_role_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_user_role_role\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\` (\`id\`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // role_permissions (entity: RolePermission -> 'role_permissions')
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

      // tenant_settings (entity: TenantSetting -> 'tenant_settings')
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`tenant_settings\` (
          \`id\` CHAR(36) NOT NULL,
          \`category\` ENUM('GENERAL', 'INVENTORY', 'SALES', 'PURCHASE', 'ACCOUNTING', 'POS', 'ECOMMERCE', 'MANUFACTURING', 'NOTIFICATION', 'INTEGRATION') DEFAULT 'GENERAL',
          \`setting_key\` VARCHAR(100) NOT NULL,
          \`setting_value\` TEXT NULL,
          \`data_type\` ENUM('STRING', 'NUMBER', 'BOOLEAN', 'JSON', 'DATE') DEFAULT 'STRING',
          \`display_name\` VARCHAR(200) NOT NULL,
          \`description\` TEXT NULL,
          \`default_value\` TEXT NULL,
          \`is_system\` TINYINT(1) DEFAULT 0,
          \`is_encrypted\` TINYINT(1) DEFAULT 0,
          \`validation_rules\` JSON NULL,
          \`updated_by\` CHAR(36) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_tenant_setting_key\` (\`setting_key\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // audit_log (entity: AuditLog -> 'audit_log')
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`audit_log\` (
          \`id\` CHAR(36) NOT NULL,
          \`user_id\` CHAR(36) NULL,
          \`action\` VARCHAR(100) NOT NULL,
          \`module\` VARCHAR(50) NOT NULL,
          \`entity_type\` VARCHAR(100) NOT NULL,
          \`entity_id\` CHAR(36) NULL,
          \`old_values\` JSON NULL,
          \`new_values\` JSON NULL,
          \`ip_address\` VARCHAR(45) NULL,
          \`user_agent\` TEXT NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_audit_entity\` (\`entity_type\`, \`entity_id\`),
          INDEX \`idx_audit_created\` (\`created_at\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // =====================================================
      // INVENTORY TABLES
      // =====================================================

      // product_categories (entity: ProductCategory -> 'product_categories')
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`product_categories\` (
          \`id\` CHAR(36) NOT NULL,
          \`category_code\` VARCHAR(50) NOT NULL,
          \`category_name\` VARCHAR(200) NOT NULL,
          \`parent_id\` CHAR(36) NULL,
          \`level\` INT DEFAULT 0,
          \`path\` VARCHAR(500) NULL,
          \`description\` TEXT NULL,
          \`image_url\` VARCHAR(500) NULL,
          \`is_active\` TINYINT(1) DEFAULT 1,
          \`sort_order\` INT DEFAULT 0,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_category_code\` (\`category_code\`),
          INDEX \`idx_category_parent\` (\`parent_id\`),
          INDEX \`idx_category_active\` (\`is_active\`),
          CONSTRAINT \`fk_category_parent\` FOREIGN KEY (\`parent_id\`) REFERENCES \`product_categories\` (\`id\`) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // brands (entity: Brand -> 'brands')
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`brands\` (
          \`id\` CHAR(36) NOT NULL,
          \`brand_code\` VARCHAR(50) NOT NULL,
          \`brand_name\` VARCHAR(200) NOT NULL,
          \`description\` TEXT NULL,
          \`logo_url\` VARCHAR(500) NULL,
          \`website\` VARCHAR(255) NULL,
          \`is_active\` TINYINT(1) DEFAULT 1,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_brand_code\` (\`brand_code\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // units_of_measure (entity: UnitOfMeasure -> 'units_of_measure')
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`units_of_measure\` (
          \`id\` CHAR(36) NOT NULL,
          \`uom_code\` VARCHAR(20) NOT NULL,
          \`uom_name\` VARCHAR(100) NOT NULL,
          \`description\` TEXT NULL,
          \`symbol\` VARCHAR(20) NULL,
          \`uom_type\` ENUM('COUNT', 'UNIT', 'WEIGHT', 'VOLUME', 'LENGTH', 'AREA', 'TIME', 'PACK') DEFAULT 'COUNT',
          \`decimal_places\` TINYINT DEFAULT 0,
          \`is_active\` TINYINT(1) DEFAULT 1,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_uom_code\` (\`uom_code\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // uom_conversions (entity: UomConversion -> 'uom_conversions')
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`uom_conversions\` (
          \`id\` CHAR(36) NOT NULL,
          \`from_uom_id\` CHAR(36) NOT NULL,
          \`to_uom_id\` CHAR(36) NOT NULL,
          \`conversion_factor\` DECIMAL(18, 8) NOT NULL,
          \`is_bidirectional\` TINYINT(1) DEFAULT 1,
          \`product_id\` CHAR(36) NULL,
          \`is_active\` TINYINT(1) DEFAULT 1,
          \`description\` TEXT NULL,
          \`created_by\` CHAR(36) NULL,
          \`updated_by\` CHAR(36) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_uom_conversion\` (\`from_uom_id\`, \`to_uom_id\`),
          INDEX \`idx_uom_from\` (\`from_uom_id\`),
          INDEX \`idx_uom_to\` (\`to_uom_id\`),
          CONSTRAINT \`fk_uom_conv_from\` FOREIGN KEY (\`from_uom_id\`) REFERENCES \`units_of_measure\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_uom_conv_to\` FOREIGN KEY (\`to_uom_id\`) REFERENCES \`units_of_measure\` (\`id\`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // tax_categories (entity: TaxCategory -> 'tax_categories')
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

      // tax_rates (entity: TaxRate -> 'tax_rates')
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`tax_rates\` (
          \`id\` CHAR(36) NOT NULL,
          \`tax_category_id\` CHAR(36) NOT NULL,
          \`tax_type\` VARCHAR(50) NOT NULL,
          \`rate_name\` VARCHAR(100) NOT NULL,
          \`rate_percentage\` DECIMAL(5, 2) NOT NULL,
          \`effective_from\` DATE NOT NULL,
          \`effective_to\` DATE NULL,
          \`is_active\` TINYINT(1) DEFAULT 1,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          CONSTRAINT \`fk_tax_rate_category\` FOREIGN KEY (\`tax_category_id\`) REFERENCES \`tax_categories\` (\`id\`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // product_attributes (entity: ProductAttribute -> 'product_attributes')
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`product_attributes\` (
          \`id\` CHAR(36) NOT NULL,
          \`attribute_code\` VARCHAR(50) NOT NULL,
          \`attribute_name\` VARCHAR(100) NOT NULL,
          \`attribute_type\` ENUM('TEXT', 'NUMBER', 'SELECT', 'MULTI_SELECT', 'BOOLEAN', 'DATE', 'COLOR') DEFAULT 'TEXT',
          \`description\` TEXT NULL,
          \`is_required\` TINYINT(1) DEFAULT 0,
          \`is_filterable\` TINYINT(1) DEFAULT 0,
          \`is_searchable\` TINYINT(1) DEFAULT 0,
          \`is_visible_on_front\` TINYINT(1) DEFAULT 1,
          \`is_used_for_variants\` TINYINT(1) DEFAULT 0,
          \`sort_order\` INT DEFAULT 0,
          \`validation_rules\` JSON NULL,
          \`is_active\` TINYINT(1) DEFAULT 1,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_attribute_code\` (\`attribute_code\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // product_attribute_values (entity: ProductAttributeValue -> 'product_attribute_values')
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`product_attribute_values\` (
          \`id\` CHAR(36) NOT NULL,
          \`attribute_id\` CHAR(36) NOT NULL,
          \`value_code\` VARCHAR(50) NOT NULL,
          \`value_label\` VARCHAR(200) NOT NULL,
          \`color_hex\` VARCHAR(7) NULL,
          \`image_url\` VARCHAR(500) NULL,
          \`sort_order\` INT DEFAULT 0,
          \`is_active\` TINYINT(1) DEFAULT 1,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_attr_value_attr\` (\`attribute_id\`),
          CONSTRAINT \`fk_attr_value_attr\` FOREIGN KEY (\`attribute_id\`) REFERENCES \`product_attributes\` (\`id\`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // products (entity: Product -> 'products')
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`products\` (
          \`id\` CHAR(36) NOT NULL,
          \`sku\` VARCHAR(100) NOT NULL,
          \`barcode\` VARCHAR(100) NULL,
          \`product_name\` VARCHAR(300) NOT NULL,
          \`short_name\` VARCHAR(100) NULL,
          \`description\` TEXT NULL,
          \`category_id\` CHAR(36) NULL,
          \`brand_id\` CHAR(36) NULL,
          \`base_uom_id\` CHAR(36) NOT NULL,
          \`secondary_uom_id\` CHAR(36) NULL,
          \`uom_conversion_factor\` DECIMAL(18, 8) NULL,
          \`product_type\` ENUM('GOODS', 'SERVICE', 'COMBO', 'DIGITAL', 'RAW_MATERIAL', 'SEMI_FINISHED', 'FINISHED') DEFAULT 'GOODS',
          \`is_stockable\` TINYINT(1) DEFAULT 1,
          \`is_purchasable\` TINYINT(1) DEFAULT 1,
          \`is_sellable\` TINYINT(1) DEFAULT 1,
          \`is_active\` TINYINT(1) DEFAULT 1,
          \`track_serial\` TINYINT(1) DEFAULT 0,
          \`track_batch\` TINYINT(1) DEFAULT 0,
          \`track_expiry\` TINYINT(1) DEFAULT 0,
          \`shelf_life_days\` INT NULL,
          \`hsn_code\` VARCHAR(20) NULL,
          \`tax_category_id\` CHAR(36) NOT NULL,
          \`cost_price\` DECIMAL(18, 4) DEFAULT 0,
          \`selling_price\` DECIMAL(18, 4) DEFAULT 0,
          \`mrp\` DECIMAL(18, 4) NULL,
          \`minimum_price\` DECIMAL(18, 4) NULL,
          \`wholesale_price\` DECIMAL(18, 4) NULL,
          \`weight\` DECIMAL(10, 4) NULL,
          \`weight_unit\` VARCHAR(20) NULL,
          \`length\` DECIMAL(10, 4) NULL,
          \`width\` DECIMAL(10, 4) NULL,
          \`height\` DECIMAL(10, 4) NULL,
          \`dimension_unit\` VARCHAR(20) NULL,
          \`reorder_level\` DECIMAL(18, 4) DEFAULT 0,
          \`reorder_quantity\` DECIMAL(18, 4) DEFAULT 0,
          \`minimum_order_quantity\` DECIMAL(18, 4) DEFAULT 1,
          \`maximum_order_quantity\` DECIMAL(18, 4) NULL,
          \`lead_time_days\` INT NULL,
          \`warranty_months\` INT NULL,
          \`notes\` TEXT NULL,
          \`created_by\` CHAR(36) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          \`deleted_at\` DATETIME(6) NULL,
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_product_sku\` (\`sku\`),
          UNIQUE KEY \`uk_product_barcode\` (\`barcode\`),
          INDEX \`idx_product_category\` (\`category_id\`),
          INDEX \`idx_product_brand\` (\`brand_id\`),
          INDEX \`idx_product_active\` (\`is_active\`),
          CONSTRAINT \`fk_product_category\` FOREIGN KEY (\`category_id\`) REFERENCES \`product_categories\` (\`id\`) ON DELETE SET NULL,
          CONSTRAINT \`fk_product_brand\` FOREIGN KEY (\`brand_id\`) REFERENCES \`brands\` (\`id\`) ON DELETE SET NULL,
          CONSTRAINT \`fk_product_base_uom\` FOREIGN KEY (\`base_uom_id\`) REFERENCES \`units_of_measure\` (\`id\`),
          CONSTRAINT \`fk_product_secondary_uom\` FOREIGN KEY (\`secondary_uom_id\`) REFERENCES \`units_of_measure\` (\`id\`) ON DELETE SET NULL,
          CONSTRAINT \`fk_product_tax_cat\` FOREIGN KEY (\`tax_category_id\`) REFERENCES \`tax_categories\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // product_variants (entity: ProductVariant -> 'product_variants')
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`product_variants\` (
          \`id\` CHAR(36) NOT NULL,
          \`product_id\` CHAR(36) NOT NULL,
          \`variant_sku\` VARCHAR(100) NOT NULL,
          \`variant_barcode\` VARCHAR(100) NULL,
          \`variant_name\` VARCHAR(300) NOT NULL,
          \`cost_price\` DECIMAL(18, 4) NULL,
          \`selling_price\` DECIMAL(18, 4) NULL,
          \`mrp\` DECIMAL(18, 4) NULL,
          \`weight\` DECIMAL(10, 4) NULL,
          \`image_url\` VARCHAR(500) NULL,
          \`is_active\` TINYINT(1) DEFAULT 1,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_variant_sku\` (\`variant_sku\`),
          UNIQUE KEY \`uk_variant_barcode\` (\`variant_barcode\`),
          INDEX \`idx_variant_product\` (\`product_id\`),
          CONSTRAINT \`fk_variant_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // product_variant_attributes (entity: ProductVariantAttribute -> 'product_variant_attributes')
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`product_variant_attributes\` (
          \`id\` CHAR(36) NOT NULL,
          \`variant_id\` CHAR(36) NOT NULL,
          \`attribute_id\` CHAR(36) NOT NULL,
          \`attribute_value_id\` CHAR(36) NULL,
          \`custom_value\` VARCHAR(500) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_pva_variant\` (\`variant_id\`),
          CONSTRAINT \`fk_pva_variant\` FOREIGN KEY (\`variant_id\`) REFERENCES \`product_variants\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_pva_attribute\` FOREIGN KEY (\`attribute_id\`) REFERENCES \`product_attributes\` (\`id\`),
          CONSTRAINT \`fk_pva_attr_value\` FOREIGN KEY (\`attribute_value_id\`) REFERENCES \`product_attribute_values\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // product_images (entity: ProductImage -> 'product_images')
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`product_images\` (
          \`id\` CHAR(36) NOT NULL,
          \`product_id\` CHAR(36) NOT NULL,
          \`image_url\` VARCHAR(500) NOT NULL,
          \`thumbnail_url\` VARCHAR(500) NULL,
          \`alt_text\` VARCHAR(255) NULL,
          \`title\` VARCHAR(100) NULL,
          \`is_primary\` TINYINT(1) DEFAULT 0,
          \`sort_order\` INT DEFAULT 0,
          \`file_name\` VARCHAR(255) NULL,
          \`file_size\` INT NULL,
          \`mime_type\` VARCHAR(50) NULL,
          \`width\` INT NULL,
          \`height\` INT NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_product_image_product\` (\`product_id\`),
          CONSTRAINT \`fk_product_image_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // =====================================================
      // WAREHOUSE TABLES
      // =====================================================

      // warehouses (entity: Warehouse -> 'warehouses')
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`warehouses\` (
          \`id\` CHAR(36) NOT NULL,
          \`warehouse_code\` VARCHAR(50) NOT NULL,
          \`warehouse_name\` VARCHAR(200) NOT NULL,
          \`warehouse_type\` ENUM('MAIN', 'DISTRIBUTION', 'RAW_MATERIAL', 'RETAIL', 'VIRTUAL', 'TRANSIT', 'QUARANTINE', 'RETURNS') DEFAULT 'MAIN',
          \`address_line1\` VARCHAR(255) NULL,
          \`address_line2\` VARCHAR(255) NULL,
          \`city\` VARCHAR(100) NULL,
          \`state\` VARCHAR(100) NULL,
          \`country\` VARCHAR(100) NULL,
          \`postal_code\` VARCHAR(20) NULL,
          \`contact_person\` VARCHAR(100) NULL,
          \`phone\` VARCHAR(50) NULL,
          \`email\` VARCHAR(255) NULL,
          \`total_area_sqft\` DECIMAL(12, 2) NULL,
          \`usable_area_sqft\` DECIMAL(12, 2) NULL,
          \`is_active\` TINYINT(1) DEFAULT 1,
          \`is_default\` TINYINT(1) DEFAULT 0,
          \`allow_negative_stock\` TINYINT(1) DEFAULT 0,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_warehouse_code\` (\`warehouse_code\`),
          INDEX \`idx_warehouse_active\` (\`is_active\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // warehouse_zones (entity: WarehouseZone -> 'warehouse_zones')
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`warehouse_zones\` (
          \`id\` CHAR(36) NOT NULL,
          \`warehouse_id\` CHAR(36) NOT NULL,
          \`zone_code\` VARCHAR(50) NOT NULL,
          \`zone_name\` VARCHAR(200) NOT NULL,
          \`zone_type\` ENUM('STAGING', 'PACKING', 'STORAGE', 'GENERAL', 'COLD_STORAGE', 'HAZARDOUS', 'HIGH_VALUE', 'BULK', 'PICKING', 'RECEIVING', 'SHIPPING', 'QUARANTINE', 'RETURNS') DEFAULT 'STORAGE',
          \`description\` TEXT NULL,
          \`temperature_min\` DECIMAL(5, 2) NULL,
          \`temperature_max\` DECIMAL(5, 2) NULL,
          \`is_active\` TINYINT(1) DEFAULT 1,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_zone_warehouse\` (\`warehouse_id\`),
          CONSTRAINT \`fk_zone_warehouse\` FOREIGN KEY (\`warehouse_id\`) REFERENCES \`warehouses\` (\`id\`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // warehouse_locations (entity: WarehouseLocation -> 'warehouse_locations')
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`warehouse_locations\` (
          \`id\` CHAR(36) NOT NULL,
          \`warehouse_id\` CHAR(36) NOT NULL,
          \`zone_id\` CHAR(36) NULL,
          \`location_code\` VARCHAR(50) NOT NULL,
          \`location_name\` VARCHAR(200) NULL,
          \`aisle\` VARCHAR(20) NULL,
          \`rack\` VARCHAR(20) NULL,
          \`shelf\` VARCHAR(20) NULL,
          \`bin\` VARCHAR(20) NULL,
          \`location_type\` ENUM('RECEIVING', 'STORAGE', 'PICKING', 'PACKING', 'SHIPPING', 'STAGING', 'QUALITY_CHECK', 'RETURNS', 'DAMAGE', 'BULk') DEFAULT 'BULk',
          \`barcode\` VARCHAR(100) NULL,
          \`max_weight_kg\` DECIMAL(10, 2) NULL,
          \`max_volume_cbm\` DECIMAL(10, 4) NULL,
          \`max_units\` INT NULL,
          \`current_weight_kg\` DECIMAL(10, 2) DEFAULT 0,
          \`current_volume_cbm\` DECIMAL(10, 4) DEFAULT 0,
          \`current_units\` INT DEFAULT 0,
          \`status\` ENUM('AVAILABLE', 'OCCUPIED', 'RESERVED', 'BLOCKED', 'MAINTENANCE') DEFAULT 'AVAILABLE',
          \`is_active\` TINYINT(1) DEFAULT 1,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_location_warehouse\` (\`warehouse_id\`),
          INDEX \`idx_location_zone\` (\`zone_id\`),
          CONSTRAINT \`fk_location_warehouse\` FOREIGN KEY (\`warehouse_id\`) REFERENCES \`warehouses\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_location_zone\` FOREIGN KEY (\`zone_id\`) REFERENCES \`warehouse_zones\` (\`id\`) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // inventory_stock (entity: InventoryStock -> 'inventory_stock')
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`inventory_stock\` (
          \`id\` CHAR(36) NOT NULL,
          \`product_id\` CHAR(36) NOT NULL,
          \`variant_id\` CHAR(36) NULL,
          \`warehouse_id\` CHAR(36) NOT NULL,
          \`quantity_on_hand\` DECIMAL(18, 4) NOT NULL DEFAULT 0,
          \`quantity_reserved\` DECIMAL(18, 4) NOT NULL DEFAULT 0,
          \`quantity_incoming\` DECIMAL(18, 4) NOT NULL DEFAULT 0,
          \`quantity_outgoing\` DECIMAL(18, 4) NOT NULL DEFAULT 0,
          \`last_stock_date\` TIMESTAMP NULL,
          \`last_count_date\` TIMESTAMP NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_stock_product_wh\` (\`product_id\`, \`warehouse_id\`, \`variant_id\`),
          CONSTRAINT \`fk_stock_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_stock_variant\` FOREIGN KEY (\`variant_id\`) REFERENCES \`product_variants\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_stock_warehouse\` FOREIGN KEY (\`warehouse_id\`) REFERENCES \`warehouses\` (\`id\`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // =====================================================
      // PRICING TABLES
      // =====================================================

      // price_lists (entity: PriceList -> 'price_lists')
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`price_lists\` (
          \`id\` CHAR(36) NOT NULL,
          \`price_list_code\` VARCHAR(50) NOT NULL,
          \`price_list_name\` VARCHAR(200) NOT NULL,
          \`price_list_type\` ENUM('SALES', 'PURCHASE') DEFAULT 'SALES',
          \`description\` TEXT NULL,
          \`currency\` VARCHAR(3) DEFAULT 'INR',
          \`is_tax_inclusive\` TINYINT(1) DEFAULT 0,
          \`effective_from\` DATE NULL,
          \`effective_to\` DATE NULL,
          \`min_order_amount\` DECIMAL(18, 4) NULL,
          \`discount_percentage\` DECIMAL(5, 2) DEFAULT 0,
          \`priority\` INT DEFAULT 0,
          \`is_default\` TINYINT(1) DEFAULT 0,
          \`is_active\` TINYINT(1) DEFAULT 1,
          \`created_by\` CHAR(36) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_price_list_code\` (\`price_list_code\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // price_list_items (entity: PriceListItem -> 'price_list_items')
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`price_list_items\` (
          \`id\` CHAR(36) NOT NULL,
          \`price_list_id\` CHAR(36) NOT NULL,
          \`product_id\` CHAR(36) NOT NULL,
          \`variant_id\` CHAR(36) NULL,
          \`uom_id\` CHAR(36) NULL,
          \`price\` DECIMAL(18, 4) NOT NULL,
          \`min_quantity\` DECIMAL(18, 4) DEFAULT 1,
          \`max_quantity\` DECIMAL(18, 4) NULL,
          \`discount_percentage\` DECIMAL(5, 2) DEFAULT 0,
          \`discount_amount\` DECIMAL(18, 4) DEFAULT 0,
          \`effective_from\` DATE NULL,
          \`effective_to\` DATE NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_pli_price_list\` (\`price_list_id\`),
          CONSTRAINT \`fk_pli_price_list\` FOREIGN KEY (\`price_list_id\`) REFERENCES \`price_lists\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_pli_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`),
          CONSTRAINT \`fk_pli_variant\` FOREIGN KEY (\`variant_id\`) REFERENCES \`product_variants\` (\`id\`),
          CONSTRAINT \`fk_pli_uom\` FOREIGN KEY (\`uom_id\`) REFERENCES \`units_of_measure\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // =====================================================
      // PAYMENT TABLES
      // =====================================================

      // payment_methods (entity: PaymentMethod -> 'payment_methods')
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`payment_methods\` (
          \`id\` CHAR(36) NOT NULL,
          \`method_code\` VARCHAR(50) NOT NULL,
          \`method_name\` VARCHAR(200) NOT NULL,
          \`description\` TEXT NULL,
          \`method_type\` ENUM('CASH', 'CARD', 'UPI', 'NET_BANKING', 'WALLET', 'BANK_TRANSFER', 'CHEQUE', 'COD', 'CREDIT', 'EMI', 'GIFT_CARD', 'STORE_CREDIT', 'OTHER') NOT NULL,
          \`gateway_code\` VARCHAR(50) NULL,
          \`gateway_config\` JSON NULL,
          \`processing_fee_type\` ENUM('PERCENTAGE', 'FIXED', 'NONE') DEFAULT 'NONE',
          \`processing_fee_value\` DECIMAL(10, 4) DEFAULT 0,
          \`min_amount\` DECIMAL(18, 4) NULL,
          \`max_amount\` DECIMAL(18, 4) NULL,
          \`is_available_pos\` TINYINT(1) DEFAULT 1,
          \`is_available_ecommerce\` TINYINT(1) DEFAULT 1,
          \`requires_reference\` TINYINT(1) DEFAULT 0,
          \`is_active\` TINYINT(1) DEFAULT 1,
          \`sort_order\` INT DEFAULT 0,
          \`icon_url\` VARCHAR(500) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_payment_method_code\` (\`method_code\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // =====================================================
      // CUSTOMER & SUPPLIER TABLES
      // =====================================================

      // customer_groups (entity: CustomerGroup -> 'customer_groups')
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`customer_groups\` (
          \`id\` CHAR(36) NOT NULL,
          \`group_code\` VARCHAR(50) NOT NULL,
          \`group_name\` VARCHAR(200) NOT NULL,
          \`description\` TEXT NULL,
          \`default_price_list_id\` CHAR(36) NULL,
          \`discount_percentage\` DECIMAL(5, 2) DEFAULT 0,
          \`payment_terms_days\` INT NULL,
          \`credit_limit\` DECIMAL(18, 2) NULL,
          \`is_tax_exempt\` TINYINT(1) DEFAULT 0,
          \`loyalty_multiplier\` DECIMAL(5, 2) DEFAULT 1,
          \`is_active\` TINYINT(1) DEFAULT 1,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_customer_group_code\` (\`group_code\`),
          CONSTRAINT \`fk_cg_price_list\` FOREIGN KEY (\`default_price_list_id\`) REFERENCES \`price_lists\` (\`id\`) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // customers (entity: Customer -> 'customers')
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`customers\` (
          \`id\` CHAR(36) NOT NULL,
          \`customer_code\` VARCHAR(50) NOT NULL,
          \`customer_type\` ENUM('INDIVIDUAL', 'BUSINESS') DEFAULT 'INDIVIDUAL',
          \`first_name\` VARCHAR(100) NOT NULL,
          \`last_name\` VARCHAR(100) NULL,
          \`company_name\` VARCHAR(200) NULL,
          \`email\` VARCHAR(255) NULL,
          \`phone\` VARCHAR(50) NULL,
          \`mobile\` VARCHAR(50) NULL,
          \`panNumber\` VARCHAR(50) NULL,
          \`paymentTermsDays\` VARCHAR(50) NULL,
          \`currency\` VARCHAR(50) NULL,
          \`tax_id\` VARCHAR(100) NULL,
          \`date_of_birth\` DATE NULL,
          \`gender\` ENUM('MALE', 'FEMALE', 'OTHER') NULL,
          \`customer_group_id\` CHAR(36) NULL,
          \`price_list_id\` CHAR(36) NULL,
          \`default_payment_terms_days\` INT NULL,
          \`credit_limit\` DECIMAL(18, 2) DEFAULT 0,
          \`total_purchases\` DECIMAL(18, 2) DEFAULT 0,
          \`current_balance\` DECIMAL(18, 2) DEFAULT 0,
          \`loyalty_points\` INT DEFAULT 0,
          \`total_orders\` INT DEFAULT 0,
          \`total_spent\` DECIMAL(18, 2) DEFAULT 0,
          \`last_order_date\` TIMESTAMP NULL,
          \`notes\` TEXT NULL,
          \`is_active\` TINYINT(1) DEFAULT 1,
          \`is_verified\` TINYINT(1) DEFAULT 0,
          \`accepts_marketing\` TINYINT(1) DEFAULT 0,
          \`source\` VARCHAR(50) NULL,
          \`referral_code\` VARCHAR(50) NULL,
          \`referred_by\` CHAR(36) NULL,
          \`created_by\` CHAR(36) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          \`deleted_at\` DATETIME(6) NULL,
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_customer_code\` (\`customer_code\`),
          INDEX \`idx_customer_active\` (\`is_active\`),
          CONSTRAINT \`fk_customer_group\` FOREIGN KEY (\`customer_group_id\`) REFERENCES \`customer_groups\` (\`id\`) ON DELETE SET NULL,
          CONSTRAINT \`fk_customer_price_list\` FOREIGN KEY (\`price_list_id\`) REFERENCES \`price_lists\` (\`id\`) ON DELETE SET NULL,
          CONSTRAINT \`fk_customer_referrer\` FOREIGN KEY (\`referred_by\`) REFERENCES \`customers\` (\`id\`) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // customer_addresses (entity: CustomerAddress -> 'customer_addresses')
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`customer_addresses\` (
          \`id\` CHAR(36) NOT NULL,
          \`address_label\` VARCHAR(100) NULL,
          \`customer_id\` CHAR(36) NOT NULL,
          \`address_type\` ENUM('BILLING', 'SHIPPING', 'BOTH') DEFAULT 'BOTH',
          \`is_default\` TINYINT(1) DEFAULT 0,
          \`contact_name\` VARCHAR(200) NULL,
          \`contact_phone\` VARCHAR(50) NULL,
          \`address_line1\` VARCHAR(255) NOT NULL,
          \`address_line2\` VARCHAR(255) NULL,
          \`landmark\` VARCHAR(200) NULL,
          \`city\` VARCHAR(100) NOT NULL,
          \`state\` VARCHAR(100) NOT NULL,
          \`country\` VARCHAR(100) DEFAULT 'Bangladesh',
          \`postal_code\` VARCHAR(20) NOT NULL,
          \`latitude\` DECIMAL(10, 8) NULL,
          \`longitude\` DECIMAL(11, 8) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_addr_customer\` (\`customer_id\`),
          CONSTRAINT \`fk_addr_customer\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\` (\`id\`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // suppliers (entity: Supplier -> 'suppliers')
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`suppliers\` (
          \`id\` CHAR(36) NOT NULL,
          \`supplier_code\` VARCHAR(50) NOT NULL,
          \`company_name\` VARCHAR(200) NOT NULL,
          \`contact_person\` VARCHAR(100) NULL,
          \`email\` VARCHAR(255) NULL,
          \`phone\` VARCHAR(50) NULL,
          \`mobile\` VARCHAR(50) NULL,
          \`panNumber\` VARCHAR(50) NULL,
          \`fax\` VARCHAR(50) NULL,
          \`website\` VARCHAR(255) NULL,
          \`tax_id\` VARCHAR(100) NULL,
          \`payment_terms_days\` INT DEFAULT 30,
          \`credit_limit\` DECIMAL(18, 2) DEFAULT 0,
          \`currency\` VARCHAR(3) DEFAULT 'INR',
          \`address_line1\` VARCHAR(255) NULL,
          \`address_line2\` VARCHAR(255) NULL,
          \`city\` VARCHAR(100) NULL,
          \`state\` VARCHAR(100) NULL,
          \`country\` VARCHAR(100) NULL,
          \`postal_code\` VARCHAR(20) NULL,
          \`bank_name\` VARCHAR(200) NULL,
          \`bank_account_number\` VARCHAR(50) NULL,
          \`bank_ifsc_code\` VARCHAR(20) NULL,
          \`bank_branch\` VARCHAR(200) NULL,
          \`notes\` TEXT NULL,
          \`is_active\` TINYINT(1) DEFAULT 1,
          \`created_by\` CHAR(36) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          \`deleted_at\` DATETIME(6) NULL,
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_supplier_code\` (\`supplier_code\`),
          INDEX \`idx_supplier_active\` (\`is_active\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // supplier_contacts (entity: SupplierContact -> 'supplier_contacts')
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`supplier_contacts\` (
          \`id\` CHAR(36) NOT NULL,
          \`supplier_id\` CHAR(36) NOT NULL,
          \`contact_name\` VARCHAR(200) NOT NULL,
          \`designation\` VARCHAR(100) NULL,
          \`department\` VARCHAR(100) NULL,
          \`email\` VARCHAR(255) NULL,
          \`phone\` VARCHAR(50) NULL,
          \`mobile\` VARCHAR(50) NULL,
          \`fax\` VARCHAR(50) NULL,
          \`is_primary\` TINYINT(1) DEFAULT 0,
          \`is_active\` TINYINT(1) DEFAULT 1,
          \`notes\` TEXT NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_sc_supplier\` (\`supplier_id\`),
          CONSTRAINT \`fk_sc_supplier\` FOREIGN KEY (\`supplier_id\`) REFERENCES \`suppliers\` (\`id\`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // supplier_products (entity: SupplierProduct -> 'supplier_products')
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`supplier_products\` (
          \`id\` CHAR(36) NOT NULL,
          \`supplier_id\` CHAR(36) NOT NULL,
          \`product_id\` CHAR(36) NOT NULL,
          \`variant_id\` CHAR(36) NULL,
          \`supplier_sku\` VARCHAR(100) NULL,
          \`supplier_product_name\` VARCHAR(300) NULL,
          \`purchase_uom_id\` CHAR(36) NULL,
          \`conversion_factor\` DECIMAL(18, 8) DEFAULT 1,
          \`unit_price\` DECIMAL(18, 4) NULL,
          \`currency\` VARCHAR(3) DEFAULT 'INR',
          \`min_order_quantity\` DECIMAL(18, 4) NULL,
          \`pack_size\` DECIMAL(18, 4) NULL,
          \`lead_time_days\` INT NULL,
          \`is_preferred\` TINYINT(1) DEFAULT 0,
          \`is_active\` TINYINT(1) DEFAULT 1,
          \`last_purchase_date\` DATE NULL,
          \`last_purchase_price\` DECIMAL(18, 4) NULL,
          \`notes\` TEXT NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_sp_supplier\` (\`supplier_id\`),
          CONSTRAINT \`fk_sp_supplier\` FOREIGN KEY (\`supplier_id\`) REFERENCES \`suppliers\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_sp_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`),
          CONSTRAINT \`fk_sp_variant\` FOREIGN KEY (\`variant_id\`) REFERENCES \`product_variants\` (\`id\`),
          CONSTRAINT \`fk_sp_uom\` FOREIGN KEY (\`purchase_uom_id\`) REFERENCES \`units_of_measure\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // =====================================================
      // SALES & QUOTATION TABLES
      // =====================================================

      // sales_orders (entity: SalesOrder -> 'sales_orders')
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`sales_orders\` (
          \`id\` CHAR(36) NOT NULL,
          \`order_number\` VARCHAR(50) NOT NULL,
          \`order_date\` TIMESTAMP NOT NULL,
          \`created_by\` CHAR(36) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`delivered_at\` TIMESTAMP NULL,
          \`order_source\` ENUM('WEBSITE', 'MOBILE_APP', 'POS', 'PHONE', 'MANUAL', 'API') DEFAULT 'WEBSITE',
          \`customer_id\` CHAR(36) NULL,
          \`customer_name\` VARCHAR(200) NULL,
          \`customer_email\` VARCHAR(255) NULL,
          \`note\` VARCHAR(255) NULL,
          \`customer_phone\` VARCHAR(50) NULL,
          \`warehouse_id\` CHAR(36) NOT NULL,
          \`store_id\` CHAR(36) NULL,
          \`shipped_at\` TIMESTAMP NULL,
          \`shipped_by\` CHAR(36) NULL,
          \`tracking_number\` VARCHAR(100) NULL,
          \`shipping_carrier\` VARCHAR(100) NULL,
          \`status\` ENUM('DRAFT', 'PENDING', 'CONFIRMED', 'PROCESSING', 'READY_TO_SHIP', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'RETURNED', 'ON_HOLD') DEFAULT 'PENDING',
          \`payment_status\` ENUM('PENDING', 'UNPAID', 'PAID', 'PARTIALLY_PAID', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED', 'PARTIALLY_REFUNDED') DEFAULT 'UNPAID',
          \`fulfillment_status\` ENUM('UNFULFILLED', 'PARTIALLY_FULFILLED', 'FULFILLED', 'RETURNED') DEFAULT 'UNFULFILLED',
          \`currency\` VARCHAR(3) DEFAULT 'INR',
          \`exchange_rate\` DECIMAL(12, 6) DEFAULT 1,
          \`subtotal\` DECIMAL(18, 4) DEFAULT 0,
          \`discountPercentage\` DECIMAL(18, 4) DEFAULT 0,
          \`discount_type\` ENUM('PERCENTAGE', 'FIXED') NULL,
          \`discount_value\` DECIMAL(18, 4) NULL,
          \`discount_amount\` DECIMAL(18, 4) DEFAULT 0,
          \`coupon_id\` CHAR(36) NULL,
          \`coupon_code\` VARCHAR(50) NULL,
          \`coupon_discount\` DECIMAL(18, 4) DEFAULT 0,
          \`tax_amount\` DECIMAL(18, 4) DEFAULT 0,
          \`shipping_amount\` DECIMAL(18, 4) DEFAULT 0,
          \`shipping_tax\` DECIMAL(18, 4) DEFAULT 0,
          \`other_charges\` DECIMAL(18, 4) DEFAULT 0,
          \`rounding_adjustment\` DECIMAL(18, 4) DEFAULT 0,
          \`total_amount\` DECIMAL(18, 4) DEFAULT 0,
          \`paid_amount\` DECIMAL(18, 4) DEFAULT 0,
          \`refunded_amount\` DECIMAL(18, 4) DEFAULT 0,
          \`billing_name\` VARCHAR(200) NULL,
          \`billing_phone\` VARCHAR(50) NULL,
          \`billing_address_line1\` VARCHAR(255) NULL,
          \`billing_address_line2\` VARCHAR(255) NULL,
          \`billing_city\` VARCHAR(100) NULL,
          \`billing_state\` VARCHAR(100) NULL,
          \`billing_country\` VARCHAR(100) NULL,
          \`billing_postal_code\` VARCHAR(20) NULL,
          \`shipping_name\` VARCHAR(200) NULL,
          \`shipping_phone\` VARCHAR(50) NULL,
          \`shipping_address_line1\` VARCHAR(255) NULL,
          \`shipping_address_line2\` VARCHAR(255) NULL,
          \`shipping_city\` VARCHAR(100) NULL,
          \`shipping_state\` VARCHAR(100) NULL,
          \`shipping_country\` VARCHAR(100) NULL,
          \`shipping_postal_code\` VARCHAR(20) NULL,
          \`shipping_method_id\` CHAR(36) NULL,
          \`shipping_method_name\` VARCHAR(200) NULL,
          \`expected_delivery_date\` DATE NULL,
          \`actual_delivery_date\` DATE NULL,
          \`customer_notes\` TEXT NULL,
          \`internal_notes\` TEXT NULL,
          \`cancellation_reason\` TEXT NULL,
          \`cancelled_at\` TIMESTAMP NULL,
          \`cancelled_by\` CHAR(36) NULL,
          \`confirmed_by\` CHAR(36) NULL,
          \`confirmed_at\` TIMESTAMP NULL,
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          \`payment_terms_days\` INT DEFAULT 0,
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_order_number\` (\`order_number\`),
          INDEX \`idx_order_customer\` (\`customer_id\`),
          INDEX \`idx_order_status\` (\`status\`),
          CONSTRAINT \`fk_order_customer\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\` (\`id\`),
          CONSTRAINT \`fk_order_warehouse\` FOREIGN KEY (\`warehouse_id\`) REFERENCES \`warehouses\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // sales_order_items (entity: SalesOrderItem -> 'sales_order_items')
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`sales_order_items\` (
          \`id\` CHAR(36) NOT NULL,
          \`sales_order_id\` CHAR(36) NOT NULL,
          \`product_id\` CHAR(36) NOT NULL,
          \`variant_id\` CHAR(36) NULL,
          \`sku\` VARCHAR(100) NOT NULL,
          \`product_name\` VARCHAR(300) NOT NULL,
          \`variant_name\` VARCHAR(300) NULL,
          \`quantity_ordered\` DECIMAL(18, 4) NOT NULL,
          \`quantity_allocated\` DECIMAL(18, 4) DEFAULT 0,
          \`quantity_shipped\` DECIMAL(18, 4) DEFAULT 0,
          \`quantity_delivered\` DECIMAL(18, 4) DEFAULT 0,
          \`quantity_returned\` DECIMAL(18, 4) DEFAULT 0,
          \`quantity_cancelled\` DECIMAL(18, 4) DEFAULT 0,
          \`uom_id\` CHAR(36) NULL,
          \`unit_price\` DECIMAL(18, 4) NOT NULL,
          \`original_price\` DECIMAL(18, 4) NULL,
          \`discount_percentage\` DECIMAL(5, 2) DEFAULT 0,
          \`discount_amount\` DECIMAL(18, 4) DEFAULT 0,
          \`tax_category_id\` CHAR(36) NULL,
          \`tax_percentage\` DECIMAL(5, 2) DEFAULT 0,
          \`tax_amount\` DECIMAL(18, 4) DEFAULT 0,
          \`line_total\` DECIMAL(18, 4) NOT NULL,
          \`cost_price\` DECIMAL(18, 4) NULL,
          \`notes\` TEXT NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_soi_order\` (\`sales_order_id\`),
          CONSTRAINT \`fk_soi_order\` FOREIGN KEY (\`sales_order_id\`) REFERENCES \`sales_orders\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_soi_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`),
          CONSTRAINT \`fk_soi_variant\` FOREIGN KEY (\`variant_id\`) REFERENCES \`product_variants\` (\`id\`),
          CONSTRAINT \`fk_soi_uom\` FOREIGN KEY (\`uom_id\`) REFERENCES \`units_of_measure\` (\`id\`),
          CONSTRAINT \`fk_soi_tax_cat\` FOREIGN KEY (\`tax_category_id\`) REFERENCES \`tax_categories\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // quotations (entity: Quotation -> 'quotations')
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`quotations\` (
          \`id\` CHAR(36) NOT NULL,
          \`quotation_number\` VARCHAR(50) NOT NULL,
          \`customer_id\` CHAR(36) NOT NULL,
          \`warehouse_id\` CHAR(36) NOT NULL,
          \`quotation_date\` DATE NOT NULL,
          \`valid_until\` DATE NULL,
          \`status\` ENUM('DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CONVERTED', 'CANCELLED') DEFAULT 'DRAFT',
          \`currency\` CHAR(3) DEFAULT 'INR',
          \`subtotal\` DECIMAL(15, 4) DEFAULT 0,
          \`discount_type\` ENUM('PERCENTAGE', 'FIXED') DEFAULT 'FIXED',
          \`discount_value\` DECIMAL(15, 4) DEFAULT 0,
          \`discount_amount\` DECIMAL(15, 4) DEFAULT 0,
          \`tax_amount\` DECIMAL(15, 4) DEFAULT 0,
          \`shipping_amount\` DECIMAL(15, 4) DEFAULT 0,
          \`total_amount\` DECIMAL(15, 4) DEFAULT 0,
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

      // quotation_items (entity: QuotationItem -> 'quotation_items')
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`quotation_items\` (
          \`id\` CHAR(36) NOT NULL,
          \`quotation_id\` CHAR(36) NOT NULL,
          \`product_id\` CHAR(36) NOT NULL,
          \`variant_id\` CHAR(36) NULL,
          \`product_name\` VARCHAR(300) NOT NULL,
          \`sku\` VARCHAR(100) NOT NULL,
          \`quantity\` DECIMAL(15, 4) NOT NULL,
          \`unit_price\` DECIMAL(15, 4) NOT NULL,
          \`discount_type\` ENUM('PERCENTAGE', 'FIXED') DEFAULT 'FIXED',
          \`discount_value\` DECIMAL(15, 4) DEFAULT 0,
          \`discount_amount\` DECIMAL(15, 4) DEFAULT 0,
          \`tax_rate\` DECIMAL(8, 4) DEFAULT 0,
          \`tax_amount\` DECIMAL(15, 4) DEFAULT 0,
          \`line_total\` DECIMAL(15, 4) NOT NULL,
          \`notes\` TEXT NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_qi_quotation\` (\`quotation_id\`),
          CONSTRAINT \`fk_qi_quotation\` FOREIGN KEY (\`quotation_id\`) REFERENCES \`quotations\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_qi_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // =====================================================
      // PURCHASE TABLES
      // =====================================================

      // purchase_orders (entity: PurchaseOrder -> 'purchase_orders')
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`purchase_orders\` (
          \`id\` CHAR(36) NOT NULL,
          \`po_number\` VARCHAR(50) NOT NULL,
          \`supplier_id\` CHAR(36) NOT NULL,
          \`warehouse_id\` CHAR(36) NOT NULL,
          \`po_date\` DATE NOT NULL,
          \`order_date\` DATE NOT NULL,
          \`expected_date\` DATE NULL,
          \`status\` ENUM('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'SENT', 'ACKNOWLEDGED', 'PARTIALLY_RECEIVED', 'RECEIVED', 'COMPLETED', 'CANCELLED', 'CLOSED') DEFAULT 'DRAFT',
          \`currency\` VARCHAR(3) DEFAULT 'INR',
          \`exchange_rate\` DECIMAL(12, 6) DEFAULT 1,
          \`subtotal\` DECIMAL(18, 4) DEFAULT 0,
          \`discount_type\` ENUM('PERCENTAGE', 'FIXED') NULL,
          \`discount_value\` DECIMAL(18, 4) NULL,
          \`discount_amount\` DECIMAL(18, 4) DEFAULT 0,
          \`tax_amount\` DECIMAL(18, 4) DEFAULT 0,
          \`shipping_amount\` DECIMAL(18, 4) DEFAULT 0,
          \`other_charges\` DECIMAL(18, 4) DEFAULT 0,
          \`total_amount\` DECIMAL(18, 4) DEFAULT 0,
          \`paid_amount\` DECIMAL(18, 4) DEFAULT 0,
          \`payment_status\` ENUM('PENDING', 'UNPAID', 'PAID', 'PARTIALLY_PAID', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED', 'PARTIALLY_REFUNDED') DEFAULT 'UNPAID',
          \`payment_terms_days\` INT NULL,
          \`payment_due_date\` DATE NULL,
          \`billing_address_line1\` VARCHAR(255) NULL,
          \`billing_address_line2\` VARCHAR(255) NULL,
          \`billing_city\` VARCHAR(100) NULL,
          \`billing_state\` VARCHAR(100) NULL,
          \`billing_country\` VARCHAR(100) NULL,
          \`billing_postal_code\` VARCHAR(20) NULL,
          \`shipping_address_line1\` VARCHAR(255) NULL,
          \`shipping_address_line2\` VARCHAR(255) NULL,
          \`shipping_city\` VARCHAR(100) NULL,
          \`shipping_state\` VARCHAR(100) NULL,
          \`shipping_country\` VARCHAR(100) NULL,
          \`shipping_postal_code\` VARCHAR(20) NULL,
          \`notes\` TEXT NULL,
          \`internal_notes\` TEXT NULL,
          \`terms_and_conditions\` TEXT NULL,
          \`approved_by\` CHAR(36) NULL,
          \`approved_at\` TIMESTAMP NULL,
          \`acknowledged_at\` TIMESTAMP NULL,
          \`supplier_reference_number\` VARCHAR(255) NULL,
          \`sent_at\` TIMESTAMP NULL,
          \`sent_by\` CHAR(36) NULL,
          \`cancelled_at\` TIMESTAMP NULL,
          \`cancelled_by\` CHAR(36) NULL,
          \`created_by\` CHAR(36) NULL,
          \`cancellation_reason\` VARCHAR(255) NULL,
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

      // purchase_order_items (entity: PurchaseOrderItem -> 'purchase_order_items')
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`purchase_order_items\` (
          \`id\` CHAR(36) NOT NULL,
          \`purchase_order_id\` CHAR(36) NOT NULL,
          \`product_id\` CHAR(36) NOT NULL,
          \`variant_id\` CHAR(36) NULL,
          \`description\` TEXT NULL,
          \`quantity_ordered\` DECIMAL(18, 4) NOT NULL,
          \`quantity_received\` DECIMAL(18, 4) DEFAULT 0,
          \`quantity_rejected\` DECIMAL(18, 4) DEFAULT 0,
          \`uom_id\` CHAR(36) NOT NULL,
          \`unit_price\` DECIMAL(18, 4) NOT NULL,
          \`discount_percentage\` DECIMAL(5, 2) DEFAULT 0,
          \`discount_amount\` DECIMAL(18, 4) DEFAULT 0,
          \`tax_category_id\` CHAR(36) NULL,
          \`tax_amount\` DECIMAL(18, 4) DEFAULT 0,
          \`line_total\` DECIMAL(18, 4) NOT NULL,
          \`expected_date\` DATE NULL,
          \`notes\` TEXT NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_poi_order\` (\`purchase_order_id\`),
          CONSTRAINT \`fk_poi_order\` FOREIGN KEY (\`purchase_order_id\`) REFERENCES \`purchase_orders\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_poi_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`),
          CONSTRAINT \`fk_poi_variant\` FOREIGN KEY (\`variant_id\`) REFERENCES \`product_variants\` (\`id\`),
          CONSTRAINT \`fk_poi_uom\` FOREIGN KEY (\`uom_id\`) REFERENCES \`units_of_measure\` (\`id\`),
          CONSTRAINT \`fk_poi_tax_cat\` FOREIGN KEY (\`tax_category_id\`) REFERENCES \`tax_categories\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // ─── Accounting ───────────────────────────────────────────────────────

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`fiscal_years\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`year_code\` VARCHAR(50) NOT NULL,
          \`year_name\` VARCHAR(100) NOT NULL,
          \`start_date\` DATE NOT NULL,
          \`end_date\` DATE NOT NULL,
          \`status\` ENUM('OPEN','CLOSED','LOCKED') NOT NULL DEFAULT 'OPEN',
          \`is_current\` TINYINT NOT NULL DEFAULT 0,
          \`closed_by\` VARCHAR(255) NULL,
          \`closed_at\` TIMESTAMP NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`UQ_fiscal_years_code\` (\`year_code\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`fiscal_periods\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`fiscal_year_id\` VARCHAR(255) NOT NULL,
          \`period_number\` INT NOT NULL,
          \`period_name\` VARCHAR(50) NOT NULL,
          \`start_date\` DATE NOT NULL,
          \`end_date\` DATE NOT NULL,
          \`status\` ENUM('OPEN','CLOSED','LOCKED') NOT NULL DEFAULT 'OPEN',
          \`closed_by\` VARCHAR(255) NULL,
          \`closed_at\` TIMESTAMP NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_fp_year\` (\`fiscal_year_id\`),
          CONSTRAINT \`fk_fp_year\` FOREIGN KEY (\`fiscal_year_id\`) REFERENCES \`fiscal_years\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`chart_of_accounts\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`account_code\` VARCHAR(50) NOT NULL,
          \`account_name\` VARCHAR(200) NOT NULL,
          \`account_type\` ENUM('ASSET','LIABILITY','EQUITY','REVENUE','EXPENSE') NOT NULL,
          \`account_subtype\` VARCHAR(50) NULL,
          \`parent_id\` VARCHAR(255) NULL,
          \`level\` INT NOT NULL DEFAULT 0,
          \`path\` VARCHAR(500) NULL,
          \`normal_balance\` ENUM('DEBIT','CREDIT') NOT NULL,
          \`is_header\` TINYINT NOT NULL DEFAULT 0,
          \`is_system\` TINYINT NOT NULL DEFAULT 0,
          \`is_active\` TINYINT NOT NULL DEFAULT 1,
          \`is_bank_account\` TINYINT NOT NULL DEFAULT 0,
          \`is_cash_account\` TINYINT NOT NULL DEFAULT 0,
          \`is_receivable\` TINYINT NOT NULL DEFAULT 0,
          \`is_payable\` TINYINT NOT NULL DEFAULT 0,
          \`currency\` VARCHAR(3) NULL,
          \`opening_balance_debit\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`opening_balance_credit\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`current_balance\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`description\` TEXT NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`UQ_coa_code\` (\`account_code\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`cost_centers\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`cost_center_code\` VARCHAR(50) NOT NULL,
          \`cost_center_name\` VARCHAR(200) NOT NULL,
          \`parent_id\` VARCHAR(255) NULL,
          \`level\` INT NOT NULL DEFAULT 0,
          \`path\` VARCHAR(500) NULL,
          \`description\` TEXT NULL,
          \`manager_id\` VARCHAR(255) NULL,
          \`budget\` DECIMAL(18,4) NULL,
          \`is_active\` TINYINT NOT NULL DEFAULT 1,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`UQ_cc_code\` (\`cost_center_code\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`journal_entries\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`entry_number\` VARCHAR(50) NOT NULL,
          \`entry_date\` DATE NOT NULL,
          \`fiscal_year_id\` VARCHAR(255) NOT NULL,
          \`fiscal_period_id\` VARCHAR(255) NOT NULL,
          \`entry_type\` ENUM('MANUAL','SALES','PURCHASE','RECEIPT','PAYMENT','INVENTORY','MANUFACTURING','ADJUSTMENT','OPENING','CLOSING','REVERSAL') NOT NULL DEFAULT 'MANUAL',
          \`reference_type\` VARCHAR(50) NULL,
          \`reference_id\` VARCHAR(255) NULL,
          \`reference_number\` VARCHAR(50) NULL,
          \`description\` TEXT NOT NULL,
          \`total_debit\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`total_credit\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`currency\` VARCHAR(3) NOT NULL DEFAULT 'INR',
          \`exchange_rate\` DECIMAL(12,6) NOT NULL DEFAULT 1,
          \`status\` ENUM('DRAFT','PENDING','POSTED','REVERSED','CANCELLED') NOT NULL DEFAULT 'DRAFT',
          \`is_auto_generated\` TINYINT NOT NULL DEFAULT 0,
          \`reversal_of_id\` VARCHAR(255) NULL,
          \`reversed_by_id\` VARCHAR(255) NULL,
          \`posted_by\` VARCHAR(255) NULL,
          \`posted_at\` TIMESTAMP NULL,
          \`notes\` TEXT NULL,
          \`created_by\` VARCHAR(255) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`UQ_je_number\` (\`entry_number\`),
          INDEX \`idx_je_date\` (\`entry_date\`),
          INDEX \`idx_je_fy\` (\`fiscal_year_id\`),
          CONSTRAINT \`fk_je_fy\` FOREIGN KEY (\`fiscal_year_id\`) REFERENCES \`fiscal_years\` (\`id\`),
          CONSTRAINT \`fk_je_fp\` FOREIGN KEY (\`fiscal_period_id\`) REFERENCES \`fiscal_periods\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`journal_entry_lines\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`journal_entry_id\` VARCHAR(255) NOT NULL,
          \`line_number\` INT NOT NULL,
          \`account_id\` VARCHAR(255) NOT NULL,
          \`cost_center_id\` VARCHAR(255) NULL,
          \`description\` VARCHAR(500) NULL,
          \`debit_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`credit_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`base_debit_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`base_credit_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`currency\` VARCHAR(3) NOT NULL DEFAULT 'INR',
          \`exchange_rate\` DECIMAL(12,6) NOT NULL DEFAULT 1,
          \`party_type\` ENUM('CUSTOMER','SUPPLIER','EMPLOYEE','OTHER') NULL,
          \`party_id\` VARCHAR(255) NULL,
          \`tax_category_id\` VARCHAR(255) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_jel_entry\` (\`journal_entry_id\`),
          INDEX \`idx_jel_account\` (\`account_id\`),
          CONSTRAINT \`fk_jel_entry\` FOREIGN KEY (\`journal_entry_id\`) REFERENCES \`journal_entries\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_jel_account\` FOREIGN KEY (\`account_id\`) REFERENCES \`chart_of_accounts\` (\`id\`),
          CONSTRAINT \`fk_jel_cost_center\` FOREIGN KEY (\`cost_center_id\`) REFERENCES \`cost_centers\` (\`id\`),
          CONSTRAINT \`fk_jel_tax_cat\` FOREIGN KEY (\`tax_category_id\`) REFERENCES \`tax_categories\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`general_ledger\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`account_id\` VARCHAR(255) NOT NULL,
          \`fiscal_year_id\` VARCHAR(255) NOT NULL,
          \`fiscal_period_id\` VARCHAR(255) NOT NULL,
          \`transaction_date\` DATE NOT NULL,
          \`journal_entry_id\` VARCHAR(255) NOT NULL,
          \`journal_entry_line_id\` VARCHAR(255) NOT NULL,
          \`description\` VARCHAR(500) NULL,
          \`debit_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`credit_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`running_balance\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`currency\` VARCHAR(3) NOT NULL DEFAULT 'INR',
          \`exchange_rate\` DECIMAL(12,6) NOT NULL DEFAULT 1,
          \`base_debit_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`base_credit_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`cost_center_id\` VARCHAR(255) NULL,
          \`reference_type\` VARCHAR(50) NULL,
          \`reference_id\` VARCHAR(255) NULL,
          \`reference_number\` VARCHAR(100) NULL,
          \`party_type\` VARCHAR(50) NULL,
          \`party_id\` VARCHAR(255) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_gl_account_date\` (\`account_id\`, \`transaction_date\`),
          INDEX \`idx_gl_fy_fp_account\` (\`fiscal_year_id\`, \`fiscal_period_id\`, \`account_id\`),
          CONSTRAINT \`fk_gl_account\` FOREIGN KEY (\`account_id\`) REFERENCES \`chart_of_accounts\` (\`id\`),
          CONSTRAINT \`fk_gl_fy\` FOREIGN KEY (\`fiscal_year_id\`) REFERENCES \`fiscal_years\` (\`id\`),
          CONSTRAINT \`fk_gl_fp\` FOREIGN KEY (\`fiscal_period_id\`) REFERENCES \`fiscal_periods\` (\`id\`),
          CONSTRAINT \`fk_gl_je\` FOREIGN KEY (\`journal_entry_id\`) REFERENCES \`journal_entries\` (\`id\`),
          CONSTRAINT \`fk_gl_jel\` FOREIGN KEY (\`journal_entry_line_id\`) REFERENCES \`journal_entry_lines\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`budgets\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`budget_code\` VARCHAR(50) NOT NULL,
          \`budget_name\` VARCHAR(200) NOT NULL,
          \`description\` TEXT NULL,
          \`budget_type\` ENUM('REVENUE','EXPENSE','CAPITAL','PROJECT') NOT NULL DEFAULT 'EXPENSE',
          \`fiscal_year_id\` VARCHAR(255) NOT NULL,
          \`cost_center_id\` VARCHAR(255) NULL,
          \`status\` ENUM('DRAFT','PENDING_APPROVAL','APPROVED','REJECTED','ACTIVE','CLOSED') NOT NULL DEFAULT 'DRAFT',
          \`currency\` VARCHAR(3) NOT NULL DEFAULT 'INR',
          \`total_budget_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`allocated_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`utilized_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`committed_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`start_date\` DATE NOT NULL,
          \`end_date\` DATE NOT NULL,
          \`allow_over_budget\` TINYINT NOT NULL DEFAULT 0,
          \`over_budget_tolerance_percentage\` DECIMAL(5,2) NOT NULL DEFAULT 0,
          \`notes\` TEXT NULL,
          \`approved_by\` VARCHAR(255) NULL,
          \`approved_at\` TIMESTAMP NULL,
          \`created_by\` VARCHAR(255) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`UQ_budgets_code\` (\`budget_code\`),
          CONSTRAINT \`fk_budget_fy\` FOREIGN KEY (\`fiscal_year_id\`) REFERENCES \`fiscal_years\` (\`id\`),
          CONSTRAINT \`fk_budget_cc\` FOREIGN KEY (\`cost_center_id\`) REFERENCES \`cost_centers\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`budget_lines\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`budget_id\` VARCHAR(255) NOT NULL,
          \`account_id\` VARCHAR(255) NOT NULL,
          \`fiscal_period_id\` VARCHAR(255) NULL,
          \`description\` TEXT NULL,
          \`budget_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`revised_amount\` DECIMAL(18,4) NULL,
          \`utilized_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`committed_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`january_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`february_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`march_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`april_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`may_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`june_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`july_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`august_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`september_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`october_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`november_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`december_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`notes\` TEXT NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_bl_budget\` (\`budget_id\`),
          CONSTRAINT \`fk_bl_budget\` FOREIGN KEY (\`budget_id\`) REFERENCES \`budgets\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_bl_account\` FOREIGN KEY (\`account_id\`) REFERENCES \`chart_of_accounts\` (\`id\`),
          CONSTRAINT \`fk_bl_fp\` FOREIGN KEY (\`fiscal_period_id\`) REFERENCES \`fiscal_periods\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`bank_accounts\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`account_code\` VARCHAR(50) NOT NULL,
          \`account_name\` VARCHAR(200) NOT NULL,
          \`account_type\` ENUM('SAVINGS','CURRENT','CASH_CREDIT','OVERDRAFT','FIXED_DEPOSIT','OTHER') NOT NULL DEFAULT 'CURRENT',
          \`bank_name\` VARCHAR(200) NOT NULL,
          \`branch_name\` VARCHAR(200) NULL,
          \`account_number\` VARCHAR(50) NOT NULL,
          \`ifsc_code\` VARCHAR(20) NULL,
          \`swift_code\` VARCHAR(20) NULL,
          \`micr_code\` VARCHAR(20) NULL,
          \`currency\` VARCHAR(3) NOT NULL DEFAULT 'INR',
          \`gl_account_id\` VARCHAR(255) NULL,
          \`opening_balance\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`current_balance\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`overdraft_limit\` DECIMAL(18,4) NULL,
          \`interest_rate\` DECIMAL(5,2) NULL,
          \`contact_person\` VARCHAR(200) NULL,
          \`contact_phone\` VARCHAR(50) NULL,
          \`contact_email\` VARCHAR(255) NULL,
          \`address\` TEXT NULL,
          \`is_primary\` TINYINT NOT NULL DEFAULT 0,
          \`is_active\` TINYINT NOT NULL DEFAULT 1,
          \`last_reconciled_date\` DATE NULL,
          \`last_reconciled_balance\` DECIMAL(18,4) NULL,
          \`notes\` TEXT NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`UQ_bank_accounts_code\` (\`account_code\`),
          CONSTRAINT \`fk_bank_gl\` FOREIGN KEY (\`gl_account_id\`) REFERENCES \`chart_of_accounts\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`bank_transactions\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`transaction_number\` VARCHAR(50) NOT NULL,
          \`bank_account_id\` VARCHAR(255) NOT NULL,
          \`transaction_date\` DATE NOT NULL,
          \`value_date\` DATE NULL,
          \`transaction_type\` ENUM('DEPOSIT','WITHDRAWAL','TRANSFER_IN','TRANSFER_OUT','INTEREST','CHARGES','CHEQUE_DEPOSIT','CHEQUE_PAYMENT','NEFT','RTGS','IMPS','UPI','CARD_PAYMENT','DIRECT_DEBIT','DIRECT_CREDIT') NOT NULL,
          \`status\` ENUM('PENDING','CLEARED','BOUNCED','CANCELLED','RECONCILED') NOT NULL DEFAULT 'PENDING',
          \`amount\` DECIMAL(18,4) NOT NULL,
          \`currency\` VARCHAR(3) NOT NULL DEFAULT 'INR',
          \`running_balance\` DECIMAL(18,4) NULL,
          \`description\` TEXT NOT NULL,
          \`reference_number\` VARCHAR(100) NULL,
          \`cheque_number\` VARCHAR(50) NULL,
          \`cheque_date\` DATE NULL,
          \`payee_payer_name\` VARCHAR(200) NULL,
          \`bank_reference\` VARCHAR(100) NULL,
          \`journal_entry_id\` VARCHAR(255) NULL,
          \`is_reconciled\` TINYINT NOT NULL DEFAULT 0,
          \`reconciled_date\` DATE NULL,
          \`reconciliation_id\` VARCHAR(255) NULL,
          \`notes\` TEXT NULL,
          \`created_by\` VARCHAR(255) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`UQ_bt_number\` (\`transaction_number\`),
          INDEX \`idx_bt_account_date\` (\`bank_account_id\`, \`transaction_date\`),
          CONSTRAINT \`fk_bt_account\` FOREIGN KEY (\`bank_account_id\`) REFERENCES \`bank_accounts\` (\`id\`),
          CONSTRAINT \`fk_bt_je\` FOREIGN KEY (\`journal_entry_id\`) REFERENCES \`journal_entries\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`bank_reconciliations\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`reconciliation_number\` VARCHAR(50) NOT NULL,
          \`bank_account_id\` VARCHAR(255) NOT NULL,
          \`statement_date\` DATE NOT NULL,
          \`statement_start_date\` DATE NOT NULL,
          \`statement_end_date\` DATE NOT NULL,
          \`status\` ENUM('DRAFT','IN_PROGRESS','COMPLETED','CANCELLED') NOT NULL DEFAULT 'DRAFT',
          \`opening_balance_book\` DECIMAL(18,4) NOT NULL,
          \`closing_balance_book\` DECIMAL(18,4) NOT NULL,
          \`opening_balance_bank\` DECIMAL(18,4) NOT NULL,
          \`closing_balance_bank\` DECIMAL(18,4) NOT NULL,
          \`total_deposits_book\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`total_withdrawals_book\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`total_deposits_bank\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`total_withdrawals_bank\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`deposits_in_transit\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`outstanding_cheques\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`bank_errors\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`book_errors\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`adjusted_balance_book\` DECIMAL(18,4) NULL,
          \`adjusted_balance_bank\` DECIMAL(18,4) NULL,
          \`difference\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`is_reconciled\` TINYINT NOT NULL DEFAULT 0,
          \`notes\` TEXT NULL,
          \`reconciled_by\` VARCHAR(255) NULL,
          \`reconciled_at\` TIMESTAMP NULL,
          \`created_by\` VARCHAR(255) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`UQ_br_number\` (\`reconciliation_number\`),
          CONSTRAINT \`fk_br_account\` FOREIGN KEY (\`bank_account_id\`) REFERENCES \`bank_accounts\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // ─── eCommerce Extras ─────────────────────────────────────────────────

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`coupons\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`coupon_code\` VARCHAR(50) NOT NULL,
          \`coupon_name\` VARCHAR(200) NOT NULL,
          \`description\` TEXT NULL,
          \`coupon_type\` ENUM('PERCENTAGE','FIXED_AMOUNT','FREE_SHIPPING','BUY_X_GET_Y') NOT NULL DEFAULT 'PERCENTAGE',
          \`discount_value\` DECIMAL(18,4) NOT NULL,
          \`max_discount_amount\` DECIMAL(18,4) NULL,
          \`min_order_amount\` DECIMAL(18,4) NULL,
          \`min_quantity\` INT NULL,
          \`start_date\` TIMESTAMP NOT NULL,
          \`end_date\` TIMESTAMP NULL,
          \`usage_limit\` INT NULL,
          \`usage_limit_per_customer\` INT NULL,
          \`times_used\` INT NOT NULL DEFAULT 0,
          \`status\` ENUM('ACTIVE','INACTIVE','EXPIRED','EXHAUSTED') NOT NULL DEFAULT 'ACTIVE',
          \`applies_to_all_products\` TINYINT NOT NULL DEFAULT 1,
          \`applies_to_all_customers\` TINYINT NOT NULL DEFAULT 1,
          \`is_first_order_only\` TINYINT NOT NULL DEFAULT 0,
          \`is_combinable\` TINYINT NOT NULL DEFAULT 0,
          \`created_by\` VARCHAR(255) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`UQ_coupons_code\` (\`coupon_code\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`customer_credentials\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`customer_id\` CHAR(36) NOT NULL,
          \`password_hash\` VARCHAR(255) NOT NULL,
          \`password_changed_at\` TIMESTAMP NULL,
          \`email_verified\` TINYINT NOT NULL DEFAULT 0,
          \`email_verification_token\` VARCHAR(255) NULL,
          \`email_verification_expires\` TIMESTAMP NULL,
          \`password_reset_token\` VARCHAR(255) NULL,
          \`password_reset_expires\` TIMESTAMP NULL,
          \`failed_login_attempts\` INT NOT NULL DEFAULT 0,
          \`locked_until\` TIMESTAMP NULL,
          \`last_login_at\` TIMESTAMP NULL,
          \`last_login_ip\` VARCHAR(45) NULL,
          \`two_factor_enabled\` TINYINT NOT NULL DEFAULT 0,
          \`two_factor_secret\` VARCHAR(255) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`UQ_cc_customer\` (\`customer_id\`),
          CONSTRAINT \`fk_cc_customer\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\` (\`id\`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`order_payments\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`order_id\` VARCHAR(255) NOT NULL,
          \`payment_method_id\` VARCHAR(255) NOT NULL,
          \`payment_date\` TIMESTAMP NOT NULL,
          \`amount\` DECIMAL(18,4) NOT NULL,
          \`currency\` VARCHAR(3) NOT NULL DEFAULT 'INR',
          \`status\` ENUM('PENDING','PROCESSING','COMPLETED','FAILED','CANCELLED','REFUNDED','PARTIALLY_REFUNDED') NOT NULL DEFAULT 'PENDING',
          \`transaction_id\` VARCHAR(255) NULL,
          \`gateway_transaction_id\` VARCHAR(255) NULL,
          \`gateway_response\` JSON NULL,
          \`payment_reference\` VARCHAR(255) NULL,
          \`refunded_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`refund_reason\` TEXT NULL,
          \`refunded_at\` TIMESTAMP NULL,
          \`failure_reason\` TEXT NULL,
          \`notes\` TEXT NULL,
          \`processed_by\` VARCHAR(255) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_op_order\` (\`order_id\`),
          CONSTRAINT \`fk_op_order\` FOREIGN KEY (\`order_id\`) REFERENCES \`sales_orders\` (\`id\`),
          CONSTRAINT \`fk_op_method\` FOREIGN KEY (\`payment_method_id\`) REFERENCES \`payment_methods\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`sales_returns\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`return_number\` VARCHAR(50) NOT NULL,
          \`return_date\` DATE NOT NULL,
          \`sales_order_id\` VARCHAR(255) NOT NULL,
          \`customer_id\` VARCHAR(255) NOT NULL,
          \`warehouse_id\` VARCHAR(255) NOT NULL,
          \`status\` ENUM('REQUESTED','PENDING_APPROVAL','APPROVED','REJECTED','RECEIVED','INSPECTING','REFUND_PENDING','REFUNDED','EXCHANGED','COMPLETED','CANCELLED') NOT NULL DEFAULT 'REQUESTED',
          \`return_reason\` ENUM('DEFECTIVE','WRONG_ITEM','NOT_AS_DESCRIBED','DAMAGED_IN_TRANSIT','CHANGED_MIND','QUALITY_ISSUE','EXPIRED','EXCESS_QUANTITY','OTHER') NOT NULL,
          \`reason_details\` TEXT NULL,
          \`refund_type\` ENUM('ORIGINAL_PAYMENT','STORE_CREDIT','BANK_TRANSFER','EXCHANGE') NULL,
          \`currency\` VARCHAR(3) NOT NULL DEFAULT 'INR',
          \`subtotal\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`tax_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`restocking_fee\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`shipping_fee_deduction\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`total_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`refund_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`is_pickup_required\` TINYINT NOT NULL DEFAULT 0,
          \`pickup_address\` TEXT NULL,
          \`pickup_date\` DATE NULL,
          \`tracking_number\` VARCHAR(100) NULL,
          \`received_date\` DATE NULL,
          \`inspection_notes\` TEXT NULL,
          \`customer_notes\` TEXT NULL,
          \`internal_notes\` TEXT NULL,
          \`refund_transaction_id\` VARCHAR(255) NULL,
          \`refunded_at\` TIMESTAMP NULL,
          \`approved_by\` VARCHAR(255) NULL,
          \`approved_at\` TIMESTAMP NULL,
          \`created_by\` VARCHAR(255) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`UQ_sr_number\` (\`return_number\`),
          CONSTRAINT \`fk_sr_order\` FOREIGN KEY (\`sales_order_id\`) REFERENCES \`sales_orders\` (\`id\`),
          CONSTRAINT \`fk_sr_customer\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\` (\`id\`),
          CONSTRAINT \`fk_sr_warehouse\` FOREIGN KEY (\`warehouse_id\`) REFERENCES \`warehouses\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`sales_return_items\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`sales_return_id\` VARCHAR(255) NOT NULL,
          \`order_item_id\` VARCHAR(255) NULL,
          \`product_id\` VARCHAR(255) NOT NULL,
          \`variant_id\` VARCHAR(255) NULL,
          \`quantity_returned\` DECIMAL(18,4) NOT NULL,
          \`quantity_received\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`quantity_restocked\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`uom_id\` VARCHAR(255) NOT NULL,
          \`unit_price\` DECIMAL(18,4) NOT NULL,
          \`tax_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`line_total\` DECIMAL(18,4) NOT NULL,
          \`refund_amount\` DECIMAL(18,4) NULL,
          \`condition\` ENUM('GOOD','LIKE_NEW','NEW','OPENED','DAMAGED','DEFECTIVE','EXPIRED') NULL,
          \`disposition\` ENUM('RESTOCK','SCRAP','REFURBISH','RETURN_TO_VENDOR','PENDING') NOT NULL DEFAULT 'PENDING',
          \`reason\` TEXT NULL,
          \`inspection_notes\` TEXT NULL,
          \`is_restocked\` TINYINT NOT NULL DEFAULT 0,
          \`restocked_quantity\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_sri_return\` (\`sales_return_id\`),
          CONSTRAINT \`fk_sri_return\` FOREIGN KEY (\`sales_return_id\`) REFERENCES \`sales_returns\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_sri_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`),
          CONSTRAINT \`fk_sri_variant\` FOREIGN KEY (\`variant_id\`) REFERENCES \`product_variants\` (\`id\`),
          CONSTRAINT \`fk_sri_uom\` FOREIGN KEY (\`uom_id\`) REFERENCES \`units_of_measure\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`shipping_methods\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`method_code\` VARCHAR(50) NOT NULL,
          \`method_name\` VARCHAR(200) NOT NULL,
          \`description\` TEXT NULL,
          \`carrier_type\` ENUM('INTERNAL','EXTERNAL','PICKUP') NOT NULL DEFAULT 'INTERNAL',
          \`carrier_code\` VARCHAR(50) NULL,
          \`calculation_type\` ENUM('FLAT_RATE','WEIGHT_BASED','PRICE_BASED','ITEM_BASED','REAL_TIME','FREE') NOT NULL DEFAULT 'FLAT_RATE',
          \`base_rate\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`rate_per_kg\` DECIMAL(18,4) NULL,
          \`rate_per_item\` DECIMAL(18,4) NULL,
          \`free_shipping_threshold\` DECIMAL(18,4) NULL,
          \`min_order_amount\` DECIMAL(18,4) NULL,
          \`max_order_amount\` DECIMAL(18,4) NULL,
          \`max_weight_kg\` DECIMAL(10,2) NULL,
          \`estimated_delivery_days_min\` INT NULL,
          \`estimated_delivery_days_max\` INT NULL,
          \`tracking_available\` TINYINT NOT NULL DEFAULT 0,
          \`insurance_available\` TINYINT NOT NULL DEFAULT 0,
          \`is_active\` TINYINT NOT NULL DEFAULT 1,
          \`sort_order\` INT NOT NULL DEFAULT 0,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`UQ_sm_code\` (\`method_code\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`shopping_carts\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`customer_id\` VARCHAR(255) NULL,
          \`session_id\` VARCHAR(255) NULL,
          \`status\` ENUM('ACTIVE','CONVERTED','ABANDONED','MERGED') NOT NULL DEFAULT 'ACTIVE',
          \`subtotal\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`discount_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`tax_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`total_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`coupon_id\` VARCHAR(255) NULL,
          \`coupon_code\` VARCHAR(50) NULL,
          \`coupon_discount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`item_count\` INT NOT NULL DEFAULT 0,
          \`currency\` VARCHAR(3) NOT NULL DEFAULT 'INR',
          \`ip_address\` VARCHAR(45) NULL,
          \`user_agent\` TEXT NULL,
          \`last_activity_at\` TIMESTAMP NULL,
          \`converted_order_id\` VARCHAR(255) NULL,
          \`notes\` TEXT NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_sc_customer\` (\`customer_id\`),
          CONSTRAINT \`fk_sc_customer\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\` (\`id\`),
          CONSTRAINT \`fk_sc_coupon\` FOREIGN KEY (\`coupon_id\`) REFERENCES \`coupons\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`shopping_cart_items\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`cart_id\` VARCHAR(255) NOT NULL,
          \`product_id\` VARCHAR(255) NOT NULL,
          \`variant_id\` VARCHAR(255) NULL,
          \`quantity\` DECIMAL(18,4) NOT NULL DEFAULT 1,
          \`unit_price\` DECIMAL(18,4) NOT NULL,
          \`original_price\` DECIMAL(18,4) NULL,
          \`discount_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`tax_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`line_total\` DECIMAL(18,4) NOT NULL,
          \`custom_options\` JSON NULL,
          \`notes\` TEXT NULL,
          \`added_at\` TIMESTAMP NOT NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_sci_cart\` (\`cart_id\`),
          CONSTRAINT \`fk_sci_cart\` FOREIGN KEY (\`cart_id\`) REFERENCES \`shopping_carts\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_sci_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`),
          CONSTRAINT \`fk_sci_variant\` FOREIGN KEY (\`variant_id\`) REFERENCES \`product_variants\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`wishlists\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`customer_id\` VARCHAR(255) NOT NULL,
          \`product_id\` VARCHAR(255) NOT NULL,
          \`variant_id\` VARCHAR(255) NULL,
          \`notes\` TEXT NULL,
          \`priority\` INT NOT NULL DEFAULT 0,
          \`notify_on_sale\` TINYINT NOT NULL DEFAULT 0,
          \`notify_on_stock\` TINYINT NOT NULL DEFAULT 0,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_wl_customer\` (\`customer_id\`),
          CONSTRAINT \`fk_wl_customer\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_wl_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`),
          CONSTRAINT \`fk_wl_variant\` FOREIGN KEY (\`variant_id\`) REFERENCES \`product_variants\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // ─── Due Management ───────────────────────────────────────────────────

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`customer_dues\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`customer_id\` VARCHAR(255) NOT NULL,
          \`reference_type\` ENUM('SALES_ORDER','INVOICE','DEBIT_NOTE','OPENING_BALANCE','OTHER') NOT NULL,
          \`sales_order_id\` VARCHAR(255) NULL,
          \`reference_id\` VARCHAR(255) NULL,
          \`reference_number\` VARCHAR(50) NULL,
          \`due_date\` DATE NOT NULL,
          \`currency\` VARCHAR(3) NOT NULL DEFAULT 'INR',
          \`original_amount\` DECIMAL(18,4) NOT NULL,
          \`paid_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`adjusted_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`written_off_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`status\` ENUM('PENDING','PARTIAL','PAID','OVERDUE','WRITTEN_OFF','CANCELLED') NOT NULL DEFAULT 'PENDING',
          \`last_reminder_date\` DATE NULL,
          \`reminder_count\` INT NOT NULL DEFAULT 0,
          \`notes\` TEXT NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_cd_customer\` (\`customer_id\`),
          INDEX \`idx_cd_due_date\` (\`due_date\`),
          CONSTRAINT \`fk_cd_customer\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\` (\`id\`),
          CONSTRAINT \`fk_cd_order\` FOREIGN KEY (\`sales_order_id\`) REFERENCES \`sales_orders\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`customer_due_collections\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`collection_number\` VARCHAR(50) NOT NULL,
          \`collection_date\` DATE NOT NULL,
          \`customer_id\` VARCHAR(255) NOT NULL,
          \`payment_method_id\` VARCHAR(255) NOT NULL,
          \`amount\` DECIMAL(18,4) NOT NULL,
          \`currency\` VARCHAR(3) NOT NULL DEFAULT 'INR',
          \`status\` ENUM('DRAFT','PENDING','CONFIRMED','DEPOSITED','BOUNCED','CANCELLED') NOT NULL DEFAULT 'DRAFT',
          \`reference_number\` VARCHAR(100) NULL,
          \`cheque_number\` VARCHAR(50) NULL,
          \`cheque_date\` DATE NULL,
          \`cheque_bank\` VARCHAR(200) NULL,
          \`bank_account_id\` VARCHAR(255) NULL,
          \`deposit_date\` DATE NULL,
          \`clearance_date\` DATE NULL,
          \`bounce_date\` DATE NULL,
          \`bounce_reason\` TEXT NULL,
          \`bounce_charges\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`allocated_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`unallocated_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`journal_entry_id\` VARCHAR(255) NULL,
          \`notes\` TEXT NULL,
          \`received_by\` VARCHAR(255) NULL,
          \`created_by\` VARCHAR(255) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`UQ_cdc_number\` (\`collection_number\`),
          INDEX \`idx_cdc_customer\` (\`customer_id\`),
          CONSTRAINT \`fk_cdc_customer\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\` (\`id\`),
          CONSTRAINT \`fk_cdc_method\` FOREIGN KEY (\`payment_method_id\`) REFERENCES \`payment_methods\` (\`id\`),
          CONSTRAINT \`fk_cdc_bank\` FOREIGN KEY (\`bank_account_id\`) REFERENCES \`bank_accounts\` (\`id\`),
          CONSTRAINT \`fk_cdc_je\` FOREIGN KEY (\`journal_entry_id\`) REFERENCES \`journal_entries\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`customer_due_collection_allocations\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`collection_id\` VARCHAR(255) NOT NULL,
          \`customer_due_id\` VARCHAR(255) NOT NULL,
          \`allocated_amount\` DECIMAL(18,4) NOT NULL,
          \`allocation_date\` DATE NOT NULL,
          \`notes\` TEXT NULL,
          \`created_by\` VARCHAR(255) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_cdca_collection\` (\`collection_id\`),
          CONSTRAINT \`fk_cdca_collection\` FOREIGN KEY (\`collection_id\`) REFERENCES \`customer_due_collections\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_cdca_due\` FOREIGN KEY (\`customer_due_id\`) REFERENCES \`customer_dues\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`credit_notes\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`credit_note_number\` VARCHAR(50) NOT NULL,
          \`credit_note_date\` DATE NOT NULL,
          \`customer_id\` VARCHAR(255) NOT NULL,
          \`sales_order_id\` VARCHAR(255) NULL,
          \`sales_return_id\` VARCHAR(255) NULL,
          \`reason\` ENUM('SALES_RETURN','PRICE_ADJUSTMENT','DISCOUNT','DAMAGED_GOODS','QUALITY_ISSUE','DUPLICATE_PAYMENT','GOODWILL','OTHER') NOT NULL,
          \`reason_details\` TEXT NULL,
          \`status\` ENUM('DRAFT','PENDING_APPROVAL','APPROVED','REJECTED','ISSUED','PARTIALLY_USED','FULLY_USED','CANCELLED') NOT NULL DEFAULT 'DRAFT',
          \`currency\` VARCHAR(3) NOT NULL DEFAULT 'INR',
          \`subtotal\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`tax_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`total_amount\` DECIMAL(18,4) NOT NULL,
          \`used_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`balance_amount\` DECIMAL(18,4) NOT NULL,
          \`valid_until\` DATE NULL,
          \`journal_entry_id\` VARCHAR(255) NULL,
          \`notes\` TEXT NULL,
          \`approved_by\` VARCHAR(255) NULL,
          \`approved_at\` TIMESTAMP NULL,
          \`created_by\` VARCHAR(255) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`UQ_cn_number\` (\`credit_note_number\`),
          CONSTRAINT \`fk_cn_customer\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\` (\`id\`),
          CONSTRAINT \`fk_cn_order\` FOREIGN KEY (\`sales_order_id\`) REFERENCES \`sales_orders\` (\`id\`),
          CONSTRAINT \`fk_cn_return\` FOREIGN KEY (\`sales_return_id\`) REFERENCES \`sales_returns\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`debit_notes\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`debit_note_number\` VARCHAR(50) NOT NULL,
          \`debit_note_date\` DATE NOT NULL,
          \`supplier_id\` VARCHAR(255) NOT NULL,
          \`purchase_order_id\` VARCHAR(255) NULL,
          \`grn_id\` VARCHAR(255) NULL,
          \`purchase_return_id\` VARCHAR(255) NULL,
          \`reason\` ENUM('PURCHASE_RETURN','PRICE_ADJUSTMENT','QUALITY_ISSUE','SHORTAGE','DAMAGED_GOODS','EXCESS_BILLING','OTHER') NOT NULL,
          \`reason_details\` TEXT NULL,
          \`status\` ENUM('DRAFT','PENDING_APPROVAL','APPROVED','REJECTED','ISSUED','SENT_TO_SUPPLIER','ACKNOWLEDGED','PARTIALLY_ADJUSTED','FULLY_ADJUSTED','CANCELLED') NOT NULL DEFAULT 'DRAFT',
          \`currency\` VARCHAR(3) NOT NULL DEFAULT 'INR',
          \`subtotal\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`tax_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`total_amount\` DECIMAL(18,4) NOT NULL,
          \`adjusted_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`balance_amount\` DECIMAL(18,4) NOT NULL,
          \`supplier_acknowledgement_number\` VARCHAR(100) NULL,
          \`supplier_acknowledgement_date\` DATE NULL,
          \`journal_entry_id\` VARCHAR(255) NULL,
          \`notes\` TEXT NULL,
          \`approved_by\` VARCHAR(255) NULL,
          \`approved_at\` TIMESTAMP NULL,
          \`created_by\` VARCHAR(255) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`UQ_dn_number\` (\`debit_note_number\`),
          CONSTRAINT \`fk_dn_supplier\` FOREIGN KEY (\`supplier_id\`) REFERENCES \`suppliers\` (\`id\`),
          CONSTRAINT \`fk_dn_po\` FOREIGN KEY (\`purchase_order_id\`) REFERENCES \`purchase_orders\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`payment_reminders\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`customer_id\` VARCHAR(255) NOT NULL,
          \`customer_due_id\` VARCHAR(255) NULL,
          \`reminder_type\` ENUM('EMAIL','SMS','PHONE_CALL','LETTER','WHATSAPP','IN_PERSON') NOT NULL,
          \`status\` ENUM('SCHEDULED','SENT','DELIVERED','FAILED','CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
          \`reminder_date\` DATE NOT NULL,
          \`scheduled_time\` TIME NULL,
          \`sent_at\` TIMESTAMP NULL,
          \`subject\` TEXT NULL,
          \`message\` TEXT NULL,
          \`recipient_email\` VARCHAR(255) NULL,
          \`recipient_phone\` VARCHAR(50) NULL,
          \`overdue_amount\` DECIMAL(18,4) NULL,
          \`overdue_days\` INT NULL,
          \`reminder_level\` INT NOT NULL DEFAULT 1,
          \`response_received\` TINYINT NOT NULL DEFAULT 0,
          \`response_date\` DATE NULL,
          \`response_notes\` TEXT NULL,
          \`promise_to_pay_date\` DATE NULL,
          \`promised_amount\` DECIMAL(18,4) NULL,
          \`follow_up_required\` TINYINT NOT NULL DEFAULT 0,
          \`follow_up_date\` DATE NULL,
          \`notes\` TEXT NULL,
          \`sent_by\` VARCHAR(255) NULL,
          \`created_by\` VARCHAR(255) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_pr_customer\` (\`customer_id\`),
          CONSTRAINT \`fk_pr_customer\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\` (\`id\`),
          CONSTRAINT \`fk_pr_due\` FOREIGN KEY (\`customer_due_id\`) REFERENCES \`customer_dues\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`supplier_dues\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`supplier_id\` VARCHAR(255) NOT NULL,
          \`reference_type\` ENUM('PURCHASE_ORDER','GRN','BILL','CREDIT_NOTE','OPENING_BALANCE','OTHER') NOT NULL,
          \`reference_id\` VARCHAR(255) NULL,
          \`purchase_order_id\` VARCHAR(255) NULL,
          \`reference_number\` VARCHAR(50) NULL,
          \`bill_number\` VARCHAR(100) NULL,
          \`bill_date\` DATE NULL,
          \`due_date\` DATE NOT NULL,
          \`currency\` VARCHAR(3) NOT NULL DEFAULT 'INR',
          \`original_amount\` DECIMAL(18,4) NOT NULL,
          \`paid_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`adjusted_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`status\` ENUM('PENDING','PARTIAL','PAID','OVERDUE','WRITTEN_OFF','CANCELLED') NOT NULL DEFAULT 'PENDING',
          \`payment_scheduled_date\` DATE NULL,
          \`notes\` TEXT NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_sd_supplier\` (\`supplier_id\`),
          INDEX \`idx_sd_due_date\` (\`due_date\`),
          CONSTRAINT \`fk_sd_supplier\` FOREIGN KEY (\`supplier_id\`) REFERENCES \`suppliers\` (\`id\`),
          CONSTRAINT \`fk_sd_po\` FOREIGN KEY (\`purchase_order_id\`) REFERENCES \`purchase_orders\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`supplier_payments\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`payment_number\` VARCHAR(50) NOT NULL,
          \`payment_date\` DATE NOT NULL,
          \`supplier_id\` VARCHAR(255) NOT NULL,
          \`payment_method_id\` VARCHAR(255) NOT NULL,
          \`bank_account_id\` VARCHAR(255) NULL,
          \`amount\` DECIMAL(18,4) NOT NULL,
          \`currency\` VARCHAR(3) NOT NULL DEFAULT 'INR',
          \`exchange_rate\` DECIMAL(12,6) NOT NULL DEFAULT 1,
          \`status\` ENUM('DRAFT','PENDING_APPROVAL','APPROVED','PROCESSING','COMPLETED','FAILED','CANCELLED') NOT NULL DEFAULT 'DRAFT',
          \`reference_number\` VARCHAR(100) NULL,
          \`cheque_number\` VARCHAR(50) NULL,
          \`cheque_date\` DATE NULL,
          \`bank_reference\` VARCHAR(100) NULL,
          \`transaction_id\` VARCHAR(255) NULL,
          \`allocated_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`unallocated_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`tds_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`tds_percentage\` DECIMAL(5,2) NULL,
          \`journal_entry_id\` VARCHAR(255) NULL,
          \`notes\` TEXT NULL,
          \`approved_by\` VARCHAR(255) NULL,
          \`approved_at\` TIMESTAMP NULL,
          \`created_by\` VARCHAR(255) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`UQ_sp_number\` (\`payment_number\`),
          INDEX \`idx_sp_supplier\` (\`supplier_id\`),
          CONSTRAINT \`fk_sp_supplier\` FOREIGN KEY (\`supplier_id\`) REFERENCES \`suppliers\` (\`id\`),
          CONSTRAINT \`fk_sp_method\` FOREIGN KEY (\`payment_method_id\`) REFERENCES \`payment_methods\` (\`id\`),
          CONSTRAINT \`fk_sp_bank\` FOREIGN KEY (\`bank_account_id\`) REFERENCES \`bank_accounts\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`supplier_payment_allocations\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`payment_id\` VARCHAR(255) NOT NULL,
          \`supplier_due_id\` VARCHAR(255) NOT NULL,
          \`allocated_amount\` DECIMAL(18,4) NOT NULL,
          \`allocation_date\` DATE NOT NULL,
          \`notes\` TEXT NULL,
          \`created_by\` VARCHAR(255) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_spa_payment\` (\`payment_id\`),
          CONSTRAINT \`fk_spa_payment\` FOREIGN KEY (\`payment_id\`) REFERENCES \`supplier_payments\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_spa_due\` FOREIGN KEY (\`supplier_due_id\`) REFERENCES \`supplier_dues\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // ─── Warehouse Extras ─────────────────────────────────────────────────

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`inventory_batches\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`product_id\` VARCHAR(255) NOT NULL,
          \`variant_id\` VARCHAR(255) NULL,
          \`batch_number\` VARCHAR(100) NOT NULL,
          \`manufacturing_date\` DATE NULL,
          \`expiry_date\` DATE NULL,
          \`supplier_id\` VARCHAR(255) NULL,
          \`warehouse_id\` VARCHAR(255) NULL,
          \`purchase_order_id\` VARCHAR(255) NULL,
          \`cost_price\` DECIMAL(18,4) NULL,
          \`current_quantity\` DECIMAL(18,4) NULL,
          \`notes\` TEXT NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_ib_product\` (\`product_id\`),
          INDEX \`idx_ib_batch_number\` (\`batch_number\`),
          CONSTRAINT \`fk_ib_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`),
          CONSTRAINT \`fk_ib_variant\` FOREIGN KEY (\`variant_id\`) REFERENCES \`product_variants\` (\`id\`),
          CONSTRAINT \`fk_ib_supplier\` FOREIGN KEY (\`supplier_id\`) REFERENCES \`suppliers\` (\`id\`),
          CONSTRAINT \`fk_ib_warehouse\` FOREIGN KEY (\`warehouse_id\`) REFERENCES \`warehouses\` (\`id\`),
          CONSTRAINT \`fk_ib_po\` FOREIGN KEY (\`purchase_order_id\`) REFERENCES \`purchase_orders\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`inventory_serial_numbers\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`serial_number\` VARCHAR(100) NOT NULL,
          \`product_id\` VARCHAR(255) NOT NULL,
          \`variant_id\` VARCHAR(255) NULL,
          \`batch_id\` VARCHAR(255) NULL,
          \`warehouse_id\` VARCHAR(255) NULL,
          \`location_id\` VARCHAR(255) NULL,
          \`status\` ENUM('AVAILABLE','RESERVED','SOLD','IN_TRANSIT','RETURNED','DAMAGED','SCRAPPED') NOT NULL DEFAULT 'AVAILABLE',
          \`cost_price\` DECIMAL(18,4) NULL,
          \`purchase_order_id\` VARCHAR(255) NULL,
          \`grn_id\` VARCHAR(255) NULL,
          \`received_date\` DATE NULL,
          \`sales_order_id\` VARCHAR(255) NULL,
          \`sold_date\` DATE NULL,
          \`warranty_start_date\` DATE NULL,
          \`warranty_end_date\` DATE NULL,
          \`notes\` TEXT NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_isn_serial\` (\`serial_number\`),
          INDEX \`idx_isn_product\` (\`product_id\`),
          CONSTRAINT \`fk_isn_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`),
          CONSTRAINT \`fk_isn_variant\` FOREIGN KEY (\`variant_id\`) REFERENCES \`product_variants\` (\`id\`),
          CONSTRAINT \`fk_isn_batch\` FOREIGN KEY (\`batch_id\`) REFERENCES \`inventory_batches\` (\`id\`),
          CONSTRAINT \`fk_isn_warehouse\` FOREIGN KEY (\`warehouse_id\`) REFERENCES \`warehouses\` (\`id\`),
          CONSTRAINT \`fk_isn_location\` FOREIGN KEY (\`location_id\`) REFERENCES \`warehouse_locations\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`location_inventory\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`product_id\` VARCHAR(255) NOT NULL,
          \`variant_id\` VARCHAR(255) NULL,
          \`warehouse_id\` VARCHAR(255) NOT NULL,
          \`location_id\` VARCHAR(255) NOT NULL,
          \`batch_id\` VARCHAR(255) NULL,
          \`quantity\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`quantity_reserved\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`status\` ENUM('AVAILABLE','RESERVED','DAMAGED','QUARANTINE','ON_HOLD') NOT NULL DEFAULT 'AVAILABLE',
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_li_product_location\` (\`product_id\`, \`location_id\`),
          CONSTRAINT \`fk_li_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`),
          CONSTRAINT \`fk_li_variant\` FOREIGN KEY (\`variant_id\`) REFERENCES \`product_variants\` (\`id\`),
          CONSTRAINT \`fk_li_warehouse\` FOREIGN KEY (\`warehouse_id\`) REFERENCES \`warehouses\` (\`id\`),
          CONSTRAINT \`fk_li_location\` FOREIGN KEY (\`location_id\`) REFERENCES \`warehouse_locations\` (\`id\`),
          CONSTRAINT \`fk_li_batch\` FOREIGN KEY (\`batch_id\`) REFERENCES \`inventory_batches\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`stock_adjustments\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`adjustment_number\` VARCHAR(50) NOT NULL,
          \`adjustment_date\` DATE NOT NULL,
          \`warehouse_id\` VARCHAR(255) NOT NULL,
          \`adjustment_type\` ENUM('INCREASE','DECREASE','WRITE_OFF','OPENING_STOCK','CYCLE_COUNT','DAMAGE','EXPIRY','THEFT','OTHER') NOT NULL,
          \`status\` ENUM('DRAFT','PENDING_APPROVAL','APPROVED','REJECTED','CANCELLED') NOT NULL DEFAULT 'DRAFT',
          \`reason\` TEXT NOT NULL,
          \`reference_number\` VARCHAR(50) NULL,
          \`total_value_impact\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`notes\` TEXT NULL,
          \`approved_by\` VARCHAR(255) NULL,
          \`approved_at\` TIMESTAMP NULL,
          \`rejection_reason\` TEXT NULL,
          \`created_by\` VARCHAR(255) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`UQ_sa_number\` (\`adjustment_number\`),
          CONSTRAINT \`fk_sa_warehouse\` FOREIGN KEY (\`warehouse_id\`) REFERENCES \`warehouses\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`stock_adjustment_items\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`stock_adjustment_id\` VARCHAR(255) NOT NULL,
          \`product_id\` VARCHAR(255) NOT NULL,
          \`variant_id\` VARCHAR(255) NULL,
          \`location_id\` VARCHAR(255) NULL,
          \`batch_id\` VARCHAR(255) NULL,
          \`system_quantity\` DECIMAL(18,4) NOT NULL,
          \`physical_quantity\` DECIMAL(18,4) NOT NULL,
          \`adjustment_quantity\` DECIMAL(18,4) NOT NULL,
          \`uom_id\` VARCHAR(255) NOT NULL,
          \`unit_cost\` DECIMAL(18,4) NULL,
          \`value_impact\` DECIMAL(18,4) NULL,
          \`reason\` TEXT NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_sai_adjustment\` (\`stock_adjustment_id\`),
          CONSTRAINT \`fk_sai_adjustment\` FOREIGN KEY (\`stock_adjustment_id\`) REFERENCES \`stock_adjustments\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_sai_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`),
          CONSTRAINT \`fk_sai_variant\` FOREIGN KEY (\`variant_id\`) REFERENCES \`product_variants\` (\`id\`),
          CONSTRAINT \`fk_sai_location\` FOREIGN KEY (\`location_id\`) REFERENCES \`warehouse_locations\` (\`id\`),
          CONSTRAINT \`fk_sai_uom\` FOREIGN KEY (\`uom_id\`) REFERENCES \`units_of_measure\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`stock_movements\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`movement_number\` VARCHAR(50) NOT NULL,
          \`movement_type\` ENUM('PURCHASE_RECEIPT','SALES_ISSUE','TRANSFER_IN','TRANSFER_OUT','ADJUSTMENT_IN','ADJUSTMENT_OUT','RETURN_FROM_CUSTOMER','RETURN_TO_SUPPLIER','PRODUCTION_ISSUE','PRODUCTION_RECEIPT','OPENING_STOCK','WRITE_OFF','DAMAGE','EXPIRY','SAMPLE','INTER_LOCATION_IN','INTER_LOCATION_OUT','SCRAP','OTHER') NOT NULL,
          \`movement_date\` TIMESTAMP NOT NULL,
          \`product_id\` VARCHAR(255) NOT NULL,
          \`variant_id\` VARCHAR(255) NULL,
          \`batch_id\` VARCHAR(255) NULL,
          \`from_warehouse_id\` VARCHAR(255) NULL,
          \`to_warehouse_id\` VARCHAR(255) NULL,
          \`from_location_id\` VARCHAR(255) NULL,
          \`to_location_id\` VARCHAR(255) NULL,
          \`quantity\` DECIMAL(18,4) NOT NULL,
          \`uom_id\` VARCHAR(255) NOT NULL,
          \`unit_cost\` DECIMAL(18,4) NULL,
          \`total_cost\` DECIMAL(18,4) NULL,
          \`reference_type\` VARCHAR(50) NULL,
          \`reference_id\` VARCHAR(255) NULL,
          \`reference_number\` VARCHAR(50) NULL,
          \`reason\` TEXT NULL,
          \`created_by\` VARCHAR(255) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`UQ_sm_number\` (\`movement_number\`),
          INDEX \`idx_smov_product_date\` (\`product_id\`, \`movement_date\`),
          CONSTRAINT \`fk_smov_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`),
          CONSTRAINT \`fk_smov_uom\` FOREIGN KEY (\`uom_id\`) REFERENCES \`units_of_measure\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`warehouse_transfers\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`transfer_number\` VARCHAR(50) NOT NULL,
          \`transfer_type\` ENUM('INTER_WAREHOUSE','INTER_LOCATION') NOT NULL DEFAULT 'INTER_WAREHOUSE',
          \`transfer_date\` DATE NOT NULL,
          \`from_warehouse_id\` VARCHAR(255) NOT NULL,
          \`to_warehouse_id\` VARCHAR(255) NOT NULL,
          \`status\` ENUM('DRAFT','PENDING_APPROVAL','APPROVED','IN_TRANSIT','PARTIALLY_RECEIVED','RECEIVED','CANCELLED') NOT NULL DEFAULT 'DRAFT',
          \`expected_delivery_date\` DATE NULL,
          \`actual_delivery_date\` DATE NULL,
          \`shipping_method\` VARCHAR(100) NULL,
          \`tracking_number\` VARCHAR(100) NULL,
          \`shipping_cost\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`total_value\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`reason\` TEXT NULL,
          \`notes\` TEXT NULL,
          \`approved_by\` VARCHAR(255) NULL,
          \`approved_at\` TIMESTAMP NULL,
          \`shipped_by\` VARCHAR(255) NULL,
          \`shipped_at\` TIMESTAMP NULL,
          \`received_by\` VARCHAR(255) NULL,
          \`received_at\` TIMESTAMP NULL,
          \`created_by\` VARCHAR(255) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`UQ_wt_number\` (\`transfer_number\`),
          CONSTRAINT \`fk_wt_from\` FOREIGN KEY (\`from_warehouse_id\`) REFERENCES \`warehouses\` (\`id\`),
          CONSTRAINT \`fk_wt_to\` FOREIGN KEY (\`to_warehouse_id\`) REFERENCES \`warehouses\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`warehouse_transfer_items\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`warehouse_transfer_id\` VARCHAR(255) NOT NULL,
          \`product_id\` VARCHAR(255) NOT NULL,
          \`variant_id\` VARCHAR(255) NULL,
          \`from_location_id\` VARCHAR(255) NULL,
          \`to_location_id\` VARCHAR(255) NULL,
          \`batch_id\` VARCHAR(255) NULL,
          \`quantity_requested\` DECIMAL(18,4) NOT NULL,
          \`quantity_shipped\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`quantity_received\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`quantity_damaged\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`uom_id\` VARCHAR(255) NOT NULL,
          \`unit_cost\` DECIMAL(18,4) NULL,
          \`line_value\` DECIMAL(18,4) NULL,
          \`notes\` TEXT NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_wti_transfer\` (\`warehouse_transfer_id\`),
          CONSTRAINT \`fk_wti_transfer\` FOREIGN KEY (\`warehouse_transfer_id\`) REFERENCES \`warehouse_transfers\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_wti_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`),
          CONSTRAINT \`fk_wti_variant\` FOREIGN KEY (\`variant_id\`) REFERENCES \`product_variants\` (\`id\`),
          CONSTRAINT \`fk_wti_uom\` FOREIGN KEY (\`uom_id\`) REFERENCES \`units_of_measure\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // ─── Purchase Extras ──────────────────────────────────────────────────

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`goods_received_notes\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`grn_number\` VARCHAR(50) NOT NULL,
          \`grn_date\` DATE NOT NULL,
          \`receipt_date\` DATE NOT NULL,
          \`purchase_order_id\` VARCHAR(255) NULL,
          \`supplier_id\` VARCHAR(255) NOT NULL,
          \`warehouse_id\` VARCHAR(255) NOT NULL,
          \`status\` ENUM('DRAFT','PENDING_QC','QC_PASSED','QC_FAILED','PARTIALLY_ACCEPTED','ACCEPTED','CANCELLED') NOT NULL DEFAULT 'DRAFT',
          \`supplier_invoice_number\` VARCHAR(100) NULL,
          \`supplier_invoice_date\` DATE NULL,
          \`delivery_note_number\` VARCHAR(100) NULL,
          \`vehicle_number\` VARCHAR(50) NULL,
          \`transporter_name\` VARCHAR(200) NULL,
          \`lr_number\` VARCHAR(100) NULL,
          \`currency\` VARCHAR(100) NULL,
          \`lr_date\` DATE NULL,
          \`total_quantity\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`accepted_quantity\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`rejected_quantity\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`total_value\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`tax_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`subtotal\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`notes\` TEXT NULL,
          \`qc_notes\` TEXT NULL,
          \`qc_by\` VARCHAR(255) NULL,
          \`qc_at\` TIMESTAMP NULL,
          \`received_by\` VARCHAR(255) NULL,
          \`created_by\` VARCHAR(255) NULL,
          \`approved_by\` VARCHAR(255) NULL,
          \`approved_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`UQ_grn_number\` (\`grn_number\`),
          INDEX \`idx_grn_supplier\` (\`supplier_id\`),
          CONSTRAINT \`fk_grn_po\` FOREIGN KEY (\`purchase_order_id\`) REFERENCES \`purchase_orders\` (\`id\`),
          CONSTRAINT \`fk_grn_supplier\` FOREIGN KEY (\`supplier_id\`) REFERENCES \`suppliers\` (\`id\`),
          CONSTRAINT \`fk_grn_warehouse\` FOREIGN KEY (\`warehouse_id\`) REFERENCES \`warehouses\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`grn_items\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`grn_id\` VARCHAR(255) NOT NULL,
          \`po_item_id\` VARCHAR(255) NULL,
          \`product_id\` VARCHAR(255) NOT NULL,
          \`variant_id\` VARCHAR(255) NULL,
          \`location_id\` VARCHAR(255) NULL,
          \`batch_id\` VARCHAR(255) NULL,
          \`quantity_received\` DECIMAL(18,4) NOT NULL,
          \`quantity_accepted\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`quantity_rejected\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`uom_id\` VARCHAR(255) NOT NULL,
          \`unit_price\` DECIMAL(18,4) NULL,
          \`line_value\` DECIMAL(18,4) NULL,
          \`status\` ENUM('PENDING_QC','QC_PASSED','QC_FAILED','PARTIALLY_ACCEPTED','ACCEPTED') NOT NULL DEFAULT 'PENDING_QC',
          \`batch_number\` VARCHAR(100) NULL,
          \`manufacturing_date\` DATE NULL,
          \`expiry_date\` DATE NULL,
          \`rejection_reason\` TEXT NULL,
          \`notes\` TEXT NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_grni_grn\` (\`grn_id\`),
          CONSTRAINT \`fk_grni_grn\` FOREIGN KEY (\`grn_id\`) REFERENCES \`goods_received_notes\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_grni_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`),
          CONSTRAINT \`fk_grni_variant\` FOREIGN KEY (\`variant_id\`) REFERENCES \`product_variants\` (\`id\`),
          CONSTRAINT \`fk_grni_location\` FOREIGN KEY (\`location_id\`) REFERENCES \`warehouse_locations\` (\`id\`),
          CONSTRAINT \`fk_grni_uom\` FOREIGN KEY (\`uom_id\`) REFERENCES \`units_of_measure\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`purchase_returns\` (
          \`id\` CHAR(36) NOT NULL,
          \`return_number\` VARCHAR(50) NOT NULL,
          \`purchase_order_id\` CHAR(36) NULL,
          \`grn_id\` CHAR(36) NULL,
          \`supplier_id\` CHAR(36) NOT NULL,
          \`warehouse_id\` CHAR(36) NOT NULL,
          \`return_date\` DATE NOT NULL,
          \`status\` ENUM('DRAFT','PENDING_APPROVAL','APPROVED','REJECTED','SHIPPED','DELIVERED','CREDIT_RECEIVED','REPLACEMENT_RECEIVED','CANCELLED') NOT NULL DEFAULT 'DRAFT',
          \`return_type\` VARCHAR(50) NOT NULL,
          \`reason\` VARCHAR(500) NOT NULL,
          \`reason_details\` TEXT NULL,
          \`currency\` CHAR(3) NOT NULL DEFAULT 'INR',
          \`subtotal\` DECIMAL(15,4) NOT NULL DEFAULT 0,
          \`tax_amount\` DECIMAL(15,4) NOT NULL DEFAULT 0,
          \`total_amount\` DECIMAL(15,4) NOT NULL DEFAULT 0,
          \`tracking_number\` VARCHAR(100) NULL,
          \`credit_note_number\` VARCHAR(100) NULL,
          \`credit_note_amount\` DECIMAL(15,4) NULL,
          \`credit_note_date\` DATE NULL,
          \`approved_by\` CHAR(36) NULL,
          \`approved_at\` DATETIME NULL,
          \`shipped_by\` CHAR(36) NULL,
          \`shipped_at\` DATETIME NULL,
          \`received_by_supplier_at\` DATETIME NULL,
          \`rejection_reason\` VARCHAR(500) NULL,
          \`notes\` TEXT NULL,
          \`created_by\` CHAR(36) NULL,
          \`updated_by\` CHAR(36) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`UQ_pr_number\` (\`return_number\`),
          INDEX \`idx_pr_supplier_date\` (\`supplier_id\`, \`return_date\`),
          INDEX \`idx_pr_status\` (\`status\`),
          CONSTRAINT \`fk_pr_supplier\` FOREIGN KEY (\`supplier_id\`) REFERENCES \`suppliers\` (\`id\`),
          CONSTRAINT \`fk_pr_warehouse\` FOREIGN KEY (\`warehouse_id\`) REFERENCES \`warehouses\` (\`id\`),
          CONSTRAINT \`fk_pr_po\` FOREIGN KEY (\`purchase_order_id\`) REFERENCES \`purchase_orders\` (\`id\`),
          CONSTRAINT \`fk_pr_grn\` FOREIGN KEY (\`grn_id\`) REFERENCES \`goods_received_notes\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`purchase_return_items\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`purchase_return_id\` VARCHAR(255) NOT NULL,
          \`product_id\` VARCHAR(255) NOT NULL,
          \`variant_id\` VARCHAR(255) NULL,
          \`batch_id\` VARCHAR(255) NULL,
          \`quantity\` DECIMAL(18,4) NOT NULL,
          \`uom_id\` VARCHAR(255) NOT NULL,
          \`unit_price\` DECIMAL(18,4) NOT NULL,
          \`tax_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`line_total\` DECIMAL(18,4) NOT NULL,
          \`reason\` TEXT NULL,
          \`notes\` TEXT NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_pri_return\` (\`purchase_return_id\`),
          CONSTRAINT \`fk_pri_return\` FOREIGN KEY (\`purchase_return_id\`) REFERENCES \`purchase_returns\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_pri_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`),
          CONSTRAINT \`fk_pri_variant\` FOREIGN KEY (\`variant_id\`) REFERENCES \`product_variants\` (\`id\`),
          CONSTRAINT \`fk_pri_uom\` FOREIGN KEY (\`uom_id\`) REFERENCES \`units_of_measure\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // ─── POS ──────────────────────────────────────────────────────────────

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`stores\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`store_code\` VARCHAR(50) NOT NULL,
          \`store_name\` VARCHAR(200) NOT NULL,
          \`store_type\` ENUM('RETAIL','OUTLET','FRANCHISE','POPUP','KIOSK') NOT NULL DEFAULT 'RETAIL',
          \`warehouse_id\` VARCHAR(255) NOT NULL,
          \`address_line1\` VARCHAR(255) NULL,
          \`address_line2\` VARCHAR(255) NULL,
          \`city\` VARCHAR(100) NULL,
          \`state\` VARCHAR(100) NULL,
          \`country\` VARCHAR(100) NULL,
          \`postal_code\` VARCHAR(20) NULL,
          \`phone\` VARCHAR(50) NULL,
          \`email\` VARCHAR(255) NULL,
          \`manager_id\` VARCHAR(255) NULL,
          \`opening_time\` TIME NULL,
          \`closing_time\` TIME NULL,
          \`timezone\` VARCHAR(100) NOT NULL DEFAULT 'Asia/Kolkata',
          \`tax_id\` VARCHAR(100) NULL,
          \`default_price_list_id\` VARCHAR(255) NULL,
          \`receipt_header\` TEXT NULL,
          \`receipt_footer\` TEXT NULL,
          \`is_active\` TINYINT NOT NULL DEFAULT 1,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`UQ_stores_code\` (\`store_code\`),
          CONSTRAINT \`fk_stores_warehouse\` FOREIGN KEY (\`warehouse_id\`) REFERENCES \`warehouses\` (\`id\`),
          CONSTRAINT \`fk_stores_price_list\` FOREIGN KEY (\`default_price_list_id\`) REFERENCES \`price_lists\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`pos_terminals\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`terminal_code\` VARCHAR(50) NOT NULL,
          \`terminal_name\` VARCHAR(200) NOT NULL,
          \`store_id\` VARCHAR(255) NOT NULL,
          \`terminal_type\` ENUM('DESKTOP','TABLET','MOBILE','SELF_SERVICE') NOT NULL DEFAULT 'DESKTOP',
          \`device_id\` VARCHAR(200) NULL,
          \`ip_address\` VARCHAR(45) NULL,
          \`is_active\` TINYINT NOT NULL DEFAULT 1,
          \`last_sync_at\` TIMESTAMP NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`UQ_pt_code\` (\`terminal_code\`),
          CONSTRAINT \`fk_pt_store\` FOREIGN KEY (\`store_id\`) REFERENCES \`stores\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`pos_sessions\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`session_number\` VARCHAR(50) NOT NULL,
          \`store_id\` VARCHAR(255) NOT NULL,
          \`terminal_id\` VARCHAR(255) NOT NULL,
          \`user_id\` VARCHAR(255) NOT NULL,
          \`status\` ENUM('OPEN','CLOSED','SUSPENDED') NOT NULL DEFAULT 'OPEN',
          \`opening_time\` TIMESTAMP NOT NULL,
          \`closing_time\` TIMESTAMP NULL,
          \`opening_cash\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`closing_cash\` DECIMAL(18,4) NULL,
          \`expected_cash\` DECIMAL(18,4) NULL,
          \`cash_difference\` DECIMAL(18,4) NULL,
          \`total_sales\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`total_returns\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`total_transactions\` INT NOT NULL DEFAULT 0,
          \`cash_sales\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`card_sales\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`upi_sales\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`other_sales\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`cash_in\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`cash_out\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`opening_notes\` TEXT NULL,
          \`closing_notes\` TEXT NULL,
          \`closed_by\` VARCHAR(255) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`UQ_ps_number\` (\`session_number\`),
          INDEX \`idx_ps_store\` (\`store_id\`),
          CONSTRAINT \`fk_ps_store\` FOREIGN KEY (\`store_id\`) REFERENCES \`stores\` (\`id\`),
          CONSTRAINT \`fk_ps_terminal\` FOREIGN KEY (\`terminal_id\`) REFERENCES \`pos_terminals\` (\`id\`),
          CONSTRAINT \`fk_ps_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`pos_transactions\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`transaction_number\` VARCHAR(50) NOT NULL,
          \`session_id\` VARCHAR(255) NOT NULL,
          \`store_id\` VARCHAR(255) NOT NULL,
          \`terminal_id\` VARCHAR(255) NOT NULL,
          \`sales_order_id\` VARCHAR(255) NULL,
          \`transaction_type\` ENUM('SALE','RETURN','EXCHANGE','VOID') NOT NULL DEFAULT 'SALE',
          \`customer_id\` VARCHAR(255) NULL,
          \`customer_name\` VARCHAR(200) NULL,
          \`customer_phone\` VARCHAR(50) NULL,
          \`transaction_date\` TIMESTAMP NOT NULL,
          \`subtotal\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`discount_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`tax_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`total_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`paid_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`change_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`status\` ENUM('COMPLETED','VOIDED','HELD','PENDING') NOT NULL DEFAULT 'COMPLETED',
          \`void_reason\` TEXT NULL,
          \`voided_by\` VARCHAR(255) NULL,
          \`voided_at\` TIMESTAMP NULL,
          \`notes\` TEXT NULL,
          \`cashier_id\` VARCHAR(255) NOT NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`UQ_ptx_number\` (\`transaction_number\`),
          INDEX \`idx_ptx_session\` (\`session_id\`),
          CONSTRAINT \`fk_ptx_session\` FOREIGN KEY (\`session_id\`) REFERENCES \`pos_sessions\` (\`id\`),
          CONSTRAINT \`fk_ptx_store\` FOREIGN KEY (\`store_id\`) REFERENCES \`stores\` (\`id\`),
          CONSTRAINT \`fk_ptx_terminal\` FOREIGN KEY (\`terminal_id\`) REFERENCES \`pos_terminals\` (\`id\`),
          CONSTRAINT \`fk_ptx_customer\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`pos_transaction_items\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`transaction_id\` VARCHAR(255) NOT NULL,
          \`product_id\` VARCHAR(255) NOT NULL,
          \`variant_id\` VARCHAR(255) NULL,
          \`sku\` VARCHAR(100) NOT NULL,
          \`product_name\` VARCHAR(300) NOT NULL,
          \`quantity\` DECIMAL(18,4) NOT NULL,
          \`uom_id\` VARCHAR(255) NOT NULL,
          \`unit_price\` DECIMAL(18,4) NOT NULL,
          \`original_price\` DECIMAL(18,4) NULL,
          \`discount_percentage\` DECIMAL(5,2) NOT NULL DEFAULT 0,
          \`discount_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`tax_percentage\` DECIMAL(5,2) NOT NULL DEFAULT 0,
          \`tax_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`line_total\` DECIMAL(18,4) NOT NULL,
          \`cost_price\` DECIMAL(18,4) NULL,
          \`serial_number\` VARCHAR(100) NULL,
          \`batch_number\` VARCHAR(100) NULL,
          \`is_return_item\` TINYINT NOT NULL DEFAULT 0,
          \`return_reason\` TEXT NULL,
          \`original_transaction_item_id\` VARCHAR(255) NULL,
          \`notes\` TEXT NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_pti_transaction\` (\`transaction_id\`),
          CONSTRAINT \`fk_pti_transaction\` FOREIGN KEY (\`transaction_id\`) REFERENCES \`pos_transactions\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_pti_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`),
          CONSTRAINT \`fk_pti_variant\` FOREIGN KEY (\`variant_id\`) REFERENCES \`product_variants\` (\`id\`),
          CONSTRAINT \`fk_pti_uom\` FOREIGN KEY (\`uom_id\`) REFERENCES \`units_of_measure\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`pos_transaction_payments\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`transaction_id\` VARCHAR(255) NOT NULL,
          \`payment_method_id\` VARCHAR(255) NOT NULL,
          \`amount\` DECIMAL(18,4) NOT NULL,
          \`tendered_amount\` DECIMAL(18,4) NULL,
          \`change_amount\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`currency\` VARCHAR(3) NOT NULL DEFAULT 'INR',
          \`status\` ENUM('PENDING','COMPLETED','FAILED','CANCELLED','REFUNDED') NOT NULL DEFAULT 'COMPLETED',
          \`reference_number\` VARCHAR(100) NULL,
          \`card_last_four\` VARCHAR(4) NULL,
          \`card_type\` VARCHAR(50) NULL,
          \`approval_code\` VARCHAR(50) NULL,
          \`terminal_response\` JSON NULL,
          \`is_refund\` TINYINT NOT NULL DEFAULT 0,
          \`refund_reason\` TEXT NULL,
          \`original_payment_id\` VARCHAR(255) NULL,
          \`notes\` TEXT NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_ptp_transaction\` (\`transaction_id\`),
          CONSTRAINT \`fk_ptp_transaction\` FOREIGN KEY (\`transaction_id\`) REFERENCES \`pos_transactions\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_ptp_method\` FOREIGN KEY (\`payment_method_id\`) REFERENCES \`payment_methods\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`cash_movements\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`movement_number\` VARCHAR(50) NOT NULL,
          \`session_id\` VARCHAR(255) NULL,
          \`store_id\` VARCHAR(255) NOT NULL,
          \`movement_type\` ENUM('CASH_IN','CASH_OUT','PETTY_CASH','FLOAT','BANK_DEPOSIT','BANK_WITHDRAWAL','EXPENSE','REFUND','ADJUSTMENT') NOT NULL,
          \`movement_date\` TIMESTAMP NOT NULL,
          \`amount\` DECIMAL(18,4) NOT NULL,
          \`currency\` VARCHAR(3) NOT NULL DEFAULT 'INR',
          \`status\` ENUM('PENDING','APPROVED','REJECTED','CANCELLED') NOT NULL DEFAULT 'APPROVED',
          \`reason\` TEXT NOT NULL,
          \`reference_number\` VARCHAR(100) NULL,
          \`reference_type\` VARCHAR(50) NULL,
          \`reference_id\` VARCHAR(255) NULL,
          \`expense_category\` VARCHAR(100) NULL,
          \`received_from\` VARCHAR(200) NULL,
          \`paid_to\` VARCHAR(200) NULL,
          \`notes\` TEXT NULL,
          \`approved_by\` VARCHAR(255) NULL,
          \`approved_at\` TIMESTAMP NULL,
          \`created_by\` VARCHAR(255) NOT NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`UQ_cm_number\` (\`movement_number\`),
          CONSTRAINT \`fk_cm_session\` FOREIGN KEY (\`session_id\`) REFERENCES \`pos_sessions\` (\`id\`),
          CONSTRAINT \`fk_cm_store\` FOREIGN KEY (\`store_id\`) REFERENCES \`stores\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // ─── Manufacturing ────────────────────────────────────────────────────

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`workstations\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`workstation_code\` VARCHAR(50) NOT NULL,
          \`workstation_name\` VARCHAR(200) NOT NULL,
          \`workstation_type\` ENUM('ASSEMBLY','MACHINING','WELDING','PAINTING','PACKAGING','TESTING','CUTTING','MOLDING','PRINTING','OTHER') NOT NULL DEFAULT 'ASSEMBLY',
          \`warehouse_id\` VARCHAR(255) NULL,
          \`description\` TEXT NULL,
          \`status\` ENUM('AVAILABLE','IN_USE','MAINTENANCE','BREAKDOWN','INACTIVE') NOT NULL DEFAULT 'AVAILABLE',
          \`hourly_rate\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`operating_cost_per_hour\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`capacity_per_hour\` DECIMAL(18,4) NULL,
          \`working_hours_per_day\` DECIMAL(4,2) NOT NULL DEFAULT 8,
          \`efficiency_percentage\` DECIMAL(5,2) NOT NULL DEFAULT 100,
          \`setup_time_minutes\` INT NOT NULL DEFAULT 0,
          \`cleanup_time_minutes\` INT NOT NULL DEFAULT 0,
          \`last_maintenance_date\` DATE NULL,
          \`next_maintenance_date\` DATE NULL,
          \`is_active\` TINYINT NOT NULL DEFAULT 1,
          \`notes\` TEXT NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`UQ_ws_code\` (\`workstation_code\`),
          CONSTRAINT \`fk_ws_warehouse\` FOREIGN KEY (\`warehouse_id\`) REFERENCES \`warehouses\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`bill_of_materials\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`bom_code\` VARCHAR(50) NOT NULL,
          \`bom_name\` VARCHAR(200) NOT NULL,
          \`product_id\` VARCHAR(255) NOT NULL,
          \`variant_id\` VARCHAR(255) NULL,
          \`version\` INT NOT NULL DEFAULT 1,
          \`status\` ENUM('DRAFT','ACTIVE','OBSOLETE') NOT NULL DEFAULT 'DRAFT',
          \`effective_from\` DATE NULL,
          \`effective_to\` DATE NULL,
          \`quantity\` DECIMAL(18,4) NOT NULL DEFAULT 1,
          \`uom_id\` VARCHAR(255) NOT NULL,
          \`description\` TEXT NULL,
          \`total_material_cost\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`total_operation_cost\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`total_cost\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`scrap_percentage\` DECIMAL(5,2) NOT NULL DEFAULT 0,
          \`is_default\` TINYINT NOT NULL DEFAULT 0,
          \`notes\` TEXT NULL,
          \`created_by\` VARCHAR(255) NULL,
          \`approved_by\` VARCHAR(255) NULL,
          \`approved_at\` TIMESTAMP NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_bom_product\` (\`product_id\`),
          CONSTRAINT \`fk_bom_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`),
          CONSTRAINT \`fk_bom_variant\` FOREIGN KEY (\`variant_id\`) REFERENCES \`product_variants\` (\`id\`),
          CONSTRAINT \`fk_bom_uom\` FOREIGN KEY (\`uom_id\`) REFERENCES \`units_of_measure\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`bom_items\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`bom_id\` VARCHAR(255) NOT NULL,
          \`item_type\` ENUM('RAW_MATERIAL','SEMI_FINISHED','SUB_ASSEMBLY','PACKAGING','CONSUMABLE') NOT NULL DEFAULT 'RAW_MATERIAL',
          \`product_id\` VARCHAR(255) NOT NULL,
          \`variant_id\` VARCHAR(255) NULL,
          \`quantity\` DECIMAL(18,6) NOT NULL,
          \`uom_id\` VARCHAR(255) NOT NULL,
          \`unit_cost\` DECIMAL(18,4) NULL,
          \`total_cost\` DECIMAL(18,4) NULL,
          \`scrap_percentage\` DECIMAL(5,2) NOT NULL DEFAULT 0,
          \`is_critical\` TINYINT NOT NULL DEFAULT 0,
          \`substitute_product_id\` VARCHAR(255) NULL,
          \`sequence\` INT NOT NULL DEFAULT 0,
          \`notes\` TEXT NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_bi_bom\` (\`bom_id\`),
          CONSTRAINT \`fk_bi_bom\` FOREIGN KEY (\`bom_id\`) REFERENCES \`bill_of_materials\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_bi_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`),
          CONSTRAINT \`fk_bi_variant\` FOREIGN KEY (\`variant_id\`) REFERENCES \`product_variants\` (\`id\`),
          CONSTRAINT \`fk_bi_uom\` FOREIGN KEY (\`uom_id\`) REFERENCES \`units_of_measure\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`bom_operations\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`bom_id\` VARCHAR(255) NOT NULL,
          \`operation_number\` INT NOT NULL,
          \`operation_name\` VARCHAR(200) NOT NULL,
          \`workstation_id\` VARCHAR(255) NULL,
          \`description\` TEXT NULL,
          \`instructions\` TEXT NULL,
          \`setup_time_minutes\` DECIMAL(10,2) NOT NULL DEFAULT 0,
          \`operation_time_minutes\` DECIMAL(10,2) NOT NULL DEFAULT 0,
          \`teardown_time_minutes\` DECIMAL(10,2) NOT NULL DEFAULT 0,
          \`labor_cost_per_unit\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`overhead_cost_per_unit\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`total_cost_per_unit\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`is_outsourced\` TINYINT NOT NULL DEFAULT 0,
          \`outsourced_vendor\` VARCHAR(200) NULL,
          \`outsourced_cost\` DECIMAL(18,4) NULL,
          \`is_quality_check_required\` TINYINT NOT NULL DEFAULT 0,
          \`quality_parameters\` JSON NULL,
          \`notes\` TEXT NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_bo_bom\` (\`bom_id\`),
          CONSTRAINT \`fk_bo_bom\` FOREIGN KEY (\`bom_id\`) REFERENCES \`bill_of_materials\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_bo_workstation\` FOREIGN KEY (\`workstation_id\`) REFERENCES \`workstations\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`work_orders\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`work_order_number\` VARCHAR(50) NOT NULL,
          \`bom_id\` VARCHAR(255) NOT NULL,
          \`product_id\` VARCHAR(255) NOT NULL,
          \`variant_id\` VARCHAR(255) NULL,
          \`warehouse_id\` VARCHAR(255) NOT NULL,
          \`status\` ENUM('DRAFT','CONFIRMED','RELEASED','IN_PROGRESS','PAUSED','COMPLETED','CANCELLED','ON_HOLD') NOT NULL DEFAULT 'DRAFT',
          \`priority\` ENUM('LOW','NORMAL','HIGH','URGENT') NOT NULL DEFAULT 'NORMAL',
          \`planned_quantity\` DECIMAL(18,4) NOT NULL,
          \`completed_quantity\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`rejected_quantity\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`uom_id\` VARCHAR(255) NOT NULL,
          \`planned_start_date\` DATE NOT NULL,
          \`planned_end_date\` DATE NOT NULL,
          \`actual_start_date\` DATE NULL,
          \`actual_end_date\` DATE NULL,
          \`sales_order_id\` VARCHAR(255) NULL,
          \`parent_work_order_id\` VARCHAR(255) NULL,
          \`estimated_material_cost\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`estimated_labor_cost\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`estimated_overhead_cost\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`estimated_total_cost\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`actual_material_cost\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`actual_labor_cost\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`actual_overhead_cost\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`actual_total_cost\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`notes\` TEXT NULL,
          \`created_by\` VARCHAR(255) NULL,
          \`released_by\` VARCHAR(255) NULL,
          \`released_at\` TIMESTAMP NULL,
          \`completed_by\` VARCHAR(255) NULL,
          \`completed_at\` TIMESTAMP NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`UQ_wo_number\` (\`work_order_number\`),
          INDEX \`idx_wo_product\` (\`product_id\`),
          CONSTRAINT \`fk_wo_bom\` FOREIGN KEY (\`bom_id\`) REFERENCES \`bill_of_materials\` (\`id\`),
          CONSTRAINT \`fk_wo_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`),
          CONSTRAINT \`fk_wo_warehouse\` FOREIGN KEY (\`warehouse_id\`) REFERENCES \`warehouses\` (\`id\`),
          CONSTRAINT \`fk_wo_uom\` FOREIGN KEY (\`uom_id\`) REFERENCES \`units_of_measure\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`work_order_items\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`work_order_id\` VARCHAR(255) NOT NULL,
          \`bom_item_id\` VARCHAR(255) NULL,
          \`item_type\` ENUM('RAW_MATERIAL','SEMI_FINISHED','SUB_ASSEMBLY','PACKAGING','CONSUMABLE') NOT NULL DEFAULT 'RAW_MATERIAL',
          \`product_id\` VARCHAR(255) NOT NULL,
          \`variant_id\` VARCHAR(255) NULL,
          \`required_quantity\` DECIMAL(18,4) NOT NULL,
          \`issued_quantity\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`consumed_quantity\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`returned_quantity\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`scrap_quantity\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`uom_id\` VARCHAR(255) NOT NULL,
          \`unit_cost\` DECIMAL(18,4) NULL,
          \`total_cost\` DECIMAL(18,4) NULL,
          \`status\` ENUM('PENDING','PARTIALLY_ISSUED','ISSUED','RETURNED') NOT NULL DEFAULT 'PENDING',
          \`notes\` TEXT NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_woi_order\` (\`work_order_id\`),
          CONSTRAINT \`fk_woi_order\` FOREIGN KEY (\`work_order_id\`) REFERENCES \`work_orders\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_woi_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`),
          CONSTRAINT \`fk_woi_uom\` FOREIGN KEY (\`uom_id\`) REFERENCES \`units_of_measure\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`work_order_operations\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`work_order_id\` VARCHAR(255) NOT NULL,
          \`bom_operation_id\` VARCHAR(255) NULL,
          \`operation_number\` INT NOT NULL,
          \`operation_name\` VARCHAR(200) NOT NULL,
          \`workstation_id\` VARCHAR(255) NULL,
          \`status\` ENUM('PENDING','READY','IN_PROGRESS','PAUSED','COMPLETED','CANCELLED') NOT NULL DEFAULT 'PENDING',
          \`planned_quantity\` DECIMAL(18,4) NOT NULL,
          \`completed_quantity\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`rejected_quantity\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`planned_start_time\` TIMESTAMP NULL,
          \`planned_end_time\` TIMESTAMP NULL,
          \`actual_start_time\` TIMESTAMP NULL,
          \`actual_end_time\` TIMESTAMP NULL,
          \`planned_duration_minutes\` DECIMAL(10,2) NOT NULL DEFAULT 0,
          \`actual_duration_minutes\` DECIMAL(10,2) NOT NULL DEFAULT 0,
          \`estimated_labor_cost\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`actual_labor_cost\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`estimated_overhead_cost\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`actual_overhead_cost\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`operator_id\` VARCHAR(255) NULL,
          \`instructions\` TEXT NULL,
          \`notes\` TEXT NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_woo_order\` (\`work_order_id\`),
          CONSTRAINT \`fk_woo_order\` FOREIGN KEY (\`work_order_id\`) REFERENCES \`work_orders\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_woo_workstation\` FOREIGN KEY (\`workstation_id\`) REFERENCES \`workstations\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`material_issues\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`issue_number\` VARCHAR(50) NOT NULL,
          \`issue_date\` TIMESTAMP NOT NULL,
          \`work_order_id\` VARCHAR(255) NULL,
          \`warehouse_id\` VARCHAR(255) NOT NULL,
          \`issue_type\` ENUM('PRODUCTION','REWORK','SAMPLE','REPLACEMENT','OTHER') NOT NULL DEFAULT 'PRODUCTION',
          \`status\` ENUM('DRAFT','PENDING_APPROVAL','APPROVED','ISSUED','PARTIALLY_RETURNED','RETURNED','CANCELLED') NOT NULL DEFAULT 'DRAFT',
          \`total_value\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`reason\` TEXT NULL,
          \`notes\` TEXT NULL,
          \`issued_by\` VARCHAR(255) NULL,
          \`issued_at\` TIMESTAMP NULL,
          \`approved_by\` VARCHAR(255) NULL,
          \`approved_at\` TIMESTAMP NULL,
          \`created_by\` VARCHAR(255) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`UQ_mi_number\` (\`issue_number\`),
          CONSTRAINT \`fk_mi_work_order\` FOREIGN KEY (\`work_order_id\`) REFERENCES \`work_orders\` (\`id\`),
          CONSTRAINT \`fk_mi_warehouse\` FOREIGN KEY (\`warehouse_id\`) REFERENCES \`warehouses\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`material_issue_items\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`material_issue_id\` VARCHAR(255) NOT NULL,
          \`work_order_item_id\` VARCHAR(255) NULL,
          \`product_id\` VARCHAR(255) NOT NULL,
          \`variant_id\` VARCHAR(255) NULL,
          \`location_id\` VARCHAR(255) NULL,
          \`batch_id\` VARCHAR(255) NULL,
          \`issued_quantity\` DECIMAL(18,4) NOT NULL,
          \`returned_quantity\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`uom_id\` VARCHAR(255) NOT NULL,
          \`unit_cost\` DECIMAL(18,4) NULL,
          \`total_cost\` DECIMAL(18,4) NULL,
          \`serial_numbers\` JSON NULL,
          \`notes\` TEXT NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_mii_issue\` (\`material_issue_id\`),
          CONSTRAINT \`fk_mii_issue\` FOREIGN KEY (\`material_issue_id\`) REFERENCES \`material_issues\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_mii_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`),
          CONSTRAINT \`fk_mii_uom\` FOREIGN KEY (\`uom_id\`) REFERENCES \`units_of_measure\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`production_outputs\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`output_number\` VARCHAR(50) NOT NULL,
          \`output_date\` TIMESTAMP NOT NULL,
          \`work_order_id\` VARCHAR(255) NOT NULL,
          \`work_order_operation_id\` VARCHAR(255) NULL,
          \`product_id\` VARCHAR(255) NOT NULL,
          \`variant_id\` VARCHAR(255) NULL,
          \`warehouse_id\` VARCHAR(255) NOT NULL,
          \`location_id\` VARCHAR(255) NULL,
          \`batch_id\` VARCHAR(255) NULL,
          \`produced_quantity\` DECIMAL(18,4) NOT NULL,
          \`accepted_quantity\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`rejected_quantity\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`rework_quantity\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`uom_id\` VARCHAR(255) NOT NULL,
          \`status\` ENUM('PENDING_QC','QC_PASSED','QC_FAILED','ACCEPTED','REJECTED','REWORK') NOT NULL DEFAULT 'PENDING_QC',
          \`material_cost\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`labor_cost\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`overhead_cost\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`total_cost\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`unit_cost\` DECIMAL(18,4) NULL,
          \`batch_number\` VARCHAR(100) NULL,
          \`manufacturing_date\` DATE NULL,
          \`expiry_date\` DATE NULL,
          \`rejection_reason\` TEXT NULL,
          \`notes\` TEXT NULL,
          \`produced_by\` VARCHAR(255) NULL,
          \`qc_by\` VARCHAR(255) NULL,
          \`qc_at\` TIMESTAMP NULL,
          \`created_by\` VARCHAR(255) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`UQ_po_number\` (\`output_number\`),
          INDEX \`idx_po_work_order\` (\`work_order_id\`),
          CONSTRAINT \`fk_po_work_order\` FOREIGN KEY (\`work_order_id\`) REFERENCES \`work_orders\` (\`id\`),
          CONSTRAINT \`fk_po_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`),
          CONSTRAINT \`fk_po_warehouse\` FOREIGN KEY (\`warehouse_id\`) REFERENCES \`warehouses\` (\`id\`),
          CONSTRAINT \`fk_po_uom\` FOREIGN KEY (\`uom_id\`) REFERENCES \`units_of_measure\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`quality_parameters\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`parameter_code\` VARCHAR(50) NOT NULL,
          \`parameter_name\` VARCHAR(200) NOT NULL,
          \`description\` TEXT NULL,
          \`parameter_type\` ENUM('NUMERIC','BOOLEAN','TEXT','RANGE','OPTIONS') NOT NULL DEFAULT 'NUMERIC',
          \`unit_of_measure\` VARCHAR(50) NULL,
          \`min_value\` DECIMAL(18,6) NULL,
          \`max_value\` DECIMAL(18,6) NULL,
          \`target_value\` DECIMAL(18,6) NULL,
          \`allowed_options\` JSON NULL,
          \`is_critical\` TINYINT NOT NULL DEFAULT 0,
          \`is_active\` TINYINT NOT NULL DEFAULT 1,
          \`inspection_method\` TEXT NULL,
          \`sampling_instructions\` TEXT NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`UQ_qp_code\` (\`parameter_code\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`quality_inspections\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`inspection_number\` VARCHAR(50) NOT NULL,
          \`inspection_date\` TIMESTAMP NOT NULL,
          \`inspection_type\` ENUM('INCOMING','IN_PROCESS','FINAL','RANDOM') NOT NULL,
          \`status\` ENUM('PENDING','IN_PROGRESS','PASSED','FAILED','CONDITIONAL','CANCELLED') NOT NULL DEFAULT 'PENDING',
          \`reference_type\` VARCHAR(50) NOT NULL,
          \`reference_id\` VARCHAR(255) NOT NULL,
          \`product_id\` VARCHAR(255) NOT NULL,
          \`variant_id\` VARCHAR(255) NULL,
          \`grn_id\` VARCHAR(255) NULL,
          \`production_output_id\` VARCHAR(255) NULL,
          \`batch_number\` VARCHAR(100) NULL,
          \`sample_size\` DECIMAL(18,4) NOT NULL,
          \`inspected_quantity\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`passed_quantity\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`failed_quantity\` DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`inspection_results\` JSON NULL,
          \`defects_found\` JSON NULL,
          \`remarks\` TEXT NULL,
          \`corrective_action\` TEXT NULL,
          \`inspector_id\` VARCHAR(255) NOT NULL,
          \`approved_by\` VARCHAR(255) NULL,
          \`approved_at\` TIMESTAMP NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`UQ_qi_number\` (\`inspection_number\`),
          CONSTRAINT \`fk_qi_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`),
          CONSTRAINT \`fk_qi_grn\` FOREIGN KEY (\`grn_id\`) REFERENCES \`goods_received_notes\` (\`id\`),
          CONSTRAINT \`fk_qi_output\` FOREIGN KEY (\`production_output_id\`) REFERENCES \`production_outputs\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // ─── Import / Export ──────────────────────────────────────────────────

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`file_uploads\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`original_filename\` VARCHAR(255) NOT NULL,
          \`stored_filename\` VARCHAR(255) NOT NULL,
          \`file_path\` VARCHAR(500) NOT NULL,
          \`file_url\` VARCHAR(500) NULL,
          \`mime_type\` VARCHAR(100) NOT NULL,
          \`file_extension\` VARCHAR(20) NOT NULL,
          \`file_size\` BIGINT NOT NULL,
          \`checksum\` VARCHAR(64) NULL,
          \`status\` ENUM('PENDING','UPLOADING','COMPLETED','FAILED','PROCESSING','PROCESSED','EXPIRED','DELETED') NOT NULL DEFAULT 'PENDING',
          \`purpose\` ENUM('IMPORT','ATTACHMENT','PRODUCT_IMAGE','DOCUMENT','REPORT','BACKUP','OTHER') NOT NULL DEFAULT 'OTHER',
          \`reference_type\` VARCHAR(100) NULL,
          \`reference_id\` VARCHAR(255) NULL,
          \`storage_provider\` VARCHAR(50) NOT NULL DEFAULT 'LOCAL',
          \`storage_bucket\` VARCHAR(255) NULL,
          \`is_public\` TINYINT NOT NULL DEFAULT 0,
          \`is_temporary\` TINYINT NOT NULL DEFAULT 0,
          \`expires_at\` TIMESTAMP NULL,
          \`deleted_at\` TIMESTAMP NULL,
          \`metadata\` JSON NULL,
          \`error_message\` TEXT NULL,
          \`uploaded_by\` VARCHAR(255) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_fu_purpose\` (\`purpose\`),
          INDEX \`idx_fu_status\` (\`status\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`import_templates\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`template_code\` VARCHAR(50) NOT NULL,
          \`template_name\` VARCHAR(200) NOT NULL,
          \`description\` TEXT NULL,
          \`entity_type\` ENUM('PRODUCTS','CUSTOMERS','SUPPLIERS','INVENTORY_STOCK','PRICE_LIST','SALES_ORDERS','PURCHASE_ORDERS','CHART_OF_ACCOUNTS','JOURNAL_ENTRIES','OPENING_BALANCES','CATEGORIES','BRANDS','WAREHOUSES','LOCATIONS') NOT NULL,
          \`file_format\` ENUM('XLSX','CSV','TSV') NOT NULL DEFAULT 'XLSX',
          \`has_header_row\` TINYINT NOT NULL DEFAULT 1,
          \`header_row_number\` INT NOT NULL DEFAULT 1,
          \`data_start_row\` INT NOT NULL DEFAULT 2,
          \`sheet_name\` VARCHAR(100) NULL,
          \`date_format\` VARCHAR(50) NOT NULL DEFAULT 'YYYY-MM-DD',
          \`number_format\` VARCHAR(50) NULL,
          \`delimiter\` VARCHAR(10) NULL,
          \`text_qualifier\` VARCHAR(10) NULL,
          \`encoding\` VARCHAR(50) NOT NULL DEFAULT 'UTF-8',
          \`sample_file_url\` VARCHAR(500) NULL,
          \`is_system\` TINYINT NOT NULL DEFAULT 0,
          \`is_active\` TINYINT NOT NULL DEFAULT 1,
          \`created_by\` VARCHAR(255) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`UQ_it_code\` (\`template_code\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`import_template_columns\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`template_id\` VARCHAR(255) NOT NULL,
          \`column_order\` INT NOT NULL,
          \`source_column_name\` VARCHAR(200) NOT NULL,
          \`source_column_index\` INT NULL,
          \`target_field_name\` VARCHAR(200) NOT NULL,
          \`display_name\` VARCHAR(200) NOT NULL,
          \`data_type\` ENUM('STRING','NUMBER','DECIMAL','DATE','DATETIME','BOOLEAN','EMAIL','PHONE','URL') NOT NULL DEFAULT 'STRING',
          \`mapping_type\` ENUM('DIRECT','LOOKUP','TRANSFORM','CONSTANT','FORMULA') NOT NULL DEFAULT 'DIRECT',
          \`is_required\` TINYINT NOT NULL DEFAULT 0,
          \`is_unique\` TINYINT NOT NULL DEFAULT 0,
          \`default_value\` VARCHAR(500) NULL,
          \`lookup_entity\` VARCHAR(100) NULL,
          \`lookup_field\` VARCHAR(100) NULL,
          \`lookup_return_field\` VARCHAR(100) NULL,
          \`transform_expression\` TEXT NULL,
          \`validation_rules\` JSON NULL,
          \`allowed_values\` JSON NULL,
          \`min_length\` INT NULL,
          \`max_length\` INT NULL,
          \`min_value\` DECIMAL(18,4) NULL,
          \`max_value\` DECIMAL(18,4) NULL,
          \`regex_pattern\` VARCHAR(500) NULL,
          \`description\` TEXT NULL,
          \`sample_value\` VARCHAR(500) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_itc_template\` (\`template_id\`),
          CONSTRAINT \`fk_itc_template\` FOREIGN KEY (\`template_id\`) REFERENCES \`import_templates\` (\`id\`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`import_jobs\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`job_number\` VARCHAR(50) NOT NULL,
          \`template_id\` VARCHAR(255) NOT NULL,
          \`file_upload_id\` VARCHAR(255) NOT NULL,
          \`status\` ENUM('PENDING','VALIDATING','VALIDATION_FAILED','VALIDATION_PASSED','PROCESSING','COMPLETED','FAILED','CANCELLED','PARTIALLY_COMPLETED') NOT NULL DEFAULT 'PENDING',
          \`import_mode\` ENUM('INSERT','UPDATE','UPSERT') NOT NULL DEFAULT 'INSERT',
          \`total_rows\` INT NOT NULL DEFAULT 0,
          \`processed_rows\` INT NOT NULL DEFAULT 0,
          \`successful_rows\` INT NOT NULL DEFAULT 0,
          \`failed_rows\` INT NOT NULL DEFAULT 0,
          \`skipped_rows\` INT NOT NULL DEFAULT 0,
          \`inserted_count\` INT NOT NULL DEFAULT 0,
          \`updated_count\` INT NOT NULL DEFAULT 0,
          \`validation_started_at\` TIMESTAMP NULL,
          \`validation_completed_at\` TIMESTAMP NULL,
          \`processing_started_at\` TIMESTAMP NULL,
          \`processing_completed_at\` TIMESTAMP NULL,
          \`error_file_url\` VARCHAR(500) NULL,
          \`result_summary\` JSON NULL,
          \`options\` JSON NULL,
          \`notes\` TEXT NULL,
          \`cancelled_at\` TIMESTAMP NULL,
          \`cancelled_by\` VARCHAR(255) NULL,
          \`created_by\` VARCHAR(255) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`UQ_ij_number\` (\`job_number\`),
          CONSTRAINT \`fk_ij_template\` FOREIGN KEY (\`template_id\`) REFERENCES \`import_templates\` (\`id\`),
          CONSTRAINT \`fk_ij_file\` FOREIGN KEY (\`file_upload_id\`) REFERENCES \`file_uploads\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`import_job_errors\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`import_job_id\` VARCHAR(255) NOT NULL,
          \`row_number\` INT NOT NULL,
          \`column_name\` VARCHAR(200) NULL,
          \`column_index\` INT NULL,
          \`error_type\` ENUM('VALIDATION','DUPLICATE','NOT_FOUND','CONSTRAINT','TRANSFORMATION','SYSTEM','FORMAT','REQUIRED') NOT NULL,
          \`severity\` ENUM('WARNING','ERROR','CRITICAL') NOT NULL DEFAULT 'ERROR',
          \`error_code\` VARCHAR(50) NULL,
          \`error_message\` TEXT NOT NULL,
          \`field_value\` TEXT NULL,
          \`expected_value\` TEXT NULL,
          \`row_data\` JSON NULL,
          \`is_resolved\` TINYINT NOT NULL DEFAULT 0,
          \`resolution_notes\` TEXT NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_ije_job\` (\`import_job_id\`),
          CONSTRAINT \`fk_ije_job\` FOREIGN KEY (\`import_job_id\`) REFERENCES \`import_jobs\` (\`id\`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`export_jobs\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`job_number\` VARCHAR(50) NOT NULL,
          \`export_name\` VARCHAR(200) NOT NULL,
          \`entity_type\` VARCHAR(100) NOT NULL,
          \`status\` ENUM('PENDING','PROCESSING','COMPLETED','FAILED','CANCELLED','EXPIRED') NOT NULL DEFAULT 'PENDING',
          \`file_format\` ENUM('XLSX','CSV','PDF','JSON') NOT NULL DEFAULT 'XLSX',
          \`filters\` JSON NULL,
          \`columns\` JSON NULL,
          \`sort_by\` VARCHAR(100) NULL,
          \`sort_order\` VARCHAR(10) NULL,
          \`include_headers\` TINYINT NOT NULL DEFAULT 1,
          \`total_records\` INT NOT NULL DEFAULT 0,
          \`processed_records\` INT NOT NULL DEFAULT 0,
          \`file_name\` VARCHAR(255) NULL,
          \`file_size\` BIGINT NULL,
          \`file_url\` VARCHAR(500) NULL,
          \`started_at\` TIMESTAMP NULL,
          \`completed_at\` TIMESTAMP NULL,
          \`expires_at\` TIMESTAMP NULL,
          \`error_message\` TEXT NULL,
          \`notes\` TEXT NULL,
          \`created_by\` VARCHAR(255) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`UQ_ej_number\` (\`job_number\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`export_schedules\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`schedule_name\` VARCHAR(200) NOT NULL,
          \`description\` TEXT NULL,
          \`entity_type\` VARCHAR(100) NOT NULL,
          \`file_format\` ENUM('XLSX','CSV','PDF','JSON') NOT NULL DEFAULT 'XLSX',
          \`filters\` JSON NULL,
          \`columns\` JSON NULL,
          \`frequency\` ENUM('DAILY','WEEKLY','BIWEEKLY','MONTHLY','QUARTERLY','YEARLY','CUSTOM') NOT NULL,
          \`cron_expression\` VARCHAR(100) NULL,
          \`day_of_week\` INT NULL,
          \`day_of_month\` INT NULL,
          \`time_of_day\` TIME NOT NULL,
          \`timezone\` VARCHAR(100) NOT NULL DEFAULT 'Asia/Kolkata',
          \`is_active\` TINYINT NOT NULL DEFAULT 1,
          \`send_empty_report\` TINYINT NOT NULL DEFAULT 0,
          \`email_subject\` VARCHAR(500) NULL,
          \`email_body\` TEXT NULL,
          \`last_run_at\` TIMESTAMP NULL,
          \`last_run_status\` VARCHAR(50) NULL,
          \`next_run_at\` TIMESTAMP NULL,
          \`run_count\` INT NOT NULL DEFAULT 0,
          \`created_by\` VARCHAR(255) NULL,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`export_schedule_recipients\` (
          \`id\` VARCHAR(36) NOT NULL,
          \`schedule_id\` VARCHAR(255) NOT NULL,
          \`recipient_type\` ENUM('USER','EMAIL','WEBHOOK','FTP','S3') NOT NULL DEFAULT 'EMAIL',
          \`user_id\` VARCHAR(255) NULL,
          \`email\` VARCHAR(255) NULL,
          \`recipient_name\` VARCHAR(200) NULL,
          \`webhook_url\` VARCHAR(500) NULL,
          \`ftp_host\` VARCHAR(255) NULL,
          \`ftp_username\` VARCHAR(100) NULL,
          \`ftp_password\` VARCHAR(255) NULL,
          \`ftp_path\` VARCHAR(500) NULL,
          \`s3_bucket\` VARCHAR(255) NULL,
          \`s3_path\` VARCHAR(500) NULL,
          \`is_active\` TINYINT NOT NULL DEFAULT 1,
          \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          INDEX \`idx_esr_schedule\` (\`schedule_id\`),
          CONSTRAINT \`fk_esr_schedule\` FOREIGN KEY (\`schedule_id\`) REFERENCES \`export_schedules\` (\`id\`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      this.logger.log('All tenant tables created successfully');
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Seed default data for tenant
   */
  private async seedTenantData(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      // Seed sequences
      const sequences = [
        { type: 'SALES_ORDER', prefix: 'SO' },
        { type: 'PURCHASE_ORDER', prefix: 'PO' },
        { type: 'CUSTOMER', prefix: 'CUST' },
        { type: 'SUPPLIER', prefix: 'SUPP' },
        { type: 'PRODUCT', prefix: 'PRD' },
        { type: 'QUOTATION', prefix: 'QTN' },
      ];

      for (const seq of sequences) {
        await queryRunner.query(`
          INSERT INTO sequence_numbers (id, sequence_type, prefix, current_number, padding_length)
          VALUES (UUID(), '${seq.type}', '${seq.prefix}', 0, 6)
        `);
      }

      // Seed roles
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

      // Seed permissions
      const permissions = [
        // Dashboard
        { code: 'dashboard.view', name: 'View Dashboard', module: 'dashboard' },
        {
          code: 'dashboard.analytics',
          name: 'View Analytics',
          module: 'dashboard',
        },

        // Users
        { code: 'users.read', name: 'View Users', module: 'users' },
        { code: 'users.create', name: 'Create Users', module: 'users' },
        { code: 'users.update', name: 'Update Users', module: 'users' },
        { code: 'users.delete', name: 'Delete Users', module: 'users' },

        // Roles
        { code: 'roles.read', name: 'View Roles', module: 'roles' },
        { code: 'roles.create', name: 'Create Roles', module: 'roles' },
        { code: 'roles.update', name: 'Update Roles', module: 'roles' },
        { code: 'roles.delete', name: 'Delete Roles', module: 'roles' },
        { code: 'roles.assign', name: 'Assign Roles', module: 'roles' },

        // Products
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

        // Brands
        { code: 'brands.read', name: 'View Brands', module: 'brands' },
        { code: 'brands.create', name: 'Create Brands', module: 'brands' },
        { code: 'brands.update', name: 'Update Brands', module: 'brands' },
        { code: 'brands.delete', name: 'Delete Brands', module: 'brands' },

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

        // Customer Groups
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

        // Sales Returns
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

        // Quotations
        {
          code: 'quotations.read',
          name: 'View Quotations',
          module: 'quotations',
        },
        {
          code: 'quotations.create',
          name: 'Create Quotations',
          module: 'quotations',
        },
        {
          code: 'quotations.update',
          name: 'Update Quotations',
          module: 'quotations',
        },
        {
          code: 'quotations.delete',
          name: 'Delete Quotations',
          module: 'quotations',
        },
        {
          code: 'quotations.send',
          name: 'Send Quotations',
          module: 'quotations',
        },
        {
          code: 'quotations.convert',
          name: 'Convert Quotations',
          module: 'quotations',
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

        // GRN
        { code: 'grn.read', name: 'View GRN', module: 'grn' },
        { code: 'grn.create', name: 'Create GRN', module: 'grn' },
        { code: 'grn.update', name: 'Update GRN', module: 'grn' },
        { code: 'grn.approve', name: 'Approve GRN', module: 'grn' },

        // Purchase Returns
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
        {
          code: 'inventory.count',
          name: 'Count Inventory',
          module: 'inventory',
        },

        // Stock Adjustments
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

        // Stock Transfers
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

        // Warehouse Locations
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

        // Price Lists
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

        // Tax
        { code: 'tax.read', name: 'View Tax Settings', module: 'tax' },
        { code: 'tax.create', name: 'Create Tax Rates', module: 'tax' },
        { code: 'tax.update', name: 'Update Tax Rates', module: 'tax' },
        { code: 'tax.delete', name: 'Delete Tax Rates', module: 'tax' },

        // Payments
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

        // Reports
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

        // Settings
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

        // Audit Logs
        {
          code: 'audit_logs.read',
          name: 'View Audit Logs',
          module: 'audit_logs',
        },
      ];

      // Insert all permissions
      for (const perm of permissions) {
        await queryRunner.query(`
          INSERT INTO permissions (id, permission_code, permission_name, module, description)
          VALUES ('${this.generateUUID()}', '${perm.code}', '${perm.name}', '${perm.module}', '${perm.name}')
        `);
      }

      this.logger.log(`Seeded ${permissions.length} permissions`);

      // Assign all permissions to Admin role
      const allPermissions = await queryRunner.query(
        `SELECT id FROM permissions`,
      );
      for (const perm of allPermissions) {
        await queryRunner.query(`
          INSERT INTO role_permissions (id, role_id, permission_id)
          VALUES ('${this.generateUUID()}', '${adminRoleId}', '${perm.id}')
        `);
      }

      this.logger.log('Assigned all permissions to Admin role');

      // Assign specific permissions to Manager role
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
        'quotations.read',
        'quotations.create',
        'quotations.update',
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
        const perm = await queryRunner.query(
          `SELECT id FROM permissions WHERE permission_code = '${permCode}'`,
        );
        if (perm.length > 0) {
          await queryRunner.query(`
            INSERT INTO role_permissions (id, role_id, permission_id)
            VALUES ('${this.generateUUID()}', '${managerRoleId}', '${perm[0].id}')
          `);
        }
      }

      // Assign specific permissions to Sales role
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
        'quotations.read',
        'quotations.create',
        'quotations.update',
        'quotations.send',
        'inventory.read',
        'payments.read',
        'payments.create',
        'reports.sales',
      ];

      for (const permCode of salesPermissions) {
        const perm = await queryRunner.query(
          `SELECT id FROM permissions WHERE permission_code = '${permCode}'`,
        );
        if (perm.length > 0) {
          await queryRunner.query(`
            INSERT INTO role_permissions (id, role_id, permission_id)
            VALUES ('${this.generateUUID()}', '${salesRoleId}', '${perm[0].id}')
          `);
        }
      }

      // Assign specific permissions to Purchase role
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
        const perm = await queryRunner.query(
          `SELECT id FROM permissions WHERE permission_code = '${permCode}'`,
        );
        if (perm.length > 0) {
          await queryRunner.query(`
            INSERT INTO role_permissions (id, role_id, permission_id)
            VALUES ('${this.generateUUID()}', '${purchaseRoleId}', '${perm[0].id}')
          `);
        }
      }

      // Assign specific permissions to Warehouse role
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
        const perm = await queryRunner.query(
          `SELECT id FROM permissions WHERE permission_code = '${permCode}'`,
        );
        if (perm.length > 0) {
          await queryRunner.query(`
            INSERT INTO role_permissions (id, role_id, permission_id)
            VALUES ('${this.generateUUID()}', '${warehouseRoleId}', '${perm[0].id}')
          `);
        }
      }

      this.logger.log('Assigned permissions to all roles');

      // Seed UOMs
      await queryRunner.query(`
        INSERT INTO units_of_measure (id, uom_code, uom_name, uom_type, symbol, decimal_places, is_active)
        VALUES
          (UUID(), 'PCS', 'Pieces', 'COUNT', 'pcs', 0, 1),
          (UUID(), 'BOX', 'Box', 'PACK', 'box', 0, 1),
          (UUID(), 'KG', 'Kilogram', 'WEIGHT', 'kg', 3, 1),
          (UUID(), 'GM', 'Gram', 'WEIGHT', 'g', 0, 1),
          (UUID(), 'LTR', 'Litre', 'VOLUME', 'L', 3, 1)
      `);

      // Seed tax categories
      await queryRunner.query(`
        INSERT INTO tax_categories (id, tax_code, tax_name, description, is_active)
        VALUES
          (UUID(), 'GST', 'Goods and Services Tax', 'Standard GST', 1),
          (UUID(), 'EXEMPT', 'Tax Exempt', 'Exempt from tax', 1)
      `);

      // Seed payment methods
      await queryRunner.query(`
        INSERT INTO payment_methods (id, method_code, method_name, method_type, is_active, sort_order)
        VALUES
          (UUID(), 'CASH', 'Cash', 'CASH', 1, 1),
          (UUID(), 'CARD', 'Card', 'CARD', 1, 2),
          (UUID(), 'UPI', 'UPI', 'UPI', 1, 3),
          (UUID(), 'BANK', 'Bank Transfer', 'BANK_TRANSFER', 1, 4)
      `);

      this.logger.log('Tenant seed data inserted successfully');
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Drop a tenant database (use with caution!)
   */
  async dropTenantDatabase(databaseName: string): Promise<void> {
    this.logger.warn(`Dropping tenant database: ${databaseName}`);

    const queryRunner = this.masterDataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.query(`DROP DATABASE IF EXISTS \`${databaseName}\``);
      this.logger.log(`Database ${databaseName} dropped successfully`);
    } catch (error: any) {
      this.logger.error(`Failed to drop database ${databaseName}:`, error);
      throw new InternalServerErrorException(
        `Failed to drop tenant database: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Full tenant provisioning (create DB + tables + seed data)
   */
  async provisionTenant(databaseName: string): Promise<void> {
    this.logger.log(`Starting full provisioning for: ${databaseName}`);

    // Step 1: Create the database
    await this.createTenantDatabase(databaseName);

    // Step 2: Run migrations and seed data
    await this.runTenantMigrations(databaseName);

    this.logger.log(`Tenant ${databaseName} provisioned successfully`);
  }
}
