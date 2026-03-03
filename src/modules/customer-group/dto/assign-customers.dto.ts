// src/modules/customer-groups/dto/assign-customers.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID, ArrayMinSize } from 'class-validator';

export class AssignCustomersDto {
  @ApiProperty({
    description: 'Array of customer IDs to assign to this group',
    example: ['uuid-1', 'uuid-2', 'uuid-3'],
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true, message: 'Each customer ID must be a valid UUID' })
  @ArrayMinSize(1, { message: 'At least one customer ID is required' })
  customerIds: string[];
}
