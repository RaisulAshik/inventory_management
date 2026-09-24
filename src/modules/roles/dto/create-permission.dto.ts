import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    example: 'reports.margin-analysis',
    description:
      'Stable identifier. Lower case, dot separated. Note this is NOT enforced by the API — no route is guarded by a code created at runtime — but it does reach the client in the user permission list, so the front end can gate features with it.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Matches(/^[a-z][a-z0-9_-]*(\.[a-z0-9_-]+)+$/, {
    message:
      'Permission code must be lower case, dot separated, e.g. "reports.margin-analysis"',
  })
  permissionCode: string;

  @ApiProperty({
    example: 'View Margin Analysis',
    description: 'Human label shown in the role editor.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  permissionName: string;

  @ApiProperty({
    example: 'reports',
    description: 'Grouping key for the permission catalogue screen.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  module: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}
