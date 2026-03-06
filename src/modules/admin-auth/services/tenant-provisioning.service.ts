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
