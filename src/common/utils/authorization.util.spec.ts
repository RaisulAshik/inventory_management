import {
  canSelfApprove,
  hasPermission,
  SELF_APPROVAL_PERMISSION,
} from './authorization.util';
import { PERMISSION_CODES } from '@common/constants/permissions';
import { JwtPayload } from '@common/interfaces';

const user = (over: Partial<JwtPayload> = {}): JwtPayload =>
  ({
    sub: 'u1',
    email: 'u@example.com',
    tenantId: 't1',
    roles: [],
    permissions: [],
    ...over,
  }) as JwtPayload;

describe('authorization util', () => {
  it('keeps the self-approval code in the shipped catalogue', () => {
    // If this fails the permission can never be granted: provisioning seeds
    // from PERMISSION_CODES, so a code missing here reaches no tenant.
    expect(PERMISSION_CODES.has(SELF_APPROVAL_PERMISSION)).toBe(true);
  });

  it('grants a permission the user holds', () => {
    expect(
      hasPermission(user({ permissions: ['roles.read'] }), 'roles.read'),
    ).toBe(true);
  });

  it('refuses a permission the user does not hold', () => {
    expect(
      hasPermission(user({ permissions: ['roles.read'] }), 'roles.create'),
    ).toBe(false);
  });

  it('lets a platform-admin token through, mirroring PermissionsGuard', () => {
    expect(hasPermission(user({ isAdmin: true }), 'anything.at.all')).toBe(
      true,
    );
    expect(hasPermission(user({ type: 'admin' }), 'anything.at.all')).toBe(
      true,
    );
  });

  it('refuses an absent user rather than defaulting open', () => {
    expect(hasPermission(undefined, 'roles.read')).toBe(false);
    expect(canSelfApprove(undefined)).toBe(false);
  });

  it('allows self-approval only for a holder of the code', () => {
    expect(canSelfApprove(user())).toBe(false);
    expect(
      canSelfApprove(user({ permissions: [SELF_APPROVAL_PERMISSION] })),
    ).toBe(true);
  });

  it('allows self-approval for a platform admin', () => {
    expect(canSelfApprove(user({ isAdmin: true }))).toBe(true);
  });
});
