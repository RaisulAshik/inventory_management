import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { DesignationsService } from './designations.service';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtPayload } from '@common/interfaces';

@ApiTags('HR - Designations')
@ApiBearerAuth()
@Controller('hr/designations')
export class DesignationsController {
  constructor(private readonly service: DesignationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create designation' })
  create(@Body() dto: CreateDesignationDto, @CurrentUser() user: JwtPayload) {
    return this.service.create(dto, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'List designations' })
  @ApiQuery({ name: 'search', required: false, description: 'Filter by name or code' })
  @ApiQuery({ name: 'departmentId', required: false })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('search') search?: string,
    @Query('departmentId') departmentId?: string,
    @Query('isActive') isActive?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const active = isActive !== undefined ? isActive === 'true' : undefined;
    return this.service.findAll({ search, departmentId, isActive: active, page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get designation by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update designation' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateDesignationDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete designation' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
