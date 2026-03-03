"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("./data-source");
async function runMigrations() {
    const args = process.argv.slice(2);
    const target = args[0] || 'all';
    const action = args[1] || 'run';
    console.log(`\n📦 ERP Migration Tool`);
    console.log(`Target: ${target}, Action: ${action}\n`);
    try {
        if (target === 'master' || target === 'all') {
            console.log('🔄 Running Master Database Migrations...');
            console.log(`   Database: ${data_source_1.MasterDataSource.options.database}`);
            await data_source_1.MasterDataSource.initialize();
            if (action === 'run') {
                const migrations = await data_source_1.MasterDataSource.runMigrations();
                console.log(`✅ Master: ${migrations.length} migration(s) executed`);
                migrations.forEach((m) => console.log(`   - ${m.name}`));
            }
            else if (action === 'revert') {
                await data_source_1.MasterDataSource.undoLastMigration();
                console.log('✅ Master: Last migration reverted');
            }
            else if (action === 'show') {
                const migrations = await data_source_1.MasterDataSource.showMigrations();
                console.log(`📋 Master migrations pending: ${migrations}`);
            }
            await data_source_1.MasterDataSource.destroy();
        }
        if (target === 'tenant' || target === 'all') {
            console.log('\n🔄 Running Tenant Database Migrations...');
            console.log(`   Database: ${data_source_1.TenantDataSource.options.database}`);
            await data_source_1.TenantDataSource.initialize();
            if (action === 'run') {
                const migrations = await data_source_1.TenantDataSource.runMigrations();
                console.log(`✅ Tenant: ${migrations.length} migration(s) executed`);
                migrations.forEach((m) => console.log(`   - ${m.name}`));
            }
            else if (action === 'revert') {
                await data_source_1.TenantDataSource.undoLastMigration();
                console.log('✅ Tenant: Last migration reverted');
            }
            else if (action === 'show') {
                const migrations = await data_source_1.TenantDataSource.showMigrations();
                console.log(`📋 Tenant migrations pending: ${migrations}`);
            }
            await data_source_1.TenantDataSource.destroy();
        }
        console.log('\n🎉 Migration process completed!\n');
        process.exit(0);
    }
    catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        if (error.code === 'ER_BAD_DB_ERROR') {
            console.log('\n💡 Hint: Make sure the database exists. Create it with:');
            console.log(`   CREATE DATABASE ${error.message.includes('erp_master') ? 'erp_master' : 'erp_tenant_template'};`);
        }
        process.exit(1);
    }
}
runMigrations();
//# sourceMappingURL=run-migrations.js.map