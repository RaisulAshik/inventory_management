import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePaymentTermsTable1700000000011 implements MigrationInterface {
  name = 'CreatePaymentTermsTable1700000000011';

  public async up(queryRunner: QueryRunner): Promise<void> {
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

    // Seed common payment terms if table is empty
    await queryRunner.query(`
      INSERT IGNORE INTO \`payment_terms\` (\`id\`, \`term_code\`, \`term_name\`, \`due_days\`, \`is_active\`)
      VALUES
        (UUID(), 'IMMEDIATE', 'Immediate / Due on Receipt', 0, 1),
        (UUID(), 'NET7',      'Net 7 Days',                 7, 1),
        (UUID(), 'NET15',     'Net 15 Days',               15, 1),
        (UUID(), 'NET30',     'Net 30 Days',               30, 1),
        (UUID(), 'NET45',     'Net 45 Days',               45, 1),
        (UUID(), 'NET60',     'Net 60 Days',               60, 1),
        (UUID(), 'NET90',     'Net 90 Days',               90, 1)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS \`payment_terms\``);
  }
}
