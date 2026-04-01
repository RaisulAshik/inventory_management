import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { PaymentTerm } from '@entities/tenant';
import { Permissions } from '@common/decorators/permissions.decorator';
import { v4 as uuidv4 } from 'uuid';

class CreatePaymentTermDto {
  @ApiProperty({ example: 'NET30' })
  @IsString()
  @MaxLength(50)
  termCode: string;

  @ApiProperty({ example: 'Net 30 Days' })
  @IsString()
  @MaxLength(100)
  termName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 30, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  dueDays?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountDays?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountPercentage?: number;
}

class UpdatePaymentTermDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  termName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  dueDays?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountDays?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountPercentage?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

@ApiTags('Settings')
@ApiBearerAuth()
@Controller('payment-terms')
export class PaymentTermsController {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  private async getRepo() {
    return this.tenantConnectionManager.getRepository(PaymentTerm);
  }

  @Get('dropdown')
  @Permissions('settings.read')
  @ApiOperation({ summary: 'Get active payment terms for dropdowns' })
  async dropdown() {
    const repo = await this.getRepo();
    const terms = await repo.find({
      where: { isActive: true },
      order: { termName: 'ASC' },
      select: ['id', 'termCode', 'termName', 'dueDays'],
    });
    return { data: terms };
  }

  @Get()
  @Permissions('settings.read')
  @ApiOperation({ summary: 'List all payment terms' })
  @ApiQuery({ name: 'activeOnly', required: false, type: Boolean })
  async findAll(@Query('activeOnly') activeOnly?: string) {
    const repo = await this.getRepo();
    const where = activeOnly === 'true' ? { isActive: true } : {};
    const terms = await repo.find({ where, order: { termName: 'ASC' } });
    return { data: terms };
  }

  @Get(':id')
  @Permissions('settings.read')
  @ApiOperation({ summary: 'Get payment term by ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const repo = await this.getRepo();
    const term = await repo.findOne({ where: { id } });
    if (!term) throw new NotFoundException(`Payment term ${id} not found`);
    return { data: term };
  }

  @Post()
  @Permissions('settings.update')
  @ApiOperation({ summary: 'Create a payment term' })
  async create(@Body() dto: CreatePaymentTermDto) {
    const repo = await this.getRepo();
    const term = repo.create({ id: uuidv4(), ...dto, dueDays: dto.dueDays ?? 0 });
    await repo.save(term);
    return { data: term };
  }

  @Patch(':id')
  @Permissions('settings.update')
  @ApiOperation({ summary: 'Update a payment term' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePaymentTermDto,
  ) {
    const repo = await this.getRepo();
    const term = await repo.findOne({ where: { id } });
    if (!term) throw new NotFoundException(`Payment term ${id} not found`);
    Object.assign(term, dto);
    await repo.save(term);
    return { data: term };
  }

  @Delete(':id')
  @Permissions('settings.update')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a payment term' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const repo = await this.getRepo();
    await repo.delete(id);
  }
}
