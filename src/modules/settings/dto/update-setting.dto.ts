import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  SettingCategory,
  SettingDataType,
} from '@entities/tenant/user/tenant-setting.entity';

export class UpsertSettingDto {
  @ApiProperty({ description: 'Setting value' })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiPropertyOptional({ enum: SettingCategory })
  @IsOptional()
  @IsEnum(SettingCategory)
  category?: SettingCategory;

  @ApiPropertyOptional({ enum: SettingDataType })
  @IsOptional()
  @IsEnum(SettingDataType)
  dataType?: SettingDataType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}

export class BulkUpsertSettingDto {
  @ApiProperty({
    description: 'Map of settingKey → value',
    example: {
      'acc.default_ar_account': 'uuid-here',
      'acc.default_revenue_account': 'uuid-here',
    },
  })
  settings: Record<string, string>;

  @ApiPropertyOptional({ enum: SettingCategory })
  @IsOptional()
  @IsEnum(SettingCategory)
  category?: SettingCategory;
}
