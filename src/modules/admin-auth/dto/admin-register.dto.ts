// src/modules/admin-auth/dto/admin-register.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
} from 'class-validator';

export class AdminRegisterDto {
  @ApiProperty({
    description: 'Unique tenant code (will be uppercased)',
    example: 'ACME',
    minLength: 2,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty({ message: 'Tenant code is required' })
  @MinLength(2, { message: 'Tenant code must be at least 2 characters' })
  @MaxLength(20, { message: 'Tenant code must not exceed 20 characters' })
  @Matches(/^[A-Za-z0-9_-]+$/, {
    message:
      'Tenant code can only contain letters, numbers, hyphens and underscores',
  })
  tenantCode: string;

  @ApiProperty({
    description: 'Company name',
    example: 'Acme Corporation',
  })
  @IsString()
  @IsNotEmpty({ message: 'Company name is required' })
  @MaxLength(300, { message: 'Company name must not exceed 300 characters' })
  companyName: string;

  @ApiProperty({
    description: 'Admin email address',
    example: 'admin@acme.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description:
      'Password (min 8 chars, must include uppercase, lowercase, and number/special char)',
    example: 'Password123!',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9!@#$%^&*])/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number or special character',
  })
  password: string;

  @ApiProperty({
    description: 'First name',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  @MaxLength(100, { message: 'First name must not exceed 100 characters' })
  firstName: string;

  @ApiPropertyOptional({
    description: 'Last name',
    example: 'Doe',
  })
  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'Last name must not exceed 100 characters' })
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '+880-19876543',
  })
  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'Phone must not exceed 50 characters' })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Industry type',
    example: 'Manufacturing',
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  industry?: string;

  @ApiPropertyOptional({
    description: 'Country',
    example: 'BD',
    default: 'BD',
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  country?: string;

  @ApiPropertyOptional({
    description: 'Timezone',
    example: 'Asia/Kolkata',
    default: 'Asia/Kolkata',
  })
  @IsString()
  @IsOptional()
  timezone?: string;

  @ApiPropertyOptional({
    description: 'Currency code',
    example: 'INR',
    default: 'BDT',
  })
  @IsString()
  @IsOptional()
  @MaxLength(3)
  currency?: string;
}
