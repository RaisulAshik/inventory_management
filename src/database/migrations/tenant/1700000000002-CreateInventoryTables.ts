import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInventoryTables1700000000002 implements MigrationInterface {
  name = 'CreateInventoryTables1700000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // =====================================================
    // CATEGORIES TABLE
    // =====================================================
    await queryRunner.query(`
      CREATE TABLE \`categories\` (
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
        \`meta_title\` VARCHAR(200) NULL,
        \`meta_description\` VARCHAR(500) NULL,
        \`created_by\` CHAR(36) NULL,
        \`updated_by\` CHAR(36) NULL,
        \`deleted_at\` DATETIME NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_category_code\` (\`category_code\`),
        INDEX \`idx_category_parent\` (\`parent_id\`),
        INDEX \`idx_category_active\` (\`is_active\`),
        CONSTRAINT \`fk_category_parent\` FOREIGN KEY (\`parent_id\`) 
          REFERENCES \`categories\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // =====================================================
    // BRANDS TABLE
    // =====================================================
    await queryRunner.query(`
      CREATE TABLE \`brands\` (
        \`id\` CHAR(36) NOT NULL,
        \`brand_code\` VARCHAR(50) NOT NULL,
        \`brand_name\` VARCHAR(200) NOT NULL,
        \`slug\` VARCHAR(250) NULL,
        \`description\` TEXT NULL,
        \`logo_url\` VARCHAR(500) NULL,
        \`website\` VARCHAR(255) NULL,
        \`is_active\` TINYINT(1) DEFAULT 1,
        \`created_by\` CHAR(36) NULL,
        \`updated_by\` CHAR(36) NULL,
        \`deleted_at\` DATETIME NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_brand_code\` (\`brand_code\`),
        INDEX \`idx_brand_active\` (\`is_active\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // =====================================================
    // UNITS OF MEASURE TABLE
    // =====================================================
    await queryRunner.query(`
      CREATE TABLE \`units_of_measure\` (
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
        \`created_by\` CHAR(36) NULL,
        \`updated_by\` CHAR(36) NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_uom_code\` (\`uom_code\`),
        INDEX \`idx_uom_type\` (\`uom_type\`),
        INDEX \`idx_uom_active\` (\`is_active\`),
        CONSTRAINT \`fk_uom_base\` FOREIGN KEY (\`base_uom_id\`) 
          REFERENCES \`units_of_measure\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // =====================================================
    // UOM CONVERSIONS TABLE
    // =====================================================
    await queryRunner.query(`
      CREATE TABLE \`uom_conversions\` (
        \`id\` CHAR(36) NOT NULL,
        \`from_uom_id\` CHAR(36) NOT NULL,
        \`to_uom_id\` CHAR(36) NOT NULL,
        \`conversion_factor\` DECIMAL(18, 8) NOT NULL,
        \`is_bidirectional\` TINYINT(1) DEFAULT 1,
        \`product_id\` CHAR(36) NULL,
        \`is_active\` TINYINT(1) DEFAULT 1,
        \`description\` VARCHAR(255) NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_uom_conversion\` (\`from_uom_id\`, \`to_uom_id\`),
        CONSTRAINT \`fk_uom_conv_from\` FOREIGN KEY (\`from_uom_id\`) 
          REFERENCES \`units_of_measure\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`fk_uom_conv_to\` FOREIGN KEY (\`to_uom_id\`) 
          REFERENCES \`units_of_measure\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // =====================================================
    // TAX CATEGORIES TABLE
    // =====================================================
    await queryRunner.query(`
      CREATE TABLE \`tax_categories\` (
        \`id\` CHAR(36) NOT NULL,
        \`tax_category_code\` VARCHAR(50) NOT NULL,
        \`tax_category_name\` VARCHAR(100) NOT NULL,
        \`description\` TEXT NULL,
        \`is_active\` TINYINT(1) DEFAULT 1,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_tax_category_code\` (\`tax_category_code\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // =====================================================
    // TAX RATES TABLE
    // =====================================================
    await queryRunner.query(`
      CREATE TABLE \`tax_rates\` (
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
        INDEX \`idx_tax_rate_category\` (\`tax_category_id\`),
        CONSTRAINT \`fk_tax_rate_category\` FOREIGN KEY (\`tax_category_id\`) 
          REFERENCES \`tax_categories\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // =====================================================
    // PRODUCTS TABLE
    // =====================================================
    await queryRunner.query(`
      CREATE TABLE \`products\` (
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
        \`weight_unit\` VARCHAR(20) NULL,
        \`length\` DECIMAL(10, 4) NULL,
        \`width\` DECIMAL(10, 4) NULL,
        \`height\` DECIMAL(10, 4) NULL,
        \`dimension_unit\` VARCHAR(20) NULL,
        \`is_stockable\` TINYINT(1) DEFAULT 1,
        \`is_purchasable\` TINYINT(1) DEFAULT 1,
        \`is_sellable\` TINYINT(1) DEFAULT 1,
        \`track_batch\` TINYINT(1) DEFAULT 0,
        \`track_serial\` TINYINT(1) DEFAULT 0,
        \`has_variants\` TINYINT(1) DEFAULT 0,
        \`reorder_level\` DECIMAL(15, 4) DEFAULT 0,
        \`reorder_quantity\` DECIMAL(15, 4) DEFAULT 0,
        \`max_stock_level\` DECIMAL(15, 4) NULL,
        \`lead_time_days\` INT DEFAULT 0,
        \`shelf_life_days\` INT NULL,
        \`warranty_months\` INT NULL,
        \`image_url\` VARCHAR(500) NULL,
        \`is_active\` TINYINT(1) DEFAULT 1,
        \`is_featured\` TINYINT(1) DEFAULT 0,
        \`meta_title\` VARCHAR(200) NULL,
        \`meta_description\` VARCHAR(500) NULL,
        \`tags\` JSON NULL,
        \`custom_fields\` JSON NULL,
        \`created_by\` CHAR(36) NULL,
        \`updated_by\` CHAR(36) NULL,
        \`deleted_at\` DATETIME NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_product_sku\` (\`sku\`),
        INDEX \`idx_product_category\` (\`category_id\`),
        INDEX \`idx_product_brand\` (\`brand_id\`),
        INDEX \`idx_product_type\` (\`product_type\`),
        INDEX \`idx_product_active\` (\`is_active\`),
        INDEX \`idx_product_barcode\` (\`barcode\`),
        INDEX \`idx_product_hsn\` (\`hsn_code\`),
        CONSTRAINT \`fk_product_category\` FOREIGN KEY (\`category_id\`) 
          REFERENCES \`categories\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT \`fk_product_brand\` FOREIGN KEY (\`brand_id\`) 
          REFERENCES \`brands\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT \`fk_product_base_uom\` FOREIGN KEY (\`base_uom_id\`) 
          REFERENCES \`units_of_measure\` (\`id\`) ON UPDATE CASCADE,
        CONSTRAINT \`fk_product_purchase_uom\` FOREIGN KEY (\`purchase_uom_id\`) 
          REFERENCES \`units_of_measure\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT \`fk_product_sales_uom\` FOREIGN KEY (\`sales_uom_id\`) 
          REFERENCES \`units_of_measure\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT \`fk_product_tax_category\` FOREIGN KEY (\`tax_category_id\`) 
          REFERENCES \`tax_categories\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // =====================================================
    // PRODUCT VARIANTS TABLE
    // =====================================================
    await queryRunner.query(`
      CREATE TABLE \`product_variants\` (
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
        INDEX \`idx_variant_barcode\` (\`barcode\`),
        CONSTRAINT \`fk_variant_product\` FOREIGN KEY (\`product_id\`) 
          REFERENCES \`products\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // =====================================================
    // PRODUCT IMAGES TABLE
    // =====================================================
    await queryRunner.query(`
      CREATE TABLE \`product_images\` (
        \`id\` CHAR(36) NOT NULL,
        \`product_id\` CHAR(36) NOT NULL,
        \`variant_id\` CHAR(36) NULL,
        \`image_url\` VARCHAR(500) NOT NULL,
        \`thumbnail_url\` VARCHAR(500) NULL,
        \`alt_text\` VARCHAR(255) NULL,
        \`is_primary\` TINYINT(1) DEFAULT 0,
        \`display_order\` INT DEFAULT 0,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`idx_product_image_product\` (\`product_id\`),
        CONSTRAINT \`fk_product_image_product\` FOREIGN KEY (\`product_id\`) 
          REFERENCES \`products\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // =====================================================
    // PRODUCT ATTRIBUTES TABLE
    // =====================================================
    await queryRunner.query(`
      CREATE TABLE \`product_attributes\` (
        \`id\` CHAR(36) NOT NULL,
        \`attribute_code\` VARCHAR(50) NOT NULL,
        \`attribute_name\` VARCHAR(100) NOT NULL,
        \`attribute_type\` ENUM('TEXT', 'NUMBER', 'SELECT', 'MULTI_SELECT', 'BOOLEAN', 'DATE') DEFAULT 'TEXT',
        \`is_variant_attribute\` TINYINT(1) DEFAULT 0,
        \`is_filterable\` TINYINT(1) DEFAULT 0,
        \`is_required\` TINYINT(1) DEFAULT 0,
        \`display_order\` INT DEFAULT 0,
        \`is_active\` TINYINT(1) DEFAULT 1,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_attribute_code\` (\`attribute_code\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // =====================================================
    // PRODUCT ATTRIBUTE VALUES TABLE
    // =====================================================
    await queryRunner.query(`
      CREATE TABLE \`product_attribute_values\` (
        \`id\` CHAR(36) NOT NULL,
        \`attribute_id\` CHAR(36) NOT NULL,
        \`value_code\` VARCHAR(50) NOT NULL,
        \`value_label\` VARCHAR(100) NOT NULL,
        \`display_order\` INT DEFAULT 0,
        \`is_active\` TINYINT(1) DEFAULT 1,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_attribute_value\` (\`attribute_id\`, \`value_code\`),
        CONSTRAINT \`fk_attr_value_attribute\` FOREIGN KEY (\`attribute_id\`) 
          REFERENCES \`product_attributes\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TABLE IF EXISTS \`product_attribute_values\``,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS \`product_attributes\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`product_images\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`product_variants\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`products\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`tax_rates\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`tax_categories\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`uom_conversions\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`units_of_measure\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`brands\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`categories\``);
  }
}
