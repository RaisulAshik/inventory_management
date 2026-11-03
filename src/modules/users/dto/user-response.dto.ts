import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
//import { Exclude, Expose, Type } from 'class-transformer';
import { TenantUser } from '@entities/master/tenant-user.entity';

class RoleDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  roleCode: string;

  @ApiProperty()
  roleName: string;
}

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiPropertyOptional()
  lastName?: string;

  @ApiProperty()
  fullName: string;

  @ApiPropertyOptional()
  employeeCode?: string;

  @ApiPropertyOptional({
    nullable: true,
    description:
      "The user's employee record, where the person is edited. Present on the user list; null when the login has no employee record yet.",
  })
  employeeId?: string | null;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  avatarUrl?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isEmailVerified: boolean;

  @ApiPropertyOptional()
  lastLoginAt?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional({
    type: [String],
    description:
      'Role codes held in this tenant. Populated only where the caller asked for them.',
  })
  roleCodes?: string[];

  /**
   * @param user  the master `tenant_users` record, plus `employeeId` where
   *              UsersService.findAll has resolved it
   * @param roles role codes read separately from the tenant database. They
   *              cannot be loaded as a relation: roles are per tenant while
   *              the user is not, so the two live in different databases.
   */
  constructor(
    user: TenantUser & { employeeId?: string | null },
    roles?: string[],
  ) {
    this.id = user.id;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.fullName = user.fullName;
    this.employeeCode = user.employeeCode;
    this.employeeId = user.employeeId;
    this.phone = user.phone;
    this.avatarUrl = user.avatarUrl;
    this.isActive = user.isActive;
    this.isEmailVerified = user.isEmailVerified;
    this.lastLoginAt = user.lastLoginAt ?? undefined;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.roleCodes = roles;
  }
}
