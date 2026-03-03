import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID, ArrayMinSize } from 'class-validator';

export class AssignRolesDto {
  @ApiProperty({
    type: [String],
    example: ['uuid1', 'uuid2'],
    description: 'Array of role IDs to assign',
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  roleIds: string[];
}
