import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as TenantEntities from '@entities/tenant';
import { getMasterDbConfig } from '@database/master-db.config';

/**
 * Builds TypeORM's entity metadata for both databases, without connecting.
 *
 * TypeORM validates every column when a data source initialises. A column it
 * cannot map fails that validation — for example `foo: string | null` with no
 * explicit `type`, which decorator metadata records as `Object` under
 * strictNullChecks. Every tenant request builds its connection from the full
 * tenant entity list, so one such column takes down every tenant endpoint.
 * Unit tests that stub the data source never see it; this does.
 *
 * `reflect-metadata` is imported explicitly: without it TypeORM silently
 * skips type inference and this test would pass on a broken entity.
 */
async function buildMetadata(entities: DataSourceOptions['entities']) {
  // `database` is required by the driver's constructor; nothing connects.
  const dataSource = new DataSource({
    type: 'mysql',
    database: 'metadata_check',
    entities,
  });
  // The step initialize() runs before it connects; it builds and validates
  // the metadata and needs no database.
  await (
    dataSource as unknown as { buildMetadatas(): Promise<void> }
  ).buildMetadatas();
  return dataSource.entityMetadatas;
}

describe('entity metadata', () => {
  it('builds for every tenant entity', async () => {
    // Same list TenantConnectionManager hands to each tenant connection.
    const entities = Object.values(TenantEntities).filter(
      (entity) => typeof entity === 'function',
    );
    const metadata = await buildMetadata(entities);
    expect(metadata.length).toBeGreaterThan(0);
  });

  it('builds for every master entity', async () => {
    const config = getMasterDbConfig({
      get: (_key: string, fallback?: unknown) => fallback,
    } as never) as DataSourceOptions;
    const metadata = await buildMetadata(config.entities);
    expect(metadata.length).toBeGreaterThan(0);
  });
});
