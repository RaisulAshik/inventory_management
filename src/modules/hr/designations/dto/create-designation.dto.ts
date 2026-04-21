import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength, IsUUID } from 'class-validator';

export class CreateDesignationDto {
  @ApiProperty({ example: 'MGR-HR' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  designationCode: string;

  @ApiProperty({ example: 'HR Manager' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}
