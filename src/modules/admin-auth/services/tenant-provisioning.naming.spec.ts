import { TenantProvisioningService } from './tenant-provisioning.service';

/**
 * The database name is derived, not stored, at several call sites, and live
 * tenants already exist under this exact spelling. Changing the prefix or the
 * slug rule orphans them, so it is pinned here.
 */
describe('TenantProvisioningService.databaseNameFor', () => {
  it('uses the erp_tenant_ prefix that live tenants already use', () => {
    expect(
      TenantProvisioningService.databaseNameFor('heavytracksolutions'),
    ).toBe('erp_tenant_heavytracksolutions');
  });

  it('lower-cases the tenant code', () => {
    expect(TenantProvisioningService.databaseNameFor('ACME')).toBe(
      'erp_tenant_acme',
    );
  });

  it.each([
    ['ACME-CORP', 'erp_tenant_acme_corp'],
    ['acme_corp', 'erp_tenant_acme_corp'],
    ['Acme01', 'erp_tenant_acme01'],
  ])('folds %p to %p', (code, expected) => {
    expect(TenantProvisioningService.databaseNameFor(code)).toBe(expected);
  });

  it('is stable regardless of the case the code was entered in', () => {
    expect(TenantProvisioningService.databaseNameFor('Acme-Corp')).toBe(
      TenantProvisioningService.databaseNameFor('ACME_CORP'),
    );
  });
});
