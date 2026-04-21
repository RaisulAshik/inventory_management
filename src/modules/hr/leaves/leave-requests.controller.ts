import { Controller, Get, Post, Delete, Body, Param, Query, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { LeaveRequestsService } from './leave-requests.service';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { ApproveLeaveRequestDto } from './dto/approve-leave-request.dto';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtPayload } from '@common/interfaces';
import { LeaveRequestStatus } from '@common/enums';

@ApiTags('HR - Leave Requests')
@ApiBearerAuth()
@Controller('hr/leave-requests')
export class LeaveRequestsController {
  constructor(private readonly service: LeaveRequestsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit leave request' })
  create(@Body() dto: CreateLeaveRequestDto, @CurrentUser() user: JwtPayload) {
    return this.service.create(dto, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'List leave requests' })
  @ApiQuery({ name: 'employeeId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: LeaveRequestStatus })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('employeeId') employeeId?: string,
    @Query('status') status?: LeaveRequestStatus,
    @Query('year') year?: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.service.findAll({ employeeId, status, year, page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get leave request by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Post(':id/approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve leave request' })
  approve(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.service.approve(id, user.sub);
  }

  @Post(':id/reject')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reject leave request' })
  reject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ApproveLeaveRequestDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.reject(id, user.sub, dto.rejectionReason);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel leave request' })
  cancel(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.cancel(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete leave request' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
