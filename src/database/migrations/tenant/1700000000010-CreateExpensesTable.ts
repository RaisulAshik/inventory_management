import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateExpensesTable1700000000010 implements MigrationInterface {
  name = 'CreateExpensesTable1700000000010';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`expenses\` (
        \`id\`                  VARCHAR(36)      NOT NULL,
        \`expense_number\`      VARCHAR(50)      NOT NULL UNIQUE,
        \`expense_date\`        DATE             NOT NULL,
        \`expense_account_id\`  VARCHAR(36)      NOT NULL,
        \`paid_from_account_id\` VARCHAR(36)     NOT NULL,
        \`amount\`              DECIMAL(18,4)    NOT NULL,
        \`tax_amount\`          DECIMAL(18,4)    NOT NULL DEFAULT 0,
        \`total_amount\`        DECIMAL(18,4)    NOT NULL,
        \`description\`         TEXT             NOT NULL,
        \`reference_number\`    VARCHAR(100)     NULL,
        \`notes\`               TEXT             NULL,
        \`status\`              ENUM('POSTED','CANCELLED') NOT NULL DEFAULT 'POSTED',
        \`journal_entry_id\`    VARCHAR(36)      NULL,
        \`created_by\`          VARCHAR(36)      NOT NULL,
        \`created_at\`          DATETIME(6)      NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\`          DATETIME(6)      NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`IDX_expenses_date\` (\`expense_date\`),
        INDEX \`IDX_expenses_status\` (\`status\`),
        CONSTRAINT \`FK_expenses_expense_account\`
          FOREIGN KEY (\`expense_account_id\`) REFERENCES \`chart_of_accounts\`(\`id\`),
        CONSTRAINT \`FK_expenses_paid_from_account\`
          FOREIGN KEY (\`paid_from_account_id\`) REFERENCES \`chart_of_accounts\`(\`id\`),
        CONSTRAINT \`FK_expenses_journal_entry\`
          FOREIGN KEY (\`journal_entry_id\`) REFERENCES \`journal_entries\`(\`id\`) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS \`expenses\``);
  }
}
