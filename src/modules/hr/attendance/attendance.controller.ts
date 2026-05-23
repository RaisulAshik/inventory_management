import { Controller, Get, Post, Patch, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtPayload } from '@common/interfaces';
import { AttendanceStatus } from '@common/enums';
import { Permissions } from '@common/decorators/permissions.decorator';

@ApiTags('HR - Attendance')
@ApiBearerAuth()
@Controller('hr/attendance')
export class AttendanceController {
  constructor(private readonly service: AttendanceService) {}

  @Post()
  @Permissions('hr.attendance.create')
  @ApiOperation({ summary: 'Create or update attendance record (upsert)' })
  upsert(@Body() dto: CreateAttendanceDto, @CurrentUser() user: JwtPayload) {
    return this.service.upsert(dto, user.sub);
  }

  @Get()
  @Permissions('hr.attendance.read')
  @ApiOperation({ summary: 'List attendance records' })
  @ApiQuery({ name: 'employeeId', required: false })
  @ApiQuery({ name: 'from', required: false, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'to', required: false, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'status', required: false, enum: AttendanceStatus })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('employeeId') employeeId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('status') status?: AttendanceStatus,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.service.findAll({ employeeId, from, to, status, page, limit });
  }

  @Get('summary/:employeeId')
  @Permissions('hr.attendance.read')
  @ApiOperation({ summary: 'Get monthly attendance summary for an employee' })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiQuery({ name: 'month', required: false, type: Number })
  summary(
    @Param('employeeId', ParseUUIDPipe) employeeId: string,
    @Query('year') year?: number,
    @Query('month') month?: number,
  ) {
    const now = new Date();
    return this.service.getMonthlySummary(
      employeeId,
      year ?? now.getFullYear(),
      month ?? now.getMonth() + 1,
    );
  }

  @Patch(':id')
  @Permissions('hr.attendance.update')
  @ApiOperation({ summary: 'Update attendance record' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: Partial<CreateAttendanceDto>) {
    return this.service.update(id, dto);
  }
}
