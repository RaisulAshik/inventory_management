import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'HR_MANAGER' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  roleCode: string;

  @ApiProperty({ example: 'HR Manager' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  roleName: string;

  @ApiPropertyOptional({ example: 'Manages HR operations' })
  @IsOptional()
  @IsString()
  description?: string;
}
