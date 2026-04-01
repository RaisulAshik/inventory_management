import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductsFulltextIndex1700000000009 implements MigrationInterface {
  name = 'AddProductsFulltextIndex1700000000009';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const [result] = await queryRunner.query(
      `SELECT COUNT(*) as cnt FROM information_schema.STATISTICS
       WHERE table_schema = DATABASE()
         AND table_name = 'products'
         AND index_name = 'IDX_PRODUCTS_FULLTEXT'`,
    );
    if (Number(result.cnt) === 0) {
      await queryRunner.query(
        `ALTER TABLE \`products\` ADD FULLTEXT INDEX \`IDX_PRODUCTS_FULLTEXT\` (\`sku\`, \`product_name\`, \`barcode\`)`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`products\` DROP INDEX \`IDX_PRODUCTS_FULLTEXT\``,
    );
  }
}
