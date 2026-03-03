// src/modules/sales/credit-notes/credit-notes.controller.ts

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
import { CreditNotesService } from './credit-notes.service';
import {
  CreateCreditNoteDto,
  CreditNoteFilterDto,
  ApplyToDueDto,
} from './dto/credit-note.dto';

@ApiTags('Credit Notes')
@ApiBearerAuth()
@Controller('credit-notes')
export class CreditNotesController {
  constructor(private readonly creditNotesService: CreditNotesService) {}

  @Post()
  @Permissions('credit_notes.create')
  @ApiOperation({ summary: 'Create credit note' })
  async create(
    @Body() dto: CreateCreditNoteDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.creditNotesService.create(dto, user.sub);
  }

  @Get()
  @Permissions('credit_notes.read')
  @ApiOperation({ summary: 'List credit notes with filters' })
  async findAll(@Query() filterDto: CreditNoteFilterDto) {
    return this.creditNotesService.findAll(filterDto);
  }

  @Get('customer/:customerId')
  @Permissions('credit_notes.read')
  @ApiOperation({ summary: 'Credit notes by customer' })
  async findByCustomer(@Param('customerId', ParseUUIDPipe) customerId: string) {
    return this.creditNotesService.findByCustomer(customerId);
  }

  @Get('customer/:customerId/usable')
  @Permissions('credit_notes.read')
  @ApiOperation({
    summary: 'Usable (approved + balance > 0 + not expired) credit notes',
  })
  async findUsable(@Param('customerId', ParseUUIDPipe) customerId: string) {
    return this.creditNotesService.findUsableByCustomer(customerId);
  }

  @Get(':id')
  @Permissions('credit_notes.read')
  @ApiParam({ name: 'id', format: 'uuid' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.creditNotesService.findById(id);
  }

  @Post(':id/submit')
  @Permissions('credit_notes.update')
  @ApiOperation({ summary: 'Submit for approval' })
  async submit(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.creditNotesService.submitForApproval(id, user.sub);
  }

  @Post(':id/approve')
  @Permissions('credit_notes.approve')
  @ApiOperation({ summary: 'Approve credit note' })
  async approve(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.creditNotesService.approve(id, user.sub);
  }

  @Post(':id/apply')
  @Permissions('credit_notes.update')
  @ApiOperation({ summary: 'Apply credit note against a customer due' })
  async applyToDue(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ApplyToDueDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.creditNotesService.applyToDue(id, dto, user.sub);
  }

  @Post(':id/cancel')
  @Permissions('credit_notes.update')
  @ApiOperation({ summary: 'Cancel credit note (unused only)' })
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.creditNotesService.cancel(id, user.sub);
  }
}
