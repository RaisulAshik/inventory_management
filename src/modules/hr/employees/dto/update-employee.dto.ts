import { PartialType, OmitType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsDateString } from 'class-validator';
import { CreateEmployeeDto } from './create-employee.dto';

/**
 * `password` and `roleIds` are omitted. They belong to the separate user
 * record that creation may also produce, and this endpoint only edits the
 * employee — inherited, update() would accept them and silently drop them.
 * Change a password through the auth endpoints and roles via
 * POST /users/:id/roles.
 */
export class UpdateEmployeeDto extends PartialType(
  OmitType(CreateEmployeeDto, ['password', 'roleIds'] as const),
) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  resignDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  terminationDate?: string;
}
