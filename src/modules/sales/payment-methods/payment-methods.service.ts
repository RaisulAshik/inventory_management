import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { PaymentMethod, PaymentMethodType } from '@entities/tenant/eCommerce/payment-method.entity';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';

export class CreatePaymentMethodDto {
  @ApiProperty({ example: 'BKASH' })
  @IsString() @IsNotEmpty() @MaxLength(50)
  methodCode: string;

  @ApiProperty({ example: 'bKash Mobile Banking' })
  @IsString() @IsNotEmpty() @MaxLength(200)
  methodName: string;

  @ApiProperty({ enum: PaymentMethodType })
  @IsEnum(PaymentMethodType)
  methodType: PaymentMethodType;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: ['PERCENTAGE', 'FIXED', 'NONE'], default: 'NONE' })
  @IsOptional() @IsString()
  processingFeeType?: 'PERCENTAGE' | 'FIXED' | 'NONE';

  @ApiPropertyOptional({ default: 0 })
  @IsOptional() @IsNumber() @Min(0) @Type(() => Number)
  processingFeeValue?: number;

  @ApiPropertyOptional()
  @IsOptional() @IsNumber() @Min(0) @Type(() => Number)
  minAmount?: number;

  @ApiPropertyOptional()
  @IsOptional() @IsNumber() @Min(0) @Type(() => Number)
  maxAmount?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional() @IsBoolean()
  isAvailablePos?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsOptional() @IsBoolean()
  isAvailableEcommerce?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional() @IsBoolean()
  requiresReference?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsOptional() @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional() @IsNumber() @Min(0) @Type(() => Number)
  sortOrder?: number;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  iconUrl?: string;
}

@Injectable()
export class PaymentMethodsService {
  constructor(private readonly tenantConnectionManager: TenantConnectionManager) {}

  private async getRepo() {
    return this.tenantConnectionManager.getRepository(PaymentMethod);
  }

  async findAll(isActive?: boolean): Promise<PaymentMethod[]> {
    const repo = await this.getRepo();
    const where: any = {};
    if (isActive !== undefined) where.isActive = isActive;
    return repo.find({ where, order: { sortOrder: 'ASC', methodName: 'ASC' } });
  }

  async findOne(id: string): Promise<PaymentMethod> {
    const repo = await this.getRepo();
    const pm = await repo.findOne({ where: { id } });
    if (!pm) throw new NotFoundException(`Payment method ${id} not found`);
    return pm;
  }

  async create(dto: CreatePaymentMethodDto): Promise<PaymentMethod> {
    const repo = await this.getRepo();
    const existing = await repo.findOne({ where: { methodCode: dto.methodCode } });
    if (existing) throw new ConflictException(`Method code '${dto.methodCode}' already exists`);
    const pm = repo.create({
      id: uuidv4(),
      ...dto,
      processingFeeType: dto.processingFeeType ?? 'NONE',
      processingFeeValue: dto.processingFeeValue ?? 0,
      isAvailablePos: dto.isAvailablePos ?? true,
      isAvailableEcommerce: dto.isAvailableEcommerce ?? true,
      requiresReference: dto.requiresReference ?? false,
      isActive: dto.isActive ?? true,
      sortOrder: dto.sortOrder ?? 0,
    });
    return repo.save(pm);
  }

  async update(id: string, dto: Partial<CreatePaymentMethodDto>): Promise<PaymentMethod> {
    const repo = await this.getRepo();
    const pm = await this.findOne(id);
    if (dto.methodCode && dto.methodCode !== pm.methodCode) {
      const existing = await repo.findOne({ where: { methodCode: dto.methodCode } });
      if (existing) throw new ConflictException(`Method code '${dto.methodCode}' already exists`);
    }
    Object.assign(pm, dto);
    return repo.save(pm);
  }

  async remove(id: string): Promise<void> {
    const repo = await this.getRepo();
    const pm = await this.findOne(id);
    await repo.remove(pm);
  }

  async getDropdown(): Promise<{ id: string; label: string; methodCode: string; methodType: string; requiresReference: boolean }[]> {
    const methods = await this.findAll(true);
    return methods.map((m) => ({
      id: m.id,
      label: m.methodName,
      methodCode: m.methodCode,
      methodType: m.methodType,
      requiresReference: m.requiresReference,
    }));
  }
}
