import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateLeaveRequestDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  leaveTypeId: string;

  @ApiProperty({ example: '2024-04-20' })
  @IsDateString()
  fromDate: string;

  @ApiProperty({ example: '2024-04-22' })
  @IsDateString()
  toDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;
}
