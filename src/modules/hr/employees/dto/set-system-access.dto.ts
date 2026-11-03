import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsArray,
  IsUUID,
  IsBoolean,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

/**
 * Give an employee a login, or change the one they already have.
 *
 * Every user is an employee, so there is no standalone "create user" form;
 * this is how someone hired without system access gets it later, and how
 * their roles are changed afterwards.
 *
 * `password` is only read when the employee has no login yet — it creates
 * one. For an employee who already has a login, send `roleIds` to replace
 * their roles or `isActive` to suspend or restore their access. Changing an
 * existing password is a separate concern and belongs to the password-reset
 * flow, not here.
 */
export class SetSystemAccessDto {
  @ApiPropertyOptional({
    example: 'Password123!',
    description:
      'Required only when the employee has no login yet. Ignored otherwise.',
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain uppercase, lowercase, number, and special character',
  })
  password?: string;

  @ApiPropertyOptional({
    type: [String],
    description:
      'The roles this person should hold. Replaces their current roles; an empty array removes all of them.',
  })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  roleIds?: string[];

  @ApiPropertyOptional({
    example: true,
    description:
      'Suspend or restore the login without deleting it. Only valid for an employee who already has one.',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
