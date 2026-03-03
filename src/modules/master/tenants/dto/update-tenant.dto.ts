import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateTenantDto } from './create-tenant.dto';

export class UpdateTenantDto extends PartialType(
  OmitType(CreateTenantDto, [
    'adminPassword',
    'adminEmail',
    'adminFirstName',
    'adminLastName',
    'planId',
  ] as const),
) {}
