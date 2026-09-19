// src/common/permissions-catalogue.validator.ts
import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  Type,
} from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '@common/decorators/permissions.decorator';
import {
  PERMISSION_CODES,
  isControlPlanePermission,
} from '@common/constants/permissions';

/**
 * Fails the boot if any route is guarded by a permission code that no tenant
 * can ever hold.
 *
 * PermissionsGuard requires the user to *have* the code, and ADMIN is granted
 * exactly the rows in the `permissions` table. A code that is missing from the
 * catalogue is therefore ungrantable, and its route returns 403 for every
 * tenant user including ADMIN — silently, and only in production. This check
 * turns that into a startup failure instead.
 */
@Injectable()
export class PermissionsCatalogueValidator implements OnApplicationBootstrap {
  private readonly logger = new Logger(PermissionsCatalogueValidator.name);

  constructor(
    private readonly discovery: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
  ) {}

  onApplicationBootstrap(): void {
    const unknown = new Map<string, string[]>();
    let guarded = 0;

    const collect = (codes: string[] | undefined, where: string) => {
      for (const code of codes ?? []) {
        guarded += 1;
        if (PERMISSION_CODES.has(code) || isControlPlanePermission(code)) {
          continue;
        }
        const sites = unknown.get(code) ?? [];
        sites.push(where);
        unknown.set(code, sites);
      }
    };

    for (const wrapper of this.discovery.getControllers()) {
      const { instance, metatype } = wrapper;
      if (!instance || !metatype) continue;

      const controller = metatype.name;
      collect(
        this.reflector.get<string[]>(PERMISSIONS_KEY, metatype as Type),
        controller,
      );

      const proto = Object.getPrototypeOf(instance) as Record<string, unknown>;
      for (const method of this.metadataScanner.getAllMethodNames(proto)) {
        collect(
          this.reflector.get<string[]>(PERMISSIONS_KEY, proto[method] as Type),
          `${controller}.${method}()`,
        );
      }
    }

    if (unknown.size > 0) {
      const detail = [...unknown.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([code, sites]) => `  ${code}  <- ${sites.join(', ')}`)
        .join('\n');

      throw new Error(
        `${unknown.size} permission code(s) are used by @Permissions() but are ` +
          `absent from the catalogue in src/common/constants/permissions.ts. ` +
          `No tenant user — not even ADMIN — could ever call these routes:\n${detail}`,
      );
    }

    this.logger.log(
      `Permission catalogue OK: ${guarded} guarded route(s) resolve against ${PERMISSION_CODES.size} codes`,
    );
  }
}
