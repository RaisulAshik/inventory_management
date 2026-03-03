"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePurchaseTables1700000000007 = void 0;
class CreatePurchaseTables1700000000007 {
    name = 'CreatePurchaseTables1700000000007';
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE \`purchase_orders\` (
        \`id\` CHAR(36) NOT NULL,
        \`po_number\` VARCHAR(50) NOT NULL,
        \`supplier_id\` CHAR(36) NOT NULL,
        \`warehouse_id\` CHAR(36) NOT NULL,
        \`order_date\` DATE NOT NULL,
        \`expected_delivery_date\` DATE NULL,
        \`status\` ENUM('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'SENT', 'ACKNOWLEDGED', 'PARTIALLY_RECEIVED', 'RECEIVED', 'COMPLETED', 'CANCELLED', 'CLOSED') DEFAULT 'DRAFT',
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
        \`payment_status\` ENUM('PENDING', 'PARTIAL', 'PAID') DEFAULT 'PENDING',
        \`payment_term_id\` CHAR(36) NULL,
        \`payment_terms_days\` INT NULL,
        \`supplier_reference\` VARCHAR(100) NULL,
        \`supplier_acknowledgement_number\` VARCHAR(100) NULL,
        \`supplier_acknowledged_at\` DATETIME NULL,
        \`notes\` TEXT NULL,
        \`internal_notes\` TEXT NULL,
        \`terms_and_conditions\` TEXT NULL,
        \`approved_by\` CHAR(36) NULL,
        \`approved_at\` DATETIME NULL,
        \`sent_at\` DATETIME NULL,
        \`sent_by\` CHAR(36) NULL,
        \`cancelled_at\` DATETIME NULL,
        \`cancellation_reason\` VARCHAR(500) NULL,
        \`closed_at\` DATETIME NULL,
        \`closed_by\` CHAR(36) NULL,
        \`created_by\` CHAR(36) NULL,
        \`updated_by\` CHAR(36) NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_po_number\` (\`po_number\`),
        INDEX \`idx_po_supplier\` (\`supplier_id\`),
        INDEX \`idx_po_warehouse\` (\`warehouse_id\`),
        INDEX \`idx_po_status\` (\`status\`),
        INDEX \`idx_po_date\` (\`order_date\`),
        CONSTRAINT \`fk_po_supplier\` FOREIGN KEY (\`supplier_id\`) 
          REFERENCES \`suppliers\` (\`id\`) ON UPDATE CASCADE,
        CONSTRAINT \`fk_po_warehouse\` FOREIGN KEY (\`warehouse_id\`) 
          REFERENCES \`warehouses\` (\`id\`) ON UPDATE CASCADE,
        CONSTRAINT \`fk_po_payment_term\` FOREIGN KEY (\`payment_term_id\`) 
          REFERENCES \`payment_terms\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`purchase_order_items\` (
        \`id\` CHAR(36) NOT NULL,
        \`purchase_order_id\` CHAR(36) NOT NULL,
        \`product_id\` CHAR(36) NOT NULL,
        \`variant_id\` CHAR(36) NULL,
        \`product_name\` VARCHAR(300) NOT NULL,
        \`sku\` VARCHAR(100) NOT NULL,
        \`supplier_sku\` VARCHAR(100) NULL,
        \`quantity\` DECIMAL(15, 4) NOT NULL,
        \`received_quantity\` DECIMAL(15, 4) DEFAULT 0,
        \`pending_quantity\` DECIMAL(15, 4) NOT NULL,
        \`uom_id\` CHAR(36) NULL,
        \`unit_price\` DECIMAL(15, 4) NOT NULL,
        \`discount_percentage\` DECIMAL(8, 4) DEFAULT 0,
        \`discount_amount\` DECIMAL(15, 4) DEFAULT 0,
        \`tax_percentage\` DECIMAL(8, 4) DEFAULT 0,
        \`tax_amount\` DECIMAL(15, 4) DEFAULT 0,
        \`line_total\` DECIMAL(15, 4) NOT NULL,
        \`expected_date\` DATE NULL,
        \`notes\` TEXT NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`idx_po_item_order\` (\`purchase_order_id\`),
        INDEX \`idx_po_item_product\` (\`product_id\`),
        CONSTRAINT \`fk_po_item_order\` FOREIGN KEY (\`purchase_order_id\`) 
          REFERENCES \`purchase_orders\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`fk_po_item_product\` FOREIGN KEY (\`product_id\`) 
          REFERENCES \`products\` (\`id\`) ON UPDATE CASCADE,
        CONSTRAINT \`fk_po_item_variant\` FOREIGN KEY (\`variant_id\`) 
          REFERENCES \`product_variants\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT \`fk_po_item_uom\` FOREIGN KEY (\`uom_id\`) 
          REFERENCES \`units_of_measure\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`goods_receipt_notes\` (
        \`id\` CHAR(36) NOT NULL,
        \`grn_number\` VARCHAR(50) NOT NULL,
        \`purchase_order_id\` CHAR(36) NOT NULL,
        \`supplier_id\` CHAR(36) NOT NULL,
        \`warehouse_id\` CHAR(36) NOT NULL,
        \`receipt_date\` DATE NOT NULL,
        \`status\` ENUM('DRAFT', 'PENDING_QC', 'QC_COMPLETED', 'APPROVED', 'CANCELLED') DEFAULT 'DRAFT',
        \`supplier_invoice_number\` VARCHAR(100) NULL,
        \`supplier_invoice_date\` DATE NULL,
        \`currency\` CHAR(3) DEFAULT 'INR',
        \`subtotal\` DECIMAL(15, 4) DEFAULT 0,
        \`tax_amount\` DECIMAL(15, 4) DEFAULT 0,
        \`total_amount\` DECIMAL(15, 4) DEFAULT 0,
        \`notes\` TEXT NULL,
        \`qc_notes\` TEXT NULL,
        \`qc_completed_by\` CHAR(36) NULL,
        \`qc_completed_at\` DATETIME NULL,
        \`approved_by\` CHAR(36) NULL,
        \`approved_at\` DATETIME NULL,
        \`cancelled_at\` DATETIME NULL,
        \`cancellation_reason\` VARCHAR(500) NULL,
        \`created_by\` CHAR(36) NULL,
        \`updated_by\` CHAR(36) NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_grn_number\` (\`grn_number\`),
        INDEX \`idx_grn_po\` (\`purchase_order_id\`),
        INDEX \`idx_grn_supplier\` (\`supplier_id\`),
        INDEX \`idx_grn_warehouse\` (\`warehouse_id\`),
        INDEX \`idx_grn_status\` (\`status\`),
        INDEX \`idx_grn_date\` (\`receipt_date\`),
        CONSTRAINT \`fk_grn_po\` FOREIGN KEY (\`purchase_order_id\`) 
          REFERENCES \`purchase_orders\` (\`id\`) ON UPDATE CASCADE,
        CONSTRAINT \`fk_grn_supplier\` FOREIGN KEY (\`supplier_id\`) 
          REFERENCES \`suppliers\` (\`id\`) ON UPDATE CASCADE,
        CONSTRAINT \`fk_grn_warehouse\` FOREIGN KEY (\`warehouse_id\`) 
          REFERENCES \`warehouses\` (\`id\`) ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`grn_items\` (
        \`id\` CHAR(36) NOT NULL,
        \`grn_id\` CHAR(36) NOT NULL,
        \`po_item_id\` CHAR(36) NULL,
        \`product_id\` CHAR(36) NOT NULL,
        \`variant_id\` CHAR(36) NULL,
        \`received_quantity\` DECIMAL(15, 4) NOT NULL,
        \`accepted_quantity\` DECIMAL(15, 4) NOT NULL,
        \`rejected_quantity\` DECIMAL(15, 4) DEFAULT 0,
        \`uom_id\` CHAR(36) NULL,
        \`unit_price\` DECIMAL(15, 4) NOT NULL,
        \`tax_amount\` DECIMAL(15, 4) DEFAULT 0,
        \`line_total\` DECIMAL(15, 4) NOT NULL,
        \`batch_number\` VARCHAR(100) NULL,
        \`lot_number\` VARCHAR(100) NULL,
        \`manufacturing_date\` DATE NULL,
        \`expiry_date\` DATE NULL,
        \`location_id\` CHAR(36) NULL,
        \`rejection_reason\` VARCHAR(500) NULL,
        \`qc_status\` ENUM('PENDING', 'PASSED', 'FAILED', 'PARTIAL') DEFAULT 'PENDING',
        \`notes\` TEXT NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`idx_grn_item_grn\` (\`grn_id\`),
        INDEX \`idx_grn_item_product\` (\`product_id\`),
        CONSTRAINT \`fk_grn_item_grn\` FOREIGN KEY (\`grn_id\`) 
          REFERENCES \`goods_receipt_notes\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`fk_grn_item_product\` FOREIGN KEY (\`product_id\`) 
          REFERENCES \`products\` (\`id\`) ON UPDATE CASCADE,
        CONSTRAINT \`fk_grn_item_location\` FOREIGN KEY (\`location_id\`) 
          REFERENCES \`warehouse_locations\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`purchase_returns\` (
        \`id\` CHAR(36) NOT NULL,
        \`return_number\` VARCHAR(50) NOT NULL,
        \`purchase_order_id\` CHAR(36) NULL,
        \`grn_id\` CHAR(36) NULL,
        \`supplier_id\` CHAR(36) NOT NULL,
        \`warehouse_id\` CHAR(36) NOT NULL,
        \`return_date\` DATE NOT NULL,
        \`status\` ENUM('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'SHIPPED', 'RECEIVED_BY_SUPPLIER', 'CREDIT_NOTE_RECEIVED', 'COMPLETED', 'CANCELLED') DEFAULT 'DRAFT',
        \`return_type\` ENUM('DAMAGED', 'DEFECTIVE', 'WRONG_ITEM', 'QUALITY_ISSUE', 'EXCESS_QUANTITY', 'OTHER') DEFAULT 'QUALITY_ISSUE',
        \`reason\` VARCHAR(500) NOT NULL,
        \`reason_details\` TEXT NULL,
        \`currency\` CHAR(3) DEFAULT 'INR',
        \`subtotal\` DECIMAL(15, 4) DEFAULT 0,
        \`tax_amount\` DECIMAL(15, 4) DEFAULT 0,
        \`total_amount\` DECIMAL(15, 4) DEFAULT 0,
        \`tracking_number\` VARCHAR(200) NULL,
        \`credit_note_number\` VARCHAR(100) NULL,
        \`credit_note_amount\` DECIMAL(15, 4) NULL,
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
        UNIQUE KEY \`uk_purchase_return_number\` (\`return_number\`),
        INDEX \`idx_purchase_return_supplier\` (\`supplier_id\`),
        INDEX \`idx_purchase_return_status\` (\`status\`),
        INDEX \`idx_purchase_return_date\` (\`return_date\`),
        CONSTRAINT \`fk_purchase_return_po\` FOREIGN KEY (\`purchase_order_id\`) 
          REFERENCES \`purchase_orders\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT \`fk_purchase_return_grn\` FOREIGN KEY (\`grn_id\`) 
          REFERENCES \`goods_receipt_notes\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT \`fk_purchase_return_supplier\` FOREIGN KEY (\`supplier_id\`) 
          REFERENCES \`suppliers\` (\`id\`) ON UPDATE CASCADE,
        CONSTRAINT \`fk_purchase_return_warehouse\` FOREIGN KEY (\`warehouse_id\`) 
          REFERENCES \`warehouses\` (\`id\`) ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`purchase_return_items\` (
        \`id\` CHAR(36) NOT NULL,
        \`purchase_return_id\` CHAR(36) NOT NULL,
        \`product_id\` CHAR(36) NOT NULL,
        \`variant_id\` CHAR(36) NULL,
        \`quantity\` DECIMAL(15, 4) NOT NULL,
        \`uom_id\` CHAR(36) NULL,
        \`unit_price\` DECIMAL(15, 4) NOT NULL,
        \`tax_amount\` DECIMAL(15, 4) DEFAULT 0,
        \`line_total\` DECIMAL(15, 4) NOT NULL,
        \`reason\` VARCHAR(500) NULL,
        \`condition\` ENUM('DAMAGED', 'DEFECTIVE', 'EXPIRED', 'WRONG_ITEM', 'OTHER') DEFAULT 'DEFECTIVE',
        \`batch_id\` CHAR(36) NULL,
        \`notes\` TEXT NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`idx_purchase_return_item_return\` (\`purchase_return_id\`),
        INDEX \`idx_purchase_return_item_product\` (\`product_id\`),
        CONSTRAINT \`fk_purchase_return_item_return\` FOREIGN KEY (\`purchase_return_id\`) 
          REFERENCES \`purchase_returns\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`fk_purchase_return_item_product\` FOREIGN KEY (\`product_id\`) 
          REFERENCES \`products\` (\`id\`) ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS \`purchase_return_items\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`purchase_returns\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`grn_items\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`goods_receipt_notes\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`purchase_order_items\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`purchase_orders\``);
    }
}
exports.CreatePurchaseTables1700000000007 = CreatePurchaseTables1700000000007;
//# sourceMappingURL=1700000000007-CreatePurchaseTables.js.map