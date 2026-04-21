import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtPayload } from '@common/interfaces';
import { EmploymentStatus } from '@common/enums';

@ApiTags('HR - Employees')
@ApiBearerAuth()
@Controller('hr/employees')
export class EmployeesController {
  constructor(private readonly service: EmployeesService) {}

  @Post()
  @ApiOperation({ summary: 'Create employee' })
  create(@Body() dto: CreateEmployeeDto, @CurrentUser() user: JwtPayload) {
    return this.service.create(dto, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'List employees' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'departmentId', required: false })
  @ApiQuery({ name: 'designationId', required: false })
  @ApiQuery({ name: 'employmentStatus', required: false, enum: EmploymentStatus })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('search') search?: string,
    @Query('departmentId') departmentId?: string,
    @Query('designationId') designationId?: string,
    @Query('employmentStatus') employmentStatus?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.service.findAll({ search, departmentId, designationId, employmentStatus, page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get employee by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Get(':id/leave-balance')
  @ApiOperation({ summary: 'Get employee leave balance for a year' })
  @ApiQuery({ name: 'year', required: false, type: Number })
  leaveBalance(@Param('id', ParseUUIDPipe) id: string, @Query('year') year?: number) {
    return this.service.getLeaveBalance(id, year ?? new Date().getFullYear());
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update employee' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateEmployeeDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete (soft) employee' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
