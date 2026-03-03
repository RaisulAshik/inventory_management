import { MasterDataSource, TenantDataSource } from './data-source';

async function runMigrations() {
  const args = process.argv.slice(2);
  const target = args[0] || 'all';
  const action = args[1] || 'run';

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

    if (target === 'tenant' || target === 'all') {
      console.log('\n🔄 Running Tenant Database Migrations...');
      console.log(`   Database: ${TenantDataSource.options.database}`);

      await TenantDataSource.initialize();

      if (action === 'run') {
        const migrations = await TenantDataSource.runMigrations();
        console.log(`✅ Tenant: ${migrations.length} migration(s) executed`);
        migrations.forEach((m) => console.log(`   - ${m.name}`));
      } else if (action === 'revert') {
        await TenantDataSource.undoLastMigration();
        console.log('✅ Tenant: Last migration reverted');
      } else if (action === 'show') {
        const migrations = await TenantDataSource.showMigrations();
        console.log(`📋 Tenant migrations pending: ${migrations}`);
      }

      await TenantDataSource.destroy();
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
