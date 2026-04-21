import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtPayload } from '@common/interfaces';

@ApiTags('HR - Departments')
@ApiBearerAuth()
@Controller('hr/departments')
export class DepartmentsController {
  constructor(private readonly service: DepartmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create department' })
  create(@Body() dto: CreateDepartmentDto, @CurrentUser() user: JwtPayload) {
    return this.service.create(dto, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'List departments' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  findAll(@Query('search') search?: string, @Query('isActive') isActive?: string) {
    const active = isActive !== undefined ? isActive === 'true' : undefined;
    return this.service.findAll(search, active);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get department by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update department' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateDepartmentDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete department' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
