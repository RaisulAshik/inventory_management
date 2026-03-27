import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '@common/dto/pagination.dto';

export class BrandFilterDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  brandCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  brandName?: string;
}
