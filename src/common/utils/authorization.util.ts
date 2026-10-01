import { JwtPayload } from '@common/interfaces';

/**
 * Lifts the maker-checker restriction: the holder may approve documents they
 * raised themselves.
 *
 * ADMIN holds the entire catalogue (provisioning grants it by CROSS JOIN), so
 * a tenant admin gets this without anyone assigning it. Any other role gets it
 * only if someone deliberately grants it.
 */
export const SELF_APPROVAL_PERMISSION = 'approvals.self';

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
 */
export function canSelfApprove(user: JwtPayload | undefined): boolean {
  return hasPermission(user, SELF_APPROVAL_PERMISSION);
}
