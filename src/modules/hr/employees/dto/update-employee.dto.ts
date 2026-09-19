import { PartialType, OmitType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsDateString } from 'class-validator';
import { CreateEmployeeDto } from './create-employee.dto';

/**
 * `password` and `roleIds` are deliberately omitted. Credentials change
 * through the auth endpoints and roles through POST /users/:id/roles; if they
 * were inherited here, update() would accept them and silently discard them.
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
