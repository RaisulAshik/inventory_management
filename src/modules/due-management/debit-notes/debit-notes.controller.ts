// src/modules/purchase/debit-notes/debit-notes.controller.ts

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
import { DebitNotesService } from './debit-notes.service';
import {
  CreateDebitNoteDto,
  AcknowledgeDebitNoteDto,
  ApplyToSupplierDueDto,
  DebitNoteFilterDto,
} from './dto/debit-note.dto';

@ApiTags('Debit Notes')
@ApiBearerAuth()
@Controller('debit-notes')
export class DebitNotesController {
  constructor(private readonly debitNotesService: DebitNotesService) {}

  @Post()
  @Permissions('debit_notes.create')
  @ApiOperation({ summary: 'Create debit note' })
  async create(
    @Body() dto: CreateDebitNoteDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.debitNotesService.create(dto, user.sub);
  }

  @Get()
  @Permissions('debit_notes.read')
  @ApiOperation({ summary: 'List debit notes' })
  async findAll(@Query() filterDto: DebitNoteFilterDto) {
    return this.debitNotesService.findAll(filterDto);
  }

  @Get('supplier/:supplierId')
  @Permissions('debit_notes.read')
  @ApiOperation({ summary: 'Debit notes by supplier' })
  async findBySupplier(@Param('supplierId', ParseUUIDPipe) supplierId: string) {
    return this.debitNotesService.findBySupplier(supplierId);
  }

  @Get(':id')
  @Permissions('debit_notes.read')
  @ApiParam({ name: 'id', format: 'uuid' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.debitNotesService.findById(id);
  }

  @Post(':id/submit')
  @Permissions('debit_notes.update')
  @ApiOperation({ summary: 'Submit for approval' })
  async submit(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.debitNotesService.submitForApproval(id, user.sub);
  }

  @Post(':id/approve')
  @Permissions('debit_notes.approve')
  @ApiOperation({ summary: 'Approve debit note' })
  async approve(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.debitNotesService.approve(id, user.sub);
  }

  @Post(':id/send')
  @Permissions('debit_notes.update')
  @ApiOperation({ summary: 'Send to supplier' })
  async send(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.debitNotesService.sendToSupplier(id, user.sub);
  }

  @Post(':id/acknowledge')
  @Permissions('debit_notes.update')
  @ApiOperation({ summary: 'Record supplier acknowledgement' })
  async acknowledge(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AcknowledgeDebitNoteDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.debitNotesService.acknowledge(id, dto, user.sub);
  }

  @Post(':id/apply')
  @Permissions('debit_notes.update')
  @ApiOperation({ summary: 'Apply debit note against a supplier due' })
  async applyToDue(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ApplyToSupplierDueDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.debitNotesService.applyToDue(id, dto, user.sub);
  }

  @Post(':id/cancel')
  @Permissions('debit_notes.update')
  @ApiOperation({ summary: 'Cancel debit note (unused only)' })
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.debitNotesService.cancel(id, user.sub);
  }
}
