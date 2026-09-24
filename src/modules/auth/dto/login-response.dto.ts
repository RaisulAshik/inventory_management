import { ApiProperty } from '@nestjs/swagger';

class RoleDetailDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'SALES' })
  roleCode: string;

  @ApiProperty({ example: 'Sales User' })
  roleName: string;

  @ApiProperty({
    type: [String],
    description: 'Permission codes this role grants.',
    example: ['orders.create', 'orders.read'],
  })
  permissions: string[];
}

class UserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  isAdmin: boolean;

  @ApiProperty({
    type: [String],
    description: 'Role codes only.',
    example: ['SALES'],
  })
  roles: string[];

  @ApiProperty({
    type: [String],
    description:
      'Every permission across all of the roles, de-duplicated. This is what the guards check.',
  })
  permissions: string[];

  @ApiProperty({
    type: [RoleDetailDto],
    description:
      'The same roles expanded, each with the permissions it grants.',
  })
  roleDetails: RoleDetailDto[];
}

class TokensDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  expiresIn: number;
}

export class LoginResponseDto {
  @ApiProperty({ type: UserDto })
  user: UserDto;

  @ApiProperty({ type: TokensDto })
  tokens: TokensDto;
}
