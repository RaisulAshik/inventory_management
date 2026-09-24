import { PartialType, OmitType } from '@nestjs/swagger';
import { CreatePermissionDto } from './create-permission.dto';

/**
 * `permissionCode` is omitted deliberately.
 *
 * The code is the identity that role grants and the client's permission list
 * refer to; renaming it in place would silently detach both. Delete the
 * permission and create it again to change a code.
 */
export class UpdatePermissionDto extends PartialType(
  OmitType(CreatePermissionDto, ['permissionCode'] as const),
) {}
