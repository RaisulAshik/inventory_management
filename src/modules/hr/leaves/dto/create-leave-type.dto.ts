import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsInt, Min, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLeaveTypeDto {
  @ApiProperty({ example: 'Annual Leave' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'AL' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  code: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 15, description: '0 = unlimited' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  maxDaysPerYear?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  carryForward?: boolean;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  maxCarryForwardDays?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  requiresApproval?: boolean;
}
