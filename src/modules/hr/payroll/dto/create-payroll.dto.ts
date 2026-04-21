import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsUUID, IsNotEmpty, IsInt, Min, Max, IsOptional,
  IsString, IsNumber, IsDateString, ValidateNested, IsEnum, IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PayrollComponentType } from '@common/enums';

export class PayrollComponentDto {
  @ApiProperty({ example: 'House Allowance' })
  @IsString()
  @IsNotEmpty()
  componentName: string;

  @ApiProperty({ enum: PayrollComponentType })
  @IsEnum(PayrollComponentType)
  componentType: PayrollComponentType;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amount: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  remarks?: string;
}

export class CreatePayrollDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({ example: 4, description: 'Month (1-12)' })
  @IsInt()
  @Min(1)
  @Max(12)
  @Type(() => Number)
  payrollMonth: number;

  @ApiProperty({ example: 2024 })
  @IsInt()
  @Min(2000)
  @Type(() => Number)
  payrollYear: number;

  @ApiProperty({ example: 26 })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  workingDays: number;

  @ApiProperty({ example: 24 })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  presentDays: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  absentDays?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  leaveDays?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  overtimeHours?: number;

  @ApiPropertyOptional({ description: 'Additional earning/deduction components' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PayrollComponentDto)
  components?: PayrollComponentDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  paymentDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
