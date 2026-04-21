import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsDateString, IsEnum, IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { AttendanceStatus } from '@common/enums';

export class CreateAttendanceDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({ example: '2024-04-18' })
  @IsDateString()
  attendanceDate: string;

  @ApiPropertyOptional({ example: '09:00:00' })
  @IsOptional()
  @IsString()
  checkInTime?: string;

  @ApiPropertyOptional({ example: '18:00:00' })
  @IsOptional()
  @IsString()
  checkOutTime?: string;

  @ApiPropertyOptional({ enum: AttendanceStatus, default: AttendanceStatus.PRESENT })
  @IsOptional()
  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  overtimeHours?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  lateMinutes?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  remarks?: string;
}
