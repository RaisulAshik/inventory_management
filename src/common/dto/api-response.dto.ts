import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MetaDto {
  @ApiProperty()
  total?: number;

  @ApiProperty()
  page?: number;

  @ApiProperty()
  limit?: number;

  @ApiProperty()
  totalPages?: number;

  @ApiProperty()
  hasNextPage?: boolean;

  @ApiProperty()
  hasPrevPage?: boolean;
}

export class PaginatedResponseDto<T> {
  @ApiProperty({ isArray: true })
  data?: T[];

  @ApiProperty({ type: MetaDto })
  meta?: MetaDto;
}

export class ApiResponseDto<T> {
  @ApiProperty()
  success?: boolean;

  @ApiPropertyOptional()
  message?: string;

  @ApiPropertyOptional()
  data?: T;

  @ApiPropertyOptional()
  errors?: any[];

  @ApiProperty()
  timestamp?: string;
}
