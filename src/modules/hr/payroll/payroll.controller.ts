import { Controller, Get, Post, Delete, Body, Param, Query, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PayrollService } from './payroll.service';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtPayload } from '@common/interfaces';
import { HrPayrollStatus } from '@common/enums';
import { Permissions } from '@common/decorators/permissions.decorator';

@ApiTags('HR - Payroll')
@ApiBearerAuth()
@Controller('hr/payroll')
export class PayrollController {
  constructor(private readonly service: PayrollService) {}

  @Post()
  @Permissions('hr.payroll.create')
  @ApiOperation({ summary: 'Process payroll for an employee' })
  process(@Body() dto: CreatePayrollDto, @CurrentUser() user: JwtPayload) {
    return this.service.process(dto, user.sub);
  }

  @Get()
  @Permissions('hr.payroll.read')
  @ApiOperation({ summary: 'List payroll records' })
  @ApiQuery({ name: 'employeeId', required: false })
  @ApiQuery({ name: 'month', required: false, type: Number })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: HrPayrollStatus })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('employeeId') employeeId?: string,
    @Query('month') month?: number,
    @Query('year') year?: number,
    @Query('status') status?: HrPayrollStatus,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.service.findAll({ employeeId, month, year, status, page, limit });
  }

  @Get(':id')
  @Permissions('hr.payroll.read')
  @ApiOperation({ summary: 'Get payroll details' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Post(':id/approve')
  @Permissions('hr.payroll.approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve payroll' })
  approve(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.service.approve(id, user.sub);
  }

  @Post(':id/mark-paid')
  @Permissions('hr.payroll.approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark payroll as paid' })
  markPaid(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('paymentDate') paymentDate?: string,
  ) {
    return this.service.markPaid(id, paymentDate);
  }

  @Delete(':id')
  @Permissions('hr.payroll.delete')
  @ApiOperation({ summary: 'Delete draft payroll' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
