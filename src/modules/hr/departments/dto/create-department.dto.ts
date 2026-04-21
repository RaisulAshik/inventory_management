import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, MaxLength, IsUUID } from 'class-validator';

export class CreateDepartmentDto {
  @ApiProperty({ example: 'HR' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  departmentCode: string;

  @ApiProperty({ example: 'Human Resources' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional({ example: 'Handles hiring and employee relations' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Parent department ID for hierarchy' })
  @IsOptional()
  @IsUUID()
  parentId?: string;

  @ApiPropertyOptional({ description: 'Manager employee ID' })
  @IsOptional()
  @IsUUID()
  managerId?: string;
}
