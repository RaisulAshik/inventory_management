import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ApproveLeaveRequestDto {
  @ApiPropertyOptional({ description: 'Reason for rejection (required when rejecting)' })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
