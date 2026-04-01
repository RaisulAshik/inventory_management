import { DataSource } from 'typeorm';
import {
  MasterDataSource,
  TenantDataSource,
  tenantDataSourceOptions,
} from './data-source';

async function runMigrations() {
  const args = process.argv.slice(2);
  const target = args[0] || 'all';
  const action = args[1] || 'run';
  // Optional: pass a specific tenant DB name, e.g. "ts-node run-migrations.ts tenant-db erp_tenant_test1"
  const tenantDb = args[2] || null;

  console.log(`\n📦 ERP Migration Tool`);
  console.log(`Target: ${target}, Action: ${action}\n`);

  try {
    if (target === 'master' || target === 'all') {
      console.log('🔄 Running Master Database Migrations...');
      console.log(`   Database: ${MasterDataSource.options.database}`);

      await MasterDataSource.initialize();

      if (action === 'run') {
        const migrations = await MasterDataSource.runMigrations();
        console.log(`✅ Master: ${migrations.length} migration(s) executed`);
        migrations.forEach((m) => console.log(`   - ${m.name}`));
      } else if (action === 'revert') {
        await MasterDataSource.undoLastMigration();
        console.log('✅ Master: Last migration reverted');
      } else if (action === 'show') {
        const migrations = await MasterDataSource.showMigrations();
        console.log(`📋 Master migrations pending: ${migrations}`);
      }

      await MasterDataSource.destroy();
    }

    if (target === 'tenant' || target === 'tenant-db' || target === 'all') {
      const ds = tenantDb
        ? new DataSource(
            Object.assign({}, tenantDataSourceOptions, {
              database: tenantDb,
            }) as typeof tenantDataSourceOptions,
          )
        : TenantDataSource;

      console.log('\n🔄 Running Tenant Database Migrations...');
      console.log(`   Database: ${ds.options.database}`);

      await ds.initialize();

      if (action === 'run') {
        const migrations = await ds.runMigrations();
        console.log(`✅ Tenant: ${migrations.length} migration(s) executed`);
        migrations.forEach((m) => console.log(`   - ${m.name}`));
      } else if (action === 'revert') {
        await ds.undoLastMigration();
        console.log('✅ Tenant: Last migration reverted');
      } else if (action === 'show') {
        const migrations = await ds.showMigrations();
        console.log(`📋 Tenant migrations pending: ${migrations}`);
      }

      await ds.destroy();
    }

    console.log('\n🎉 Migration process completed!\n');
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Migration failed:', error.message);
    if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n💡 Hint: Make sure the database exists. Create it with:');
      console.log(
        `   CREATE DATABASE ${error.message.includes('erp_master') ? 'erp_master' : 'erp_tenant_template'};`,
      );
    }
    process.exit(1);
  }
}

runMigrations();
