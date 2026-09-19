import { Controller, Get } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { Permissions } from '@common/decorators/permissions.decorator';
import { PermissionsCatalogueValidator } from '@common/permissions-catalogue.validator';

@Controller('ok')
class GrantableController {
  @Get()
  @Permissions('products.read')
  find(): string {
    return 'ok';
  }
}

@Controller('control-plane')
class ControlPlaneController {
  @Get()
  @Permissions('master.tenants.read')
  find(): string {
    return 'ok';
  }
}

@Controller('broken')
class UngrantableController {
  @Get()
  @Permissions('products.read', 'widgets.explode')
  find(): string {
    return 'ok';
  }
}

/** Minimal stand-in for DiscoveryService.getControllers(). */
function discoveryOf(...types: Array<new () => unknown>) {
  return {
    getControllers: () =>
      types.map((metatype) => ({ instance: new metatype(), metatype })),
  } as unknown as DiscoveryService;
}

function validatorFor(...types: Array<new () => unknown>) {
  return new PermissionsCatalogueValidator(
    discoveryOf(...types),
    new MetadataScanner(),
    new Reflector(),
  );
}

describe('PermissionsCatalogueValidator', () => {
  it('accepts a route guarded by a code in the catalogue', () => {
    expect(() =>
      validatorFor(GrantableController).onApplicationBootstrap(),
    ).not.toThrow();
  });

  it('accepts control-plane codes, which are deliberately not grantable', () => {
    expect(() =>
      validatorFor(ControlPlaneController).onApplicationBootstrap(),
    ).not.toThrow();
  });

  it('throws, naming the code and the route, when a code cannot be granted', () => {
    expect(() =>
      validatorFor(UngrantableController).onApplicationBootstrap(),
    ).toThrow(/widgets\.explode\s+<- UngrantableController\.find\(\)/);
  });

  it('does not flag the valid codes on an otherwise broken controller', () => {
    expect(() =>
      validatorFor(UngrantableController).onApplicationBootstrap(),
    ).toThrow(/^(?:(?!products\.read).)*$/s);
  });
});
