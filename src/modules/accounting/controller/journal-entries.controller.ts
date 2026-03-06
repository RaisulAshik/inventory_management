import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Permissions } from '@common/decorators/permissions.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import {
  CreateJournalEntryDto,
  QueryJournalEntryDto,
  UpdateJournalEntryDto,
  ReverseJournalEntryDto,
} from '../dto/journal-entries.dto';
import { JournalEntriesService } from '../service/journal-entries.service';
import { JwtPayload } from '@/common/interfaces';

@Controller('accounting/journal-entries')
export class JournalEntriesController {
  constructor(private readonly journalEntriesService: JournalEntriesService) {}

  @Post()
  @Permissions('accounting.journal-entries.create')
  create(
    @Body() dto: CreateJournalEntryDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.journalEntriesService.create(dto, currentUser.sub);
  }

  @Get()
  @Permissions('accounting.journal-entries.read')
  findAll(@Query() query: QueryJournalEntryDto) {
    return this.journalEntriesService.findAll(query);
  }

  @Get(':id')
  @Permissions('accounting.journal-entries.read')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.journalEntriesService.findOne(id);
  }

  @Put(':id')
  @Permissions('accounting.journal-entries.update')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateJournalEntryDto,
  ) {
    return this.journalEntriesService.update(id, dto);
  }

  @Post(':id/post')
  @Permissions('accounting.journal-entries.post')
  post(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.journalEntriesService.post(id, currentUser.sub);
  }

  @Post(':id/reverse')
  @Permissions('accounting.journal-entries.reverse')
  reverse(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ReverseJournalEntryDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.journalEntriesService.reverse(id, dto, currentUser.sub);
  }

  @Delete(':id')
  @Permissions('accounting.journal-entries.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.journalEntriesService.remove(id);
  }
}
