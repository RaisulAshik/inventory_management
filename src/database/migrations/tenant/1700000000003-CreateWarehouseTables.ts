import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWarehouseTables1700000000003 implements MigrationInterface {
  name = 'CreateWarehouseTables1700000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // =====================================================
    // WAREHOUSES TABLE
    // =====================================================
    await queryRunner.query(`
      CREATE TABLE \`warehouses\` (
        \`id\` CHAR(36) NOT NULL,
        \`warehouse_code\` VARCHAR(50) NOT NULL,
        \`warehouse_name\` VARCHAR(200) NOT NULL,
        \`warehouse_type\` ENUM('MAIN', 'DISTRIBUTION', 'RETAIL', 'VIRTUAL', 'TRANSIT', 'QUARANTINE', 'RETURNS') DEFAULT 'MAIN',
        \`address_line1\` VARCHAR(255) NULL,
        \`address_line2\` VARCHAR(255) NULL,
        \`city\` VARCHAR(100) NULL,
        \`state\` VARCHAR(100) NULL,
        \`country\` VARCHAR(100) DEFAULT 'BD',
        \`postal_code\` VARCHAR(20) NULL,
        \`phone\` VARCHAR(50) NULL,
        \`email\` VARCHAR(255) NULL,
        \`manager_id\` CHAR(36) NULL,
        \`is_active\` TINYINT(1) DEFAULT 1,
        \`is_default\` TINYINT(1) DEFAULT 0,
        \`allow_negative_stock\` TINYINT(1) DEFAULT 0,
        \`created_by\` CHAR(36) NULL,
        \`updated_by\` CHAR(36) NULL,
        \`deleted_at\` DATETIME NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_warehouse_code\` (\`warehouse_code\`),
        INDEX \`idx_warehouse_type\` (\`warehouse_type\`),
        INDEX \`idx_warehouse_active\` (\`is_active\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // =====================================================
    // WAREHOUSE ZONES TABLE
    // =====================================================
    await queryRunner.query(`
      CREATE TABLE \`warehouse_zones\` (
        \`id\` CHAR(36) NOT NULL,
        \`warehouse_id\` CHAR(36) NOT NULL,
        \`zone_code\` VARCHAR(50) NOT NULL,
        \`zone_name\` VARCHAR(100) NOT NULL,
        \`zone_type\` ENUM('GENERAL', 'COLD_STORAGE', 'HAZARDOUS', 'HIGH_VALUE', 'BULK', 'PICKING', 'RECEIVING', 'SHIPPING', 'QUARANTINE', 'RETURNS') DEFAULT 'GENERAL',
        \`description\` TEXT NULL,
        \`is_active\` TINYINT(1) DEFAULT 1,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_warehouse_zone\` (\`warehouse_id\`, \`zone_code\`),
        CONSTRAINT \`fk_zone_warehouse\` FOREIGN KEY (\`warehouse_id\`) 
          REFERENCES \`warehouses\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // =====================================================
    // WAREHOUSE LOCATIONS TABLE
    // =====================================================
    await queryRunner.query(`
      CREATE TABLE \`warehouse_locations\` (
        \`id\` CHAR(36) NOT NULL,
        \`warehouse_id\` CHAR(36) NOT NULL,
        \`zone_id\` CHAR(36) NULL,
        \`location_code\` VARCHAR(50) NOT NULL,
        \`location_name\` VARCHAR(100) NULL,
        \`location_type\` ENUM('RECEIVING', 'STORAGE', 'PICKING', 'PACKING', 'SHIPPING', 'STAGING', 'QUALITY_CHECK', 'RETURNS', 'DAMAGE') DEFAULT 'STORAGE',
        \`aisle\` VARCHAR(20) NULL,
        \`rack\` VARCHAR(20) NULL,
        \`shelf\` VARCHAR(20) NULL,
        \`bin\` VARCHAR(20) NULL,
        \`max_weight\` DECIMAL(10, 2) NULL,
        \`max_volume\` DECIMAL(10, 2) NULL,
        \`max_items\` INT NULL,
        \`status\` ENUM('AVAILABLE', 'OCCUPIED', 'RESERVED', 'BLOCKED', 'MAINTENANCE') DEFAULT 'AVAILABLE',
        \`is_active\` TINYINT(1) DEFAULT 1,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_warehouse_location\` (\`warehouse_id\`, \`location_code\`),
        INDEX \`idx_location_zone\` (\`zone_id\`),
        INDEX \`idx_location_type\` (\`location_type\`),
        INDEX \`idx_location_status\` (\`status\`),
        CONSTRAINT \`fk_location_warehouse\` FOREIGN KEY (\`warehouse_id\`) 
          REFERENCES \`warehouses\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`fk_location_zone\` FOREIGN KEY (\`zone_id\`) 
          REFERENCES \`warehouse_zones\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // =====================================================
    // INVENTORY STOCK TABLE
    // =====================================================
    await queryRunner.query(`
      CREATE TABLE \`inventory_stock\` (
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
        \`last_count_date\` DATETIME NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_stock_product_warehouse\` (\`product_id\`, \`warehouse_id\`, \`variant_id\`, \`location_id\`),
        INDEX \`idx_stock_warehouse\` (\`warehouse_id\`),
        INDEX \`idx_stock_location\` (\`location_id\`),
        CONSTRAINT \`fk_stock_product\` FOREIGN KEY (\`product_id\`) 
          REFERENCES \`products\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`fk_stock_variant\` FOREIGN KEY (\`variant_id\`) 
          REFERENCES \`product_variants\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`fk_stock_warehouse\` FOREIGN KEY (\`warehouse_id\`) 
          REFERENCES \`warehouses\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`fk_stock_location\` FOREIGN KEY (\`location_id\`) 
          REFERENCES \`warehouse_locations\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // =====================================================
    // INVENTORY BATCHES TABLE
    // =====================================================
    await queryRunner.query(`
      CREATE TABLE \`inventory_batches\` (
        \`id\` CHAR(36) NOT NULL,
        \`product_id\` CHAR(36) NOT NULL,
        \`variant_id\` CHAR(36) NULL,
        \`warehouse_id\` CHAR(36) NOT NULL,
        \`location_id\` CHAR(36) NULL,
        \`batch_number\` VARCHAR(100) NOT NULL,
        \`lot_number\` VARCHAR(100) NULL,
        \`manufacturing_date\` DATE NULL,
        \`expiry_date\` DATE NULL,
        \`initial_quantity\` DECIMAL(15, 4) NOT NULL,
        \`current_quantity\` DECIMAL(15, 4) NOT NULL,
        \`reserved_quantity\` DECIMAL(15, 4) DEFAULT 0,
        \`cost_price\` DECIMAL(15, 4) NULL,
        \`supplier_id\` CHAR(36) NULL,
        \`grn_id\` CHAR(36) NULL,
        \`status\` ENUM('ACTIVE', 'QUARANTINE', 'EXPIRED', 'DEPLETED', 'RECALLED') DEFAULT 'ACTIVE',
        \`notes\` TEXT NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`idx_batch_product\` (\`product_id\`),
        INDEX \`idx_batch_warehouse\` (\`warehouse_id\`),
        INDEX \`idx_batch_number\` (\`batch_number\`),
        INDEX \`idx_batch_expiry\` (\`expiry_date\`),
        INDEX \`idx_batch_status\` (\`status\`),
        CONSTRAINT \`fk_batch_product\` FOREIGN KEY (\`product_id\`) 
          REFERENCES \`products\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`fk_batch_warehouse\` FOREIGN KEY (\`warehouse_id\`) 
          REFERENCES \`warehouses\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // =====================================================
    // INVENTORY SERIALS TABLE
    // =====================================================
    await queryRunner.query(`
      CREATE TABLE \`inventory_serials\` (
        \`id\` CHAR(36) NOT NULL,
        \`product_id\` CHAR(36) NOT NULL,
        \`variant_id\` CHAR(36) NULL,
        \`warehouse_id\` CHAR(36) NOT NULL,
        \`location_id\` CHAR(36) NULL,
        \`batch_id\` CHAR(36) NULL,
        \`serial_number\` VARCHAR(100) NOT NULL,
        \`status\` ENUM('AVAILABLE', 'RESERVED', 'SOLD', 'RETURNED', 'DAMAGED', 'IN_TRANSIT') DEFAULT 'AVAILABLE',
        \`cost_price\` DECIMAL(15, 4) NULL,
        \`supplier_id\` CHAR(36) NULL,
        \`grn_id\` CHAR(36) NULL,
        \`sales_order_id\` CHAR(36) NULL,
        \`warranty_start_date\` DATE NULL,
        \`warranty_end_date\` DATE NULL,
        \`notes\` TEXT NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_serial_number\` (\`serial_number\`),
        INDEX \`idx_serial_product\` (\`product_id\`),
        INDEX \`idx_serial_warehouse\` (\`warehouse_id\`),
        INDEX \`idx_serial_status\` (\`status\`),
        CONSTRAINT \`fk_serial_product\` FOREIGN KEY (\`product_id\`) 
          REFERENCES \`products\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`fk_serial_warehouse\` FOREIGN KEY (\`warehouse_id\`) 
          REFERENCES \`warehouses\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // =====================================================
    // STOCK MOVEMENTS TABLE
    // =====================================================
    await queryRunner.query(`
      CREATE TABLE \`stock_movements\` (
        \`id\` CHAR(36) NOT NULL,
        \`movement_number\` VARCHAR(50) NOT NULL,
        \`movement_type\` ENUM('PURCHASE_RECEIPT', 'PURCHASE_RETURN', 'SALES', 'SALES_RETURN', 'TRANSFER_IN', 'TRANSFER_OUT', 'ADJUSTMENT_IN', 'ADJUSTMENT_OUT', 'PRODUCTION_CONSUMPTION', 'PRODUCTION_OUTPUT', 'WRITE_OFF', 'DAMAGE', 'OPENING_STOCK') NOT NULL,
        \`movement_date\` DATETIME NOT NULL,
        \`product_id\` CHAR(36) NOT NULL,
        \`variant_id\` CHAR(36) NULL,
        \`from_warehouse_id\` CHAR(36) NULL,
        \`to_warehouse_id\` CHAR(36) NULL,
        \`from_location_id\` CHAR(36) NULL,
        \`to_location_id\` CHAR(36) NULL,
        \`batch_id\` CHAR(36) NULL,
        \`serial_id\` CHAR(36) NULL,
        \`quantity\` DECIMAL(15, 4) NOT NULL,
        \`uom_id\` CHAR(36) NULL,
        \`unit_cost\` DECIMAL(15, 4) NULL,
        \`total_cost\` DECIMAL(15, 4) NULL,
        \`reference_type\` VARCHAR(50) NULL,
        \`reference_id\` CHAR(36) NULL,
        \`reference_number\` VARCHAR(100) NULL,
        \`notes\` TEXT NULL,
        \`created_by\` CHAR(36) NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_movement_number\` (\`movement_number\`),
        INDEX \`idx_movement_type\` (\`movement_type\`),
        INDEX \`idx_movement_date\` (\`movement_date\`),
        INDEX \`idx_movement_product\` (\`product_id\`),
        INDEX \`idx_movement_reference\` (\`reference_type\`, \`reference_id\`),
        CONSTRAINT \`fk_movement_product\` FOREIGN KEY (\`product_id\`) 
          REFERENCES \`products\` (\`id\`) ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // =====================================================
    // STOCK RESERVATIONS TABLE
    // =====================================================
    await queryRunner.query(`
      CREATE TABLE \`stock_reservations\` (
        \`id\` CHAR(36) NOT NULL,
        \`product_id\` CHAR(36) NOT NULL,
        \`variant_id\` CHAR(36) NULL,
        \`warehouse_id\` CHAR(36) NOT NULL,
        \`location_id\` CHAR(36) NULL,
        \`batch_id\` CHAR(36) NULL,
        \`quantity\` DECIMAL(15, 4) NOT NULL,
        \`reference_type\` VARCHAR(50) NOT NULL,
        \`reference_id\` CHAR(36) NOT NULL,
        \`reserved_at\` DATETIME NOT NULL,
        \`expires_at\` DATETIME NULL,
        \`released_at\` DATETIME NULL,
        \`status\` ENUM('ACTIVE', 'RELEASED', 'EXPIRED', 'FULFILLED') DEFAULT 'ACTIVE',
        \`created_by\` CHAR(36) NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`idx_reservation_product\` (\`product_id\`),
        INDEX \`idx_reservation_warehouse\` (\`warehouse_id\`),
        INDEX \`idx_reservation_reference\` (\`reference_type\`, \`reference_id\`),
        INDEX \`idx_reservation_status\` (\`status\`),
        CONSTRAINT \`fk_reservation_product\` FOREIGN KEY (\`product_id\`) 
          REFERENCES \`products\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`fk_reservation_warehouse\` FOREIGN KEY (\`warehouse_id\`) 
          REFERENCES \`warehouses\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // =====================================================
    // STOCK TRANSFERS TABLE
    // =====================================================
    await queryRunner.query(`
      CREATE TABLE \`stock_transfers\` (
        \`id\` CHAR(36) NOT NULL,
        \`transfer_number\` VARCHAR(50) NOT NULL,
        \`from_warehouse_id\` CHAR(36) NOT NULL,
        \`to_warehouse_id\` CHAR(36) NOT NULL,
        \`transfer_date\` DATE NOT NULL,
        \`expected_date\` DATE NULL,
        \`received_date\` DATE NULL,
        \`status\` ENUM('DRAFT', 'PENDING', 'APPROVED', 'IN_TRANSIT', 'PARTIALLY_RECEIVED', 'RECEIVED', 'CANCELLED') DEFAULT 'DRAFT',
        \`transfer_reason\` VARCHAR(255) NULL,
        \`notes\` TEXT NULL,
        \`approved_by\` CHAR(36) NULL,
        \`approved_at\` DATETIME NULL,
        \`shipped_by\` CHAR(36) NULL,
        \`shipped_at\` DATETIME NULL,
        \`received_by\` CHAR(36) NULL,
        \`created_by\` CHAR(36) NULL,
        \`updated_by\` CHAR(36) NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_transfer_number\` (\`transfer_number\`),
        INDEX \`idx_transfer_from_warehouse\` (\`from_warehouse_id\`),
        INDEX \`idx_transfer_to_warehouse\` (\`to_warehouse_id\`),
        INDEX \`idx_transfer_status\` (\`status\`),
        INDEX \`idx_transfer_date\` (\`transfer_date\`),
        CONSTRAINT \`fk_transfer_from_warehouse\` FOREIGN KEY (\`from_warehouse_id\`) 
          REFERENCES \`warehouses\` (\`id\`) ON UPDATE CASCADE,
        CONSTRAINT \`fk_transfer_to_warehouse\` FOREIGN KEY (\`to_warehouse_id\`) 
          REFERENCES \`warehouses\` (\`id\`) ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // =====================================================
    // STOCK TRANSFER ITEMS TABLE
    // =====================================================
    await queryRunner.query(`
      CREATE TABLE \`stock_transfer_items\` (
        \`id\` CHAR(36) NOT NULL,
        \`transfer_id\` CHAR(36) NOT NULL,
        \`product_id\` CHAR(36) NOT NULL,
        \`variant_id\` CHAR(36) NULL,
        \`from_location_id\` CHAR(36) NULL,
        \`to_location_id\` CHAR(36) NULL,
        \`batch_id\` CHAR(36) NULL,
        \`requested_quantity\` DECIMAL(15, 4) NOT NULL,
        \`shipped_quantity\` DECIMAL(15, 4) DEFAULT 0,
        \`received_quantity\` DECIMAL(15, 4) DEFAULT 0,
        \`uom_id\` CHAR(36) NULL,
        \`notes\` TEXT NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`idx_transfer_item_transfer\` (\`transfer_id\`),
        INDEX \`idx_transfer_item_product\` (\`product_id\`),
        CONSTRAINT \`fk_transfer_item_transfer\` FOREIGN KEY (\`transfer_id\`) 
          REFERENCES \`stock_transfers\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`fk_transfer_item_product\` FOREIGN KEY (\`product_id\`) 
          REFERENCES \`products\` (\`id\`) ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // =====================================================
    // STOCK ADJUSTMENTS TABLE
    // =====================================================
    await queryRunner.query(`
      CREATE TABLE \`stock_adjustments\` (
        \`id\` CHAR(36) NOT NULL,
        \`adjustment_number\` VARCHAR(50) NOT NULL,
        \`warehouse_id\` CHAR(36) NOT NULL,
        \`adjustment_date\` DATE NOT NULL,
        \`adjustment_type\` ENUM('CYCLE_COUNT', 'PHYSICAL_COUNT', 'DAMAGE', 'WRITE_OFF', 'CORRECTION', 'OPENING_STOCK', 'OTHER') DEFAULT 'CORRECTION',
        \`status\` ENUM('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED') DEFAULT 'DRAFT',
        \`reason\` VARCHAR(500) NULL,
        \`notes\` TEXT NULL,
        \`total_adjustment_value\` DECIMAL(15, 4) DEFAULT 0,
        \`approved_by\` CHAR(36) NULL,
        \`approved_at\` DATETIME NULL,
        \`rejection_reason\` VARCHAR(500) NULL,
        \`created_by\` CHAR(36) NULL,
        \`updated_by\` CHAR(36) NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_adjustment_number\` (\`adjustment_number\`),
        INDEX \`idx_adjustment_warehouse\` (\`warehouse_id\`),
        INDEX \`idx_adjustment_status\` (\`status\`),
        INDEX \`idx_adjustment_date\` (\`adjustment_date\`),
        CONSTRAINT \`fk_adjustment_warehouse\` FOREIGN KEY (\`warehouse_id\`) 
          REFERENCES \`warehouses\` (\`id\`) ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // =====================================================
    // STOCK ADJUSTMENT ITEMS TABLE
    // =====================================================
    await queryRunner.query(`
      CREATE TABLE \`stock_adjustment_items\` (
        \`id\` CHAR(36) NOT NULL,
        \`adjustment_id\` CHAR(36) NOT NULL,
        \`product_id\` CHAR(36) NOT NULL,
        \`variant_id\` CHAR(36) NULL,
        \`location_id\` CHAR(36) NULL,
        \`batch_id\` CHAR(36) NULL,
        \`system_quantity\` DECIMAL(15, 4) NOT NULL,
        \`physical_quantity\` DECIMAL(15, 4) NOT NULL,
        \`adjustment_quantity\` DECIMAL(15, 4) NOT NULL,
        \`uom_id\` CHAR(36) NULL,
        \`unit_cost\` DECIMAL(15, 4) NULL,
        \`adjustment_value\` DECIMAL(15, 4) NULL,
        \`reason\` VARCHAR(500) NULL
        \`reason\` VARCHAR(500) NULL,
        \`notes\` TEXT NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`idx_adjustment_item_adjustment\` (\`adjustment_id\`),
        INDEX \`idx_adjustment_item_product\` (\`product_id\`),
        CONSTRAINT \`fk_adjustment_item_adjustment\` FOREIGN KEY (\`adjustment_id\`) 
          REFERENCES \`stock_adjustments\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`fk_adjustment_item_product\` FOREIGN KEY (\`product_id\`) 
          REFERENCES \`products\` (\`id\`) ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS \`stock_adjustment_items\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`stock_adjustments\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`stock_transfer_items\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`stock_transfers\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`stock_reservations\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`stock_movements\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`inventory_serials\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`inventory_batches\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`inventory_stock\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`warehouse_locations\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`warehouse_zones\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`warehouses\``);
  }
}
