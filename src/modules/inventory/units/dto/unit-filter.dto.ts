import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { PaginationDto } from '@common/dto/pagination.dto';
import { UomType } from '@common/enums';

export class UnitFilterDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  uomCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  uomName?: string;

  @ApiPropertyOptional({ enum: UomType })
  @IsOptional()
  @IsEnum(UomType)
  uomType?: UomType;
}
