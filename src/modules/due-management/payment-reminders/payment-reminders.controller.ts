// src/modules/sales/payment-reminders/payment-reminders.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { Permissions } from '@common/decorators/permissions.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtPayload } from '@common/interfaces';
import { PaymentRemindersService } from './payment-reminders.service';
import {
  ReminderFilterDto,
  CreateReminderDto,
  RecordResponseDto,
} from './dto/reminder.dto';
@ApiTags('Payment Reminders')
@ApiBearerAuth()
@Controller('payment-reminders')
export class PaymentRemindersController {
  constructor(private readonly remindersService: PaymentRemindersService) {}

  @Get()
  @Permissions('payment_reminders.read')
  @ApiOperation({ summary: 'List reminders with filters' })
  async findAll(@Query() filterDto: ReminderFilterDto) {
    return this.remindersService.findAll(filterDto);
  }

  @Get('follow-ups-today')
  @Permissions('payment_reminders.read')
  @ApiOperation({ summary: 'Reminders with follow-up due today or earlier' })
  async getFollowUpsToday() {
    return this.remindersService.getFollowUpsToday();
  }

  @Get('broken-promises')
  @Permissions('payment_reminders.read')
  @ApiOperation({
    summary: 'Reminders where promise-to-pay date passed but due still unpaid',
  })
  async getBrokenPromises() {
    return this.remindersService.getBrokenPromises();
  }

  @Get('due/:dueId')
  @Permissions('payment_reminders.read')
  @ApiOperation({ summary: 'All reminders for a specific due' })
  async findByDue(@Param('dueId', ParseUUIDPipe) dueId: string) {
    return this.remindersService.findByDue(dueId);
  }

  @Get(':id')
  @Permissions('payment_reminders.read')
  @ApiParam({ name: 'id', format: 'uuid' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.remindersService.findById(id);
  }

  @Post()
  @Permissions('payment_reminders.create')
  @ApiOperation({ summary: 'Create manual reminder' })
  async create(
    @Body() dto: CreateReminderDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.remindersService.createManual(dto, user.sub);
  }

  @Post(':id/send')
  @Permissions('payment_reminders.update')
  @ApiOperation({ summary: 'Mark reminder as sent' })
  async markSent(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.remindersService.markSent(id, user.sub);
  }

  @Post(':id/response')
  @Permissions('payment_reminders.update')
  @ApiOperation({
    summary: 'Record customer response (promise to pay, follow-up, etc.)',
  })
  async recordResponse(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RecordResponseDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.remindersService.recordResponse(id, dto, user.sub);
  }

  @Post(':id/cancel')
  @Permissions('payment_reminders.update')
  @ApiOperation({ summary: 'Cancel a scheduled reminder' })
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.remindersService.cancel(id, user.sub);
  }
}
