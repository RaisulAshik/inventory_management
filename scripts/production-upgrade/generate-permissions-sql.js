// Emits scripts/production-upgrade/03-permissions.sql, the hand-run
// equivalent of migration 012. Generated so the SQL cannot drift from the
// catalogue by transcription error.
const fs = require('fs');

// Line comments are stripped first. Without this a commented-out grant such
// as `// 'users.read',` still matches the quoted-string scan below and would
// be emitted as SQL, silently granting a permission someone removed on
// purpose. Only whole-line comments are dropped, so the `// module` section
// headers go too, which is harmless.
const src = fs
  .readFileSync('src/common/constants/permissions.ts', 'utf8')
  .split('\n')
  .filter((line) => !line.trim().startsWith('//'))
  .join('\n');

// The trailing comma after `module` is present on multi-line entries and
// absent on the single-line ones prettier collapses, so it must be optional.
const perms = [...src.matchAll(
  /\{\s*code:\s*'([^']+)',\s*name:\s*'((?:[^'\\]|\\.)*)',\s*module:\s*'([^']+)',?\s*\}/g,
)].map((m) => ({ code: m[1], name: m[2].replace(/\\'/g, "'"), module: m[3] }));

// Guard against the regex silently missing entries again. Counted over the
// PERMISSIONS array only, and not anchored to line start: prettier collapses
// short entries onto one line, where `code:` is not the first token.
const catalogueSrc = src.slice(0, src.indexOf('export const PERMISSION_CODES'));
const declared = (catalogueSrc.match(/code: '/g) || []).length;
if (perms.length !== declared) {
  throw new Error(
    `parsed ${perms.length} permissions but the file declares ${declared}`,
  );
}

const roleBlock = src.slice(src.indexOf('export const ROLE_PERMISSIONS'));
const roles = {};
for (const role of ['MANAGER', 'SALES', 'PURCHASE', 'WAREHOUSE']) {
  const start = roleBlock.indexOf(role + ': [');
  const end = roleBlock.indexOf('],', start);
  roles[role] = [...roleBlock.slice(start, end).matchAll(/'([^']+)'/g)].map(
    (m) => m[1],
  );
}

const q = (s) => "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "''") + "'";

const L = [];
L.push('-- scripts/production-upgrade/03-permissions.sql');
L.push('--');
L.push('-- Hand-run equivalent of tenant migration 012 SyncPermissionCatalogue.');
L.push('-- GENERATED from src/common/constants/permissions.ts - do not edit by hand;');
L.push('-- regenerate instead, or the SQL and the application will disagree.');
L.push('--');
L.push('-- Additive and idempotent. Inserts every catalogue code, refreshes the');
L.push('-- display name and module of codes already present, grants the full');
L.push('-- catalogue to ADMIN and the default set to the other system roles.');
L.push('-- It never revokes, so permissions an operator added by hand survive.');
L.push('--');
L.push('-- Run against ONE TENANT schema. Repeat per tenant.');
L.push('--   mysql -h <host> -u <user> -p <tenant_db> < 03-permissions.sql');
L.push('--');
L.push('-- Afterwards, record it so the migration runner does not repeat the work:');
L.push("--   INSERT INTO `migrations` (`timestamp`, `name`)");
L.push("--   VALUES (1700000000012, 'SyncPermissionCatalogue1700000000012');");
L.push('');
L.push('START TRANSACTION;');
L.push('');
L.push('-- 1. the catalogue itself (' + perms.length + ' codes)');
L.push('INSERT INTO `permissions`');
L.push('  (`id`, `permission_code`, `permission_name`, `module`, `description`)');
L.push('VALUES');
L.push(
  perms
    .map(
      (p) =>
        `  (UUID(), ${q(p.code)}, ${q(p.name)}, ${q(p.module)}, ${q(p.name)})`,
    )
    .join(',\n'),
);
L.push('ON DUPLICATE KEY UPDATE');
L.push('  `permission_name` = VALUES(`permission_name`),');
L.push('  `module`          = VALUES(`module`);');
L.push('');
L.push('-- 2. ADMIN holds the whole catalogue.');
L.push('--    The unique key on (role_id, permission_id) makes this additive.');
L.push('INSERT IGNORE INTO `role_permissions` (`id`, `role_id`, `permission_id`)');
L.push('SELECT UUID(), r.`id`, p.`id`');
L.push('  FROM `roles` r');
L.push('  CROSS JOIN `permissions` p');
L.push(" WHERE r.`role_code` = 'ADMIN';");
L.push('');

for (const [role, codes] of Object.entries(roles)) {
  L.push(`-- 3. ${role} default grants (${codes.length})`);
  L.push('INSERT IGNORE INTO `role_permissions` (`id`, `role_id`, `permission_id`)');
  L.push('SELECT UUID(), r.`id`, p.`id`');
  L.push('  FROM `roles` r');
  L.push('  JOIN `permissions` p ON p.`permission_code` IN (');
  L.push(codes.map((c) => '    ' + q(c)).join(',\n'));
  L.push('  )');
  L.push(` WHERE r.\`role_code\` = ${q(role)};`);
  L.push('');
}

L.push('COMMIT;');
L.push('');
L.push('-- Verify: expect ' + perms.length + ' and a non-zero grant count per role.');
L.push('SELECT COUNT(*) AS catalogue_size FROM `permissions`;');
L.push('SELECT r.`role_code`, COUNT(rp.`id`) AS grants');
L.push('  FROM `roles` r');
L.push('  LEFT JOIN `role_permissions` rp ON rp.`role_id` = r.`id`');
L.push(' GROUP BY r.`role_code`');
L.push(' ORDER BY r.`role_code`;');
L.push('');

fs.mkdirSync('scripts/production-upgrade', { recursive: true });
fs.writeFileSync('scripts/production-upgrade/03-permissions.sql', L.join('\n'));

console.log('codes:', perms.length);
for (const [r, c] of Object.entries(roles)) console.log('  ' + r + ':', c.length);
