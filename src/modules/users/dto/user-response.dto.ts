import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
//import { Exclude, Expose, Type } from 'class-transformer';
import { User } from '@entities/tenant/user/user.entity';

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

  @ApiPropertyOptional({ type: [RoleDto] })
  roles?: RoleDto[];

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.fullName = user.fullName;
    this.employeeCode = user.employeeCode;
    this.phone = user.phone;
    this.avatarUrl = user.avatarUrl;
    this.isActive = user.isActive;
    this.isEmailVerified = user.isEmailVerified;
    this.lastLoginAt = user.lastLoginAt;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;

    if (user.userRoles) {
      this.roles = user.userRoles.map((ur: any) => ({
        id: ur.role.id,
        roleCode: ur.role.roleCode,
        roleName: ur.role.roleName,
      }));
    }
  }
}
