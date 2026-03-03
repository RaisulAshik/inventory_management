// src/modules/sales/payment-reminders/dto/reminder.dto.ts

import {
  IsUUID,
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsEnum,
  IsBoolean,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '@common/dto/pagination.dto';
import { Transform } from 'class-transformer';
import {
  ReminderType,
  ReminderStatus,
} from '@/entities/tenant/dueManagement/payment-reminder.entity';

export class CreateReminderDto {
  @ApiProperty() @IsUUID() customerId: string;
  @ApiPropertyOptional() @IsUUID() @IsOptional() customerDueId?: string;

  @ApiProperty({ enum: ReminderType })
  @IsEnum(ReminderType)
  reminderType: ReminderType;

  @ApiProperty() @IsDateString() reminderDate: string;
  @ApiPropertyOptional() @IsString() @IsOptional() scheduledTime?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() subject?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() message?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() recipientEmail?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() recipientPhone?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() notes?: string;
}

export class RecordResponseDto {
  @ApiProperty() @IsBoolean() responseReceived: boolean;
  @ApiPropertyOptional() @IsDateString() @IsOptional() responseDate?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() responseNotes?: string;
  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  promiseToPayDate?: string;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Min(0)
  promisedAmount?: number;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() followUpRequired?: boolean;
  @ApiPropertyOptional() @IsDateString() @IsOptional() followUpDate?: string;
}

export class ReminderFilterDto extends PaginationDto {
  @IsOptional() @IsEnum(ReminderStatus) status?: ReminderStatus;
  @IsOptional() @IsEnum(ReminderType) reminderType?: ReminderType;
  @IsOptional() @IsUUID() customerId?: string;
  @IsOptional() @IsUUID() customerDueId?: string;
  @IsOptional() @IsString() fromDate?: string;
  @IsOptional() @IsString() toDate?: string;
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  followUpToday?: boolean;
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  brokenPromises?: boolean;
}
