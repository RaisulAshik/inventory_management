import { JwtPayload } from '@common/interfaces';

/**
 * Lifts the maker-checker restriction: the holder may approve documents they
 * raised themselves.
 *
 * Reserved to the ADMIN role: provisioning grants it to ADMIN (the whole
 * catalogue, by CROSS JOIN), RolesService refuses to assign it to any other
 * role, and canSelfApprove() additionally requires the ADMIN role, so a stray
 * grant elsewhere has no effect.
 */
export const SELF_APPROVAL_PERMISSION = 'approvals.self';

/** The only tenant role that may hold SELF_APPROVAL_PERMISSION. */
export const SELF_APPROVAL_ROLE = 'ADMIN';

/**
 * Whether the caller holds a permission.
 *
 * Mirrors PermissionsGuard, including its platform-admin bypass, so a check
 * made here agrees with the one made at the route. Guard checks protect the
 * endpoint; this is for business rules that vary by permission *inside* a
 * handler, which a guard cannot express.
 */
export function hasPermission(
  user: JwtPayload | undefined,
  code: string,
): boolean {
  if (!user) return false;
  if (user.isAdmin === true || user.type === 'admin') return true;
  return (user.permissions ?? []).includes(code);
}

/**
 * Whether this caller may approve their own documents.
 *
 * Passed into the approval services, which default it to `false` — so a caller
 * that does not supply it gets the segregation-of-duties rule enforced.
 *
 * A platform admin passes outright; a tenant user needs both the ADMIN role
 * and the permission.
 */
export function canSelfApprove(user: JwtPayload | undefined): boolean {
  if (!user) return false;
  if (user.isAdmin === true || user.type === 'admin') return true;
  return (
    (user.roles ?? []).includes(SELF_APPROVAL_ROLE) &&
    hasPermission(user, SELF_APPROVAL_PERMISSION)
  );
}
