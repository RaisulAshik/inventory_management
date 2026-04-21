import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';
import { CreateDesignationDto } from './create-designation.dto';

export class UpdateDesignationDto extends PartialType(CreateDesignationDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
