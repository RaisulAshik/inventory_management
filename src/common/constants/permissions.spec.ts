import { PERMISSIONS, PERMISSION_CODES } from './permissions';

/**
 * Shape rules for the catalogue itself.
 *
 * The boot-time validator checks that every guarded route resolves to a code.
 * It cannot see the other direction — a code nothing guards passes silently —
 * which is how three namespaces came to exist twice, once hyphenated and once
 * with underscores, with only the hyphenated form enforced. The duplicates sat
 * in the roles screen under near-identical module names, grantable and inert.
 */
describe('permission catalogue shape', () => {
  it('has no duplicate codes', () => {
    const seen = new Set<string>();
    const duplicates = PERMISSIONS.map((p) => p.code).filter((code) => {
      if (seen.has(code)) return true;
      seen.add(code);
      return false;
    });
    expect(duplicates).toEqual([]);
  });

  it('does not spell any module name two ways', () => {
    const modules = new Set(PERMISSIONS.map((p) => p.module));
    const collisions = [...modules]
      .filter((m) => m.includes('_'))
      .map((m) => [m, m.replace(/_/g, '-')] as const)
      .filter(([, hyphenated]) => modules.has(hyphenated));

    expect(collisions).toEqual([]);
  });

  it('prefixes every code with its own module', () => {
    const mismatched = PERMISSIONS.filter(
      (p) => !p.code.startsWith(`${p.module}.`),
    ).map((p) => `${p.code} (module: ${p.module})`);

    expect(mismatched).toEqual([]);
  });

  it('keeps PERMISSION_CODES in step with PERMISSIONS', () => {
    expect(PERMISSION_CODES.size).toBe(PERMISSIONS.length);
  });
});
